// book routes - api endpoints for book operations
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');

// all routes require authentication

// get all books (with optional filtering)
// GET /api/books 
router.get('/', auth, bookController.getAllBooks);

// get a single book by id
// GET /api/books/:id
router.get('/:id', auth, bookController.getBookById);

// create a new book
// POST /api/books
router.post('/', auth, bookController.uploadMiddleware, bookController.createBook);

// update an existing book
// PUT /api/books/:id
router.put('/:id', auth, bookController.uploadMiddleware, bookController.updateBook);

// delete a book
// DELETE /api/books/:id
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;