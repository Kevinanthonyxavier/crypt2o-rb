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
      subject: `Your OTP for Crypt2o.com is: ${otp}`,
      // text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      html: `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background: #0d0d0d; color: #ffffff; text-align: center; padding: 40px;">
    <table align="center" width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
                <table width="400" cellspacing="0" cellpadding="20" style="background:rgb(46, 16, 128); border-radius: 10px; text-align: center;">
                    <tr>
                        <td>
                            <a href="https://crypt2o.com/" style="color: #AB47BC; font-size: 38px; font-weight: bold; text-decoration: none;">
                                Crypt2o.com
                            </a>
                            <h1 style="color:rgb(255, 255, 255);">OTP Login Request</h1>
                            <p><strong style="color:rgb(206, 193, 193);">Your OTP code is:</strong></p>
                            <p style="font-size: 34px; font-weight: bold; color: #AB47BC;">${otp}</p>
                            <p style="color: #cccccc;">Use this code to verify your account. It expires in 5 minutes.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

      `,
    });

    // Respond with the userId (you may choose to respond with a success message instead)
    res.status(200).json({ userId });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
}
