const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Item = require('../models/item');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const items = req.body.items;
        let totalAmount = 0;

        // Calculate total amount
        for (let orderItem of items) {
            const item = await Item.findById(orderItem.item);
            if (!item) return res.status(400).json({ message: 'Invalid item ID' });
            orderItem.unitPrice = item.unitPrice;
            totalAmount += item.unitPrice * orderItem.quantity;
        }

        const order = new Order({ ...req.body, totalAmount });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('items.item', 'itemName');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.item', 'itemName');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
