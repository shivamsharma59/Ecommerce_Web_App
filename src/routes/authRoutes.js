const express = require('express');
const router = express.Router();

// router 
const cartRoutes = require('./cartRoutes.js');
const adminRoutes = require('./adminRoutes.js');
const checkoutRoutes = require('./checkoutRoutes.js');
router.use('/cart',cartRoutes);
router.use('/admin',adminRoutes);
router.use('/checkout',checkoutRoutes);

module.exports = router;