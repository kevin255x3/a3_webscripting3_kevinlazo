// book controller - handles all book-related operations
// includes file upload functionality for book covers
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// set up storage for uploaded files
// defines where files are stored and how they're named
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// only allow image file types for uploads
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg and .png files are allowed!'), false);
    }
};

// configure multer with our storage and filter settings
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB max file size
    }
});

const bookController = {
    // file upload middleware - processes uploaded cover images
    uploadMiddleware: upload.single('cover_image'),

    // get all books from database with optional filtering
    getAllBooks: async (req, res) => {
        try {
            const { categoryId, search } = req.query;
            const userId = req.userData.userId; // get user ID from auth middleware

            const filters = {
                userId,
                categoryId: categoryId || null,
                search: search || null
            };

            const books = await Book.getAll(filters);
            res.status(200).json(books);
        } catch (error) {
            console.error('Error getting books:', error);
            res.status(500).json({ message: 'Error retrieving books', error: error.message });
        }
    },

    // get a single book by its ID
    getBookById: async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.userData.userId;

            const book = await Book.getById(id, userId);

            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            res.status(200).json(book);
        } catch (error) {
            console.error('Error getting book:', error);
            res.status(500).json({ message: 'Error retrieving book', error: error.message });
        }
    },

    // add a new book to the database
    createBook: async (req, res) => {
        try {
            const userId = req.userData.userId;

            const bookData = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                publication_year: req.body.publication_year,
                category_id: req.body.category_id,
                cover_image: req.file ? req.file.filename : null,
                user_id: userId // link book to current user
            };

            const newBook = await Book.create(bookData);
            res.status(201).json(newBook);
        } catch (error) {
            console.error('Error creating book:', error);

            // clean up uploaded file if there was an error
            if (req.file) {
                fs.unlink(req.file.path, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting file:', unlinkError);
                });
            }

            res.status(500).json({ message: 'Error creating book', error: error.message });
        }
    },

    // update an existing book
    updateBook: async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.userData.userId;

            // check if book exists and belongs to user
            const existingBook = await Book.getById(id, userId);

            if (!existingBook) {
                // remove uploaded file if book not found
                if (req.file) {
                    fs.unlink(req.file.path, (unlinkError) => {
                        if (unlinkError) console.error('Error deleting file:', unlinkError);
                    });
                }

                return res.status(404).json({ message: 'Book not found or you do not have permission to edit it' });
            }

            const bookData = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                publication_year: req.body.publication_year,
                category_id: req.body.category_id
            };

            // handle cover image update if new file was uploaded
            if (req.file) {
                bookData.cover_image = req.file.filename;

                // delete old cover image file
                if (existingBook.cover_image) {
                    const oldImagePath = path.join(__dirname, '../uploads/', existingBook.cover_image);
                    fs.unlink(oldImagePath, (unlinkError) => {
                        if (unlinkError) console.error('Error deleting old image:', unlinkError);
                    });
                }
            }

            const updatedBook = await Book.update(id, bookData, userId);
            res.status(200).json(updatedBook);
        } catch (error) {
            console.error('Error updating book:', error);

            // clean up uploaded file if there was an error
            if (req.file) {
                fs.unlink(req.file.path, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting file:', unlinkError);
                });
            }

            res.status(500).json({ message: 'Error updating book', error: error.message });
        }
    },

    // remove a book from the database
    deleteBook: async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.userData.userId;

            // check if book exists and belongs to user
            const existingBook = await Book.getById(id, userId);

            if (!existingBook) {
                return res.status(404).json({ message: 'Book not found or you do not have permission to delete it' });
            }

            // delete the cover image file if it exists
            if (existingBook.cover_image) {
                const imagePath = path.join(__dirname, '../uploads/', existingBook.cover_image);
                fs.unlink(imagePath, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting image:', unlinkError);
                });
            }

            const deleted = await Book.delete(id, userId);

            if (deleted) {
                res.status(200).json({ message: 'Book deleted successfully' });
            } else {
                res.status(500).json({ message: 'Error deleting book' });
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            res.status(500).json({ message: 'Error deleting book', error: error.message });
        }
    }
};

module.exports = bookController;