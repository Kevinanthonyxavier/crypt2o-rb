import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  try {
    // Store OTP in Firestore
    const userId = email.split("@")[0]; // Example userId derived from email
    await setDoc(doc(db, "otps", userId), { otp, expiresAt });

    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // Use true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Crypto-Bank",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    // Respond with the userId (you may choose to respond with a success message instead)
    res.status(200).json({ userId });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
}
