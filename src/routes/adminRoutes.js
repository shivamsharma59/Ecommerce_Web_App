const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../../public/images')});

const adminController = require('../controllers/adminController');
router.get('/', isAdmin, adminController.renderAdminPage);
router.post('/products/add', isAdmin, upload.single('imageUrl'), adminController.addProduct);
router.delete('/products/delete/:id', isAdmin, adminController.deleteProduct);

module.exports = router;