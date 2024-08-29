const Cart = require('../models/cart');
const product = require('../models/product');
const Product = require('../models/product');
const User = require('../models/user');

async function addToCart(req, res) {
    try {
        const userId = req.user.id; // Make sure user is authenticated
        const { productId, quantity } = req.body;
        // Find or create the cart for the user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        // Check if the product is already in the cart
        const productIndex = cart.products.findIndex(p => p.productId == productId);
        console.log("hi");
        if (productIndex > -1) {
            console.log("Product already exists!");
            // Update the quantity if the product is already in the cart
            cart.products[productIndex].quantity += parseInt(quantity, 10);
        } else {
            // Add the new product to the cart
            cart.products.push({ productId, quantity: parseInt(quantity, 10) });
        }

        await cart.save();
        res.status(201).json({msg : "product added to cart successfully!"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function deleteFromCart(req, res) {
    // Implementation for removing items from the cart
}

async function getCart(req, res) {
    try {
        const userId = req.user.id; // Make sure user is authenticated
        console.log(userId);
        const cart = await Cart.findOne({ userId }).populate('products.productId');
       
        if (!cart) {
            return res.render('cart', {session : req.session, cart: { products: [] }, totalAmount: 0 });
        }

        let totalAmount = 0;
        cart.products.forEach(item => {
            totalAmount += item.productId.price * item.quantity; // Assuming productId contains price
        });

        res.render('cart', {session : req.session, cart, totalAmount });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    addToCart,
    deleteFromCart,
    getCart
};
