const Product = require('../models/product.js');

async function getHomePage(req, res) {
    try {
        let products = await Product.find(); // Fetch all products

        if (req.xhr) {
            // Respond with JSON data for AJAX requests
            return res.json(products);
        }

        // Render the home page with all products
        res.render('home', { session: req.session, products: products });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching products" });
    }
}

module.exports = { getHomePage };