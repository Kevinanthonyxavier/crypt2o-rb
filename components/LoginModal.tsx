'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Checkbox from '@/components/ui/checkbox';
import { EyeIcon, EyeOffIcon, TriangleAlert } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { showToast } from '@/utils/toast';
//import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';

import {  useUser } from '@/contexts/UserContext';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';


export interface User {
  uid: string;
  email: string | null; // Allow null
  displayName: string | null;
  photoURL: string | null;
}





interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  useUser(); // Import useUser() to manage user state

  
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
  //const { toast } = useToast();
  //forgotpassword
  const [isForgotPassword, setIsForgotPassword] = useState(false); // New state for forgot password

// Forgot Password Handler
const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await sendPasswordResetEmail(auth, loginForm.email);
    showToast({
      title: 'Password Reset Email Sent',
      description: 'Check your email for the password reset link.',
      variant: 'default',
    });
    setIsForgotPassword(false); // Close forgot password dialog
  } catch (error) {
    console.error('Error sending password reset email:', error);
    showToast({
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

  const redirectToVerifyEmail = () => {
    setTimeout(() => {
      router.push("/verify-email");
    }, 3000);
  };

  // const validateForm = () => {
  //   if (!loginForm.email || !loginForm.password) {
  //     setError("Email and Password are required.");
  //     return false;
  //   }
  //   return true;
  // };
  
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        showToast({
          title: "Email Not Verified",
          description: "Please verify your email address before logging in.",
          variant: "error",
        });
  
        redirectToVerifyEmail();
        return;
      }
  
      // export interface User {
      //   uid: string;
      //   email: string | null; // Allow null
      //   displayName: string | null;
      //   photoURL: string | null;
      // }
      
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send OTP. Please try again.");
      }
  
      const data = await response.json();
      setUserId(data.userId);
  
      showToast({
        title: "OTP Sent",
        description: "An OTP has been sent to your email. Please enter it below.",
        variant: "default",
      });
  
      setIsOtpStage(true);
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred.");
      showToast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Unable to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d$/.test(value) && value !== "") return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      const nextInput = document.querySelector<HTMLInputElement>(`input[data-index="${index + 1}"]`);
      nextInput?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector<HTMLInputElement>(`input[data-index="${index - 1}"]`);
      prevInput?.focus();
    }
  };




  const handleVerifyOtp = useCallback(async () => {
    if (otp.join("").length < 6) {
      setError("Please enter a complete OTP.");
      return;
    }
    if (!userId) {
      setError("User ID is missing.");
      return;
    }
  
    console.log("User ID:", userId); // Debugging
    setIsLoading(true);

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: otp.join("") }),
      });

      if (!response.ok) throw new Error("Invalid OTP. Please try again.");

      // ✅ Update lastLogin in Firestore
    const userRef = doc(db, "lastlogin", userId);
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    console.log("Last login updated in Firestore"); // Debugging


      showToast({
        title: "Login Successful",
        description: "Welcome to Crypt2o.com!",
        variant: "default",
      });

      router.push("/dashboard?tab=token-pre-release");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "OTP verification failed.";
      setError(errorMessage);
      
      showToast({ title: "OTP Verification Failed", description: errorMessage, variant: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [otp, userId, router]); // Dependencies for the callback






  // useEffect to trigger OTP verification when the OTP is complete
  useEffect(() => {
    if (otp.join("").length === 6) {
      handleVerifyOtp();
    }
  }, [otp, handleVerifyOtp]); // Dependencies for useEffect
  

  const { user } = useUser(); // Get the user from context

  const handleResendOtp = async () => {
    const email = loginForm.email || user?.email;
    console.log("Sending OTP to:", email);
    // Use email from login form or user context
  
    if (!email) {
      showToast({
        title: "Resend Failed",
        description: "No email found. Please log in again.",
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log("Resend OTP Response:", data);
      if (!response.ok) throw new Error(data.message || "Failed to resend OTP.");
  
      showToast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
        variant: "default",
      });
    } catch (error) {
      console.error("Resend OTP Error:", error);

      const errorMessage = error instanceof Error ? error.message : "Resend failed.";
      showToast({ title: "Resend Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  ///////////

  // const [loginForm, setLoginForm] = useState({
      
  //     email: '',
      
  //     password: '',
      
  //   });
 const [formErrors, setFormErrors] = useState<{
   
    email?: string;
   
    password?: string;
   

  }>({});

  const validateForm = (): boolean => {
    const errors: Partial<typeof loginForm> = {};

   

    if (!loginForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      errors.email = 'Invalid email format';
    }

   
    if (!loginForm.password.trim()) {
      errors.password = 'password is required';
    }
     // Password regex check
     const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/; // At least one letter, one number, one special character, and at least 8 characters long
     if (loginForm.password && !passwordRegex.test(loginForm.password)) {
       errors.password = "Password must be at least 8 characters long and include a number and a special character.";
     }

    

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  //////////////

  return (
    <div id="login">

    
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
            
              // className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              className={`bg-white bg-opacity-10 border-white border-opacity-20 ${formErrors.email ? 'border-red-500' : ''}`}
            />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
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
                     
                      className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                        formErrors.password ? 'border-red-500' : ''
                      }`}
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
            {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
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
    disabled={isLoading}
    
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

<p className="text-sm text-red-500">Please check your Email</p>  
<Button
    onClick={handleVerifyOtp}
    className={`w-full ${otp.every((digit) => digit !== '') ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 cursor-not-allowed'}`}
    disabled={isLoading || otp.some((digit) => digit === '')} // Disable if OTP is incomplete
  >
    {isLoading ? 'Verifying...' : 'Verify OTP'}
  </Button>
            <Button onClick={handleResendOtp} className="mt-4 w-full" disabled={isLoading}>
            
              {isLoading ? 'Resending...' : 'Resend OTP'}
            </Button>
          </div>
          
        )}
      </DialogContent>
    </Dialog>
    </div>
  );
}
