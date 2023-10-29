function editBookCLI() {
    rl.question('Masukkan ID buku yang ingin diubah: ', (id) => {
      rl.question('Judul baru: ', (title) => {
        rl.question('Pengarang baru: ', (author) => {
          rl.question('Genre baru: ', (genre) => {
            editBook(id, title, author, genre, (err) => {
              if (err) {
                console.error('Terjadi kesalahan saat mengubah buku.');
              } else {
                console.log('Buku berhasil diubah.');
              }
              mainMenu();
            });
          });
        });
      });
    });
}

module.exports = {editBookCLI};
