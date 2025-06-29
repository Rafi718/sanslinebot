const { proto, getContentType } = require("@whiskeysockets/baileys");
const fs = require("fs");
const { tmpdir } = require("os");
const Crypto = require("crypto");
const ff = require("fluent-ffmpeg");
const webp = require("node-webpmux");
const path = require("path");
const Jimp = require("jimp");
const { spawn } = require("child_process");

function smsg(sansline, m, store) {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id.startsWith("BAE5") && m.id.length === 16;
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat.endsWith("@g.us");
    m.sender = sansline.decodeJid(
      (m.fromMe && sansline.user.id) ||
        m.participant ||
        m.key.participant ||
        m.chat ||
        ""
    );
    if (m.isGroup) m.participant = sansline.decodeJid(m.key.participant) || "";
  }
  if (m.message) {
    m.mtype = getContentType(m.message);

    // Pastikan bahwa m.message[m.mtype] tidak undefined sebelum mengakses propertinya
    if (m.mtype == "viewOnceMessage" && m.message[m.mtype]) {
        m.msg = m.message[m.mtype].message[getContentType(m.message[m.mtype].message)];
    } else {
        m.msg = m.message[m.mtype];
    }

    // Pastikan m.msg tidak undefined sebelum mengakses propertinya
    m.body = m.message.conversation ||
        (m.msg && m.msg.caption) ||
        (m.msg && m.msg.text) ||
        (m.mtype == "listResponseMessage" && m.msg && m.msg.singleSelectReply && m.msg.singleSelectReply.selectedRowId) ||
        (m.mtype == "buttonsResponseMessage" && m.msg && m.msg.selectedButtonId) ||
        (m.mtype == "viewOnceMessage" && m.msg && m.msg.caption) ||
        m.text;

    // Pastikan contextInfo ada sebelum mengakses quotedMessage
    let quoted = m.quoted = (m.msg && m.msg.contextInfo) ? m.msg.contextInfo.quotedMessage : null;

    // Pastikan contextInfo ada sebelum mengakses mentionedJid
    m.mentionedJid = (m.msg && m.msg.contextInfo) ? m.msg.contextInfo.mentionedJid : [];
    if (m.quoted) {
      let type = getContentType(quoted);
      m.quoted = m.quoted[type];
      if (["productMessage"].includes(type)) {
        type = getContentType(m.quoted);
        m.quoted = m.quoted[type];
      }
      if (typeof m.quoted === "string") m.quoted = { text: m.quoted };
      m.quoted.mtype = type;
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
      m.quoted.isBaileys = m.quoted.id
        ? m.quoted.id.startsWith("BAE5") && m.quoted.id.length === 16
        : false;
      m.quoted.sender = sansline.decodeJid(m.msg.contextInfo.participant);
      m.quoted.fromMe = m.quoted.sender === (sansline.user && sansline.user.id);
      m.quoted.text =
        m.quoted.text ||
        m.quoted.caption ||
        m.quoted.conversation ||
        m.quoted.contentText ||
        m.quoted.selectedDisplayText ||
        m.quoted.title ||
        "";
      m.quoted.mentionedJid = m.msg.contextInfo
        ? m.msg.contextInfo.mentionedJid
        : [];
      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return false;
        let q = await store.loadMessage(m.chat, m.quoted.id, sansline);
        return exports.smsg(sansline, q, store);
      };
      let vM = (m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.chat,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id,
        },
        message: quoted,
        ...(m.isGroup ? { participant: m.quoted.sender } : {}),
      }));
      m.quoted.delete = () =>
        sansline.sendMessage(m.quoted.chat, { delete: vM.key });
      m.quoted.download = () => sansline.downloadMediaMessage(m.quoted);
    }
  }
   if (m.msg && m.msg.url) {
        m.download = () => sansline.downloadMediaMessage(m.msg);
    } else {
        // console.error('Call end');
    }

    m.text =
        (m.msg && m.msg.text) ||
        (m.msg && m.msg.caption) ||
        m.message.conversation ||
        (m.msg && m.msg.contentText) ||
        (m.msg && m.msg.selectedDisplayText) ||
        (m.msg && m.msg.title) ||
        "";

    m.reply = (text, chatId = m.chat, options = {}) =>
        Buffer.isBuffer(text)
            ? sansline.sendMedia(chatId, text, "file", "", m, { ...options })
            : sansline.sendText(chatId, text, m, { ...options });

    return m;
}

async function imageToWebp(media) {
  const tmpFileOut = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
  );
  const tmpFileIn = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`
  );
  fs.writeFileSync(tmpFileIn, media);
  await new Promise((resolve, reject) => {
    ff(tmpFileIn)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([
        "-vcodec",
        "libwebp",
        "-vf",
        "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
      ])
      .toFormat("webp")
      .save(tmpFileOut);
  });
  const buff = fs.readFileSync(tmpFileOut);
  fs.unlinkSync(tmpFileOut);
  fs.unlinkSync(tmpFileIn);
  return buff;
}

async function videoToWebp(media) {
  const tmpFileOut = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
  );
  const tmpFileIn = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`
  );
  fs.writeFileSync(tmpFileIn, media);
  await new Promise((resolve, reject) => {
    ff(tmpFileIn)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([
        "-vcodec",
        "libwebp",
        "-vf",
        "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
        "-loop",
        "0",
        "-ss",
        "00:00:00",
        "-t",
        "00:00:05",
        "-preset",
        "default",
        "-an",
        "-vsync",
        "0",
      ])
      .toFormat("webp")
      .save(tmpFileOut);
  });
  const buff = fs.readFileSync(tmpFileOut);
  fs.unlinkSync(tmpFileOut);
  fs.unlinkSync(tmpFileIn);
  return buff;
}

