'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Checkbox from '@/components/ui/checkbox';
import { EyeIcon, EyeOffIcon, TriangleAlert } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { showToast } from '@/utils/toast';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';








interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  //
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  //const [otp, setOtp] = useState('');
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const { toast } = useToast();
  //forgotpassword
  const [isForgotPassword, setIsForgotPassword] = useState(false); // New state for forgot password

// Forgot Password Handler
const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await sendPasswordResetEmail(auth, loginForm.email);
    toast({
      title: 'Password Reset Email Sent',
      description: 'Check your email for the password reset link.',
      variant: 'default',
    });
    setIsForgotPassword(false); // Close forgot password dialog
  } catch (error) {
    console.error('Error sending password reset email:', error);
    toast({
      title: 'Error',
      description: 'Failed to send password reset email. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};



  //

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount or when error changes
    }
  }, [error]);


  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      const user = userCredential.user;
      

      if (!user.emailVerified) {
        // Redirect to the verify email page if the email is not verified
        showToast({
          title: 'Email Not Verified',
          description: 'Please verify your email address before logging in.',
          variant: 'destructive',
        });
        router.push('/verify-email'); // Redirect to the verification page
        return; // Early return to prevent further execution
      }

      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP. Please try again.');
      }

      const data = await response.json();
      setUserId(data.userId);

      toast({
        title: 'OTP Sent',
        description: 'An OTP has been sent to your email. Please enter it below.',
        variant: 'default',
      });

      setIsOtpStage(true);
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        console.error('Login error:', error);
        setError(error.message); // Safely access message property
    
        toast({
          title: 'Login Failed',
          description: error.message || 'Unable to log in. Please try again.',
          variant: 'destructive',
        });
      } else {
        // Handle the case where the error is not an instance of Error
        console.error('Login error:', error);
        setError('An unknown error occurred. Please try again.');
    
        toast({
          title: 'Login Failed',
          description: 'An unknown error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    }
    finally {
      setIsLoading(false);
    }
  };



  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
  
    if (!/^\d$/.test(value) && value !== '') return; // Allow only single digits
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
  
    // Automatically focus the next input
    if (value && index < 5) {
      const nextInput = document.querySelector<HTMLInputElement>(`input[data-index="${index + 1}"]`);
      nextInput?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move focus to the previous input
      const prevInput = document.querySelector<HTMLInputElement>(`input[data-index="${index - 1}"]`);
      prevInput?.focus();
    }
  };
  
  const handleVerifyOtp = async () => {
    if (otp.join('').length < 6) {
      setError('Please enter a complete OTP.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: otp.join('') }), // Convert OTP array to string
      });
  
      if (!response.ok) {
        throw new Error('Invalid OTP. Please try again.');
      }
  
      toast({
        title: 'Login Successful',
        description: 'Welcome to Crypt2o.com!',
        variant: 'default',
      });
  
      router.push('/dashboard?tab=token-pre-release');
    }catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        setError(error.message || 'Invalid OTP.');
        console.error('OTP verification error:', error);
      
        toast({
          title: 'OTP Verification Failed',
          description: error.message || 'Invalid OTP.',
          variant: 'destructive',
        });
      } else {
        // Handle the case where the error is not an instance of Error
        setError('Invalid OTP.'); // or any other default message you prefer
        console.error('OTP verification error:', error);
    
        toast({
          title: 'OTP Verification Failed',
          description: 'An unknown error occurred during OTP verification.',
          variant: 'destructive',
        });
      }
    }
    finally {
      setIsLoading(false);
    }
  };
  
  

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP. Please try again.');
      }

      toast({
        title: 'OTP Resent',
        description: 'A new OTP has been sent to your email.',
        variant: 'default',
      });
    }catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        toast({
          title: 'Resend Failed',
          description: error.message || 'Unable to resend OTP.',
          variant: 'destructive',
        });
      } else {
        // Handle the case where the error is not an instance of Error
        toast({
          title: 'Resend Failed',
          description: 'An unknown error occurred while trying to resend the OTP.',
          variant: 'destructive',
        });
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  

  return (
    
    <Dialog open={isOpen} onOpenChange={onClose}>
            

      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {isForgotPassword ? 'Forgot Password' : 'Login to Crypt2o.com'}

          </DialogTitle>
        </DialogHeader>
        {!isOtpStage ? (
          isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Label htmlFor="reset-email">Enter your email to reset password</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full bg-gray-600 hover:bg-gray-700"
              >
                Back to Login
              </Button>
            </form>
          ) : (
              <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
            <Input
                    id="password"
                    
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                     type={showPassword ? 'text' : 'password'}
                
                       required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked: boolean) => setRememberMe(checked)}
            />
            
          </div>
          <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-purple-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          {error && (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-red-500 text-sm flex items-center"
  >
    <TriangleAlert 
    className="w-4 h-4 mr-2" />
    Incorrect User ID or Password
  </motion.p>
)}
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700"
          disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Login'}
          </Button>
        
         
       </form>
          )
        )  : (

          <div className="space-y-4">
<Label htmlFor="otp" className="text-white">
Enter OTP
</Label>
<div className="text-purple-800 flex justify-center space-x-2">
{Array(6)
.fill(0)
.map((_, index) => (
  <input
    id="otp"
    key={index}
    type="text"
    maxLength={1}
    className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    value={otp[index] || ''}
    onChange={(e) => handleOtpChange(e, index)}
    onKeyDown={(e) => handleKeyDown(e, index)}
    data-index={index}

    
  />
))}</div>  
 {error && (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
className="flex flex-row items-center justify-center text-red-500 text-sm"
>
<TriangleAlert className="w-4 h-4 mb-1 mr-2" />
<p> Incorrect OTP</p>
</motion.div>
)}

        
            <Button onClick={handleVerifyOtp} className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <Button onClick={handleResendOtp} className="mt-4 w-full" disabled={isLoading}>
              {isLoading ? 'Resending...' : 'Resend OTP'}
            </Button>
          </div>
          
        )}
      </DialogContent>
    </Dialog>
  );
}
