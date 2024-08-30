const Product = require('../models/product');

// Render admin page with products
async function renderAdminPage(req, res){
    try {
        console.log("Hi");
        const products = await Product.find();
        res.render('admin', {session : req.session, products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Add new product
async function addProduct(req, res){
    const { productName, price, imageUrl } = req.body;

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
};

// Delete product
async function deleteProduct(req, res){
    const productId = req.params.id;

    try {
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
};

module.exports = {
    renderAdminPage,
    addProduct,
    deleteProduct
}
