const ActivityCategory = require('../../Models/ActivityModels/ActivityCategory.js');

// Create Activity Category
const createCategory = async(req, res) => {
    const { name } = req.body;

    try {
        const newCategory = await ActivityCategory.create({ name });
        res.status(201).json({ message: 'Category created successfully', newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
};

// Get all Categories
const getAllCategories = async(req, res) => {
    try {
        const categories = await ActivityCategory.find({});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
};

// Update Category
const updateCategory = async(req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const category = await ActivityCategory.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error });
    }
};

// Delete Category
const deleteCategory = async(req, res) => {
    const { id } = req.params;

    try {
        const category = await ActivityCategory.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error });
    }
};

module.exports = { createCategory, getAllCategories, updateCategory, deleteCategory };