const Order = require('../models/order.js');
const Product = require('../models/product.js'); // Assuming you have a Product model
const Cart = require('../models/cart');

async function renderCheckoutPage(req, res) {
    try {
        const userId = req.user.id;
        let cart = await Cart.findOne({ userId }).populate({
            path: 'products.productId',
            select: 'productName price', // Only select the fields you need
        })
            .exec();

        if (!cart || !cart.products || cart.products.length === 0) {
            return res.redirect('/auth/cart'); // Redirect to cart if it's empty
        }

        let totalAmount = 0;
        for (const item of cart.products) {
            totalAmount += item.productPrice * item.quantity;
        }

        res.render('checkout', {
            session: req.session,
            cart,
            totalAmount
        });
    } catch (error) {
        console.error('Error rendering checkout page:', error);
        res.status(500).send('Failed to render checkout page');
    }
}


async function process(req, res) {
    try {
        const { street, city, state, zipCode, country, phone, email } = req.body;
        const userId = req.user.id;
        let cart = await Cart.findOne({ userId }).populate({
            path: 'products.productId',
            select: 'productName price', // Only select the fields you need
        })
            .exec();

        if (!cart || !cart.products || cart.products.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Calculate total amount
        let totalAmount = 0;
        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            totalAmount += product.price * item.quantity;

            // Update product stock
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
            } else {
                return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}` });
            }
        }

        // Create the order
        const newOrder = new Order({
            user: userId,
            products: cart.products,
            totalAmount,
            address: { street, city, state, zipCode, country },
            contactDetails: { phone, email },
            status: 'Completed' // Marking as completed for now, you can add payment logic here
        });

        await newOrder.save();

        // Clear the cart
        req.session.cart = null;

        res.status(200).json({ success: true, message: 'Order placed successfully!' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Failed to place order' });
    }
}

module.exports = { renderCheckoutPage, process }