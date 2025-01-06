// routes/customer.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Create a new customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) res.json(customer);
    else res.status(404).json({ message: 'Customer not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a customer by ID
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (customer) res.json(customer);
    else res.status(404).json({ message: 'Customer not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (customer) res.json({ message: 'Customer deleted' });
    else res.status(404).json({ message: 'Customer not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
