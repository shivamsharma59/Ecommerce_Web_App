const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other email services or SMTP servers
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD // Your email password
    }
});

// Function to send different types of emails
async function sendMail(email, tokenOrOtp, type, host) {
    let subject, htmlContent;

    if (type === 'verification') {
        subject = 'Please verify your email address';
        htmlContent = `
            <p>Hello,</p>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="http:${host}//:${process.env.PORT}/verifyEmail?emailToken=${tokenOrOtp}">Verify Email</a>
            <p>Thank you!</p>
        `;
    } else if (type === 'otp') {
        subject = 'Your OTP Code';
        htmlContent = `
            <p>Hello,</p>
            <p>Your OTP code is: <strong>${tokenOrOtp}</strong></p>
            <p>This code is valid for 15 minutes.</p>
            <p>Thank you!</p>
        `;
    } else {
        throw new Error('Invalid email type');
    }

    const mailOptions = {
        from: `"ESTORE" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: htmlContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

module.exports = sendMail;
