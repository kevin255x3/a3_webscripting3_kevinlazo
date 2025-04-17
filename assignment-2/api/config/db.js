const mysql = require('mysql2/promise');

// creating a connection pool with cross-platform compatibility, in development i had a mac os socket. changing the host fixed the issue.
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'bookclub_user',
    password: process.env.DB_PASSWORD || 'Bookclub444!',
    database: process.env.DB_NAME || 'book_collection',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// test connection on startup
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error);
        console.log('Please ensure MySQL is running and database is set up correctly.');
    }
}

testConnection();

module.exports = pool;