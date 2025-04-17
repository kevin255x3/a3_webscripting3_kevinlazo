// category routes - api endpoints for category operations
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// get all categories
// GET /api/categories
router.get('/', categoryController.getAllCategories);

// get a single category by id
// GET /api/categories/:id
router.get('/:id', categoryController.getCategoryById);

// create a new category
// POST /api/categories
router.post('/', categoryController.createCategory);

// update an existing category
// PUT /api/categories/:id
router.put('/:id', categoryController.updateCategory);

// delete a category
// DELETE /api/categories/:id
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;