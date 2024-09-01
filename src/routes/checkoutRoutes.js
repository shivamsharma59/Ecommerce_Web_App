const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController.js');

router.get('/', checkoutController.renderCheckoutPage);
router.post('/', checkoutController.process);

module.exports = router;
