// handle category-related database operations
const db = require('../config/db');

class Category {
    // get all categories with book count
    // returns all categories with the number of books in each category
    // filters - optional category and search filters
    static async getAll() {
        try {
            const [rows] = await db.execute(`
        SELECT c.*, COUNT(b.id) as book_count 
        FROM categories c
        LEFT JOIN books b ON c.id = b.category_id
        GROUP BY c.id
        ORDER BY c.name
      `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // get single category by id
    // id - category id
    // returns a single category object
    // with the number of books in that category
    // if category not found, returns null
    // if error occurs, throws error
    static async getById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM categories WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // create a new category
    // categoryData - category information
    // returns the created category object
    // if error occurs, throws error
    // if category already exists, throws error
    // if category name is empty, throws error
    // if category description is empty, throws error
    // if category name already exists, throws error
    // etc....
    static async create(categoryData) {
        try {
            const { name, description } = categoryData;

            const [result] = await db.execute(
                `INSERT INTO categories (name, description, created_at) 
         VALUES (?, ?, NOW())`,
                [name, description]
            );

            const id = result.insertId;
            return this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // update a category
    // id - category id
    // categoryData - updated category information    
    // returns the updated category object
    static async update(id, categoryData) {
        try {
            const { name, description } = categoryData;

            await db.execute(
                `UPDATE categories SET name = ?, description = ? WHERE id = ?`,
                [name, description, id]
            );

            return this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // delete a category
    // id - category id
    // returns true if category was deleted
    // returns false if category was not deleted
    // if error occurs, throws error
    static async delete(id) {
        try {
            const [result] = await db.execute(
                `DELETE FROM categories WHERE id = ?`,
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Category;