const { deleteBook } = require('../ConnectDB.js');

function deleteBookCLI(rl, mainMenu) {
    rl.question('Masukkan ID buku yang ingin dihapus: ', (id) => {
      deleteBook(id, (err) => {
        if (err) {
          console.error('Terjadi kesalahan saat menghapus buku.');
        } else {
          console.log("Terjadi Kesalahan Tertuli");

          console.log('Buku berhasil dihapus.');
        }

        
        mainMenu();
      });
    });
  }
  
module.exports = { deleteBookCLI };