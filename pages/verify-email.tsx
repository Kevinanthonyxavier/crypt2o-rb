'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import '@/app/globals.css';
import LoginModal from '@/components/LoginModal';


const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // Function to resend the verification email
  const resendVerificationEmail = async () => {
    setIsSending(true);

    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to resend verification email. Please try again.');
      }

      toast({
        title: 'Verification Email Sent',
        description: 'A new verification email has been sent to your inbox.',
        variant: 'default',
      });
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: error.message || 'Something went wrong.',
          variant: 'destructive',
        });
      } else {
        // Handle cases where error is not an instance of Error
        toast({
          title: 'Error',
          description: 'Something went wrong.',
          variant: 'destructive',
        });
      }
    }
    finally {
      setIsSending(false);
    }
  };

 
  
    const redirectToGmail = () => {
      window.open("https://mail.google.com", "_blank"); // Opens Gmail in a new tab
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] bg-black bg-opacity-30 backdrop-blur-lg border-white border-opacity-20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Verify Your Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-white mb-6">
              We’ve sent a verification email to your inbox. Please check your email and click the verification link to
              activate your account.
            </p>
            <div className="flex flex-row items-center gap-6 w-full">
              <Button onClick={resendVerificationEmail} disabled={isSending} className="flex-2  bg-orange-400">
                {isSending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              <Button 
  variant="secondary"
  onClick={() => {
   // setIsLoginModalOpen(true); // Open the login modal
     router.push("/login"); // Navigate to "/"
  }}
  className="bg-purple-600 hover:bg-purple-700"
>
  Back to Login
</Button>

{/* Login Modal Component */}
{isLoginModalOpen && (
  <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
)}
            </div>
            
     

               <div className="flex flex-row items-center h-16 gap-6 w-full">
      <Button
        onClick={redirectToGmail}
        className="flex flex-row items-center justify-center gap-2 flex-1 bg-white text-black border border-gray-300 hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 48 48"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C34.8 2.5 29.7 0 24 0 14.9 0 7.1 5.2 3.4 12.8l7.9 6.1C13.2 12 18.1 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M47.5 24c0-1.6-.2-3.2-.6-4.7H24v9.4h13.2c-.6 3-2.5 5.6-5.3 7.3l8.1 6.3c4.6-4.2 7.5-10.4 7.5-18.3z"
          />
          <path
            fill="#4A90E2"
            d="M9.3 24c0-1.5.3-3 .8-4.3l-8-6.1C.7 16.1 0 19.9 0 24s.7 7.9 2.1 11.4l8-6.1c-.5-1.3-.8-2.8-.8-4.3z"
          />
          <path
            fill="#FBBC05"
            d="M24 48c6.5 0 12-2.1 16.1-5.7l-8.1-6.3c-2.2 1.5-5.1 2.4-8 2.4-5.7 0-10.5-3.6-12.2-8.6l-8.1 6.3C7.1 42.9 14.8 48 24 48z"
          />
        </svg>
        Open Gmail
      </Button>
    </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
