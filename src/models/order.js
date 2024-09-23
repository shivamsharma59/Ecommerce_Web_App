const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            buyPrice: {
                type: Number,
                default: 0
            },
            address: {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                country: String
            },
            contactDetails: {
                phone: String,
                email: String
            },
            status: {
                type: String,
                enum: ['Pending', 'Completed', 'Rejected'],
                default: 'Pending'
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Order', orderSchema);
