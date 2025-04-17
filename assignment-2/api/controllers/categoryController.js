// same logic as book controller
const Category = require('../models/Category');

const categoryController = {

    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.getAll();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error getting categories:', error);
            res.status(500).json({ message: 'Error retrieving categories', error: error.message });
        }
    },

    // get a single category by ID
    getCategoryById: async (req, res) => {
        try {
            const id = req.params.id;
            const category = await Category.getById(id);

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json(category);
        } catch (error) {
            console.error('Error getting category:', error);
            res.status(500).json({ message: 'Error retrieving category', error: error.message });
        }
    },

    // create a new category
    createCategory: async (req, res) => {
        try {
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'Category name is required' });
            }

            const categoryData = {
                name,
                description: description || ''
            };

            const newCategory = await Category.create(categoryData);
            res.status(201).json(newCategory);
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ message: 'Error creating category', error: error.message });
        }
    },

    // update an existing category
    updateCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'Category name is required' });
            }

            const existingCategory = await Category.getById(id);

            if (!existingCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            const categoryData = {
                name,
                description: description || existingCategory.description
            };

            const updatedCategory = await Category.update(id, categoryData);
            res.status(200).json(updatedCategory);
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ message: 'Error updating category', error: error.message });
        }
    },

    // delete a category
    deleteCategory: async (req, res) => {
        try {
            const id = req.params.id;

            const existingCategory = await Category.getById(id);

            if (!existingCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            const deleted = await Category.delete(id);

            if (deleted) {
                res.status(200).json({ message: 'Category deleted successfully' });
            } else {
                res.status(500).json({ message: 'Error deleting category' });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ message: 'Error deleting category', error: error.message });
        }
    }
};

module.exports = categoryController;