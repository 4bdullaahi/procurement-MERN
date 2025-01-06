// models/receive.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReceiveSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    receivedDate: {
        type: Date,
        default: Date.now,
    },
    receivedItems: [
        {
            item: {
                type: Schema.Types.ObjectId,
                ref: 'Item',
                required: true,
            },
            quantityReceived: {
                type: Number,
                required: true,
            },
        },
    ],
    totalReceivedQuantity: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
        maxlength: 500,
    },
});

ReceiveSchema.pre('save', function (next) {
    this.totalReceivedQuantity = this.receivedItems.reduce((acc, item) => acc + item.quantityReceived, 0);
    next();
});

module.exports = mongoose.model('Receive', ReceiveSchema);
