const nodemailer = require('nodemailer');

async function sendMail(email, emailToken) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user : process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: `"ESTORE" <${process.env.EMAIL_USER}>`,
        to: `${email}`,
        subject: 'Please verify your email.',
        html: `<p>Hello, Verify your email by cliking on this</p>
        </br>
        <a href="http://localhost:${process.env.PORT}/verifyEmail?emailToken=${emailToken}">Click Here to verify</a>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;


