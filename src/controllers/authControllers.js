const User = require('../models/user.js');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendMail = require('../services/sendMail.js');
const jwt = require('jsonwebtoken');


// This is your new route handler for email verification
async function verifyEmail(req, res) {
    const { emailToken } = req.query;

    if (!emailToken) {
        return res.status(400).json({ msg: 'Invalid token' });
    }

    let user = await User.findOne({ emailToken });

    if (!user) {
        return res.status(400).json({ msg: 'User not found' });
    }

    await User.updateOne({ email: user.email }, { isVerified: true, emailToken: null });

    return res.status(200).redirect('/login');
};

// Initiate signup by generating and sending an OTP
async function initiateSignup(req, res) {
    const { username, email, password } = req.body;
    const emailToken = crypto.randomBytes(64).toString('hex');
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists Please login' });

    await sendMail(email, emailToken);

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            emailToken,
        })

        newUser.save();
        // return res.redirect('/login');
    }
    catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }

    return res.status(200).json({ msg: "Email Verification link sent" });
}

const generateToken = (user) => {
    // Create a token with user ID and other payload information
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiry time
    });
};

async function loginUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ msg: 'Email not verified' });
        }

        // Generate JWT token
        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true });

        req.session.username = user.username;
        req.session.isLoggedIn = true;
        req.session.isAdmin = user.isAdmin;

        // Send the token in the response
        res.status(200).json({ msg: 'Login successful', token, username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
}

async function logoutUser(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        
        res.clearCookie('sessionId');
        // Clear the authentication token cookie if used
        res.clearCookie('token');
        res.redirect('/');
    });
}


module.exports = { verifyEmail, initiateSignup, loginUser, logoutUser };