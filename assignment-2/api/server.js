require('dotenv').config();

console.log("ENV VARS:", {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD?.substring(0, 3) + "...", // For security
    DB_NAME: process.env.DB_NAME
});

// main server file for book collection api
// sets up express server and configures middleware
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


// import route modules
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');

// initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// configure middleware
app.use(cors());  // enable cross-origin requests
app.use(bodyParser.json());  // parse json request bodies
app.use(bodyParser.urlencoded({ extended: true }));  // parse url-encoded data

// serve static files from uploads folder
// makes uploaded book covers accessible via url
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// register api routes
app.use('/api/books', bookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', authRoutes);  // authentication routes

// root route - simple api health check
app.get('/', (req, res) => {
    res.send('Book Collection API is running');
});

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});