const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true }
    }],
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    totalAmount: { type: Number, required: true },
    dateOrdered: { type: Date, default: Date.now }
});

// Pre-save hook to calculate the total amount
orderSchema.pre('save', function (next) {
    // Calculate the total amount by summing up each item's unitPrice * quantity
    this.totalAmount = this.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    next();
});

module.exports = mongoose.model('Order', orderSchema);
