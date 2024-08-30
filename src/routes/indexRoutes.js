const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController.js');
const authController = require('../controllers/authControllers.js');

router.get('/', homeController.getHomePage);

router.get('/signup', (req, res) => { res.render('signup'); });

router.get('/login', (req, res) => { res.render('login'); });

router.post('/initiateSignup', authController.initiateSignup);

router.get('/verifyEmail', authController.verifyEmail);

router.post('/login', authController.loginUser);

router.get('/logout', authController.logoutUser);

// Routes
const authenticateUser = require('../middleware/auth.js');
const authRoutes = require('./authRoutes.js');
router.use('/auth', authenticateUser, authRoutes);

module.exports = router;