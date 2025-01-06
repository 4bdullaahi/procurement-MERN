// routes/vendor.js
const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendor');

// Create a new vendor
router.post('/', async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor) res.json(vendor);
    else res.status(404).json({ message: 'Vendor not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a vendor by ID
router.put('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (vendor) res.json(vendor);
    else res.status(404).json({ message: 'Vendor not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a vendor by ID
router.delete('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (vendor) res.json({ message: 'Vendor deleted' });
    else res.status(404).json({ message: 'Vendor not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
