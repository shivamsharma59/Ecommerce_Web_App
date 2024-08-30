const Product = require('../models/product');
const path = require('path');
const fs = require('fs');

// Render admin page with products
async function renderAdminPage(req, res){
    try {
        const products = await Product.find();
        res.render('admin', { session: req.session, products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function addProduct(req, res) {
    const { productName, price } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null; // Correct filename usage

    try {
        const newProduct = new Product({
            productName,
            price,
            imageUrl
        });
        await newProduct.save();
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding product' });
    }
}


// Delete product
async function deleteProduct(req, res){
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        if (product && product.imageUrl) {
            const imagePath = path.join(__dirname, '../public', product.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
}

module.exports = {
    renderAdminPage,
    addProduct, // Use multer middleware
    deleteProduct
};
