const express = require('express');
const router = express.Router();
const Product = require('../models/product.js');
const authController = require('../controllers/authControllers.js');

// Fixed number of products per page
const productsPerPage = 5;

router.get('/', async (req, res) => {
    try {
        // Fetch the first set of products
        const products = await Product.find().limit(productsPerPage);
        const totalProducts = await Product.countDocuments();
        const hasMore = totalProducts > productsPerPage;

        // Render the home page with the first set of products
        res.render('home', {
            session: req.session,
            products: products,
            hasMore: hasMore
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while fetching products" });
    }
});

router.get('/load-products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Use the page number from the query
        const skip = (page - 1) * productsPerPage;

        const products = await Product.find().skip(skip).limit(productsPerPage);
        const totalProducts = await Product.countDocuments();
        const hasMore = totalProducts > skip + productsPerPage;

        res.json({ products, hasMore });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
});

// Other routes remain unchanged

router.get('/signup', (req, res) => { return res.render('signup'); });

router.get('/login', (req, res) => { return res.render('login'); });

router.post('/initiateSignup', authController.initiateSignup);

router.get('/verifyEmail', authController.verifyEmail);

router.post('/login', authController.loginUser);

router.get('/logout', authController.logoutUser);

router.get('/forgotpass', (req, res) => { return res.render('forgotpass') });

router.post('/forgot-pass', authController.forgotPassword);

router.get('/verify-otp', (req, res) => { return res.render('verifyotp') });

router.post('/verify-otp', authController.verifyOtp);

router.get('/create-new-pass', (req, res) => { return res.render('createnewpass') });

router.post('/create-new-pass', authController.createNewPassword);

// Routes
const authenticateUser = require('../middleware/auth.js');
const authRoutes = require('./authRoutes.js');
router.use('/auth', authenticateUser, authRoutes);

module.exports = router;
