const mongoose = require('mongoose');
const PreferenceTag = require('../../Models/ActivityModels/PreferenceTags');

// Create PreferenceTag
exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the tag already exists
        const existingTag = await PreferenceTag.findOne({ name: name }); 
        if (existingTag) {
            return res.status(400).json({ message: 'Tag already exists' });
        }

        // Create the new tag
        const newTag = new PreferenceTag({ name });
        await newTag.save();

        res.status(201).json(newTag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get All PreferenceTags
exports.getAllTags = async (req, res) => {
    try {
        const tags = await PreferenceTag.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a PreferenceTag by ID
exports.getTagById = async (req, res) => {
    try {
        const tag = await PreferenceTag.findById(req.params.id);

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a PreferenceTag by ID
exports.updateTag = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the tag exists
        const tag = await PreferenceTag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        // Update the tag name
        tag.name = name || tag.name;

        await tag.save();
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a PreferenceTag by ID
exports.deleteTag = async (req, res) => {
    try {
        const tag = await PreferenceTag.findByIdAndDelete(req.params.id);

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
