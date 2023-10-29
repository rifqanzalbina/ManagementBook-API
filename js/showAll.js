function showAllBooks() {
    getAllBooks((err, books) => {
      if (err) {
        console.error('Terjadi kesalahan saat mengambil daftar buku.');
      } else {
        if (books.length > 0) {
          console.log('Daftar Buku: \n');
          books.forEach((book, index) => {
            console.log(`${index + 1}.`);
            console.log(`Judul    : ${book.title}`);
            console.log(`Pengarang: ${book.author}`);
            console.log(`Genre    : ${book.genre}`);
            console.log('');
          });
        } else {
          console.log('Belum ada buku yang ditambahkan.');
        }
      }
      mainMenu();
    });
}

module.exports = {showAllBooks};