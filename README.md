Book Collection Application
A full-stack application for managing a personal library using React and Express.

Features
Browse and search your book collection
Filter books by categories
Add new books with cover images
Edit and delete book entries
User authentication with secure login

## Environment configuration

This application uses an `.env` file to store database credentials. Before running the application

1. Navigate to the API directory: cd assignment-2/api

2. Create or edit the .env file with your mySQL credentials.
PORT=5001 
DB_HOST=127.0.0.1 
DB_USER=your_mysql_username 
DB_PASSWORD=your_mysql_password 
DB_NAME=book_collection 
JWT_SECRET=your_jwt_secret

3. Save the file. The application will use these credentials to connect to your MySQL server.

## Setup Instructions
Prerequisites - Node.js (v14+), MySQL (v8.0+)

## Installation Steps

1. Install dependencies
api dependencies: cd assignment-2/api npm install
front end dependencies cd../web npm install

In the API directory run: npm run set up

This will run a script to:
- Create the book collection database if it does not exist
- Create the table (books, categories, users)
- Add sample book data into categories
- Create a default user testing account

4. Start the application
to start the backend from the api directory: npm run dev
to start the front end from the web directory: npm start

5. Access the app
there should be a link to the app in the cli, 
you can manually access at http://localhost:3000

the default log in credentials are 
email: default@example.com
password: password123

## Notes

### There might be database connection issues
If you see connection errors, you need to verify if your mySQL server is running.
Check your credentials match in your .env file and mySQL setup
Grant sufficient priviledges to your mySQL user

### Auto-setup script failure
Check the mySQL error messages in the console

try this manual set up process
CREATE DATABASE book_collection;
CREATE USER 'bookclub_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON book_collection.* TO 'bookclub_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

* verify that your mySQL user has CREATE DATABASE privileges

then update your .env file with the credentials you created.

then import the setup SQL file: mysql -u your_username -p book_collection < assignment-2/api/setup.sql

## After set up
Verify installation. You should be able to
1. Log in with the default credentials
2. See a list of sample books
3. Add, edit and delete books
4. Filter books by category