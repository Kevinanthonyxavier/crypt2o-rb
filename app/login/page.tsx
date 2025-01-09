'use client';

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { showToast } from '@/utils/toast';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header'
import { TriangleAlert   } from  'lucide-react';




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
      'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=035',
      'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=035',
      'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg?v=035',
      'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=035',
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

///////////

const LoginPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  //const [otp, setOtp] = useState('');
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Login error:', err);
        setError(err.message);
    
        toast({
          title: 'Login Failed',
          description: err.message || 'Unable to log in. Please try again.',
          variant: 'destructive',
        });
      } else {
        console.error('Unexpected error:', err);
        toast({
          title: 'Login Failed',
          description: 'An unexpected error occurred. Please try again.',
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
        description: 'Welcome to Crypto-Bank!',
        variant: 'default',
      });
  
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Invalid OTP.';
      setError(errorMessage);
    
      console.error('OTP verification error:', err);
    
      toast({
        title: 'OTP Verification Failed',
        description: errorMessage,
        variant: 'destructive',
      });
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to resend OTP.';
      
      toast({
        title: 'Resend Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
      <ParticleBackground />
      
     
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] bg-black bg-opacity-30 backdrop-blur-lg border-white border-opacity-20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Crypto-Bank
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isOtpStage ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Log In'}
                </Button>
              </form>
            ) : (

              <div className="space-y-4">
  <Label htmlFor="otp" className="text-white">
    Enter OTP
  </Label>
  <div className="flex justify-center space-x-2">
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </div>
  );
};

export default LoginPage;
