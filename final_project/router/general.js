const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  users.push({ username, password });
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Simulating asynchronous operation with existing data
    const bookList = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(books));
      }, 1000); // Simulating a delay of 1 second
    });

    res.status(200).json({
      message: "Books retrieved successfully",
      books: JSON.stringify(bookList, null, 2)
    });
  } catch (error) {
    console.error('Error retrieving books:', error.message);
    res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundBook = books[isbn];
        if (foundBook) {
          resolve(foundBook);
        } else {
          reject(new Error('Book not found'));
        }
      }, 1000);
    });

    res.status(200).json({
      message: "Book retrieved successfully",
      book: JSON.stringify(book, null, 2)
    });
  } catch (error) {
    res.status(404).json({
      message: "Error retrieving book",
      error: error.message
    });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const booksByAuthor = await new Promise((resolve) => {
      setTimeout(() => {
        const foundBooks = Object.values(books).filter(book => 
          book.author.toLowerCase().includes(author.toLowerCase())
        );
        resolve(foundBooks);
      }, 1000);
    });

    if (booksByAuthor.length > 0) {
      res.status(200).json({
        message: "Books retrieved successfully",
        books: JSON.stringify(booksByAuthor, null, 2)
      });
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const booksByTitle = await new Promise((resolve) => {
      setTimeout(() => {
        const foundBooks = Object.values(books).filter(book => 
          book.title.toLowerCase().includes(title.toLowerCase())
        );
        resolve(foundBooks);
      }, 1000);
    });

    if (booksByTitle.length > 0) {
      res.status(200).json({
        message: "Books retrieved successfully",
        books: JSON.stringify(booksByTitle, null, 2)
      });
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    res.status(200).json({
      message: "Book reviews retrieved successfully",
      reviews: JSON.stringify(books[isbn].reviews, null, 2)
    });
  } else {
    res.status(404).json({
      message: "Book not found"
    });
  }
});

module.exports.general = public_users;
