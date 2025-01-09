'use client'

import { motion, useAnimation } from 'framer-motion'
import { Shield, Zap, Coins, Globe, Brain, Sparkles } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

const features = [
  {
    icon: <Shield className="h-8 w-8 text-purple-400" />,
    title: 'Secure Storage',
    description: 'Your assets are protected by state-of-the-art security measures.'
  },
  {
    icon: <Zap className="h-8 w-8 text-yellow-400" />,
    title: 'Instant Transactions',
    description: 'Send and receive cryptocurrencies in seconds, not hours.'
  },
  {
    icon: <Coins className="h-8 w-8 text-pink-400" />,
    title: 'Multi-Currency Support',
    description: 'Store and manage a wide range of cryptocurrencies in one place.'
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-400" />,
    title: 'Global Access',
    description: 'Access your funds from anywhere in the world, anytime.'
  },
  {
    icon: <Brain className="h-8 w-8 text-green-400" />,
    title: 'AI at Your Service',
    description: 'State-of-the-art AI for trading and recovery services with 93% accuracy.'
  },
  {
    icon: <Sparkles className="h-8 w-8 text-amber-400" />,
    title: 'Early-Stage Crypto Access',
    description: 'Get access to promising early-stage cryptocurrencies, carefully vetted for potential growth.'
  },
]

export default function Features() {
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

  return (
    <section id="features" ref={ref} className="py-20 px-4 bg-gray-800 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Our Features
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 25px rgba(168, 85, 247, 0.4)",
                transition: { duration: 0.3 }
              }}
              className="bg-gray-700 p-6 rounded-lg transition-all duration-300"
            >
              <motion.div 
                className="mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={controls}
                variants={{
                  hidden: { scale: 0, rotate: -180 },
                  visible: { scale: 1, rotate: 0 }
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.3 + index * 0.1 
                }}
              >
                {feature.icon}
              </motion.div>
              <motion.h3 
                className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                initial={{ opacity: 0, x: -20 }}
                animate={controls}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                {feature.title}
              </motion.h3>
              <motion.p 
                className="text-gray-300"
                initial={{ opacity: 0 }}
                animate={controls}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <AnimatedBackground />
    </section>
  )
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
      ></motion.div>
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
        className="absolute top-40 right-10 w-20 h-20 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl"
      ></motion.div>
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute bottom-10 left-1/2 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl"
      ></motion.div>
    </div>
  )
}

