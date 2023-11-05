const readline = require('readline');
const { searchBooks, editBook, getAllBooks, addBookToDatabase } = require('./ConnectDB.js');
const { addBook } = require('./js/add.js');
const { deleteBookCLI } = require('./js/deleteBook.js');
const { showFavoriteBooks, markBookAsFavorite } = require('./js/showFavoriteBook.js');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Search Book
function searchBook() {
  rl.question('Masukkan kata kunci pencarian: ', (keyword) => {
    rl.question('Ingin mengurutkan hasil? (y/n): ', (sortAnswer) => {
      let orderBy = 'id';
      let orderDirection = 'ASC';

      if (sortAnswer.toLowerCase() === 'y') {
        rl.question('Urutkan berdasarkan (title/author/genre): ', (sortField) => {
          orderBy = sortField;
          rl.question('Urutkan secara (asc/desc): ', (sortDirection) => {
            orderDirection = sortDirection;
            showSearchResults(keyword, 1, orderBy, orderDirection);
          });
        });
      } else {
        showSearchResults(keyword, 1, orderBy, orderDirection);
      }
    });
  });
}


// ShowAllBooks
function showAllBooks() {
  getAllBooks((err, books) => {
    if (err) {
      console.error('Terjadi kesalahan saat mengambil daftar buku.');
    } else {
      if (books.length > 0) {
        console.log('Daftar Buku:');
        books.forEach((book, index) => {
          const no = index + 1; // 
          console.log(`${no}.`);
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

// ShowSearchResults
function showSearchResults(keyword, page, orderBy, orderDirection) {
  const itemsPerPage = 5;
  searchBooks(keyword, page, orderBy, orderDirection, (err, books) => {
    if (err) {
      console.error('Terjadi kesalahan saat mencari buku.');
      mainMenu();
    } else {
      if (books.length > 0) {
        console.log('Buku ditemukan:');
        books.forEach((book, index) => {
          const no = ((page - 1) * itemsPerPage) + (index + 1); // Menyesuaikan nomor urut berdasarkan halaman
          console.log(`${no}.`);
          console.log(`Judul    : ${book.title}`);
          console.log(`Pengarang: ${book.author}`);
          console.log(`Genre    : ${book.genre}`);
          console.log('');
        });

        rl.question('Lihat halaman selanjutnya? (y/n): ', (answer) => {
          if (answer.toLowerCase() === 'y') {
            showSearchResults(keyword, page + 1, orderBy, orderDirection);
          } else {
            mainMenu();
          }
        });
      } else {
        if (page === 1) {
          console.log('Buku tidak ditemukan.');
        } else {
          console.log('Tidak ada buku lagi pada halaman ini.');
        }
        mainMenu();
      }
    }
  });
}


// Edit Book
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

// Functiion MainMenu(MAIN)
function mainMenu() {
  console.log('\nMenu Utama:');
  console.log('1. Tambah Buku');
  console.log('2. Cari Buku');
  console.log('3. Edit Buku');
  console.log('4. Hapus Buku');
  console.log('5. Tampilkan Semua Buku');
  console.log('6. Tampilkan Buku Favorit');
  console.log('7. Tandai Buku Sebagai Favorit');
  console.log('8. Keluar');
  rl.question('Pilih fungsi yang ingin dijalankan (1-8): ', (answer) => {
    switch (answer) {
      case '1':
        addBook(rl, mainMenu, addBookToDatabase);
        break;
      case '2':
        searchBook();
        break;
      case '3':
        editBookCLI();
        break;
      case '4':
        deleteBookCLI(rl, mainMenu, deleteBook);
        break;
      case '5':
        showAllBooks();
        break;
      case '6':
        showFavoriteBooks(mainMenu);
        break;
      case '7':
        markBookAsFavorite(rl, mainMenu);
        break;
      case '8':
        console.log('Terima kasih telah menggunakan sistem manajemen buku. Sampai jumpa!');
        rl.close();
        break;
      default:
        console.log('Pilihan tidak valid. Silakan coba lagi.');
        mainMenu();
        break;
    }
  });
}

mainMenu(); 


