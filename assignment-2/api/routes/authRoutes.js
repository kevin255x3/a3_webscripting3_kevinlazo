// auth routes - api endpoints for authentication
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// register new user
// POST /api/users
router.post('/', authController.validateSignup, authController.signup);

// user login
// POST /api/users/sign-in
router.post('/sign-in', authController.login);

// get current user profile
// GET /api/users/me
// protected route - requires auth token
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;