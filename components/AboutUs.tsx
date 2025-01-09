'use client';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

interface CountProps {
  end?: number;
  start?: number;
  prefix?: string;
  suffix?: string;
}

function CountUp({ end = 0, prefix = '', suffix = '' }: CountProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < 2000) {
        setCount(Math.min(end, Math.floor((progress / 2000) * end)));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end]);

  return (
    <span aria-live="polite">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

function CountDown({ start = 0, end = 0, prefix = '', suffix = '' }: CountProps) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < 2000) {
        setCount(Math.max(end, start - Math.floor((progress / 2000) * (start - end))));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [start, end]);

  return (
    <span aria-live="polite">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function AboutUs() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section id="about" ref={ref} className="py-20 px-4 bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <motion.div variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          >
            About Crypto-Bank
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
            Crypto-Bank is at the forefront of the digital finance revolution. Founded in 2023, we&apos;ve quickly become a trusted name in cryptocurrency banking, offering innovative solutions for the modern investor.
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
            Our mission is to make cryptocurrency accessible, secure, and beneficial for everyone. We combine cutting-edge blockchain technology with user-friendly interfaces to provide a seamless banking experience.
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg mb-6 text-gray-300">
            With a team of experts in finance, technology, and cybersecurity, we&apos;re committed to pushing the boundaries of what&apos;s possible in digital banking while ensuring the utmost security for our clients assets.
          </motion.p>
          <motion.div variants={containerVariants} className="flex justify-center space-x-4">
            <motion.div variants={statVariants} className="bg-gray-800 p-6 rounded-lg">
              <motion.h3 
                className="text-3xl font-bold mb-2 text-purple-400"
                key={inView ? 'visible' : 'hidden'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {inView && <CountDown start={150} end={100} suffix="k+" />}
              </motion.h3>
              <p className="text-gray-400 text-lg">Active Users</p>
            </motion.div>
            <motion.div variants={statVariants} className="bg-gray-800 p-6 rounded-lg">
              <motion.h3 
                className="text-3xl font-bold mb-2 text-purple-400"
                key={inView ? 'visible' : 'hidden'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {inView && <CountUp end={500} prefix="$" suffix="M+" />}
              </motion.h3>
              <p className="text-gray-400 text-lg">Assets Managed</p>
            </motion.div>
            <motion.div variants={statVariants} className="bg-gray-800 p-6 rounded-lg">
              <motion.h3 
                className="text-3xl font-bold mb-2 text-purple-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                24/7
              </motion.h3>
              <p className="text-gray-400 text-lg">Support</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <AnimatedBackground />
    </section>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-30">
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"
      />
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute top-40 right-10 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl"
      />
    </div>
  );
}