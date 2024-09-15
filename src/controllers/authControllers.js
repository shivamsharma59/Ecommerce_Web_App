const User = require('../models/user');
const VerificationToken = require('../models/verificationToken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendMail = require('../services/sendMail');
const jwt = require('jsonwebtoken');

// Initiate signup by generating and sending a verification token
async function initiateSignup(req, res) {
    const { username, email, password } = req.body;
    const emailToken = crypto.randomBytes(64).toString('hex');

    // Check if a user with the given email or username already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(400).json({ msg: 'User with this username or email already exists!' });

    // Save verification token to a temporary collection
    await sendMail(email, emailToken, 'verification');

    try {
        await VerificationToken.create({
            email,
            username,
            password: await bcrypt.hash(password, 10),
            emailToken,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }

    return res.status(200).json({ msg: 'Email Verification link sent' });
}

// Verify email and create user record
async function verifyEmail(req, res) {
    const { emailToken } = req.query;

    if (!emailToken) {
        return res.status(400).json({ msg: 'Invalid token' });
    }

    // Retrieve the token record
    const tokenRecord = await VerificationToken.findOne({ emailToken });
    if (!tokenRecord) {
        return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Create a new user with the provided details
    const { email, username, password } = tokenRecord;

    try {
        const newUser = new User({
            username,
            email,
            password,
            isVerified: true
        });
        await newUser.save();

        // Clean up the token record
        await VerificationToken.deleteOne({ emailToken });

        return res.status(200).redirect('/login');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
}

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Login user
async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
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

        return res.status(200).json({ msg: 'Login successful', token, username: user.username });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
}

// Logout user
async function logoutUser(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }

        res.clearCookie('token');
        res.redirect('/');
    });
}

// Generate and send OTP for password reset
async function forgotPassword(req, res) {
    const { email } = req.body;
    req.session.email = email; // Store email in session

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
    const otpExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes

    await User.updateOne({ email }, { otp, otpExpires });
    await sendMail(email, otp, 'otp'); // Send OTP to user's email

    return res.status(200).json({ msg: 'OTP sent to your email' });
}

// Verify OTP
async function verifyOtp(req, res) {
    const { otp } = req.body;
    const email = req.session.email;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    await User.updateOne({ email }, { otp: null, otpExpires: null });
    return res.status(200).json({ msg: 'OTP verified' });
}

// Create new password
async function createNewPassword(req, res) {
    const { newPassword } = req.body;
    const email = req.session.email;

    if (!email) return res.status(400).json({ msg: 'No email found' });

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword, otp: null, otpExpires: null });

    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.clearCookie('token');
        return res.status(200).json({ msg: 'Password updated successfully' });
    });
}

module.exports = { verifyEmail, initiateSignup, loginUser, logoutUser, forgotPassword, verifyOtp, createNewPassword };
