require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const otpStore = {}; // Store OTPs temporarily

// Configure your email transport for Hostinger
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Hostinger's SMTP server
  port: 465, // Use 465 for SSL or 587 for TLS
  secure: false, // Set to true if using SSL
  auth: {
    user: process.env.EMAIL_USER, // Your Hostinger email address
    pass: process.env.EMAIL_PASSWORD, // Your Hostinger email password
  },
});

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  const mailOptions = {
    from: process.env.EMAIL_USER, // Your Hostinger email
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. This code will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Store OTP with expiry
    res.status(200).send('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).send('Error sending OTP');
  }
});

// Endpoint for OTP verification
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send('Email and OTP are required');
  }

  const storedOtp = otpStore[email];

  if (!storedOtp) {
    return res.status(400).send('No OTP found for this email');
  }

  if (storedOtp.expires < Date.now()) {
    delete otpStore[email];
    return res.status(400).send('OTP has expired');
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).send('Invalid OTP');
  }

  // OTP is valid
  delete otpStore[email]; // Remove OTP after successful verification
  res.status(200).send('OTP verified successfully');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
