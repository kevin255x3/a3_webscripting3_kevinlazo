// user model - handles database operations for users table
const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    // find a user by email
    // returns user object or null if not found
    static async findByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // find a user by id
    // only returns non-sensitive user data
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // create a new user account
    // hashes password before storing in database
    static async create(userData) {
        try {
            const { email, password } = userData;

            // hash the password for security
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const [result] = await db.execute(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                [email, hashedPassword]
            );

            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // compare plain password with hashed password
    // used during login to verify credentials
    static async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;