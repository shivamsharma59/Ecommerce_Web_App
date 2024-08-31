const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController.js');
const authController = require('../controllers/authControllers.js');

router.get('/', homeController.getHomePage);

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