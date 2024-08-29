const express = require('express');
const router = express.Router();

// router 
const cartRoutes = require('./cartRoutes.js');
router.use('/cart',cartRoutes);

module.exports = router;