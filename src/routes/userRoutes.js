const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');

router.get('/', (req, res) => {
    return res.render('dashboard', { session: req.session, user: req.user });
});

router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('products.productId');
        return res.render('orders', { session: req.session, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).send('Internal Server Error');
    }
});



module.exports = router;