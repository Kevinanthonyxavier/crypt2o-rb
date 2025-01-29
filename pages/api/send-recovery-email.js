// pages/api/send-recovery-email.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, details } = req.body;

  // Nodemailer transport setup
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: "letsmailkevin@gmail.com", // Replace with your support email
    subject: `Crypto Recovery Request from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Recovery Details:
      ${details}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
}
