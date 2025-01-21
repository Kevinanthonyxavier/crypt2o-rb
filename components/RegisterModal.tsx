'use client'

import React, { useState, FormEvent, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


import { EyeOff, Eye,  } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
//import { FirebaseError } from "@/lib/firebase"; // Adjust the import path as necessary
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Switch } from '@/components/ui/switch';
//
import axios from 'axios';

import { sendEmailVerification } from "firebase/auth";








interface RegisterModalProps {
  isOpen: boolean
  
  onClose: () => void
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  // const [firstName, ] = useState('')
  // const [lastName, ] = useState('')
  // const [email, ] = useState('')
  // const [countryCode, ] = useState('')
  // const [phoneNumber, ] = useState('')
  // const [currency, ] = useState('')
  // const [country, ] = useState('')
  // const [password, ] = useState('')
  //const [confirmPassword, ] = useState('')
  const [showOtpInput, ] = useState(false)
  const [otp, setOtp] = useState('')
 

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (!showOtpInput) {
  //     // Simulate sending OTP
  //     console.log('Registration submitted', { firstName, lastName, email, countryCode, phoneNumber, currency, country, password })
  //     setShowOtpInput(true)
  //   } else {
  //     // Handle OTP verification
  //     console.log('Verifying OTP', otp)
  //     // Add your OTP verification logic here
  //     onClose()
  //   }
  // }


  ////////////
  const { toast } = useToast();
  const router = useRouter();
  //const [, setIpAddress] = useState('');

  const [, setIpAddress] = useState<string | null>(null);
  const [, setLocation] = useState<{
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true; // To prevent state updates if the component unmounts

    const fetchIpData = async () => {
      try {
        const response = await axios.get('https://ipwhois.app/json/');
        if (isMounted && response.data) {
          const { ip, country, region, city, latitude, longitude } = response.data;
          setIpAddress(ip);
          setLocation({ country, region, city, latitude, longitude });
        }
      } catch (error) {
        console.error('Error fetching IP data:', error);
      }
    };

    fetchIpData();

    return () => {
      isMounted = false; // Cleanup function to avoid memory leaks
    };
  }, []);


  // useEffect(() => {
  //   // Fetch IP address
  //   const fetchIpAddress = async () => {
  //     try {
  //       const response = await axios.get('https://api.ipify.org?format=json');
  //       setIpAddress(response.data.ip);
  //     } catch (error) {
  //       console.error('Error fetching IP address:', error);
  //     }
  //   };

