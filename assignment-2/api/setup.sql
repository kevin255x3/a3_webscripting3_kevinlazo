-- complete set up script that handles database creation, user setup and data import

-- creates book_collection database if not exists
CREATE DATABASE IF NOT EXISTS book_collection;

-- swirches to the target database
USE book_collection;

-- sets up users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- checks if books table exists before creating
SET @table_exists = 0;
SELECT COUNT(*) INTO @table_exists FROM information_schema.tables 
WHERE table_schema = 'book_collection' AND table_name = 'books';

-- conditional creation of books table using prepared statement
SET @create_books_sql = IF(@table_exists = 0, 
  'CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    publication_year INT,
    cover_image VARCHAR(255),
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )', 'SELECT "Books table already exists"');
PREPARE stmt FROM @create_books_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- add user_id column if not exists for book ownership
SET @column_exists = 0;
SELECT COUNT(*) INTO @column_exists FROM information_schema.columns 
WHERE table_schema = 'book_collection' AND table_name = 'books' AND column_name = 'user_id';

SET @alter_books_sql = IF(@column_exists = 0, 
  'ALTER TABLE books ADD COLUMN user_id INT', 
  'SELECT "user_id column already exists"');
PREPARE stmt FROM @alter_books_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- adds foreign key relationship if not exists
SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists FROM information_schema.table_constraints
WHERE table_schema = 'book_collection' AND table_name = 'books' 
AND constraint_name = 'fk_user';

SET @add_fk_sql = IF(@fk_exists = 0,
  'ALTER TABLE books ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)',
  'SELECT "Foreign key already exists"');
PREPARE stmt FROM @add_fk_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- creates default user account with password 123
SET @user_exists = 0;
SELECT COUNT(*) INTO @user_exists FROM users WHERE email = 'default@example.com';


SET @insert_user_sql = IF(@user_exists = 0,
  'INSERT INTO users (email, password) VALUES 
   ("default@example.com", "$2b$10$OBVKajJKGfFHe/xiLDMRIu0C8L2KKg3GNHq.87B1m0irVSRJdBg4W")',
  'SELECT "Default user already exists"');
PREPARE stmt FROM @insert_user_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- connects existing books to default user
UPDATE books SET user_id = 1 WHERE user_id IS NULL;

-- makes user association required for future books
SET @modify_column_sql = IF(@column_exists = 1, 
  'ALTER TABLE books MODIFY COLUMN user_id INT NOT NULL', 
  'SELECT "Column already required"');
PREPARE stmt FROM @modify_column_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- additional categories and book samples can be imported here
-- from custom-books.sql file if needed.