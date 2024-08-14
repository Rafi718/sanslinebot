// database.js

// Inisialisasi global.db jika belum ada
if (!global.db) {
    global.db = {};
  }
  
  // Inisialisasi global.db.data jika belum ada
  if (!global.db.data) {
    global.db.data = {};
  }
  
  // Inisialisasi global.db.data.settings jika belum ada
  if (!global.db.data.settings) {
    global.db.data.settings = {};
  }
  
  // Contoh inisialisasi beberapa nilai default
  global.db.data.settings.autoread = false;
  global.db.data.settings.autobio = false;
  global.db.data.settings.status = 0;
  
  module.exports = global.db;
  