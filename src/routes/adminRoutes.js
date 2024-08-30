const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const isAdmin = require('../middleware/isAdmin');

const adminController = require('../controllers/adminController');
router.get('/', isAdmin, adminController.renderAdminPage);
router.post('/products/add', isAdmin, adminController.addProduct);
router.delete('/products/delete/:id', isAdmin, adminController.deleteProduct);

module.exports = router;
