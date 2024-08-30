const express = require('express');
const router = express.Router();

// router 
const cartRoutes = require('./cartRoutes.js');
const adminRoutes = require('./adminRoutes.js');
router.use('/cart',cartRoutes);
router.use('/admin',adminRoutes);

module.exports = router;