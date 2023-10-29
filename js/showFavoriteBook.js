const { setFavoriteBook } = require('../ConnectDB.js');
const { getFavoriteBooks } = require('../ConnectDB.js');

function showFavoriteBooks(mainMenu) {
    getFavoriteBooks((err, books) => {
      if (err) {
        console.error('Terjadi kesalahan saat mengambil daftar buku favorit.');
      } else {
        if (books.length > 0) {
          console.log('Daftar Buku Favorit:');
          books.forEach((book, index) => {
            const no = index + 1;
            console.log(`${no}.`);
            console.log(`ID       : ${book.id}`);
            console.log(`Judul    : ${book.title}`);
            console.log(`Pengarang: ${book.author}`);
            console.log(`Genre    : ${book.genre}`);
            console.log('');
          });
        } else {
          console.log('Belum ada buku yang ditandai sebagai favorit.');
        }
      }
      mainMenu();
    });
  }

function markBookAsFavorite(rl, mainMenu) {
    rl.question('Masukkan ID buku yang ingin ditandai sebagai favorit: ', (id) => {
      if (isNaN(id)) {
        console.log('ID harus berupa angka.');
        return mainMenu();
      }
      
      setFavoriteBook(id, 1, (err) => {
        if (err) {
          console.error('Terjadi kesalahan saat menandai buku sebagai favorit : ',err.message);
        } else {
          console.log('Buku berhasil ditandai sebagai favorit.');
        }
        mainMenu();
      });
    });
}

module.exports = {markBookAsFavorite, showFavoriteBooks};