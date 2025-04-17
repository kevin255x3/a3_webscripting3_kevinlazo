// book model - handles database operations for books table
const db = require('../config/db');

class Book {
    // get all books from the database with optional filtering
    static async getAll(filters = {}) {
        try {
            let query = `
        SELECT b.*, c.name as category_name 
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE b.user_id = ?
      `;

            const queryParams = [filters.userId];

            // add category filter if provided
            if (filters.categoryId) {
                query += ` AND b.category_id = ?`;
                queryParams.push(filters.categoryId);
            }

            // add search filter if provided
            if (filters.search) {
                query += ` AND (b.title LIKE ? OR b.author LIKE ?)`;
                queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            query += ` ORDER BY b.created_at DESC`;

            const [rows] = await db.execute(query, queryParams);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // get a single book by id
    // verifies the book belongs to the user
    static async getById(id, userId) {
        try {
            const [rows] = await db.execute(
                `SELECT b.*, c.name as category_name 
         FROM books b
         LEFT JOIN categories c ON b.category_id = c.id
         WHERE b.id = ? AND b.user_id = ?`,
                [id, userId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // create a new book record
    static async create(bookData) {
        try {
            const { title, author, description, publication_year, cover_image, category_id, user_id } = bookData;

            const [result] = await db.execute(
                `INSERT INTO books (title, author, description, publication_year, cover_image, category_id, user_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [title, author, description, publication_year, cover_image, category_id, user_id]
            );

            const id = result.insertId;
            return this.getById(id, user_id);
        } catch (error) {
            throw error;
        }
    }

    // update an existing book
    // only updates fields that are provided
    static async update(id, bookData, userId) {
        try {
            const { title, author, description, publication_year, cover_image, category_id } = bookData;

            // first check if the book belongs to the user
            const book = await this.getById(id, userId);
            if (!book) {
                throw new Error('Book not found or you do not have permission to edit it');
            }

            let query = `UPDATE books SET updated_at = NOW()`;
            const queryParams = [];

            if (title !== undefined) {
                query += `, title = ?`;
                queryParams.push(title);
            }

            if (author !== undefined) {
                query += `, author = ?`;
                queryParams.push(author);
            }

            if (description !== undefined) {
                query += `, description = ?`;
                queryParams.push(description);
            }

            if (publication_year !== undefined) {
                query += `, publication_year = ?`;
                queryParams.push(publication_year);
            }

            if (cover_image !== undefined) {
                query += `, cover_image = ?`;
                queryParams.push(cover_image);
            }

            if (category_id !== undefined) {
                query += `, category_id = ?`;
                queryParams.push(category_id);
            }

            query += ` WHERE id = ? AND user_id = ?`;
            queryParams.push(id, userId);

            await db.execute(query, queryParams);
            return this.getById(id, userId);
        } catch (error) {
            throw error;
        }
    }

    // delete a book from the database
    // verifies user owns the book before deletion
    static async delete(id, userId) {
        try {
            const [result] = await db.execute(
                `DELETE FROM books WHERE id = ? AND user_id = ?`,
                [id, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Book;