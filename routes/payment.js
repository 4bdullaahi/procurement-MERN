// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

// Create a new payment record
router.post('/', async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all payment records
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find().populate('orderId');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single payment record by ID
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('orderId');
        if (!payment) return res.status(404).json({ message: 'Payment record not found' });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a payment record by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('orderId');
        if (!updatedPayment) return res.status(404).json({ message: 'Payment record not found' });
        res.json(updatedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a payment record by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) return res.status(404).json({ message: 'Payment record not found' });
        res.json({ message: 'Payment record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
