// routes/purchase.js
const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// Create a new purchase
router.post('/', async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a purchase by ID
router.get('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (purchase) res.json(purchase);
    else res.status(404).json({ message: 'Purchase not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a purchase by ID
router.put('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (purchase) res.json(purchase);
    else res.status(404).json({ message: 'Purchase not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a purchase by ID
router.delete('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (purchase) res.json({ message: 'Purchase deleted' });
    else res.status(404).json({ message: 'Purchase not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
