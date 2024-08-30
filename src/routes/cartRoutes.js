const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController.js');

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/update', cartController.updateQuantity);
router.post('/delete', cartController.deleteFromCart);

module.exports = router;
