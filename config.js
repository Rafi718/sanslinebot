//KALO MAU RECODE SC IZIN DULU !!....

//SETTING MAX LIMIT ADA DI database/limit.json  
//Note: Untuk default max limitnya 200, Jadi jika limitnya sudah 200 maka akan terkena limit

const fs = require("fs")

//setting bot
global.botName = 'sansline'                  //Nama botnya (opsional)
global.ownername = 'sansline'                //Ubah nama owner
global.prefix = '.'                          //Prefix (opsional)
global.owner = ['6285774912005']             //Ubah owner disini (*)
global.bottz = '6285175393080'               //Nomor botnya (*)
global.webapi = `https://sanslinedev.tech/`  //email (opsional)
global.autoread = true                       // false = off, true = on
global.autobio = true                        // false = off, true = on

//set apikey
//Free api public (Jika limitnya abis bisa daftar gratis di https://sanslinedev.tech/)

global.sanslineapi = 'sansline' 

//watermark 
global.packname = 'sansline'                 //Buat sticker opsional
global.author = 'sansline'
global.foter1 = 'by sanslineproject'
global.foter2 = ' ⟡ S A N S L I N E ⟡ '
global.idcennel = ''
global.thumb = 'https://telegra.ph/file/81ec86f209f4276e0e561.png'

//message
global.mess = {
    success: '✅ Done, Nih Hasilnya.~',
    admin: '_*⛔️ Perintah Ini Hanya Bisa Digunakan Oleh Admin Group !*_',
    botAdmin: '_*⛔️ Perintah Ini Hanya Bisa Digunakan Ketika Bot Menjadi Admin Group !*_',
    owner: '_*⛔️ Perintah Ini Hanya Bisa Digunakan Oleh Owner !*_',
    limit: '⛔️ Yahh Limit Kamu Habis!,* \n _Note: Chat owner untuk menambahkan limit_',
    banned: '_*🚫 Kamu telah di banned oleh owner!*_',
    premium: '_*⛔️ Fitur Premium* hanya tersedia untuk pengguna premium. !_',
    group: '_*⛔️ Perintah Ini Hanya Bisa Digunakan Di Group Chat !*_',
    private: '_(⛔️ Perintah Ini Hanya Bisa Digunakan Di Private Chat !*_',
    wait: '_*🔆 Sedang Di Proses !*_',
}

let file = require.resolve(__filename);
fs.watchFile(file, () => {
fs.unwatchFile(file);
console.log(`Update ${__filename}`);
delete require.cache[file];
require(file);
});