async function writeExifImg(media, metadata) {
  let wMedia = await imageToWebp(media);
  const tmpFileIn = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
  );
  const tmpFileOut = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
  );
  fs.writeFileSync(tmpFileIn, wMedia);
  if (metadata.packname || metadata.author) {
    const img = new webp.Image();
    const json = {
      "sticker-pack-id": `https://github.com/KirBotz`,
      "sticker-pack-name": metadata.packname,
      "sticker-pack-publisher": metadata.author,
      emojis: metadata.categories ? metadata.categories : [""],
    };
    const exifAttr = Buffer.from([
      0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
      0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
    ]);
    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([exifAttr, jsonBuff]);
    exif.writeUIntLE(jsonBuff.length, 14, 4);
    await img.load(tmpFileIn);
    fs.unlinkSync(tmpFileIn);
    img.exif = exif;
    await img.save(tmpFileOut);
    return tmpFileOut;
  }
}

async function writeExifVid(media, metadata) {
  let wMedia = await videoToWebp(media);
  const tmpFileIn = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
  );
  const tmpFileOut = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
  );
  fs.writeFileSync(tmpFileIn, wMedia);
  if (metadata.packname || metadata.author) {
    const img = new webp.Image();
    const json = {
      "sticker-pack-id": `https://github.com/KirBotz`,
      "sticker-pack-name": metadata.packname,
      "sticker-pack-publisher": metadata.author,
      emojis: metadata.categories ? metadata.categories : [""],
    };
    const exifAttr = Buffer.from([
      0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
      0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
    ]);
    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([exifAttr, jsonBuff]);
    exif.writeUIntLE(jsonBuff.length, 14, 4);
    await img.load(tmpFileIn);
    fs.unlinkSync(tmpFileIn);
    img.exif = exif;
    await img.save(tmpFileOut);
    return tmpFileOut;
  }
}

async function writeExif(media, metadata) {
  let wMedia = /webp/.test(media.mimetype)
    ? media.data
    : /image/.test(media.mimetype)
    ? await imageToWebp(media.data)
    : /video/.test(media.mimetype)
    ? await videoToWebp(media.data)
    : "";
  const tmpFileIn = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
  );
  const tmpFileOut = path.join(
    tmpdir(),
    `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
  );
  fs.writeFileSync(tmpFileIn, wMedia);
  if (metadata.packname || metadata.author) {
    const img = new webp.Image();
    const json = {
      "sticker-pack-id": `https://github.com/KirBotz`,
      "sticker-pack-name": metadata.packname,
      "sticker-pack-publisher": metadata.author,
      emojis: metadata.categories ? metadata.categories : [""],
    };
    const exifAttr = Buffer.from([
      0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
      0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
    ]);
    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([exifAttr, jsonBuff]);
    exif.writeUIntLE(jsonBuff.length, 14, 4);
    await img.load(tmpFileIn);
    fs.unlinkSync(tmpFileIn);
    img.exif = exif;
    await img.save(tmpFileOut);
    return tmpFileOut;
  }
}

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isUrl (url) {
  return url.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
      "gi"
    )
  );
};

exports.runtime = function (seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

function watsappp(buffer, args = [], ext = "", ext2 = "") {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = path.join(__dirname, "../tmp", +new Date() + "." + ext);
      let out = tmp + "." + ext2;
      await fs.promises.writeFile(tmp, buffer);
      spawn("ffmpeg", ["-y", "-i", tmp, ...args, out])
        .on("error", reject)
        .on("close", async (code) => {
          try {
            await fs.promises.unlink(tmp);
            if (code !== 0) return reject(code);
            resolve({
              data: await fs.promises.readFile(out),
              filename: out,
              delete() {
                return fs.promises.unlink(out);
              },
            });
          } catch (e) {
            reject(e);
          }
        });
    } catch (e) {
      reject(e);
    }
  });
}

function toPTT(buffer, ext) {
  return watsappp(
    buffer,
    ["-vn", "-c:a", "libopus", "-b:a", "128k", "-vbr", "on"],
    ext,
    "ogg"
  );
}
function toAudio(buffer, ext) {
  return watsappp(
    buffer,
    [
      "-vn",
      "-c:a",
      "libopus",
      "-b:a",
      "128k",
      "-vbr",
      "on",
      "-compression_level",
      "10",
    ],
    ext,
    "opus"
  );
}
function toVideo(buffer, ext) {
  return watsappp(
    buffer,
    [
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-ab",
      "128k",
      "-ar",
      "44100",
      "-crf",
      "32",
      "-preset",
      "slow",
    ],
    ext,
    "mp4"
  );
}
function getGroupAdmins(participants) {
  let admins = [];
  for (let i of participants) {
    if (i.admin === "superadmin" || i.admin === "admin") {
      admins.push(i.id);
    }
  }
  return admins;
}
const jsonformat = (string) => {
  return JSON.stringify(string, null, 2);
};
const generateProfilePicture = async (buffer) => {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
  };
};
const getBuffer = async (url, options) => {
  try {
    options ? options : {};
    const res = await axios({
      method: "GET",
      url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
        DNT: 1,
        "Upgrade-Insecure-Request": 1,
      },
      ...options,
      responseType: "arraybuffer",
    });
    return res.data;
  } catch (err) {
    return err;
  }
};
const fetchJson = async (url, options) => {
  try {
    options ? options : {};
    const res = await axios({
      method: "GET",
      url: url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
      },
      ...options,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};
module.exports = {
  smsg,
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExif,
  toPTT,
  toAudio,
  sleep,
  clockString,
  isUrl,
  toVideo,
  getGroupAdmins,
  jsonformat,
  generateProfilePicture,
  getBuffer,
  fetchJson,
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});
