const mongoose = require('mongoose');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    password: { type: String, required: true },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address']
    },
    isVerified: { type: Boolean, default: false },
    emailToken: { type: String },
    otp: { type: String }, // for storing OTP
    otpExpires: { type: Date }, // for storing OTP expiration
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);