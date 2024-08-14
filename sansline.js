//KALO MAU RECODE SC IZIN DULU!!

require("./config.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { exec, spawn, execSync } = require("child_process");
const {
  generateWAMessageFromContent,
  proto,
  prepareWAMessageMedia,
} = require("@whiskeysockets/baileys");
const db = require("./database/sansline/database.js");
const fetch = require("node-fetch");
const { downloadContentFromMessage } = require("@adiwajshing/baileys");

//==============================================

var body =
  m.mtype === "conversation"
    ? m.message.conversation
    : m.mtype == "imageMessage"
    ? m.message.imageMessage.caption
    : m.mtype == "videoMessage"
    ? m.message.videoMessage.caption
    : m.mtype == "extendedTextMessage"
    ? m.message.extendedTextMessage.text
    : m.mtype == "buttonsResponseMessage"
    ? m.message.buttonsResponseMessage.selectedButtonId
    : m.mtype == "listResponseMessage"
    ? m.message.listResponseMessage.singleSelectReply.selectedRowId
    : m.mtype == "templateButtonReplyMessage"
    ? m.message.templateButtonReplyMessage.selectedId
    : m.mtype == "interactiveResponseMessage"
    ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id
    : m.mtype == "templateButtonReplyMessage"
    ? m.msg.selectedId
    : m.mtype === "messageContextInfo"
    ? m.message.buttonsResponseMessage?.selectedButtonId ||
      m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
      m.text
    : "";
//===============================================
const reset = "\x1b[0m";
const black = "\x1b[30m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";
const magenta = "\x1b[35m";
const cyan = "\x1b[36m";
const white = "\x1b[37m";

const {
  isPremiumUser,
  addPremiumUser,
  deletePremiumUser,
  countPremiumUsers,
} = require("./database/cekpremium.js");
const { checkLimit, reduceLimit, addLimit } = require("./database/ceklimit.js");
const { readLimitData } = require("./database/ceklimit.js"); // Sesuaikan path dengan struktur proyek Anda
const {
  isUserBanned,
  banUser,
  unbanUser,
  getBannedData,
  getListBannedUsers,
} = require("./database/banned.js");

const isBan = (userId) => {
  const bannedData = getBannedData(); // Ambil data yang diblokir dari JSON
  return bannedData.users.includes(userId); // Periksa apakah userId ada dalam daftar diblokir
};

const {
  smsg,
  tanggal,
  getTime,
  isUrl,
  clockString,
  runtime,
  fetchJson,
  getBuffer,
  jsonformat,
  format,
  formatp,
  parseMention,
  getRandom,
  sleep,
  getGroupAdmins,
} = require("./lib/myfunc");
//========================================

const ctext = (text, style = 1) => {
  var abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
  var xyz = {
    1: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890",
  };
  var replacer = [];
  abc.map((v, i) =>
    replacer.push({
      original: v,
      convert: xyz[style].split("")[i],
    })
  );
  var str = text.toLowerCase().split("");
  var output = [];
  str.map((v) => {
    const find = replacer.find((x) => x.original == v);
    find ? output.push(find.convert) : output.push(v);
  });
  return output.join("");
};
const extractUrlFromText = (text) => {
  if (!text || typeof text !== "string") {
    return undefined;
  }
  var _a;
  return (_a = text.match(Defaults_1.URL_REGEX)) === null || _a === void 0
    ? void 0
    : _a[0];
};

//=============================================================================
module.exports = async (sansline, m) => {
  try {
    const from = mek.key.remoteJid;
    const body =
      (m.mtype === "conversation" && m.message.conversation) ||
      (m.mtype === "imageMessage" && m.message.imageMessage.caption) ||
      (m.mtype === "documentMessage" && m.message.documentMessage.caption) ||
      (m.mtype === "videoMessage" && m.message.videoMessage.caption) ||
      (m.mtype === "extendedTextMessage" &&
        m.message.extendedTextMessage.text) ||
      (m.mtype === "buttonsResponseMessage" &&
        m.message.buttonsResponseMessage.selectedButtonId) ||
      (m.mtype === "templateButtonReplyMessage" &&
        m.message.templateButtonReplyMessage.selectedId)
        ? (m.mtype === "conversation" && m.message.conversation) ||
          (m.mtype === "imageMessage" && m.message.imageMessage.caption) ||
          (m.mtype === "documentMessage" &&
            m.message.documentMessage.caption) ||
          (m.mtype === "videoMessage" && m.message.videoMessage.caption) ||
          (m.mtype === "extendedTextMessage" &&
            m.message.extendedTextMessage.text) ||
          (m.mtype === "buttonsResponseMessage" &&
            m.message.buttonsResponseMessage.selectedButtonId) ||
          (m.mtype === "templateButtonReplyMessage" &&
            m.message.templateButtonReplyMessage.selectedId)
        : "";
    const fcall = {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(from ? { remoteJid: "status@broadcast" } : {}),
      },
      message: { extendedTextMessage: { text: body } },
    };

    async function downloadMp3(url) {
      try {
        // jalur sampah
        let mp3File = "./.npm/" + getRandom(".mp3");
        ytdl(url, { filter: "audioonly" })
          .pipe(fs.createWriteStream(mp3File))
          .on("finish", async () => {
            await sansline.sendMessage(
              m,
              { audio: fs.readFileSync(mp3File), mimetype: "audio/mpeg" },
              { quoted: m }
            );
            fs.unlinkSync(mp3File);
          });
      } catch (e) {
        console.log(e);
        return sansline.sendteks(m, util.format(e), m);
      }
    }

    const budy = typeof m.text === "string" ? m.text : "";
    const botNumber = await sansline.decodeJid(sansline.user.id);
    const isCreator =
      (m &&
        m.sender &&
        [botNumber, ...global.owner]
          .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
          .includes(m.sender)) ||
      false;
    const _prem = require("./lib/premium");
    const premium = JSON.parse(fs.readFileSync("./database/premium.json"));
    const isOwner = isCreator
      ? true
      : _prem.checkPremiumUser(m.sender, premium);
    const msgowner = global.mess.owner;
    const msglimit = global.mess.limit;
    const msgpremium = global.mess.premium;
    const msgban = global.mess.banned;
    const msgsuccess = global.mess.success;
    const msggroup = global.mess.group;
    const apikey = global.sanslineapi;

    let ntilinkfb = JSON.parse(
      fs.readFileSync("./database/antilinkfacebook.json")
    );

    const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
    const prefix = prefixRegex.test(body)
      ? body.match(prefixRegex)[0]
      : global.prefix;
    const isCmd = body.startsWith(prefix);
    const isCommand = isCmd
      ? body.slice(1).trim().split(" ").shift().toLowerCase()
      : "";
    const command = isCreator
      ? body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase()
      : isCommand;
    const args = body.trim().split(/ +/).slice(1);
    const text = (q = args.join(" "));
    const sender = m.key.mMe
      ? sansline.user.id.split(":")[0] + "@s.whatsapp.net" || sansline.user.id
      : m.key.participant || m.key.remoteJid;
    const senderNumber = sender.split("@")[0];
    const pushname = m.pushName || `${senderNumber}`;
    const isBot = botNumber.includes(senderNumber);
    const fatkuns = m.quoted || m;
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.m || quoted).mimetype || "";
    const qmsg = quoted.m || quoted;

    const groupMetadata = m.isGroup
      ? await sansline.groupMetadata(m.chat).catch((e) => {})
      : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : "";
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const groupOwner = m.isGroup ? groupMetadata.owner : "";
    const isGroupOwner = m.isGroup
      ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender)
      : false;
    //

    const wait = global.mess.wait;
    const AntiLinkFacebook = m.isGroup ? ntilinkfb.includes(from) : false;
    const ments = (teks) => {
      return teks.match("@")
        ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map(
            (v) => v[1] + "@s.whatsapp.net"
          )
        : [sender];
    };

    const reply = async (teks) => {
      try {
        // console.log("Sending message to chat ID:", m.chat);
        await sansline.sendMessage(
          m.chat,
          {
            text: teks,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                title: `SANSLINEDEV`,
                previewType: "PHOTO",
                containsAutoReply: true,
                mediaType: 1,
                thumbnailUrl:
                  "https://telegra.ph/file/aff6f74ea9b75af87b6d6.jpg",
                sourceUrl: "https://sanslinedev.tech/",
              },
            },
          },
          { quoted: fcall }
        );
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    };

    const reply2 = (teks) => {
      return sansline.sendMessage(
        m.chat,
        {
          text: teks,
          contextInfo: {
            externalAdReply: {
              title: `SANSLINE-DEV`,
              body: `https://sanslinedev.tech/`,
              previewType: "PHOTO",
              thumbnailUrl: "https://telegra.ph/file/aff6f74ea9b75af87b6d6.jpg",
              sourceUrl: ``,
            },
          },
        },
        { quoted: m }
      );
    };

    if (isCmd) {
      const context = m.isGroup
        ? `${red}Group Chat${reset}`
        : `${red}Private Chat${reset}`;
      const argCount = `${white}[${args.length} arguments]${reset}`;
      console.log(`
        ${blue}~> Ada Pesan Nih${reset}
        ${yellow}=================${reset}
        ${green}Command  : ${reset}${command}
        ${magenta}User     : ${reset}${pushname}
        ${cyan}Di  : ${reset}${context} ${cyan}${groupName}
        ${white}Arguments: ${reset}${argCount}
        ${yellow}=================${reset}
      `);
    }
    let tik = "`";

    const userpremium = countPremiumUsers();
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);
    let role = isPremiumUser(sender) ? "Yes" : "No";
    let mode = sansline.public ? "Public" : "Self";
    let limitData = readLimitData(sender);
    const limit = isPremiumUser(sender)
      ? "Unlimited"
      : limitData.limits[sender] || "No limit data";
    let owned = `${global.ownername}`;
    const caption = `
_Halo! @${sender.split("@")[0]}, Saya adalah ${
      global.botName
    } Whatsapp bot multifungsi._

┏━『 ${tik}USER INFO${tik} 』
┃
┣✦ _*ᴘʀᴇᴍɪᴜᴍ: ${role}*_
┣✦ _*ʟɪᴍɪᴛ: ${limit}*_
┗━━━━━━━━━━━━━━━━━━◧

┏━『 ${tik}BOT INFO${tik} 』
┃
┣✦ _*ᴍᴏᴅᴇ: ${mode}*_
┣✦ _*ᴄʀᴇᴀᴛᴏʀ : ${owned.split("@")[0]}*_
┣✦ _*ᴘʀᴇꜰɪx: ${prefix}*_
┣✦ _*ᴜꜱᴇʀᴘʀᴇᴍɪᴜᴍ: ${userpremium}*_
┣✦ _*ʀᴜɴᴛɪᴍᴇ:  ${uptime}*_
┣✦ _*ʀᴇꜱᴛᴀᴘɪ :*_ ${global.webapi}
┗━━━━━━━━━━━━━━━━━━◧


┏━『 ${tik}LIST MENU${tik} 』
┃
┣✦ *${prefix}ᴍᴇɴᴜ ᴏᴡɴᴇʀ*
┣✦ *${prefix}ᴍᴇɴᴜ ᴀɪ*   
┣✦ *${prefix}ᴍᴇɴᴜ ᴅᴏᴡɴʟᴏᴀᴅ* 
┣✦ *${prefix}ᴍᴇɴᴜ ᴀɴɪᴍᴇ*      
┣✦ *${prefix}ᴍᴇɴᴜ ʙᴇʀɪᴛᴀ*
┣✦ *${prefix}ᴍᴇɴᴜ ɪꜱʟᴀᴍɪᴄ*        
┣✦ *${prefix}ᴍᴇɴᴜ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ*      
┣✦ *${prefix}ᴍᴇɴᴜ ᴅᴀᴛᴀʙᴀꜱᴇ*          
┣✦ *${prefix}ᴍᴇɴᴜ ꜱᴇᴀʀᴄʜ*           
┣✦ *${prefix}ᴍᴇɴᴜ ɢᴀᴍᴇ*      
┣✦ *${prefix}ᴍᴇɴᴜ ɢʀᴏᴜᴘ*                                      
┣✦ *${prefix}ᴍᴇɴᴜ ʀᴀɴᴅᴏᴍ*      
┣✦ *${prefix}ᴍᴇɴᴜ ᴛᴇxᴛᴘʀᴏ*           
┗━━━━━━━━━━━━━━━━━━◧

`;

    const getShortenedUrl = async (url) => {
      let { data } = await axios.post("https://shorturl.sansline.fund", {
        url,
      });
      return data.data.shortUrl;
    };

    if (autobio) {
      const _uptime = process.uptime() * 1000;
      const uptime = clockString(_uptime);
      await sansline
        .updateProfileStatus(
          `I am ${global.botName} | Aktif Selama ${uptime} ⏳ | Mode : ${
            sansline.public ? "Public-Mode" : "Self-Mode"
          }`
        )
        .catch((_) => _);
    }

    if (autoread) {
      sansline.readMessages([m.key]);
    } else {
      global.db.data.settings[botNumber] = {
        status: 0,
        autobio: false,
        autoread: false,
      };
    }
    //====================================================//

    if (args[0] === "ai") {
      reply(`┏━『 *MENU AI* 』
┃
┣✦ ${prefix}ᴍᴀʀɪᴏᴀɪ 
┣✦ ${prefix}ꜱɪᴍɪ
┣✦ ${prefix}ʙʟᴀᴄᴋʙᴏᴄᴋ
┣✦ ${prefix}ɢᴇᴍɪɴɪ
┣✦ ${prefix}ᴅɪꜰꜰᴜꜱɪᴏɴ
┣✦ ${prefix}ᴘʜᴏᴛᴏʟᴇᴀᴘ
┣✦ ${prefix}ɢᴇᴍɪɴɪ
┣✦ ${prefix}ʀᴀɢʙᴏᴛ
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "download") {
      reply(`┏━『 *MENU DOWNLOAD* 』
┃
┣✦ ${prefix}ᴛɪᴋᴛᴏᴋ 
┣✦ ${prefix}ɪɴꜱᴛᴀɢʀᴀᴍ
┣✦ ${prefix}ʏᴏᴜᴛᴜʙᴇ 
┣✦ ${prefix}ꜰᴀᴄᴇʙᴏᴏᴋ
┣✦ ${prefix}ᴛᴡɪᴛᴛᴇʀ
┣✦ ${prefix}ɢᴏᴏɢʟᴇᴅʀɪᴠᴇ
┣✦ ${prefix}ʏᴏᴜᴛᴜʙᴇ 
┣✦ ${prefix}ᴍᴇᴅɪᴀꜰɪʀᴇ
┣✦ ${prefix}ꜱᴘᴏᴛɪꜰʏ
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "anime") {
      reply(`┏━『 *MENU ANIME* 』
┃
┣✦ ${prefix}ᴏᴛᴀᴋᴜᴅᴇꜱᴜ 
┣✦ ${prefix}ᴋᴏᴍɪᴋᴄᴀꜱᴛ
┣✦ ${prefix}ᴍᴀɴɢᴀᴛᴏᴏɴ 
┣✦ ${prefix}ᴡᴇʙᴛᴏᴏɴ
┣✦ ${prefix}ᴍᴀɴɢᴀᴛᴏᴏɴ2 
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "islamic") {
      reply(`┏━『 *MENU ISLAMIC* 』
┃
┣✦ ${prefix}ᴅᴏᴀ (ᴅᴏᴀ ꜱᴇʜᴀʀɪ-ʜᴀʀɪ)
┣✦ ${prefix}ᴅᴏᴀ2 (ᴅᴏᴀ ʀᴀɴᴅᴏᴍ)
┣✦ ${prefix}ᴀʟQᴜʀᴀɴ
┣✦ ${prefix}ʜᴀᴅɪꜱᴛ  
┣✦ ${prefix}ᴊᴀᴅᴡᴀʟꜱʜᴏʟᴀᴛ
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "information") {
      reply(`┏━『 *MENU INFO* 』
┃
┣✦ ${prefix}ɢᴇᴍᴘᴀ 
┣✦ ${prefix}ʟɪꜱᴛɢᴇᴍᴘᴀ
┣✦ ${prefix}ᴘᴅᴅɪᴋᴛɪ 
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "berita") {
      reply(`┏━『 *MENU BERITA* 』
┃
┣✦ ${prefix}ᴋᴏᴍᴘᴀꜱᴛᴠ 
┣✦ ${prefix}ᴊᴀᴋᴘᴏꜱᴛ
┣✦ ${prefix}ᴄɴɴ 
┣✦ ${prefix}ᴄɴʙᴄ
┣✦ ${prefix}ʀᴇᴘᴜʙʟɪᴋᴀ
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "database") {
      reply(`┏━『 *MENU DATABASE* 』
┃
┣✦ ${prefix}ʟɪꜱᴛʙᴀɴᴋ
┣✦ ${prefix}ʟɪꜱᴛᴇᴡᴀʟʟᴇᴛ
┣✦ ${prefix}ᴄᴇᴋʙᴀɴᴋ 
┣✦ ${prefix}ᴄᴇᴋᴇᴡᴀʟʟᴇᴛ
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "search") {
      reply(`┏━『 *MENU SEARCH* 』
┃
┣✦ ${prefix}ʏᴛꜱᴇᴀʀᴄʜ 
┣✦ ${prefix}ᴛɪᴋᴛᴏᴋꜱᴇᴀʀᴄʜ
┣✦ ${prefix}ᴘʟᴀʏꜱᴛᴏʀᴇ
┣✦ ${prefix}ᴘɪɴᴛᴇʀᴇꜱᴛ 
┣✦ ${prefix}ᴋᴏᴅᴇᴘᴏꜱ
┣✦ ${prefix}ʟɪʀɪᴋ
┣✦ ${prefix}ꜱᴛɪᴄᴋᴇʀꜱᴇᴀʀᴄʜ 
┣✦ ${prefix}ᴡɪᴋɪᴍᴇᴅɪᴀ
┣✦ ${prefix}ꜱᴘᴏᴛɪꜰʏꜱᴇᴀʀᴄʜ
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "group") {
      reply(`┏━『 *MENU GROUP* 』
┃
┣✦ ${prefix}ɢᴇᴛᴄᴏɴᴛᴀᴄᴛ 
┣✦ ${prefix}ᴛᴏᴛᴀɢ
┣✦ ${prefix}ʟɪɴᴋɢᴄ 
┣✦ ${prefix}ʀᴇꜱᴇᴛʟɪɴᴋɢᴄ
┣✦ ${prefix}ꜱᴇɴᴅʟɪɴᴋɢᴄ
┣✦ ${prefix}ᴋɪᴄᴋ
┣✦ ${prefix}ᴀᴅᴅ 
┣✦ ${prefix}ᴘʀᴏᴍᴏᴛᴇ
┣✦ ${prefix}ʜɪᴅᴇᴛᴀɢ
┣✦ ${prefix}ᴛᴀɢᴀʟʟ
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "game") {
      reply(`┏━『 *MENU INFO* 』
┃
┣✦ ${prefix}ʙɪꜱᴀᴋᴀʜ
┣✦ ${prefix}ᴀᴘᴀᴋᴀʜ
┣✦ ${prefix}ᴋᴀᴘᴀɴᴋᴀʜ
┣✦ ${prefix}ʙᴀɢᴀɪᴍᴀɴᴀᴋᴀʜ
┣✦ ${prefix}ᴄᴇᴋɢᴀɴᴛᴇɴɢ
┣✦ ${prefix}ᴄᴇᴋᴄᴀɴᴛɪᴋ
┣✦ ${prefix}ʀᴀᴛᴇ
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "random") {
      reply(`┏━『 *MENU INFO* 』
┃
┣✦ ${prefix}ɢᴇᴍᴘᴀ 
┣✦ ${prefix}ʟɪꜱᴛɢᴇᴍᴘᴀ
┣✦ ${prefix}ᴘᴅᴅɪᴋᴛɪ 
┣✦ ${prefix}ꜰᴀᴄᴇʙᴏᴏᴋ
┣✦ ${prefix}ᴛᴡɪᴛᴛᴇʀ
┣✦ ${prefix}ɢᴏᴏɢʟᴇᴅʀɪᴠᴇ
┣✦ ${prefix}ʏᴏᴜᴛᴜʙᴇ 
┣✦ ${prefix}ᴍᴇᴅɪᴀꜰɪʀᴇ
┣✦ ${prefix}ꜱᴘᴏᴛɪꜰʏ
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (args[0] === "owner") {
      reply(`┏━『 *MENU OWNER* 』
┃
┣✦ ${prefix}ᴘᴜꜱʜᴋᴏɴᴛᴀᴋ 
┣✦ ${prefix}ᴘᴜʙʟɪᴄ 
┣✦ ${prefix}ꜱᴇʟꜰ 
┣✦ ${prefix}ʙᴀɴ 
┣✦ ${prefix}ᴜɴʙᴀɴ
┣✦ ${prefix}ʟɪꜱᴛʙᴀɴ
┣✦ ${prefix}ʙɪᴏᴀᴜᴛᴏ
┣✦ ${prefix}ᴀᴅᴅʟɪᴍɪᴛ
┣✦ ${prefix}ᴀᴅᴅᴘʀᴇᴍɪᴜᴍ
┣✦ ${prefix}ᴅᴇʟᴘʀᴇᴍɪᴜᴍ
┣✦ ${prefix}ʟɪꜱᴛᴘʀᴇᴍɪᴜᴍ
┣✦ ${prefix}ᴀᴜᴛᴏʙɪᴏ 
┣✦ ${prefix}ᴀᴜᴛᴏʀᴇᴀᴅ 
┣✦ ${prefix}ᴄᴇᴋɪᴅɢᴄ
┣✦ ${prefix}ɢᴇᴛɪᴅɢᴄ
┣✦ ${prefix}ᴊᴏɪɴ
┣✦ ${prefix}ꜱʜᴜᴛᴅᴏᴡɴ (Mematikan bot!)
┗━━━━━━━━━━━━━━━━━━◧`);
    } else if (command === "menu") {
      if (checkLimit(m.sender)) {
        return reply(`*${mess.limit}*`);
      }
      if (isBan(sender)) {
        return reply(msgban);
      }
      reply(`_Loading_`);
      reduceLimit(sender);
      let teksskkk = `${caption}`;
      let sections = [
        {
          title: "COMINGSOON",
          rows: [],
        },
      ];

      let listMessage = {
        title: "List Menu",
        sections,
      };

      let msghhhhhhhhhhhhhhhhhhh = generateWAMessageFromContent(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2,
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                contextInfo: {
                  mentionedJid: [m?.sender],
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: "12036326753195844@newsletter",
                    newsletterName: `${global.botName} ${uptime}`,
                    serverMessageId: -1,
                  },
                  businessMessageForwardInfo: {
                    businessOwnerJid: sansline.decodeJid(sansline.user.id),
                  },
                  externalAdReply: {
                    title: global.foter2,
                    body: "V 3.0.0",
                    thumbnail: fs.readFileSync("./sansline.png"),
                    sourceUrl: "https://sanslinedev.tech/",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                  },
                },
                body: proto.Message.InteractiveMessage.Body.create({
                  text: teksskkk,
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: `© ${global.foter1}`,
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: ``,
                  thumbnailUrl: "",
                  gifPlayback: true,
                  subtitle: `Creator: ${global.ownername}`,
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia(
                    {
                      document: fs.readFileSync("./package.json"),
                      mimetype: "application/msword",
                      fileName: `BETA VERSION`,
                    },
                    {
                      upload: sansline.waUploadToServer,
                    }
                  )),
                }),
                gifPlayback: true,
                nativeFlowMessage:
                  proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: [
                      {
                        name: "single_select",
                        buttonParamsJson: JSON.stringify(listMessage),
                      },
                      {
                        name: "cta_url",
                        buttonParamsJson: `{\"display_text\":\"Owner\",\"url\":\"https://wa.me/${global.owner}\",\"merchant_url\":\"https://wa.me/6285774912005\"}`,
                      },
                    ],
                  }),
              }),
            },
          },
        },
        {
          quoted: m,
        }
      );

      await sansline.relayMessage(
        msghhhhhhhhhhhhhhhhhhh.key.remoteJid,
        msghhhhhhhhhhhhhhhhhhh.message,
        {
          messageId: msghhhhhhhhhhhhhhhhhhh.key.id,
        }
      );
      //       if (checkLimit(m.sender)) {
      //         return reply(`*${mess.limit}*`);
      //       }
      //       if (isBan(sender)) {
      //         return reply(msgban);
      //       }
      //       const userpremium = countPremiumUsers();
      //       const _uptime = process.uptime() * 1000;
      //       const uptime = clockString(_uptime);
      //       let role = isPremiumUser(sender) ? "Yes" : "No";
      //       let mode = sansline.public ? "Public" : "Self";
      //       let limitData = readLimitData(sender);
      //       const limit = isPremiumUser(sender)
      //         ? "Unlimited"
      //         : limitData.limits[sender] || "No limit data";
      //       let owned = `${global.ownername}`;
      //       const caption = `
      // _*Halo! ${pushname}, Saya adalah ${
      //         global.botName
      //       } Whatsapp bot multifungsi yang siap membantu Anda.*_

      // ┏━『 *USER INFO* 』
      // ┃
      // ┣✦ _*ᴘʀᴇᴍɪᴜᴍ: ${role}*_
      // ┣✦ _*ʟɪᴍɪᴛ: ${limit}*_
      // ┗━━━━━━━━━━━━━━━━━━◧

      // ┏━『 *BOT INFO* 』
      // ┃
      // ┣✦ _*ᴍᴏᴅᴇ: ${mode}*_
      // ┣✦ _*ᴄʀᴇᴀᴛᴏʀ : ${owned.split("@")[0]}*_
      // ┣✦ _*ᴘʀᴇꜰɪx: ${prefix}*_
      // ┣✦ _*ᴜꜱᴇʀᴘʀᴇᴍɪᴜᴍ: ${userpremium}*_
      // ┣✦ _*ʀᴜɴᴛɪᴍᴇ:  ${uptime}*_
      // ┣✦ _*ʀᴇꜱᴛᴀᴘɪ :*_ ${global.webapi}
      // ┗━━━━━━━━━━━━━━━━━━◧

      // ┏━『 *LIST MENU* 』
      // ┃
      // ┣✦ *${prefix}ᴍᴇɴᴜ ᴏᴡɴᴇʀ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ᴀɪ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ᴅᴏᴡɴʟᴏᴀᴅ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ᴀɴɪᴍᴇ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ʙᴇʀɪᴛᴀ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ɪꜱʟᴀᴍɪᴄ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ᴅᴀᴛᴀʙᴀꜱᴇ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ꜱᴇᴀʀᴄʜ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ɢᴀᴍᴇ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ɢʀᴏᴜᴘ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ʀᴀɴᴅᴏᴍ*
      // ┣✦ *${prefix}ᴍᴇɴᴜ ᴛᴇxᴛᴘʀᴏ*
      // ┗━━━━━━━━━━━━━━━━━━◧

      // _*ᴋᴇᴛɪᴋ .ᴀʟʟᴍᴇɴᴜ ᴜɴᴛᴜᴋ ᴍᴇɴᴀᴍᴘɪʟᴋᴀɴ ꜱᴇᴍᴜᴀ ᴍᴇɴᴜ*_
      //     `;
      //       let sections = [
      //         {
      //           title: "All Menu",
      //           highlight_label: "All Menu List",
      //           rows: [
      //             {
      //               title: "Menu All",
      //               description: `Displays All Menu`,
      //               id: `${prefix}menu all`,
      //             },
      //           ],
      //         },
      //         {
      //           title: "List Menu",
      //           rows: [
      //             {
      //               title: "A-I Menu List",
      //               description: `SAS•`,
      //               id: `${prefix}tt`,
      //             },
      //             {
      //               title: "Menu Anime",
      //               description: `Displays Anime Menu`,
      //               id: `${prefix}menu anime`,
      //             },
      //             {
      //               title: "Menu Database",
      //               description: `Displays Database Menu`,
      //               id: `${prefix}menu database`,
      //             },
      //             {
      //               title: "Menu Download",
      //               description: `Displays Download Menu`,
      //               id: `${prefix}download`,
      //             },
      //             {
      //               title: "Menu Game",
      //               description: `Displays Game Menu`,
      //               id: `menu game`,
      //             },
      //             {
      //               title: "Menu Group",
      //               description: `Displays Group Menu`,
      //               id: `${prefix}menu group`,
      //             },
      //             {
      //               title: "Menu Other",
      //               description: "Displays the Other Menu",
      //               id: `${prefix}menu other`,
      //             },
      //             {
      //               title: "Menu Owner",
      //               description: "Displays the Owner Menu",
      //               id: `${prefix}menu owner`,
      //             },
      //             {
      //               title: "Menu Search",
      //               description: "Displays the Search Menu",
      //               id: `${prefix}menu search`,
      //             },
      //             {
      //               title: "Menu Tools",
      //               description: "Displays the Tools Menu",
      //               id: `${prefix}menu tools`,
      //             },
      //           ],
      //         },
      //       ];

      //       let listMessage = {
      //         title: "List Menu",
      //         sections,
      //       };

      //       let msg = generateWAMessageFromContent(
      //         m.chat,
      //         {
      //           viewOnceMessage: {
      //             message: {
      //               messageContextInfo: {
      //                 deviceListMetadata: {},
      //                 deviceListMetadataVersion: 2,
      //               },
      //               interactiveMessage: proto.Message.InteractiveMessage.create({
      //                 contextInfo: {
      //                   mentionedJid: [m?.sender],
      //                   isForwarded: true,
      //                   forwardedNewsletterMessageInfo: {
      //                     newsletterJid: "12036326753195844@newsletter",
      //                     newsletterJid: "idsal",
      //                     serverMessageId: -1,
      //                   },
      //                   businessMessageForwardInfo: {
      //                     businessOwnerJid: sansline.decodeJid(sansline.user.id),
      //                   },
      //                 },
      //                 body: proto.Message.InteractiveMessage.Body.create({
      //                   text: caption,
      //                 }),
      //                 footer: proto.Message.InteractiveMessage.Footer.create({
      //                   text: global.foter1,
      //                 }),
      //                 header: proto.Message.InteractiveMessage.Header.create({
      //                   title: `SANSLINE`,
      //                   subtitle: "S",
      //                   hasMediaAttachment: true,
      //                   ...(await prepareWAMessageMedia(
      //                     {
      //                       image: {
      //                         url: global.thumb,
      //                       },
      //                     },
      //                     { upload: sansline.waUploadToServer }
      //                   )),
      //                 }),
      //                 nativeFlowMessage:
      //                   proto.Message.InteractiveMessage.NativeFlowMessage.create({
      //                     buttons: [
      //                       {
      //                         name: "single_select",
      //                         buttonParamsJson: JSON.stringify(listMessage),
      //                       },
      //                       {
      //                         name: "cta_url",
      //                         buttonParamsJson: `{\"display_text\":\"Owner\",\"url\":\"https://wa.me/${global.owner}\",\"merchant_url\":\"https://wa.me/6285774912005\"}`,
      //                       },
      //                     ],
      //                   }),
      //               }),
      //             },
      //           },
      //         },
      //         {}
      //       );

      // if (!text)
      //   await sansline.relayMessage(msg.key.remoteJid, msg.message, {
      //     messageId: msg.key.id,
      //   });
    }

    switch (command) {
      //=============================================================
      //MENU OWNER
      //=============================================================
      // case "menu":
      // case "simplemenu":
      // case "menulist":
      // case "allmenu":

      //   break;

      case "ban":
      case "banned": {
        if (!isOwner) return reply(msgowner);
        if (args.length == 0) {
          return reply(`*Example: ${prefix + command} @user*`);
        };
        let users = m.mentionedJid[0]
          ? m.mentionedJid[0]
          : m.quoted
          ? m.quoted.sender
          : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

        const result = banUser(users);
        return m.reply(result.message);
      }

      case "unban":
      case "unbanned": {
        if (!isOwner) return reply(msgowner);
        if (args.length == 0) {
          return reply(`*Example: ${prefix + command} @user*`);
        }
        let users = m.mentionedJid[0]
          ? m.mentionedJid[0]
          : m.quoted
          ? m.quoted.sender
          : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

        const result = unbanUser(users);
        return m.reply(result.message);
      }

      case "listban":
      case "listbanned":
        {
          if (!isOwner) return reply(msgowner);
          if (!isOwner) {
            return reply(msgowner);
          }

          const bannedUsers = getListBannedUsers();
          if (bannedUsers.length === 0) {
            return m.reply("Tidak ada pengguna yang diblokir saat ini.");
          }

          let response = "Daftar Pengguna yang Diblokir:\n\n";
          bannedUsers.forEach((user, index) => {
            response += `${index + 1}. ${user}\n`;
          });

          return m.reply(response);
        }
        break;

      //========================================================
      case "addlimit":
        if (!isOwner) {
          return reply(msgowner);
        }
        if (args.length < 2) {
          return reply(`Example: ${prefix + command} 628****** 10`);
        }

        const limitUser = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        const limitAmount = parseInt(args[1]);
        if (isNaN(limitAmount)) {
          return reply("Jumlah limit harus berupa angka.");
        }

        addLimit(limitUser, limitAmount);
        reply(
          `Berhasil menambahkan ${limitAmount} limit untuk pengguna ${limitUser}.`
        );
        break;
      //===================================================
      case "addprem":
      case "addpremium":
        if (!isOwner) {
          return reply(msgowner);
        }
        if (args.length === 0) {
          return reply(`Example: ${prefix}addpremium 628******/@user`);
        }

        const newUser = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        if (addPremiumUser(newUser)) {
          reply(`User ${newUser} successfully added as a premium user.`);
        } else {
          reply(`User ${newUser} is already in the premium user list.`);
        }
        break;

      case "deletepremium":
      case "delpremium":
        if (!isOwner) {
          return reply(msgowner);
        }
        if (args.length === 0) {
          return reply(`Contoh: ${prefix + command} 628******/@user`);
        }

        const userToDelete = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        if (deletePremiumUser(userToDelete)) {
          reply(
            `Pengguna ${userToDelete} berhasil dihapus dari daftar premium.`
          );
        } else {
          reply(
            `Pengguna ${userToDelete} tidak ditemukan dalam daftar premium.`
          );
        }
        break;
      //===================================================
      case "listpremium":
      case "premiumlist":
        if (!isOwner) {
          return reply(msgowner);
        }
        const premiumUsersPath = path.join(
          __dirname,
          "./database/premium.json"
        );
        const data = JSON.parse(fs.readFileSync(premiumUsersPath, "utf-8"));
        const premiumList = data.premium.join("\n");
        reply(`Daftar Pengguna Premium:\n${premiumList}`);
        break;

      case "addlimit":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (!isOwner(sender)) {
          return reply(msgowner);
        }
        if (args.length < 2) {
          return reply(`Example: ${prefix + command} user_id 10`);
        }
        const userId = args[0];
        const amount = parseInt(args[1]);
        if (isNaN(amount)) {
          return reply("Jumlah limit harus berupa angka.");
        }
        addLimit(userId, amount);
        reply(`Berhasil menambahkan ${amount} limit untuk pengguna ${userId}.`);
        break;

      case "pushkontak":
        {
          if (!isOwner) return reply(msgowner);
          if (!m.isGroup) return reply(msggroup);
          if (!text) return reply(`Teks Nya Kak?`);
          let mem = await participants
            .filter((v) => v.id.endsWith(".net"))
            .map((v) => v.id);
          let teksnye = `${q}`;
          reply(
            `*Mengirim pesan ke ${mem.length} orang, perkiraan waktu selesai ${
              mem.length * 3
            } detik*`
          );
          for (let geek of mem) {
            await sleep(3000);
            sansline.sendMessage(
              geek,
              { text: `${teksnye}` },
              { quoted: fcall }
            );
          }
          reply(`*Sukses mengirim pesan Ke ${mem.length} orang*`);
        }
        break;
      case "getidgc":
        if (!m.isGroup) return reply("kusus Group");
        ct = `${m.chat}`;
        await sansline.relayMessage(
          m.chat,
          {
            requestPaymentMessage: {
              currencyCodeIso4217: "IDR",
              amount1000: 1000000000,
              requestFrom: m.sender,
              noteMessage: {
                extendedTextMessage: {
                  text: ct,
                  contextInfo: {
                    externalAdReply: {
                      showAdAttribution: true,
                    },
                  },
                },
              },
            },
          },
          {}
        );
        break;

      case "join":
        {
          if (!isOwner) return reply(msgowner);
          if (!text) return reply("masukan link group");
          if (!isUrl(args[0]) && !args[0].includes("whatsapp.com"))
            throw "Link Invalid!";
          // await loading();
          let result = args[0].split("https://chat.whatsapp.com/")[1];
          await sansline
            .groupAcceptInvite(result)
            .then((res) => reply(jsonformat(res)))
            .catch((err) => reply(jsonformat(err)));
        }
        break;

      case "cekidgc":
        {
          if (!isOwner) return reply(msgowner);
          let getGroups = await sansline.groupFetchAllParticipating();
          let groups = Object.entries(getGroups)
            .slice(0)
            .map((entry) => entry[1]);
          let anu = groups.map((v) => v.id);
          let teks = `⬣ *LIST GROUP DI BAWAH*\n\nTotal Group : ${anu.length} Group\n\n`;
          for (let x of anu) {
            let metadata2 = await sansline.groupMetadata(x);
            teks += `◉ Nama : ${metadata2.subject}\n◉ ID : ${metadata2.id}\n◉ Member : ${metadata2.participants.length}\n\n────────────────────────\n\n`;
          }
          reply(
            teks +
              `Untuk Penggunaan Silahkan Ketik Command ${prefix}pushkontak id|teks\n\nSebelum Menggunakan Silahkan Salin Dulu Id Group Nya Di Atas`
          );
        }
        break;

      case "autobio":
        {
          let {
            proto,
            generateWAMessageFromContent,
          } = require("@whiskeysockets/baileys");
          let msg = generateWAMessageFromContent(
            m.chat,
            {
              viewOnceMessage: {
                message: {
                  messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                  },
                  interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                      text: "",
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                      text: "wm",
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                      title: ctext(
                        `click button *enable* to enable autobio\nclick button *disable* to disable autobio`
                      ),
                      subtitle: "rorr",
                      hasMediaAttachment: false,
                    }),
                    nativeFlowMessage:
                      proto.Message.InteractiveMessage.NativeFlowMessage.create(
                        {
                          buttons: [
                            {
                              name: "quick_reply",
                              buttonParamsJson:
                                '{"display_text":"Enable","id":".biochange enable"}',
                            },
                            {
                              name: "quick_reply",
                              buttonParamsJson:
                                '{"display_text":"Disable","id":".biochange disable"}',
                            },
                          ],
                        }
                      ),
                  }),
                },
              },
            },
            {}
          );

          await sansline.relayMessage(msg.key.remoteJid, msg.message, {
            messageId: msg.key.id,
          });
        }
        break;
      case "bioauto":
        if (!isCreator) return reply(msgowner);
        if (args.length < 1) return reply(`Example ${prefix + command} on/off`);
        if (q == "enable") {
          autobio = true;
          reply(`Berhasil Mengubah AutoBio Ke ${q}`);
        } else if (q == "disable") {
          autobio = false;
          reply(`Berhasil Mengubah AutoBio Ke ${q}`);
        }
        break;
      case "autoread":
        if (!isCreator) return reply(msgowner);
        if (args.length < 1)
          return reply(`Contoh ${prefix + command} enable/disable`);
        if (q === "enable") {
          autoread = true;
          reply(`Berhasil mengubah autoread ke ${q}`);
        } else if (q === "disable") {
          autoread = false;
          reply(`Berhasil mengubah autoread ke ${q}`);
        }
        break;

      case "public":
        {
          if (!isCreator) return reply(msgowner);
          sansline.public = true;
          reply("*_Sukse Change To Public_*");
        }
        break;

      case "self":
        {
          if (!isCreator) return reply(msgowner);
          sansline.public = false;
          reply("*_Sukses Change To Self_*");
        }
        break;

      case "shutdown":
        if (!isCreator) return reply(msgowner);
        reply2(`_Mematikan Bot . . ._`);
        await sleep(3000);
        process.exit();
        break;

      //===================================================
      case "owner":
      case "crator":
        {
          sansline.sendContact(from, global.owner, m);
        }
        sansline.sendMessage(
          from,
          {
            text: `Hai Kak @${
              sender.split("@")[0]
            }, Nih Owner Ku.. Kalo Ada Sesuatu Bilang Aja Sama Dia :3`,
            contextInfo: {
              forwardingScore: 9999999,
              isForwarded: true,
              mentionedJid: [sender],
            },
          },
          { quoted: m }
        );

        break;

      //=======================================================
      //GROUP MENU
      //=======================================================

      case "getcontact":
      case "getcon":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins) return reply(mess.admin);
          konstak = await sansline.sendMessage(
            m.chat,
            {
              text: `Group : *${groupMetadata.subject}*\nMember : *${participants.length}*`,
            },
            { quoted: m, ephemeralExpiration: 86400 }
          );
          sansline.sendContact(
            m.chat,
            participants.map((a) => a.id),
            konstak
          );
        }
        break;

      case "linkgroup":
      case "linkgc":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins) return reply(mess.admin);
          if (!isBotAdmins) return reply(mess.botAdmin);
          let response = await sansline.groupInviteCode(from);
          sansline.sendText(
            from,
            `https://chat.whatsapp.com/${response}\n\nLink Group : ${groupMetadata.subject}`,
            m,
            { detectLink: true }
          );
        }
        break;

      case "resetlinkgc": {
        if (!isAdmins) return reply(mess.admin);
        if (!m.isGroup) return reply(mess.group);
        if (!isBotAdmins) return reply(mess.botAdmin);

        reply(mess.wait);

        try {
          await sleep(3000);
          await sansline.groupRevokeInvite(from);
          const newInviteCode = await sansline.groupInviteCode(from); // Mendapatkan kode undangan baru
          reply(
            `Link grup berhasil di-reset. Kode undangan baru: https://chat.whatsapp.com/${newInviteCode}`
          );
        } catch (error) {
          console.error(error);
          reply(`Terjadi kesalahan saat mereset link grup: ${error.message}`);
        }
        break;
      }

      case "sendlinkgc": {
        if (!m.isGroup) return reply(mess.group);
        if (!isBotAdmins) return reply(mess.botAdmin);
        if (!args[0]) return reply(`Example: ${prefix + command} 628123xxxxxx`);

        reply(mess.wait);

        try {
          await sleep(3000);
          const bnnd = text.split("|")[0] + "@s.whatsapp.net";
          const response = await sansline.groupInviteCode(from);
          await sansline.sendText(
            bnnd,
            `https://chat.whatsapp.com/${response}\n\nLink Group : ${groupMetadata.subject}`,
            m,
            { detectLink: true }
          );
          reply(mess.success);
        } catch (error) {
          console.error(error);
          reply(`Terjadi kesalahan: ${error.message}`);
        }
        break;
      }
      case "kick":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.botAdmin);
          if (!isAdmins) return reply(mess.admin);
          let users = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await sansline.groupParticipantsUpdate(from, [users], "remove");
          reply(mess.succes);
        }
        break;
      case "add":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.botAdmin);
          if (!isAdmins) return reply(mess.admin);
          let users = m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await sansline.groupParticipantsUpdate(from, [users], "add");
          reply(mess.succes);
        }
        break;
      case "promote":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isBotAdmins) return reply(mess.botAdmin);
          if (!isAdmins) return reply(mess.admin);
          let users = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
          await sansline.groupParticipantsUpdate(from, [users], "promote");
          reply(mess.done);
        }
        break;

      case "hidetag":
      case "h":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins) return reply(mess.admin);
          sansline.sendMessage(
            from,
            { text: q ? q : "", mentions: participants.map((a) => a.id) },
            { quoted: Sans }
          );
        }
        break;

      case "tagall":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins) return reply(mess.admin);

          let teks = `══✪〘 *👥 Tag All* 〙✪══
*Pesan : ${q ? q : "kosong"}*\n\n`;
          for (let mem of participants) {
            teks += `⭔ @${mem.id.split("@")[0]}\n`;
          }
          sansline.sendMessage(
            m.chat,
            { text: teks, mentions: participants.map((a) => a.id) },
            { quoted: fcall }
          );
        }
        break;

      //=======================================================

      case "sticker":
      case "s":
      case "stickergif":
      case "sgif":
        {
          if (isBan(sender)) {
            return reply(msgban);
          }
          if (checkLimit(sender)) {
            return reply(mess.limit);
          }
          if (/image/.test(mime)) {
            reply("wait");
            let media = await sansline.downloadMediaMessage(qmsg);
            let encmedia = await sansline.sendImageAsSticker(m.chat, media, m, {
              packname: global.packname,
              author: global.author,
            });
            await fs.unlinkSync(encmedia);
            reduceLimit(sender);
          } else if (/video/.test(mime)) {
            m.reply("wait");
            if (qmsg.seconds > 11) return m.reply("Maksimal 10 detik!");
            let media = await sansline.downloadMediaMessage(qmsg);
            let encmedia = await sansline.sendVideoAsSticker(m.chat, media, m, {
              packname: global.packname,
              author: global.author,
            });
            await fs.unlinkSync(encmedia);
            reduceLimit(sender);
          } else {
            m.reply(
              `*reply gambar/video/gif dengan caption${
                prefix + command
              }*\n*Durasi Video/Gif 1-9 Detik*`
            );
          }
        }
        break;

      //=====================================
      //MENUAI
      //=====================================

      case "marioai":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Saran film horror`);
          return;
        }

        const queryMario = args.join("%20");

        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/ai/marioai?q=${encodeURIComponent(
              queryMario
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              const message = data.result.message;

              reply(message);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Link error cuy..*`);
          });
        break;

      //=====================================

      case "simi":
      case "simi-simi":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Hai`);
          return;
        }
        const querySimi = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/ai/simi?q=${encodeURIComponent(
              querySimi
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              const message = data.result;

              reply(message);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================
      case "blackbock":
      case "blackbockai":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Hai`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`)
        //   return;
        // }
        const queryBok = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/ai/blackbockai?q=${encodeURIComponent(
              queryBok
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              const message = data.result.message;
              reply(message);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================
      case "ragbot":
      case "ragbotai":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Hai`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`)
        //   return;
        // }
        const queryRag = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/ai/ragbotai?q=${encodeURIComponent(
              queryRag
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              const message = data.result.message;
              reply(message);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================
      case "diffusion":
      case "diffusionai":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Kucing`);
          return;
        }
        if (!isPremiumUser(sender)) {
          reply(`${msgpremium}`);
          return;
        }
        const queryDiffusion = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/ai/diffusion?q=${encodeURIComponent(
              queryDiffusion
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reduceLimit(sender);
              const fileUrl = data.result.url;
              sansline.sendMessage(
                from,
                {
                  image: { url: fileUrl },
                  caption: `*D I F F U S I O N - A I* \n`,
                },
                { quoted: m }
              );
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================
      case "photoleap":
      case "photoleapai":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Kucing`);
          return;
        }
        if (!isPremiumUser(sender)) {
          reply(`${msgpremium}`);
          return;
        }
        const queryPhotoai = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/ai/photoleap?q=${encodeURIComponent(
              queryPhotoai
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              reduceLimit(sender);
              const fileUrl = data.result.message.url;
              sansline.sendMessage(
                from,
                {
                  image: { url: fileUrl },
                  caption: `*♢ P H O T O L E A P - A I ♢*`,
                },
                { quoted: m }
              );
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================
      //MENUDOWNLOADER
      //=====================================
      case "ig":
      case "instagram":
      case "igreels":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length == 0) {
          reply(
            `Example: ${
              prefix + command
            } https://www.instagram.com/tv/CXwPLSIFDW0/?igshid=NTc4MTIwNjQ2YQ==`
          );
          return;
        }
        axios
          .get(
            `https://sanslinedev.tech/api/downloader/instagram?q=${args[0]}&apikey=${apikey}`
          )
          .then(({ data }) => {
            reply2(wait);
            if (data.code === 200) {
              const videoUrl = data.result.Link;
              sansline.sendMessage(
                from,
                {
                  video: { url: videoUrl },
                  caption: `${msgsuccess}`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Link error cuy.. ${error}*`);
          });
        break;

      //=============================================

      case "tt":
      case "tiktok":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length == 0) {
          reply(
            `Example: ${prefix + command} https://vt.tiktok.com/ZSYPn3dHW/`
          );
          return;
        }

        axios
          .get(
            `https://sanslinedev.tech/api/downloader/tiktok2?url=${args[0]}&apikey=${apikey}`
          )
          .then(({ data }) => {
            reply2(wait);
            if (data.code === 200) {
              const videoUrl = data.result.data[1].url;
              const title = data.result.title;
              const ori = data.result;
              sansline.sendMessage(
                from,
                {
                  video: { url: videoUrl },
                  mimetype: "video/mp4",
                  caption: `*📽 T I K T O K - D L 📽* \n\n *🔍Akun:* ${ori.author.fullname} \n *✏️Title:* ${title} \n *❤️Likes:* ${ori.stats.likes} \n *📥Uploud:* ${ori.taken_at}`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Link error cuy.. ${error}*`);
          });
        break;

      //=============================================

      case "twitmp4":
      case "twittermp4":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length == 0) {
          reply(`Example: ${prefix + command} https://twitter.com/`);
          return;
        }
        axios
          .get(
            `https://sanslinedev.tech/api/downloader/twitter?q=${args[0]}&apikey=${apikey}`
          )
          .then(({ data }) => {
            reply(wait);
            if (data.code === 200) {
              const videoUrl = data.result.video_hd;
              const title = data.result.desc;
              sansline.sendMessage(
                from,
                {
                  video: { url: videoUrl },
                  mimetype: "video/mp4",
                  caption: `*💿 T W I T T E R - D L 💿* \n\n *📜Title:* ${title}`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Link error cuy.. ${error}*`);
          });
        break;

      //=============================================

      case "mediafire":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length == 0) {
          reply(`Example: ${prefix + command} https://mediafire.com/`);
          return;
        }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/downloader/mediafire?url=${args[0]}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              const fileUrl = data.result.url;
              const title = data.result.title;
              const size = data.result.size;

              sansline.sendMessage(
                from,
                {
                  document: { url: fileUrl },
                  mimetype: "application/zip", // Tipe MIME untuk dokumen biner
                  fileName: `${title}`, // Nama file yang dikirim
                  caption: `*G D R I V E - D L* \n\n *📝 Title:* ${title} \n *📁 Size:* ${size}`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=============================================

      case "yw":
        // if (!isPremiumUser) return reply(`*fitur Premium* ${premiumUsers}`);
        if (args.length == 0) {
          reply(
            `Example: ${
              prefix + command
            } https://www.instagram.com/tv/CXwPLSIFDW0/?igshid=NTc4MTIwNjQ2YQ==`
          );
          return; // Tambahkan return di sini
        }
        reply(wait);

        axios
          .get(`https://api.agatz.xyz/api/xnxx?message=${args[0]}`)
          .then(({ data }) => {
            if (data.status === 200) {
              const results = data.data.result; // Mengambil semua hasil dari array result

              // Memproses setiap hasil menggunakan perulangan for
              for (let i = 0; i < results.length; i++) {
                const currentResult = results[i];

                // Menampilkan hasil
                // reply(wait);
                const title = currentResult.title;
                const info = currentResult.info;
                const link = currentResult.link;

                setTimeout(() => {
                  reply(`Judul:${title}\n Info:${info}\n Link:${link}`);
                }, i * 2000); // Delay masing-masing hasil sebesar 2 detik berturut-turut (2000 milidetik)
              }
            } else if (data.status === "Gagal") {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Link error cuy..*`);
          });

        break;

      //==================================================//

      case "ytmp4":
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length == 0) {
          reply(
            `Example: ${
              prefix + command
            } https://www.youtube.com/watch?v=dQw4w9WgXcQ`
          );
          return; // Tambahkan return di sini
        }

        axios
          .get(
            `https://sanslinedev.tech/api/downloader/youtubemp4?url=${args[0]}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(wait);
              const videoUrl = data.result.url_mp4;
              const akun = data.result.channel;
              const title = data.result.title;
              const duration = data.result.duration;
              const ori = data.result;
              axios
                .head(videoUrl)
                .then((response) => {
                  const contentLength = response.headers["content-length"];
                  const fileSizeInMB = contentLength / (1024 * 1024); // Konversi ke MB

                  if (fileSizeInMB > 1000) {
                    reply(
                      `File terlalu besar (${fileSizeInMB.toFixed(
                        2
                      )} MB). Batas maksimum adalah 500 MB.`
                    );
                  } else {
                    sansline.sendMessage(
                      from,
                      {
                        video: { url: videoUrl },
                        mimetype: "video/mp4",
                        body: `Sansline`,
                        caption: `*♧ Y O U T U B E - M P 4 ♧*\n\n*Channel*: ${akun}\n*Judul*: ${ori.title}`,
                      },
                      { quoted: m }
                    );
                    reduceLimit(sender);
                  }
                })
                .catch((headError) => {
                  console.error("Error fetching file size:", headError);
                  reply(`*Terjadi kesalahan saat memeriksa ukuran file.*`);
                });
            } else {
              reply(`*${data.message}`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Link error cuy..*`);
          });
        break;

      //==================================================//

      case "play":
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length == 0) {
          reply(`Contoh: ${prefix + command} dj remix`);
          return; // Tambahkan return di sini
        }
        const userText = args.join(" "); // Menggabungkan semua argumen menjadi satu string
        const encodedText = encodeURIComponent(userText); // Melakukan encoding pada teks pengguna
        axios
          .get(
            `https://api.lolhuman.xyz/api/ytplay?apikey=sansline&query=${encodedText}`
          )
          .then(({ data }) => {
            if (data.status === 200) {
              reply(wait);
              const videoUrl = data.result.audio.link;
              const akun = data.result.author;
              const ori = data.result;
              let teks = `*♧ Y O U T U B E - P L A Y*

              • Channel : ${ori.uploader}
              • Duration : ${ori.duration}
              • Url : ${ori.channel}`;

              sansline.sendMessage(
                from,
                {
                  contextInfo: {
                    externalAdReply: {
                      showAdAttribution: true,
                      title: `${ori.title}`,
                      body: `Sansline`,
                      renderLargerThumbnail: true,
                      mediaUrl: videoUrl,
                      sourceUrl: videoUrl,
                    },
                  },
                  image: { url: inithumb },
                  text: teks,
                },
                { quoted: m }
              );

              sansline.sendMessage(
                from,
                {
                  audio: { url: videoUrl },
                  mimetype: "audio/mp4",
                },
                { quoted: m }
              );
              reduceLimit(sender);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            // reply(`*Link error cuy..${error}*`);
          });
        break;

      //=====================================
      //MENUISLAMI
      //=====================================

      case "doaharian":
      case "doa":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Makan`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`)
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/islami/doa?q=${args[0]}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              const doa = data.result;
              reply(
                `*_${doa.doa}_* \n\n *${doa.ayat}* \n _*${doa.latin}*_ \n \n_${doa.artinya}_ \n `
              );
            } else {
              reply(` `);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "doarandom":
      case "doa2":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }

        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} Hai`);
        //   return;
        // }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`)
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/islami/doarandom?q=&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              const doa = data.result[0];
              reply(
                `*_${doa.doa}_* \n\n *${doa.ayat}* \n _*${doa.latin}*_ \n \n_${doa.artinya}_ \n `
              );
            } else {
              reply(` `);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "surah":
      case "alquran":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} 12 (Surat alquran)`);
          return;
        }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/Islami/alquran?q=${args[0]}&apikey=${apikey}` // Perbaiki URL API dengan menambahkan "&" antara query dan apikey
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(wait);
              // Mengumpulkan semua hasil dalam satu string
              let allMessages = data.result
                .map((doa) => {
                  return `*_${doa.ar}_* \n\n *"${doa.id}"* \n `;
                })
                .join("\n\n---------------------------\n\n"); // Memisahkan setiap doa dengan garis pemisah

              // Mengirim satu pesan gabungan
              reply(allMessages);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "hadist":
      case "carihadist":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} sholat (Cari Hadist)`);
          return;
        }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/Islami/hadist?q=${args[0]}&apikey=${apikey}` // Perbaiki URL API dengan menambahkan "&" antara query dan apikey
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(wait);
              // Mengumpulkan semua hasil dalam satu string
              let allMessages = data.result
                .map((doa) => {
                  return `*_${doa.riwayat}_* \n\n *"${doa.ayat}"* \n *${doa.artinya}* \n\n *🔗Sumber:* ${doa.link} `;
                })
                .join("\n\n---------------------------\n\n"); // Memisahkan setiap doa dengan garis pemisah

              // Mengirim satu pesan gabungan
              reply(allMessages);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "sholat":
      case "jadwalsholat":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Bandung`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`)
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/islami/jadwalsholat?q=${args[0]}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              const doa = data.result[0].timings;
              reply(
                `_*Jadwalsholat ${args[0]}*_ \n\n *Fajr: ${doa.Fajr}*\n *Dhuhr: ${doa.Dhuhr}*\n *Asr: ${doa.Asr}*\n *Maghrib: ${doa.Maghrib}*\n *Isha: ${doa.Isha}*\n *Imsak: ${doa.Imsak}*\n`
              );
            } else {
              reply(` `);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================
      //BERITA
      //=====================================

      case "kompas":
      case "kompastv":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} sholat (Cari Hadist)`);
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/news/kompastv?q=news&apikey=${apikey}` // Perbaiki URL API dengan menambahkan "&" antara query dan apikey
          )
          .then(({ data }) => {
            if (data.code === 200) {
              // Mengumpulkan semua hasil dalam satu string
              let allMessages = data.result.articles
                .map((news) => {
                  return `♢ K O M P A S T V ♢ \n\n*🔍Title:* ${news.title} \n *🔗Sumber:* ${news.url} `;
                })
                .join("\n\n---------------------------\n\n"); // Memisahkan setiap doa dengan garis pemisah

              // Mengirim satu pesan gabungan
              reply(allMessages);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "jakpost":
      case "jakpostnews":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} sholat (Cari Hadist)`);
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/news/jakpostnews?q=news&apikey=${apikey}` // Perbaiki URL API dengan menambahkan "&" antara query dan apikey
          )
          .then(({ data }) => {
            if (data.code === 200) {
              // Mengumpulkan semua hasil dalam satu string
              let allMessages = data.result.podcast
                .map((news) => {
                  return `♢ J A K P O S T ♢ \n\n *🔍Title:* *${news.title}* \n *📇Publis:* *${news.published_at}* \n *🔗Sumber:* ${news.link} `;
                })
                .join("\n\n---------------------------\n\n"); // Memisahkan setiap doa dengan garis pemisah

              // Mengirim satu pesan gabungan
              reply(allMessages);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "cnn":
      case "cnnnews":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Terbaru`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/news/cnnindonesia?q=${encodeURIComponent(
              args[0]
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              const news = data.result.data.posts[1];
              const fileUrl = news.thumbnail;
              sansline.sendMessage(
                from,
                {
                  image: { url: fileUrl },
                  caption: `*♢ C N N - N E W S ♢* \n\n *🔍Title:* *${news.title}* \n *📇Publis:* *${news.pubDate}* \n *🔗Sumber:* ${news.link}`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "cnbc":
      case "cnbcnews":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Terbaru`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/news/cnbc?q=${encodeURIComponent(
              args[0]
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              const news = data.result.data.posts[0];
              const fileUrl = news.thumbnail;
              sansline.sendMessage(
                from,
                {
                  image: { url: fileUrl },
                  caption: `*♢ C N B - N E W S ♢* \n\n *🔍Title:* *${news.title}* \n *📇Publis:* *${news.pubDate}* \n *🔗Sumber:* ${news.link}`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;
      case "republika":
      case "republikanews":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} Terbaru`);
        //   return;
        // }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/news/republika?q=&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              const news = data.result[0];
              const fileUrl = data.result.thumbnail;
              reply2(
                `*♢ R E P U B L I K A ♢* \n\n *🔍Title:* *${news.judul}* \n *🔗Sumber:* ${news.link}`
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================

      //=====================================
      //MENUINFORMATION
      //=====================================
      case "gempa":
      case "infogempa":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} Terbaru`);
        //   return;
        // }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/information/gempaterbaru?q=&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              const news = data.result.gempa;
              const fileUrl = news.Shakemap;
              reply2(
                `*♢ G E M P A - I N F O ♢* \n\n *Tanggal:* *${news.Tanggal}* \n *Jam:* *${news.Jam}* \n *DateTime:* ${news.DateTime} \n *Coordinates:* ${news.Coordinates} \n *Lintang:* ${news.Lintang} \n *Bujur:* ${news.Bujur} \n *Magnitude:* ${news.Magnitude} \n *Kedalaman:* ${news.Kedalaman} \n *Wilayah:* ${news.Wilayah} \n *Potensi:* ${news.Potensi} \n *Dirasakan:* ${news.Dirasakan} `
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "listgempa":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} Terbaru`);
        //   return;
        // }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/information/listgempa?q=&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let allMessages = data.result.gempa
                .map((news) => {
                  return `*♢ L I S T G E M P A ♢* \n\n *Tanggal:* *${news.Tanggal}* \n *Jam:* *${news.Jam}* \n *DateTime:* ${news.DateTime} \n *Coordinates:* ${news.Coordinates} \n *Lintang:* ${news.Lintang} \n *Bujur:* ${news.Bujur} \n *Magnitude:* ${news.Magnitude} \n *Kedalaman:* ${news.Kedalaman} \n *Wilayah:* ${news.Wilayah} \n *Potensi:* ${news.Potensi}`;
                })
                .join("\n\n---------------------------\n\n"); // Memisahkan setiap doa dengan garis pemisah

              // Mengirim satu pesan gabungan
              reply(allMessages);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "pddikti":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Freya`);
          return;
        }
        if (!isPremiumUser(sender)) {
          reply(`${msgpremium}`);
          return;
        }
        const queryDikti = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/information/pddikti?q=${encodeURIComponent(
              queryDikti
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let allMessages = data.result
                .map((dikti) => {
                  return `*♢ P D D I K T I ♢* \n\n *🔍Nama:* ${dikti.nama} \n *🔗Link:* ${dikti.link}`;
                })
                .join("\n\n---------------------------\n\n"); // Memisahkan setiap doa dengan garis pemisah

              // Mengirim satu pesan gabungan
              reply2(allMessages);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================

      //=====================================
      //MENUANIME
      //=====================================

      case "otakudesu":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Naruto`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryOtaku = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/anime/otakudesusearch?q=${queryOtaku}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let otaku = data.result;
              let thumburl = data.result.Thumb;
              sansline.sendMessage(
                from,
                {
                  image: { url: thumburl },
                  caption: `*♢ O T A K U D E S U ♢* \n\n *🔍Judul:* *${otaku.Title}* \n *🎬Genre:* *${otaku.Genres[0]}* \n *🏅Rating:* *${otaku.Rating}* \n *🔗Link:* ${otaku.Url}`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "komikcast":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Naruto`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryCast = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/anime/Komikcast2?q=${queryCast}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let thumburl = data.result[0].thumbnail;
              let allMessages = data.result
                .map((otaku) => {
                  return `♢ K O M I K C A S T ♢ \n\n *🔍Judul:* _${otaku.judul}_ \n *🏅Rating:* *${otaku.rating}* \n *🔗Link:* ${otaku.link}`;
                })
                .join("\n\n---------------------------\n\n");

              sansline.sendMessage(
                from,
                {
                  image: { url: thumburl },
                  caption: allMessages,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "mangaton":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Naruto`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryManga = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/anime/mangatoon?q=${queryManga}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let thumburl = data.result[1].thumbnail;
              let allMessages = data.result
                .map((otaku) => {
                  return `♢ M A N G A T O N  ♢ \n\n *🔍Judul:* _${otaku.judul}_ \n *🔗Link:* ${otaku.link}`;
                })
                .join("\n\n---------------------------\n\n");

              sansline.sendMessage(
                from,
                {
                  image: { url: thumburl },
                  caption: allMessages,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "mangaton2":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }

        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} Naruto`);
        //   return;
        // }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        // const queryManga2 = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/anime/mangatoonpopuler?q=populer&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let thumburl = data.result[1].thumbnail;
              let allMessages = data.result
                .map((otaku) => {
                  return `♢ M A N G A T O N 2 ♢ \n\n *🔍Judul:* _${otaku.judul}_ \n *🎬Genre:* _${otaku.genre}_ \n *🔗Link:* ${otaku.link}`;
                })
                .join("\n\n---------------------------\n\n");

              sansline.sendMessage(
                from,
                {
                  image: { url: thumburl },
                  caption: allMessages,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "webtoon":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Naruto`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryToon = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/anime/webtoon?q=${queryToon}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              // let thumburl = data.result[1].thumbnail;
              let allMessages = data.result
                .map((otaku) => {
                  return `♢ W E B T O O N ♢ \n\n *🔍Judul:* _${otaku.judul}_ \n *🪪Akun:* _${otaku.publis}_ \n *🎬Genre:* _${otaku.genre}_ \n *🏅Rating:* *${otaku.rating}* \n *🔗Link:* ${otaku.link}`;
                })
                .join("\n\n---------------------------\n\n");

              reply(allMessages);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================
      //=====================================
      //MENUSEARCH
      //=====================================

      case "ytsearch":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }

        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Lily`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryYt = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/search/youtube?q=${queryYt}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              const fileUrl = data.result[0].thumbnailUrl;
              let allMessages = data.result
                .map((search) => {
                  return `*♢ Y T S E A R C H ♢* \n\n *🔍Title:* _${search.title}_ \n *📱Channel:* ${search.channelTitle} \n *📆Date:* ${search.publishedTimeText}`;
                })
                .join("\n\n---------------------------\n\n"); // Memisahkan setiap doa dengan garis pemisah

              // Mengirim satu pesan gabungan
              sansline.sendMessage(
                from,
                {
                  image: { url: fileUrl },
                  caption: allMessages,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "playstore":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }

        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Minecraft`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryYStore = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/search/playstore?q=${queryYStore}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              const fileUrl = data.result[0].icon;
              let allMessages = data.result
                .map((search) => {
                  return `*♢ P L A Y S T O R E ♢* \n\n *🔍Title:* _${search.title}_ \n *Developer:* ${search.developer} \n *Price:* ${search.price} ${search.currency}   \n *Rating:* ${search.scoreText}\n *🔗Url:* ${search.url}`;
                })
                .join("\n\n---------------------------\n\n"); // Memisahkan setiap doa dengan garis pemisah

              // Mengirim satu pesan gabungan
              sansline.sendMessage(
                from,
                {
                  image: { url: fileUrl },
                  caption: allMessages,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "kodepos":
      case "searchkodepos":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }

        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Tes`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryPos = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/search/kodepos?q=${args[0]}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let allMessages = data.result.message
                .map((search) => {
                  return `*♢ K O D E P O S - S E A R C H ♢* \n\n *Code:* _${search.code}_ \n *Village:* _${search.village}_ \n *District:* ${search.district} \n *Regency:* ${search.regency} \n *Province:* ${search.province} \n *Timezone:* ${search.timezone}`;
                })
                .join("\n\n---------------------------\n\n");

              reply2(allMessages);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;
      case "spotifysearch":
      case "spotify2":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }

        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} Tes`);
        //   return;
        // }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const querySpo = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/search/spotifysearch?q=${querySpo}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let allMessages = data.result
                .map((search) => {
                  return `*♢ S P O T I F Y - S E A R C H ♢* \n\n *Artist:* _${search.artistName}_ \n *Album:* _${search.albumName}_ \n *Duration:* ${search.duration} \n *Url:* ${search.externalUrl}`;
                })
                .join("\n\n---------------------------\n\n");

              reply2(allMessages);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;
      case "searchsticker":
      case "caristicker":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }

        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Tes`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryStic = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/search/sticker?q=${queryStic}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let thumbnailUrl = data.result[0].thumbnail;
              let allMessages = data.result
                .map((search) => {
                  return `*♢ S T I C K E R - S E A R C H ♢* \n\n *Judul:* _${search.judul}_ \n *Akun:* _${search.username}_ \n *Link:* ${search.link}`;
                })
                .join("\n\n---------------------------\n\n");

              sansline.sendMessage(
                from,
                {
                  image: { url: thumbnailUrl },
                  caption: allMessages,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;
      case "wikimedia":
      case "searchwiki":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }

        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Tes`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryWiki = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/search/wikimedia?q=${queryWiki}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let thumbnailUrl = data.result[0].image;
              let allMessages = data.result
                .map((search) => {
                  return `*♢ W I K I M E D I A - S E A R C H ♢* \n\n *Judul:* _${search.title}_ \n *Link:* _${search.source}_`;
                })
                .join("\n\n---------------------------\n\n");

              sansline.sendMessage(
                from,
                {
                  image: { url: thumbnailUrl },
                  caption: allMessages,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "lirik":
      case "liriklagu":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Naruto`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryLirik = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/search/lirik?q=${queryLirik}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let search = data.result.message;
              let thumburl = data.result.message.thumb;
              sansline.sendMessage(
                from,
                {
                  image: { url: thumburl },
                  caption: `*♢ L I R I K - S E A R C H ♢* \n\n *🔍Judul:* *${search.title}* \n *🎬Album:* *${search.album}* \n *🔗Lyrics:* ${search.lyrics}`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "ttsearch":
      case "tiktoksearch":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (args.length == 0) {
          reply(`Example: ${prefix + command} kucing`);
          return;
        }

        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        const queryTs = args.join("%20");
        axios
          .get(
            `https://sanslinedev.tech/api/search/tiktokseacrh?q=${queryTs}&apikey=${apikey}`
          )
          .then(({ data }) => {
            reply(wait);
            if (data.code === 200) {
              const videoUrl = data.result.message.no_watermark;
              const title = data.result.message.title;
              sansline.sendMessage(
                from,
                {
                  video: { url: videoUrl },
                  mimetype: "video/mp4",
                  caption: `*📽 T I K T O K - S E A R C H 📽* \n\n *📜Title:* ${title}`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Link error cuy.. ${error}*`);
          });
        break;

      case "pin":
      case "pintereset":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Naruto`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const queryPin = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/search/pintereset?q=${queryPin}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let otaku = data.result;
              let thumburl = data.result[0];
              sansline.sendMessage(
                from,
                {
                  image: { url: thumburl },
                  caption: `*♢ P I N T E R E S E T ♢* \n`,
                },
                { quoted: m }
              );
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;
      //=====================================
      //=====================================
      //MENUDATABASE
      //=====================================

      case "listbank":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }

        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} Tes`);
        //   return;
        // }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/database/listbank?q=&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let allMessages = data.result
                .map((dikti) => {
                  return `*♢ L I S T B A N K - I N D ♢* \n\n *🔍Nama Bank:* _${dikti.namaBank}_ \n *🪙Kode Bank:* ${dikti.kodeBank}`;
                })
                .join("\n\n---------------------------\n\n"); // Memisahkan setiap doa dengan garis pemisah

              // Mengirim satu pesan gabungan
              reply2(allMessages);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "listewallet":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        // if (args.length === 0) {
        //   reply2(`Example: ${prefix + command} Tes`);
        //   return;
        // }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/database/listewallet?q=&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let allMessages = data.result
                .map((dikti) => {
                  return `*♢ L I S T E W A L L E T ♢* \n\n *🔍Nama Ewallet:* _${dikti.namaBank}_ \n *🪙Kode Ewallet:* ${dikti.kodeBank}`;
                })
                .join("\n\n---------------------------\n\n");

              reply2(allMessages);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "cekbank":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length < 2) {
          reply2(`Example: ${prefix + command} 002 123456789`);
          return;
        }
        if (!isPremiumUser(sender)) {
          reply(`${msgpremium}`);
          return;
        }
        const bankCode = args[0];
        const accountNumber = args[1];
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/database/cekbank?bankCode=${encodeURIComponent(
              bankCode
            )}&accountNumber=${encodeURIComponent(
              accountNumber
            )}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data bank!.._`);
              let bankInfo = data.result;
              let message = `*♢ Bank Info ♢*\n\n*🔍 Bank Code:* ${bankInfo.bankcode}\n*🏦 Bank Name:* ${bankInfo.bankname}\n*🔢 Account Number:* ${bankInfo.accountnumber}\n*👤 Account Name:* ${bankInfo.accountname}`;

              reply(message);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "cekewallet":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length < 2) {
          reply2(
            `Example: ${prefix + command} DANA 081234567 (Wajib huruf kapital)`
          );
          return;
        }
        if (!isPremiumUser(sender)) {
          reply(`${msgpremium}`);
          return;
        }
        const ewalletCode = args[0];
        const ewalletNumber = args[1];
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/database/cekbank?bankCode=${ewalletCode}&accountNumber=${ewalletNumber}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data bank!.._`);
              let bankInfo = data.result;
              let message = `*♢ Uwallet Info ♢*\n\n*🔍 Bank Code:* ${bankInfo.bankcode}\n*🏦 Bank Name:* ${bankInfo.bankname}\n*🔢 Account Number:* ${bankInfo.accountnumber}\n*👤 Account Name:* ${bankInfo.accountname}`;

              reply(message);
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      //=====================================

      //=====================================
      //MENUGAME
      //=====================================

      case "apakah":
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        {
          if (!text)
            return reply(
              `Penggunaan ${command} text\n\nContoh : ${command} saya wibu`
            );
          reply(mess.wait);
          await sleep(500);
          const apa = ["Iya", "Tidak", "Bisa Jadi", "Betul"];
          const kah = apa[Math.floor(Math.random() * apa.length)];
          reply(`Pertanyaan : Apakah ${q}\nJawaban : ${kah}`);
        }
        break;

      case "bisakah":
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        {
          if (!text)
            return reply(
              `Penggunaan ${command} text\n\nContoh : ${command} saya menjadi presiden`
            );
          reply(mess.wait);
          await sleep(500);
          const bisa = [
            "Bisa",
            "Gak Bisa",
            "Gak Bisa lu wibu",
            "TENTU PASTI KAMU BISA!!!!",
          ];
          const ga = bisa[Math.floor(Math.random() * bisa.length)];
          reply(`Pertanyaan : Apakah ${q}\nJawaban : ${ga}`);
        }
        break;
      case "bagaimanakah":
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        {
          if (!text)
            return reply(
              `Penggunaan ${command} text\n\nContoh : ${command} cara mengatasi sakit hati`
            );
          reply(mess.wait);
          await sleep(500);
          const gimana = [
            "Gak Gimana2",
            "Sulit Itu Bro",
            "Maaf Bot Tidak Bisa Menjawab",
            "Coba Deh Cari Di Gugel",
            "astaghfirallah Beneran???",
            "Pusing ah",
            "Owhh Begitu:(",
            "Gimana yeee",
          ];
          const ya = gimana[Math.floor(Math.random() * gimana.length)];
          reply(`Pertanyaan : Bagaimanakah ${q}\nJawaban : ${ya}`);
        }
        break;

      case "rate":
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        {
          if (!q)
            return reply(
              `Penggunaan ${command} text\n\nContoh : ${command} Gambar aku`
            );
          reply(mess.wait);
          await sleep(500);
          const ra = [
            "5",
            "10",
            "15",
            "20",
            "25",
            "30",
            "35",
            "40",
            "45",
            "50",
            "55",
            "60",
            "65",
            "70",
            "75",
            "80",
            "85",
            "90",
            "95",
            "100",
          ];
          const te = ra[Math.floor(Math.random() * ra.length)];
          reply(`Rate : ${q}\nJawaban : *${te}%*`);
        }
        break;

      case "gantengcek":
      case "cekganteng":
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        {
          if (!q)
            return reply(
              `Penggunaan ${command} Nama\n\nContoh : ${command} sansline`
            );
          reply(mess.wait);
          await sleep(500);
          const gan = [
            '10% banyak" perawatan ya bang:v\nCanda Perawatan:v',
            "30% Semangat bang Merawat Dirinya><",
            "20% Semangat Ya bang👍",
            "40% Wahh bang><",
            "50% abang Ganteng deh><",
            "60% Hai Ganteng🐊",
            "70% Hai Ganteng🐊",
            "62% Bang Ganteng><",
            "74% abang ni ganteng deh><",
            "83% Love You abang><",
            "97% Assalamualaikum Ganteng🐊",
            "100% Bang Pake Susuk ya??:v",
            "29% Semangat Bang:)",
            "94% Hai Ganteng><",
            "75% Hai Bang Ganteng",
            "82% wihh abang Pasti Sering Perawatan kan??",
            "41% Semangat:)",
            "39% Lebih Semangat🐊",
          ];
          const teng = gan[Math.floor(Math.random() * gan.length)];
          reply(`Nama : ${q}\nJawaban : *${teng}*`);
        }
        break;

      case "cantikcek":
      case "cekcantik":
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        {
          if (!q)
            return reply(
              `Penggunaan ${command} Nama\n\nContoh : ${command} Lisaa`
            );
          reply(mess.wait);
          await sleep(500);
          const can = [
            '10% banyak" perawatan ya kak:v\nCanda Perawatan:v',
            "30% Semangat Kaka Merawat Dirinya><",
            "20% Semangat Ya Kaka👍",
            "40% Wahh Kaka><",
            "50% kaka cantik deh><",
            "60% Hai Cantik🐊",
            "70% Hai Ukhty🐊",
            "62% Kakak Cantik><",
            "74% Kakak ni cantik deh><",
            "83% Love You Kakak><",
            "97% Assalamualaikum Ukhty🐊",
            "100% Kakak Pake Susuk ya??:v",
            "29% Semangat Kakak:)",
            "94% Hai Cantik><",
            "75% Hai Kakak Cantik",
            "82% wihh Kakak Pasti Sering Perawatan kan??",
            "41% Semangat:)",
            "39% Lebih Semangat🐊",
          ];
          const tik = can[Math.floor(Math.random() * can.length)];
          reply(`Nama : ${q}\nJawaban : *${tik}*`);
        }
        break;
      case "kapankah":
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        {
          if (!q)
            return reply(
              `Penggunaan ${command} Pertanyaan\n\nContoh : ${command} Saya Kaya`
            );
          reply(mess.wait);
          await sleep(500);
          const kapan = [
            "5 Hari Lagi",
            "10 Hari Lagi",
            "15 Hari Lagi",
            "20 Hari Lagi",
            "25 Hari Lagi",
            "30 Hari Lagi",
            "35 Hari Lagi",
            "40 Hari Lagi",
            "45 Hari Lagi",
            "50 Hari Lagi",
            "55 Hari Lagi",
            "60 Hari Lagi",
            "65 Hari Lagi",
            "70 Hari Lagi",
            "75 Hari Lagi",
            "80 Hari Lagi",
            "85 Hari Lagi",
            "90 Hari Lagi",
            "95 Hari Lagi",
            "100 Hari Lagi",
            "5 Bulan Lagi",
            "10 Bulan Lagi",
            "15 Bulan Lagi",
            "20 Bulan Lagi",
            "25 Bulan Lagi",
            "30 Bulan Lagi",
            "35 Bulan Lagi",
            "40 Bulan Lagi",
            "45 Bulan Lagi",
            "50 Bulan Lagi",
            "55 Bulan Lagi",
            "60 Bulan Lagi",
            "65 Bulan Lagi",
            "70 Bulan Lagi",
            "75 Bulan Lagi",
            "80 Bulan Lagi",
            "85 Bulan Lagi",
            "90 Bulan Lagi",
            "95 Bulan Lagi",
            "100 Bulan Lagi",
            "1 Tahun Lagi",
            "2 Tahun Lagi",
            "3 Tahun Lagi",
            "4 Tahun Lagi",
            "5 Tahun Lagi",
            "Besok",
            "Lusa",
            `Abis Command Ini Juga Lu ${q}`,
          ];
          const kapankah = kapan[Math.floor(Math.random() * kapan.length)];
          reply(`Pertanyaan : ${q}\nJawaban : *${kapankah}*`);
        }
        break;
      //=============================================
      //MENUTOOLS
      //=============================================

      //NEXTUPDATE

      case "speech":
      case "texttoaudio":
        if (isBan(sender)) {
          return reply(msgban);
        }
        if (checkLimit(sender)) {
          return reply(mess.limit);
        }
        if (args.length === 0) {
          reply2(`Example: ${prefix + command} Naruto`);
          return;
        }
        // if (!isPremiumUser(sender)) {
        //   reply(`${msgpremium}`);
        //   return;
        // }
        const querySpe = args.join("%20");
        reply(wait);
        axios
          .get(
            `https://sanslinedev.tech/api/ai/texttospeech?q=${querySpe}&apikey=${apikey}`
          )
          .then(({ data }) => {
            if (data.code === 200) {
              reply(`_Berhasil mendapatkan data!.._`);
              let tex = data.result;
              let audio = data.result.url;
              sansline.sendMessage(m.chat, { audio: audio }, { quoted: m });
              reduceLimit(sender);
            } else {
              reply(`*${data.message}*`);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reply(`*Error, Harap lapor owner...*`);
          });
        break;

      case "hd":
      case "remini":
        {
          let media;
          if (m.message && m.message.imageMessage) {
            const stream = await downloadContentFromMessage(
              m.message.imageMessage,
              "image"
            );
            media = Buffer.from([]);
            for await (const chunk of stream) {
              media = Buffer.concat([media, chunk]);
            }
          } else if (
            m.message.extendedTextMessage &&
            m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
          ) {
            const stream = await downloadContentFromMessage(
              m.message.extendedTextMessage.contextInfo.quotedMessage
                .imageMessage,
              "image"
            );
            media = Buffer.from([]);
            for await (const chunk of stream) {
              media = Buffer.concat([media, chunk]);
            }
          } else {
            return reply(`Kirim/Balas Foto dengan Caption ${prefix + command}`);
          }
          reply(mess.wait);
          const { remini } = require("./lib/remini");
          let proses = await remini(media, "enhance");
          sansline.sendMessage(
            m.chat,
            { image: proses, caption: mess.succes },
            { quoted: m }
          );
        }
        break;

      //=============================================

      case "antilinkfacebook":
      case "antilinkfb":
        {
          if (!m.isGroup) return reply(`Hanya di Group`);
          if (!isBotAdmins) return reply(`Bot bukan admin`);
          if (!isAdmins && !isOwner) return reply(`Khusus owner & Admin Group`);
          if (args[0] === "on") {
            if (AntiLinkFacebook) return reply("Already activated");
            ntilinkfb.push(from);
            fs.writeFileSync(
              "./database/antilinkfacebook.json",
              JSON.stringify(ntilinkfb)
            );
            reply("Success in turning on facebook antilink in this group");
            var groupe = await sansline.groupMetadata(from);
            var members = groupe["participants"];
            var mems = [];
            members.map(async (adm) => {
              mems.push(adm.id.replace("c.us", "s.whatsapp.net"));
            });
            sansline.sendMessage(
              from,
              {
                text: `\`\`\`「 ⚠️Warning⚠️ 」\`\`\`\n\nIf you're not an admin, don't send the facebook link in this group or u will be kicked immediately!`,
                contextInfo: { mentionedJid: mems },
              },
              { quoted: m }
            );
          } else if (args[0] === "off") {
            if (!AntiLinkFacebook) return reply("Already deactivated");
            let off = ntilinkfb.indexOf(from);
            ntilinkfb.splice(off, 1);
            fs.writeFileSync(
              "./database/antilinkfacebook.json",
              JSON.stringify(ntilinkfb)
            );
            reply("Success in turning off facebook antilink in this group");
          } else {
            await reply(
              `Please Type The Option\n\nExample: ${
                prefix + command
              } on\nExample: ${
                prefix + command
              } off\n\non to enable\noff to disable`
            );
          }
        }
        break;

      default:
        if (budy.startsWith("~>")) {
          if (!isCreator) return;
          function Return(sul) {
            sat = JSON.stringify(sul, null, 2);
            bang = util.format(sat);
            if (sat == undefined) {
              bang = util.format(sul);
            }
            return reply(`Apa mangsud`);
          }
          try {
            reply(
              util.format(eval(`(async () => { return ${budy.slice(3)} })()`))
            );
          } catch (e) {
            reply(String(e));
          }
        }
        if (AntiLinkFacebook)
          if (budy.includes("https://facebook.com/")) {
            if (!isBotAdmins) return;
            bvl = `\`\`\`「 Facebook Link Detected 」\`\`\`\n\nAdmin has sent a facebook link, admin is free to send any link😇`;
            if (isAdmins) return reply(bvl);
            if (m.key.fromMe) return m.reply(bvl);
            if (isOwner) return reply(bvl);
            await sansline.sendMessage(m.chat, {
              delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
              },
            });
            sansline.groupParticipantsUpdate(m.chat, [m.sender], "delete");
            sansline.sendMessage(
              from,
              {
                text: `\`\`\`「 Facebook Link Detected 」\`\`\`\n\n@${
                  m.sender.split("@")[0]
                } Has been kicked because of sending facebook link in this group`,
                contextInfo: { mentionedJid: [m.sender] },
              },
              { quoted: m }
            );
          } else {
          }
        if (budy.startsWith(">>")) {
          if (!isCreator) return;
          let kode = budy.trim().split(/ +/)[0];
          let teks;
          try {
            teks = await eval(
              `(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`
            );
          } catch (e) {
            teks = e;
          } finally {
            await m.reply(require("util").format(teks));
          }
        }

        if (budy.startsWith("$")) {
          if (!isCreator) return;
          exec(budy.slice(2), (err, stdout) => {
            if (err) return m.reply(`${err}`);
            if (stdout) return m.reply(stdout);
          });
        }
    }
  } catch (err) {
    console.log(require("util").format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});
