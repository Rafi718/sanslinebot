//NGAPAIN BANG
//KALO MAU RECODE SC IZIN DULU!!

require("./config.js");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeInMemoryStore,
  jidDecode,
  downloadContentFromMessage,
  getAggregateVotesInPollMessage,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const { Boom } = require("@hapi/boom");
const PhoneNumber = require("awesome-phonenumber");
const fetch = require("node-fetch");
const FileType = require("file-type");
const readline = require("readline");
const {
  smsg,
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExif,
  toPTT,
  toAudio,
  toVideo,
} = require("./lib/myfunc");

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
};

async function startBotz() {
  const { state, saveCreds } = await useMultiFileAuthState("sansline");
  const sansline = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    browser: ["Linux", "Chrome", "20.0.04"],
  });
  if (!sansline.authState.creds.registered) {
    const phoneNumber = await question(
      "Masukan Nomer Yang Aktif Awali Dengan 62 : "
    );
    let code = await sansline.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(`Pairing Code :`, code);
  }

  store.bind(sansline.ev);

  sansline.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };

  sansline.ev.on("call", async (celled) => {
    let botNumber = await sansline.decodeJid(sansline.user.id);
    let koloi = global.anticall;
    if (!koloi) return;
    console.log(celled);
    for (let kopel of celled) {
      if (kopel.isGroup == false) {
        if (kopel.status == "offer") {
          let nomer = await sansline.sendTextWithMentions(
            kopel.from,
            `*${sansline.user.name}* tidak bisa menerima panggilan ${
              kopel.isVideo ? `video` : `suara`
            }. Maaf @${
              kopel.from.split("@")[0]
            } kamu akan diblokir. Silahkan hubungi Owner membuka blok !`
          );
          sansline.sendContact(
            kopel.from,
            owner.map((i) => i.split("@")[0]),
            nomer
          );
          await sleep(8000);
          await sansline.updateBlockStatus(kopel.from, "block");
        }
      }
    }
  });

  sansline.sendContact = async (jid, kon, quoted = "", opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await sansline.getName(i + "@s.whatsapp.net"),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await sansline.getName(
          i + "@s.whatsapp.net"
        )}\nFN:${await sansline.getName(
          i + "@s.whatsapp.net"
        )}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:aplusscell@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://chat.whatsapp.com/HbCl8qf3KQK1MEp3ZBBpSf\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    //=================================================//
    sansline.sendMessage(
      jid,
      {
        contacts: { displayName: `${list.length} Kontak`, contacts: list },
        ...opts,
      },
      { quoted: m }
    );
  };
  sansline.getName = (jid, withoutContact = false) => {
    id = sansline.decodeJid(jid);
    withoutContact = sansline.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = sansline.groupMetadata(id) || {};
        resolve(
          v.name ||
            v.subject ||
            PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
              "international"
            )
        );
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === sansline.decodeJid(sansline.user.id)
          ? sansline.user
          : store.contacts[id] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
        "international"
      )
    );
  };

  sansline.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message =
        Object.keys(mek.message)[0] === "ephemeralMessage"
          ? mek.message.ephemeralMessage.message
          : mek.message;
      if (mek.key && mek.key.remoteJid === "status@broadcast") return;
      if (!sansline.public && !mek.key.fromMe && chatUpdate.type === "notify")
        return;
      if (mek.key.id.startsWith("BAE5") && mek.key.id.length === 16) return;

      m = smsg(sansline, mek, store);
      require("./sansline.js")(sansline, m, chatUpdate, store);
    } catch (err) {
      console.log(err);
    }
  });

  sansline.public = true; //True = On | False = Off

  sansline.ev.on("group-participants.update", async (grupp) => {
    console.log(grupp);
    try {
      let metadata = await sansline.groupMetadata(grupp.id);
      let participants = grupp.participants;
      for (let num of participants) {
        var bg = `https://telegra.ph/file/4c9b5571066104127e436.jpg`;
        let ppuser2 = `https://telegra.ph/file/24fa902ead26340f3df2c.png`;
        let nameUser = await sansline.getName(num);
        let membr = metadata.participants.length;
        let wlc = `https://api.popcat.xyz/welcomecard?background=${bg}&text1=WELCOME&text2=+${nameUser}&text3=Member+${membr}&avatar=${ppuser2}`;
        let lefts = `https://api.popcat.xyz/welcomecard?background=${bg}&text1=GOODBYE&text2=+${nameUser}&text3=Member+${membr}&avatar=${ppuser2}`;
        if (grupp.action === "add") {
          await sansline.sendMessage(grupp.id, {
            image: { url: wlc },
            caption: `☆━━━━━[ *WELCOME* ]━━━━━☆\n\nHello @${
              num.split("@")[0]
            } Welcome To *${metadata.subject}*   

⁠•══════════════♡
[ *DESC GROUP* ]

${metadata.desc}
════────────•
©sansline`,
            mentions: [num],
          });
        } else if (grupp.action === "remove") {
          await sansline.sendMessage(grupp.id, {
            image: { url: lefts },
            caption: `☆━━━━━━[ *LEFT* ]━━━━━━☆\n\n*Goodbye* *@${
              num.split("@")[0]
            }* 

_Bunga mawar di tepi kali_
_Bunga melati tumbuh di hutan_
_Terima kasih telah menemani_
_Selamat jalan kawan, semoga sukses di masa depan._`,
            mentions: [num],
          });
        } else if (grupp.action === "promote") {
          sansline.sendMessage(grupp.id, {
            mentions: [num],
            text: `@${
              num.split("@")[0]
            } Congratulations, Now you are a Group Admin`,
          });
        } else if (grupp.action === "demote") {
          sansline.sendMessage(grupp.id, {
            mentions: [num],
            text: `@${num.split("@")[0]} Congratulations, You are in demote`,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  async function clearConsole() {
    const isWindows = process.platform === "win32";
    const isLinuxOrMac =
      process.platform === "linux" || process.platform === "darwin";

    return new Promise((resolve, reject) => {
      const command = isWindows ? "cls" : isLinuxOrMac ? "clear" : "";
      if (command) {
        require("child_process").exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            console.log(stdout);
            resolve();
          }
        });
      } else {
        console.log("Platform not supported for clearing console.");
        resolve();
      }
    });
  }

  sansline.serializeM = (m) => smsg(sansline, m, store);

  sansline.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (
        reason === DisconnectReason.badSession ||
        reason === DisconnectReason.connectionClosed ||
        reason === DisconnectReason.connectionLost ||
        reason === DisconnectReason.connectionReplaced ||
        reason === DisconnectReason.restartRequired ||
        reason === DisconnectReason.timedOut
      ) {
        startBotz();
      } else if (reason === DisconnectReason.loggedOut) {
        // Handle logout
      } else {
        sansline.end(`Unknown DisconnectReason: ${reason}|${connection}`);
      }
    } else if (connection === "open") {
      console.log(
        "%cTerhubung.... " + JSON.stringify(sansline.user.id, null, 2),
        "color: green;"
      );

      sansline.sendMessage(global.owner + "@s.whatsapp.net", {
        text: `*Connected! 👻*\n\nJangan Jual Bot/SC!!`,
      });
    }
  });

  sansline.ev.on("creds.update", saveCreds);

  sansline.sendText = (jid, text, quoted = "", options) =>
    sansline.sendMessage(jid, { text: text, ...options }, { quoted });

  sansline.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  // Inisialisasi pollCreation dan event handler untuk messages.update
  const pollCreation = {
    question: "Apa pendapat Anda tentang Baileys?",
    options: ["Baik", "Buruk", "Netral"],
  };

  sansline.ev.on("messages.update", async (update) => {
    const pollUpdate = await getAggregateVotesInPollMessage({
      message: pollCreation,
      pollUpdates: update.pollUpdates,
    });
    const command = pollUpdate.filter((v) => v.voters.length !== 0)[0]?.name;
    if (command == undefined) return;
    const comand = "." + command;
    sansline.appenTextMessage(comand);
  });

  sansline.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split`, `[1], "base64")
      : /^https?:\/\//.test(path)
      ? await (await fetch(path)).buffer()
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await sansline.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      { quoted }
    );
    return buffer;
  };

  sansline.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
      ? Buffer.from(path.split`, `[1], "base64")
      : /^https?:\/\//.test(path)
      ? await (await fetch(path)).buffer()
      : fs.existsSync(path)
      ? fs.readFileSync(path)
      : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await sansline.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      { quoted }
    );
    return buffer;
  };

  sansline.getFile = async (PATH, returnAsFilename) => {
    let res, filename;
    const data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`, `[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await fetch(PATH)).buffer()
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);
    if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
    const type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    if (data && returnAsFilename && !filename)
      (filename = path.join(
        __dirname,
        "./tmp/" + new Date() * 1 + "." + type.ext
      )),
        await fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      ...type,
      data,
      deleteFile() {
        return filename && fs.promises.unlink(filename);
      },
    };
  };

  sansline.sendFile = async (
    jid,
    path,
    filename = "",
    caption = "",
    quoted,
    ptt = false,
    options = {}
  ) => {
    let type = await sansline.getFile(path, true);
    let { res, data: file, filename: pathFile } = type;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let opt = { filename };
    if (quoted) opt.quoted = quoted;
    if (!type) options.asDocument = true;
    let mtype = "",
      mimetype = type.mime,
      convert;
    if (
      /webp/.test(type.mime) ||
      (/image/.test(type.mime) && options.asSticker)
    )
      mtype = "sticker";
    else if (
      /image/.test(type.mime) ||
      (/webp/.test(type.mime) && options.asImage)
    )
      mtype = "image";
    else if (/video/.test(type.mime)) mtype = "video";
    else if (/audio/.test(type.mime))
      (convert = await (ptt ? toPTT : toAudio)(file, type.ext)),
        (file = convert.data),
        (pathFile = convert.filename),
        (mtype = "audio"),
        (mimetype = "audio/ogg; codecs=opus");
    else mtype = "document";
    if (options.asDocument) mtype = "document";

    let message = {
      ...options,
      caption,
      ptt,
      [mtype]: { url: pathFile },
      mimetype,
    };
    let m;
    try {
      m = await sansline.sendMessage(jid, message, { ...opt, ...options });
    } catch (e) {
      console.error(e);
      m = null;
    } finally {
      if (!m)
        m = await sansline.sendMessage(
          jid,
          { ...message, [mtype]: file },
          { ...opt, ...options }
        );
      return m;
    }
  };

  sansline.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true
  ) => {
    let quoted = message.m ? message.m : message;
    let mime = (message.m || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? filename + "." + type.ext : filename;
    // save to file
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  return sansline;
}

startBotz();

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});
