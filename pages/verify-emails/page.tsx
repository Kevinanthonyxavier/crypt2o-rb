import React, { useState } from "react";
import { auth } from "@/lib/firebase"; // Adjust import path for your Firebase setup
import { sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button"; // Adjust import path for your Button component
import { toast } from "@/components/ui/use-toast"; // Adjust import path for your toast library

const VerifyEmail = () => {
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const resendVerificationEmail = async () => {
    setIsSending(true);

    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        toast({
          title: "Verification Email Sent",
          description: `A new verification email has been sent to ${auth.currentUser.email}. Please check your inbox.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "No authenticated user found. Please log in again.",
          variant: "destructive",
        });
        router.push("/login"); // Redirect to login if no user is logged in
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
      <p className="text-center mb-6">
        We’ve sent a verification email to your inbox. Please check your email and click the verification link to
        activate your account.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={resendVerificationEmail} disabled={isSending}>
          {isSending ? "Sending..." : "Resend Verification Email"}
        </Button>
        <Button variant="secondary" onClick={() => router.push("/login")}>
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
