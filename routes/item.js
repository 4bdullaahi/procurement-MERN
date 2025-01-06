// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const Category = require('../models/category');
const Vendor = require('../models/vendor');

// Create a new item
router.post('/', async (req, res) => {
    try {
        // Check if category and vendor exist
        const category = await Category.findById(req.body.category);
        const vendor = await Vendor.findById(req.body.vendor);
        if (!category || !vendor) {
            return res.status(400).json({ message: 'Invalid category or vendor' });
        }

        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all items with category and vendor populated
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().populate('category', 'name').populate('vendor', 'name');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single item by ID with category and vendor populated
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('category', 'name').populate('vendor', 'name');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an item by ID with validation on category and vendor
router.put('/:id', async (req, res) => {
    try {
        if (req.body.category) {
            const category = await Category.findById(req.body.category);
            if (!category) return res.status(400).json({ message: 'Invalid category' });
        }
        if (req.body.vendor) {
            const vendor = await Vendor.findById(req.body.vendor);
            if (!vendor) return res.status(400).json({ message: 'Invalid vendor' });
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an item by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
