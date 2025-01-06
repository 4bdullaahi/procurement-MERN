// routes/emailRouter.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Email = require('../models/email'); // Import model if saving data

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service provider (e.g., Gmail, Outlook)
    auth: {
        user:'abdillaahiisse@hotmail.com', // Your email address from .env
        pass:'Oleksander zinchenko'  // Your email password or app-specific password from .env
    }
});

// POST route to send an email
router.post('/send', async (req, res) => {
    const { to, subject, message } = req.body;

    // Set up email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,           // Recipient's email
        subject,      // Subject of the email
        text: message // Email message content
    };

    try {
        // Send email using Nodemailer
        await transporter.sendMail(mailOptions);

        // Save email to database (optional)
        const email = new Email({ to, subject, message });
        await email.save();

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error });
    }
});

module.exports = router;
