import { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ error: "User ID and OTP are required." });
  }

  try {
    const otpDocRef = doc(db, "otps", userId);
    const otpDoc = await getDoc(otpDocRef);

    if (!otpDoc.exists()) {
      return res.status(400).json({ error: "OTP not found or already verified." });
    }

    const storedData = otpDoc.data();

    // Check if OTP has expired
    const expiresAt = storedData.expiresAt.toMillis ? storedData.expiresAt.toMillis() : storedData.expiresAt;

    if (expiresAt < Date.now()) {
      await deleteDoc(otpDocRef); // Cleanup expired OTP
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    // Validate OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    // Success: OTP matches
    await deleteDoc(otpDocRef); // Remove OTP after successful verification
    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}
