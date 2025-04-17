-- database migration script for adding user authentication
-- adds users table and links books to specific users

-- create users table to store account information
-- includes email, password hash, and creation timestamp
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- modify books table to associate each book with a user
-- adds foreign key relationship to users table
ALTER TABLE books ADD COLUMN user_id INT;
ALTER TABLE books ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);

-- create default user account for testing
-- pre-hashed password for security (original is 'password123')
INSERT INTO users (email, password) VALUES 
('default@example.com', '$2b$10$OBVKajJKGfFHe/xiLDMRIu0C8L2KKg3GNHq.87B1m0irVSRJdBg4W');

-- migrate existing books to default user 
-- ensures no books are left without an owner
UPDATE books SET user_id = 1 WHERE user_id IS NULL;

-- make user_id required for all future books
-- enforces data integrity
ALTER TABLE books MODIFY COLUMN user_id INT NOT NULL;