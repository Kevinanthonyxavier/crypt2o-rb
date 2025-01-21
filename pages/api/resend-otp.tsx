import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
   // Configure your email transport for Hostinger
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 60000, // Increase timeout (60 seconds)
  });
  
  
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your New OTP for Crypt2o.com',
        text: `Your new OTP is: ${otp}. It will expire in 5 minutes.`,
      });
  
      res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
    }
  }
  