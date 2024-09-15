const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String, // Store hashed password here temporarily
    emailToken: String
});

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);

module.exports = VerificationToken;
