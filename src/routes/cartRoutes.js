const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController.js');

router.get('/',cartController.getCart);
router.post('/add', cartController.addToCart);

module.exports = router;