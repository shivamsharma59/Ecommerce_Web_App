const Product = require('../models/product.js');


async function addProduct(req, res) {
    for (let i = 1; i < 13; i++) {
        const newProduct = await Product.create({
            productName: `shirt${i}`,
            price: 3000,
            imageUrl: `/images/shirt${i}.avif`
        })
    }
}

module.exports = { addProduct };