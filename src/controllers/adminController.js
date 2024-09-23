const Product = require('../models/product.js');
const Cart = require('../models/cart.js'); // Import the Cart model
const path = require('path');
const fs = require('fs');

// Render admin page with products
async function renderAdminPage(req, res) {
    try {
        const products = await Product.find();
        res.render('admin', { session: req.session, products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function addProduct(req, res) {
    const { productName, price, description, stock } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null; // Correct filename usage

    try {
        const newProduct = new Product({
            productName,
            description, // Added description
            price,
            stock: parseInt(stock, 10), // Ensure stock is parsed as integer
            imageUrl
        });
        await newProduct.save();
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding product' });
    }
}

// Delete product and also remove it from all carts
async function deleteProduct(req, res) {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        if (product && product.imageUrl) {
            const imagePath = path.join(__dirname, '../public', product.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Remove product from all carts
        await Cart.updateMany(
            { 'products.productId': productId },
            { $pull: { products: { productId: productId } } }
        );

        await Product.findByIdAndDelete(productId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
}

module.exports = {
    renderAdminPage,
    addProduct,
    deleteProduct
};