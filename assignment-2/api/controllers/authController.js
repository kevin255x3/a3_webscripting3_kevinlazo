// authentication controller for handling user registration and login
// uses JWT for secure authentication
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// JWT secret key - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// validation rules for signup form
exports.validateSignup = [
    // validate email format
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    // ensure password is secure
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    // make sure passwords match
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

// handle user registration
exports.signup = async (req, res) => {
    try {
        // check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // prevent duplicate accounts
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // create new user in database
        const userId = await User.create({ email, password });

        res.status(201).json({
            message: 'User registered successfully',
            userId
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// handle user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // verify password is correct
        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // create authentication token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // return success with token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user.id,
            email: user.email
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// get currently logged in user's profile
exports.getCurrentUser = async (req, res) => {
    try {
        // get user ID from token data
        const userId = req.userData.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // return user info without sensitive data
        res.status(200).json({
            userId: user.id,
            email: user.email,
            createdAt: user.created_at
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};