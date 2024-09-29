const Order = require('../models/order.js');
const Product = require('../models/product.js'); // Assuming you have a Product model
const Cart = require('../models/cart');

async function renderCheckoutPage(req, res) {
    try {
        const userId = req.user.id;
        let cart = await Cart.findOne({ userId }).populate({
            path: 'products.productId',
            select: 'productName price imageUrl', // Only select the fields you need
        })
            .exec();

        if (!cart || !cart.products || cart.products.length === 0) {
            return res.redirect('/auth/cart'); // Redirect to cart if it's empty
        }

        let totalAmount = 0;
        for (const item of cart.products) {
            totalAmount += Number(item.productId.price) * Number(item.quantity);
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

        // Find the user's cart
        let cart = await Cart.findOne({ userId }).populate({
            path: 'products.productId',
            select: 'productName price imageUrl', // Only select the fields you need
        }).exec();

        if (!cart || !cart.products || cart.products.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Calculate total amount and prepare products for the order
        let totalAmount = 0;
        const productsForOrder = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            totalAmount += Number(product.price) * Number(item.quantity);

            // Check product stock
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity; // Decrease stock
                await product.save();

                // Push item to products array for the order
                productsForOrder.push({
                    productId: product._id,
                    quantity: item.quantity,
                    buyPrice: product.price // Set buyPrice here
                });
            } else {
                return res.status(400).json({ success: false, message: `Not enough stock for ${product.productName}` });
            }
        }

        // Create the order
        const newOrder = new Order({
            userId: userId,
            products: productsForOrder,
            totalAmount,
            address: { street, city, state, zipCode, country },
            contactDetails: { phone, email },
            status: 'Completed' // Assuming order is completed for now
        });

        await newOrder.save();

        // Clear the user's cart
        await Cart.deleteOne({ userId });

        return res.status(200).json({ success: true, message: 'Order placed successfully!' });
    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ success: false, message: 'Failed to place order' });
    }
}


module.exports = { renderCheckoutPage, process }