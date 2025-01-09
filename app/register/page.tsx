'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { motion,  } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeOff, Eye,  } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
//import { FirebaseError } from "@/lib/firebase"; // Adjust the import path as necessary
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // Animated Number Component
// const AnimatedNumber = ({ value }: { value: number }) => {
//   const springValue = useSpring(value, { stiffness: 100, damping: 30 });
//   const ref = useRef<HTMLSpanElement>(null);

//   useEffect(() => {
//     const unsubscribe = springValue.onChange(latest => {
//       if (ref.current) {
//         ref.current.textContent = latest.toFixed(2);
//       }
//     });
//     return () => unsubscribe();
//   }, [springValue]);

//   return <span ref={ref}>{value.toFixed(2)}</span>;
// };



// Particle Background Component
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext ('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const logoUrls = 
      [
        'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=035',
      ];

    const logos: HTMLImageElement[] = [];
    let loadedLogos = 0;

    logoUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedLogos++;
        if (loadedLogos === logoUrls.length) {
          initParticles();
        }
      };
      logos.push(img);
    });

    const particles: Particle[] = [];
    const particleCount = 50;

    class Particle {
      x: number;
      y: number;
      speed: number;
      logo: HTMLImageElement;
      private canvas: HTMLCanvasElement;
      private ctx: CanvasRenderingContext2D;

      constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, logos: HTMLImageElement[]) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.speed = 1 + Math.random();
        this.logo = logos[Math.floor(Math.random() * logos.length)];
      }

      update() {
        this.y += this.speed;
        if (this.y > this.canvas.height) {
          this.y = -32;
          this.x = Math.random() * this.canvas.width;
        }
      }

      draw() {
        this.ctx.globalAlpha = 0.7;
        this.ctx.drawImage(this.logo, this.x, this.y, 32, 32);
      }
    }

    const initParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas, ctx, logos));
      }
      animate();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};
// // Animated Text Component
// const AnimatedText = ({ text }: { text: string }) => {
//   const letters = Array.from(text);

//   const container = {
//     hidden: { opacity: 0 },
//     visible: (i = 1) => ({
//       opacity: 1,
//       transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
//     }),
//   };

//   const child = {
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         damping: 12,
//         stiffness: 200,
//       },
//     },
//     hidden: {
//       opacity: 0,
//       y: 20,
//       transition: {
//         type: "spring",
//         damping: 12,
//         stiffness: 200,
//       },
//     },
//   };

//   return (
//     <motion.h1 
//       className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-center"
//       variants={container}
//       initial="hidden"
//       animate="visible"
//     >
//       {letters.map((letter, index) => (
//         <motion.span
//           key={index}
//           variants={child}
//           className="inline-block"
//         >
//           {letter === " " ? "\u00A0" : letter}
//         </motion.span>
//       ))}
//     </motion.h1>
//   );
// };
///////////
const RegisterPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();


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

  const [isLoading, setIsLoading] = useState(false);
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
        // Create a new user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          registerForm.email,
          registerForm.password
        );
    
        const user = userCredential.user;
    
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
          isVerified: false,
          createdAt: serverTimestamp(),
        });
    
        console.log("User registered successfully:", userCredential);
    
        // Show success notification
        toast({
          title: "Registration Successful",
          description: `Welcome to Crypto-Bank, ${registerForm.firstName}!`,
          variant: "default",
        });
    
        // Redirect to the dashboard
        router.push('/dashboard');
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Check if we can safely access the 'code' property
          const errorCode = (error as { code?: string }).code;
      
          // Handle Firebase-specific error codes
          switch (errorCode) {
            case 'auth/email-already-in-use':
              setErrorMessage('This email is already in use. Please use a different email.');
              break;
            case 'auth/weak-password':
              setErrorMessage('The password is too weak. Please use a stronger password.');
              break;
            case 'auth/invalid-email':
              setErrorMessage('The provided email is invalid. Please check your input.');
              break;
            default:
              setErrorMessage('An error occurred during registration. Please try again.');
              break;
          }
       
      
        } else {
          setErrorMessage('An unknown error occurred. Please try again.');
        }
    
        console.error("Error registering user:", error);
      } finally {
        setIsLoading(false); // Ensure loading state ends
      }
    };
    

  ////
  

  return (

    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <ParticleBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        
        <Card className="w-[400px] bg-black bg-opacity-30 backdrop-blur-md bg-gray-900/75 border-b border-blue-500/20">
          <CardHeader className="text-center">
            <CardTitle 
              className="text-3xl font-bold mb-2 bg-clip-text text-purple-500"
            >
              Crypto-Bank
            </CardTitle>
            <CardDescription className="text-white text-opacity-80">
              Create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4 text-white">
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
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
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

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;