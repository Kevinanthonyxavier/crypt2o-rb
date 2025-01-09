'use client'

import { motion, useAnimation } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { Variants } from 'framer-motion';


export default function Hero() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

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
  }

  const taglineWords = ["Secure,", "Fast,", "and", "Innovative", "Cryptocurrency", "Banking"]

  const getStartedVariants: Variants = {
    initial: {
      rotateX: 0,
      transition: {
        duration: 0.5,
      },
    },
    animate: {
      rotateX: [0, 180, 0], // Example of a rotation animation
      transition: {
        delay: 0,
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <section ref={ref} className="pt-32 pb-20 px-4 relative">
      <motion.div
        className="container mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Welcome to Crypto-Bank
        </motion.h1>
        <motion.div
          variants={itemVariants}
          className="text-xl md:text-2xl mb-8 text-gray-300 h-24"
        >
          {taglineWords.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              transition={{ delay: index * 0.5, duration: 0.5 }}
              className="inline-block mr-2"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
        <motion.div variants={itemVariants} className="space-x-4">
          <motion.div
            className="inline-block perspective-1000"
            initial={{ opacity: 0 }}
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            transition={{ delay: 3.5, duration: 0.5 }}
          >
                          <motion.div
                variants={getStartedVariants}
                initial="initial" // Set the initial state
                animate="animate" // Set the animate state
                className="inline-block"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 absolute inset-0"
                  style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
                >
                  Get Started
                </Button>
              </motion.div>
          </motion.div>
          <motion.div
            className="inline-block perspective-1000"
            initial={{ opacity: 0 }}
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            transition={{ delay: 3.7, duration: 0.5 }}
          >
            <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105">
              Register
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      <AnimatedBackground />
    </section>
  )
}

function AnimatedBackground() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="absolute inset-0 z-0"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      ></motion.div>
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute top-40 right-10 w-20 h-20 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      ></motion.div>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute bottom-20 left-1/2 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      ></motion.div>
    </motion.div>
  )
}

