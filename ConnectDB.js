const sqlite3 = require('sqlite3');
const { logActivity } = require('./js/ActivityLog');

// Connect to sqlite3
const db = new sqlite3.Database('./books.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to The SQLite Database');
    initializeDatabase();
  } 
});

// Initial Database
function initializeDatabase() {
  db.run("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, genre TEXT, is_favorite INTEGER DEFAULT 0)", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Table "books" is ready.');
      createIndexes();
    }
  });
}

// Create Indexes to dataBase
function createIndexes() {
  db.run("CREATE INDEX IF NOT EXISTS idx_title ON books(title)");
  db.run("CREATE INDEX IF NOT EXISTS idx_author ON books(author)");
  db.run("CREATE INDEX IF NOT EXISTS idx_genre ON books(genre)");
  console.log('Indexes created.');
}

// adding book to DataBase
function addBookToDatabase(title, author, genre, callback) {
  db.run("INSERT INTO books (title, author, genre) VALUES (?, ?, ?)", [title, author, genre], function(err) {
    if (!err) {
      logActivity(`Book added: ${title} by ${author}, Genre: ${genre}`);
    }
    callback(err);
  });
}

// Searching Books From DataBase
function searchBooks(keyword, page = 1, orderBy = 'id', orderDirection = 'ASC', callback) {
  const itemsPerPage = 5;
  const offset = (page - 1) * itemsPerPage;

  db.all(
    `SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?
     ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`,
    [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, itemsPerPage, offset],
    (err, rows) => {
      callback(err, rows);
    }
  );
}

// EditBooks From DataBase
function editBook(id, title, author, genre, callback) {
  db.run("UPDATE books SET title = ?, author = ?, genre = ? WHERE id = ?", [title, author, genre, id], function(err) {
    if (!err) {
      logActivity(`Book edited: ID ${id}, New title: ${title}, New author: ${author}, New genre: ${genre}`);
    }
    callback(err);
  });
}

// DeleteBooks
function deleteBook(id, callback) {
  db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
    if (err) {
      callback(err);
    } else if (row) {
      db.run("DELETE FROM books WHERE id = ?", [id], (err) => {
        if (!err) {
          logActivity(`Book deleted: ${row.title} by ${row.author}, Genre: ${row.genre}`);
        }
        callback(err);
      });
    } else {
      console.log('Book not found.');
      callback(new Error('Book not found.'));
    }
  });
}

// getAllBooks From DataBase
function getAllBooks(callback){
  db.all("SELECT * FROM books", [], (err, rows) => {
    callback(err, rows);
  });
}

// Optimize DataBase
function optimizeDatabase(callback) {
  db.run("VACUUM", (err) => {
    if (err) {
      console.error("Failed to optimize database:", err.message);
    } else {
      console.log("Database optimized.");
    }
    if (callback) callback(err);
  });
}

// SetFavoriteBooks
function setFavoriteBook(id, isFavorite, callback) {
  db.run("UPDATE books SET is_favorite = ? WHERE id = ?", [isFavorite, id], function(err) {
    if (!err) {
      logActivity(`Book ID ${id} favorite status changed to: ${isFavorite}`);
    }
    callback(err);
  });
}

// GetFavoriteBooks
function getFavoriteBooks(callback) {
  db.all("SELECT * FROM books WHERE is_favorite = 1", [], (err, rows) => {
    callback(err, rows);
  });
}


module.exports = {
  addBookToDatabase,
  searchBooks,
  editBook,
  deleteBook,
  getAllBooks,
  optimizeDatabase,
  setFavoriteBook,
  getFavoriteBooks,
};
