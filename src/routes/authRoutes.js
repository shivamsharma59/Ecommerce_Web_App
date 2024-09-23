const express = require('express');
const router = express.Router();

// router 
const cartRoutes = require('./cartRoutes.js');
const adminRoutes = require('./adminRoutes.js');
const checkoutRoutes = require('./checkoutRoutes.js');
const userRoutes = require('./userRoutes.js');
router.use('/cart',cartRoutes);
router.use('/admin',adminRoutes);
router.use('/checkout',checkoutRoutes);
router.use('/dashboard', userRoutes);

module.exports = router;