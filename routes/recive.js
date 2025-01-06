// routes/receiveRoutes.js
const express = require('express');
const router = express.Router();
const Receive = require('../models/recive');

// Create a new receive record
router.post('/', async (req, res) => {
    try {
        const receive = new Receive(req.body);
        await receive.save();
        res.status(201).json(receive);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all receive records
router.get('/', async (req, res) => {
    try {
        const receives = await Receive.find().populate('orderId').populate('receivedItems.item');
        res.json(receives);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single receive record by ID
router.get('/:id', async (req, res) => {
    try {
        const receive = await Receive.findById(req.params.id).populate('orderId').populate('receivedItems.item');
        if (!receive) return res.status(404).json({ message: 'Receive record not found' });
        res.json(receive);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a receive record by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedReceive = await Receive.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('orderId').populate('receivedItems.item');
        if (!updatedReceive) return res.status(404).json({ message: 'Receive record not found' });
        res.json(updatedReceive);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a receive record by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedReceive = await Receive.findByIdAndDelete(req.params.id);
        if (!deletedReceive) return res.status(404).json({ message: 'Receive record not found' });
        res.json({ message: 'Receive record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
