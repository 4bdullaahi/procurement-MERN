// models/payment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Bank Transfer', 'Online Payment'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true,  // This will allow null values but enforce uniqueness for provided values.
    },
    notes: {
        type: String,
        maxlength: 500,
    },
});

module.exports = mongoose.model('Payment', PaymentSchema);
