'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Benefits from '@/components/Benefits'
import InterestCalculator from '@/components/InterestCalculator'
import AboutUs from '@/components/AboutUs'
import Footer from '@/components/Footer'
import { ToastContainer } from '@/utils/toast'
import { useEffect, useRef } from 'react'

//import { useEffect, useRef } from 'react'

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



export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white ">
      <ParticleBackground /> 
     
      <div className="relative z-20">
        <Header />
        <ToastContainer />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <Features />
          <Benefits />
          <InterestCalculator />
          <AboutUs />
        </motion.main>
        <Footer />
      </div>
    </div>
  )
}