  //   fetchIpAddress();
  // }, []);


  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currency: '',
    country: '',
    language: '',
    countryCode: '',
    password: '',
    confirmPassword: '',
    notifications: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    countryCode?: string;
    phone?: string;
    currency?: string;
    country?: string;
    language?: string;
    password?: string;
    confirmPassword?: string;
    notifications?: boolean;

  }>({});

  const validateForm = (): boolean => {
    const errors: Partial<typeof registerForm> = {};

    if (!registerForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!registerForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!registerForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = 'Invalid email format';
    }

    if (!registerForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(registerForm.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (!registerForm.currency.trim()) {
      errors.currency = 'Currency is required';
    }

    if (!registerForm.country.trim()) {
      errors.country = 'Country is required';
    }
    if (!registerForm.language.trim()) {
      errors.language = 'Language is required';
    }
    if (!registerForm.password.trim()) {
      errors.password = 'password is required';
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    // Add other validation checks as needed...

   

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

    // Proceed with registration logic if no errors
    console.log("Registering user:", registerForm);

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
      // Clear previous error messages
      setErrorMessage('');
      
      if (!validateForm()) return;
    
      setIsLoading(true);
    
      try {
    //     const ipResponse = await axios.get('https://api.ipify.org?format=json');
    // const ipAddress = ipResponse.data.ip;

    // // Fetch the location based on IP address
    // const locationResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    // const { country, regionName, city, lat, lon } = locationResponse.data;

    // Fetch the user's IP address
    const ipResponse = await axios.get('https://api.ipify.org?format=json');
    const ipAddress = ipResponse.data.ip;

    // Fetch the location based on the IP address using ipwhois.io
    const locationResponse = await axios.get(`https://ipwhois.app/json/${ipAddress}`);
    const { country, region, city, latitude, longitude } = locationResponse.data;

   
        // Create a new user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          registerForm.email,
          registerForm.password
        );
    
        const user = userCredential.user;

        // Send verification email
    await sendEmailVerification(user);
    
        // Update the user's profile to include their full name
        await updateProfile(user, {
          displayName: `${registerForm.firstName} ${registerForm.lastName}`,
        });
    
        // Save additional user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: `${registerForm.firstName} ${registerForm.lastName}`,
          email: registerForm.email,
          phone: registerForm.phone,
          currency: registerForm.currency,
          country: registerForm.country,
          language: registerForm.language || 'en', // Provide a default value for language
          notifications: registerForm.notifications,
          totalBalance: 0,
          btc: 0,
          eth: 0,
          rec: 0,
          usdt: 0,
          doge: 0,
          isVerified: false,
          hideVerification: false,
          popupVerification: false,
          createdAt: serverTimestamp(),
          ipAddress: ipAddress || 'Unknown', // Fallback for IP address
          location: {
            country: country || 'Unknown',
            region: region || 'Unknown',
            city: city || 'Unknown',
            latitude: latitude || 0,
            longitude: longitude || 0,
          },
        });
    
        console.log("User registered successfully:", userCredential);
    
        // Show success notification
        toast({
          title: "Registration Successful",
          description: `Verification email sent to ${registerForm.email}. Please verify your email before logging in.`,
          variant: "default",
        });
    
        // Redirect to the dashboard
        router.push("/verify-email");
      } catch (error: unknown) {
        if (error instanceof Error && "code" in error) {
          // Define a type guard to check for a Firebase error
          type FirebaseError = Error & { code: string };
      
          const firebaseError = error as FirebaseError;
      
          // Handle Firebase-specific error codes
          switch (firebaseError.code) {
            case "auth/email-already-in-use":
              setErrorMessage("This email is already in use. Please use a different email.");
              break;
            case "auth/weak-password":
              setErrorMessage("The password is too weak. Please use a stronger password.");
              break;
            case "auth/invalid-email":
              setErrorMessage("The provided email is invalid. Please check your input.");
              break;
            default:
              setErrorMessage("An error occurred during registration. Please try again.");
              break;
          }
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      
      
    
        console.error("Error registering user:", error);
      } finally {
        setIsLoading(false); // Ensure loading state ends
      }
    };
///

  return (
<div>
    
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white max-h-screen overflow-y-auto">
        
        <DialogHeader>
          
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {showOtpInput ? 'Verify Your Email' : 'Create a Crypt2o.com Account'}
          </DialogTitle>
        </DialogHeader>
        {/* <form onSubmit={handleSubmit} className="space-y-4"> */}

        <form onSubmit={handleRegister} className="space-y-4 text-white">
          {!showOtpInput ? (
            <>
              {/* First Name Field */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                  className={`bg-white bg-opacity-10 border-white border-opacity-20 ${formErrors.firstName ? 'border-red-500' : ''}`}
                />
                {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  className={`bg-white bg-opacity-10 border-white border-opacity-20 ${formErrors.lastName ? 'border-red-500' : ''}`}
                />
                {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className={`bg-white bg-opacity-10 border-white border-opacity-20 ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
              </div>

              <div className="space-y-2">
  <Label htmlFor="phone" className="text-white">Phone</Label>
  <div className="flex items-center space-x-2">
    {/* Country Code Input */}
    <div className="relative">
      <Input
        id="countryCode"
        type="text"
        placeholder="+1" // Example placeholder for country code
        maxLength={3}
        className="w-24 bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder-white/50"
        // You might want to manage the country code in your state if needed
        // value={registerForm.countryCode}
         onChange={(e) => setRegisterForm({ ...registerForm, countryCode: e.target.value })}
      />
    </div>
    
    {/* Phone Number Input */}
    <Input
      id="phone"
      type="text"
      placeholder="Enter your phone number"
      value={registerForm.phone}
      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
      className={`bg-white bg-opacity-10 border-white border-opacity-20 ${formErrors.phone ? 'border-red-500' : ''}`}
    />
  </div>
  {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
</div>

              <div className="space-y-2">
      <label htmlFor="currency" className="text-white">
        Currency
      </label>
      <div
        className={`bg-white bg-opacity-10 border-white border-opacity-20 ${
          formErrors.currency ? "border-red-500" : ""
        }`}
      >
        <Select
          value={registerForm.currency}
          onValueChange={(value: string) => {
            setRegisterForm({ ...registerForm, currency: value });
            // Clear error when a valid selection is made
            if (value) {
              setFormErrors((prev) => ({ ...prev, currency: undefined }));
            }
          }}
        >
          <SelectTrigger
            id="currency"
            className="bg-white bg-opacity-10 border-white border-opacity-20"
          >
            <SelectValue placeholder="Select your currency" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
                    <SelectItem value="aud">AUD</SelectItem>
                    <SelectItem value="cad">CAD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="sgd">SGD</SelectItem>
                    <SelectItem value="aed">AED</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formErrors.currency && (
        <p className="text-red-500 text-sm">{formErrors.currency}</p>
      )}
    </div>

<div className="space-y-2">
  <Label htmlFor="country" className="text-white">Country</Label>
  <div className={`bg-white bg-opacity-10 border-white border-opacity-20 ${formErrors.country ? 'border-red-500' : ''}`}>
    <Select
      value={registerForm.country}
      onValueChange={(value) => setRegisterForm({ ...registerForm, country: value })}
    >
      <SelectTrigger className="bg-white bg-opacity-10 border-white border-opacity-20">
        <SelectValue placeholder="Select your country" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 text-white">
        {/* Add options for countries */}
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
        {/* Add more countries as needed */}
      </SelectContent>
    </Select>
  </div>
  {formErrors.country && <p className="text-red-500 text-sm">{formErrors.country}</p>}
</div>      

<div className="space-y-2">
  <Label htmlFor="language" className="text-white">Language</Label>
  <div className={`bg-white bg-opacity-10 border-white border-opacity-20 ${formErrors.language ? 'border-red-500' : ''}`}>
    <Select
      value={registerForm.language}
      onValueChange={(value) => setRegisterForm({ ...registerForm, language: value })}
    >
      <SelectTrigger className="bg-white bg-opacity-10 border-white border-opacity-20">
        <SelectValue placeholder="Select your language" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 text-white">
        {/* Add options for countries */}
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
        {/* Add more countries as needed */}
      </SelectContent>
    </Select>
  </div>
  {formErrors.language && <p className="text-red-500 text-sm">{formErrors.language}</p>}
</div> 

                  {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            className={`bg-white bg-opacity-10 border-white border-opacity-20 ${formErrors.password ? 'border-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={registerForm.confirmPassword}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            className={`bg-white bg-opacity-10 border-white border-opacity-20 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
      </div>
               {/* Notifications Switch */}
               <div className="flex items-center space-x-2 ">
                <Switch
                  id="profile-notifications"
                  checked={registerForm.notifications}
                  onCheckedChange={(checked) => setRegisterForm({ ...registerForm, notifications: checked })}
                />
                <Label htmlFor="profile-notifications">Receive email notifications</Label>
              </div>
{/* Error Message Display */}
{errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Pin</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter the OTP sent to your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <p className="text-sm text-gray-400">
                If you don&apos;t see the email in your inbox, please check your spam or junk folder.
              </p>
            </>
          )}
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            {showOtpInput ? 'Verify OTP' : 'Register'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  )
}