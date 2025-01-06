// models/report.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        required: true,
    },
    receivedStatus: {
        type: String,
        enum: ['Not Received', 'Partially Received', 'Fully Received'],
        required: true,
    },
    generatedDate: {
        type: Date,
        default: Date.now,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    notes: {
        type: String,
        maxlength: 500,
    },
});

module.exports = mongoose.model('Report', ReportSchema);
