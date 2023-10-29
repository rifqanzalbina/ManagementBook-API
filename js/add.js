function addBook(rl, mainMenu, addBookToDatabase) {
    rl.question('Judul: ', (title) => {
      rl.question('Pengarang: ', (author) => {
        rl.question('Genre: ', (genre) => {
          addBookToDatabase(title, author, genre, (err) => {
            if (err) {
              console.error('Terjadi kesalahan saat menambahkan buku.');
            } else {
              console.log('Buku berhasil ditambahkan.');
            }
            mainMenu(); 
          });
        });
      });
    });
}

module.exports = {addBook};