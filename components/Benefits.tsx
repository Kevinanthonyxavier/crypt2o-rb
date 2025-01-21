'use client'

import { motion, useAnimation } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

const benefits = [
  'Low transaction fees',
  'High-interest savings accounts',
  'Advanced trading tools',
  '24/7 customer support',
  'Mobile app for on-the-go banking',
  'Regular security audits'
]

export default function Benefits() {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  return (
    <section id="benefits" ref={ref} className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Why Choose Crypt2o.com?
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-gray-800 p-4 rounded-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={controls}
                variants={{
                  hidden: { scale: 0 },
                  visible: { scale: 1 }
                }}
                transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
              >
                <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              </motion.div>
              <span className="text-gray-200">{benefit}</span>
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
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"
      ></motion.div>
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute bottom-40 left-10 w-20 h-20 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"
      ></motion.div>
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute bottom-10 right-1/2 w-20 h-20 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"
      ></motion.div>
    </div>
  )
}

