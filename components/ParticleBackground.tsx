'use client'
import { useCallback } from 'react';
import { Particles } from '@tsparticles/react';


export default function ParticleBackground() {
  const particlesLoaded = useCallback(async () => {
    console.log('Particles Loaded');
  }, []);


  return (
    <Particles
    id="tsparticles"
    particlesLoaded={particlesLoaded} // Replace init logic here
    options={{
      background: {
        color: { value: 'transparent' },
      },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
            resize: {
              enable: true, // Fix: Use correct structure for resize
            },
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 200, duration: 0.4 },
          },
        },
        particles: {
          color: { value: "#ffffff" },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            outModes: { default: "bounce" },
          },
          number: {
            density: {
              enable: true,
              width: 800,   // Replace "area" with "width"
              height: 800,  // You can specify height too
            },
            value: 80,
          },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 5 } },
        },
        detectRetina: true,
      }}
    />
  )
}
