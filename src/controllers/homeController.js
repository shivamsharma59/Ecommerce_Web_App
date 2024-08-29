const Product = require('../models/product.js');

async function getHomePage(req, res) {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    let skip = (page - 1) * limit;

    try {
        if (page === 1) {
            // For the initial page load, render the home page with the first set of products
            let products = await Product.find().skip(skip).limit(limit);
            res.render('home', { session: req.session, products: products });
        } else {
            // For subsequent requests, respond with JSON data
            let products = await Product.find().skip(skip).limit(limit);
            if (!products.length && page > 1) {
                return res.status(200).json({ msg: "No more products" });
            }
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching products" });
    }
}

module.exports = { getHomePage };
