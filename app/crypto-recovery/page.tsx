'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Shield, Key, RefreshCw, ChevronDown } from 'lucide-react'
import { useRef } from 'react'

export default function CryptoRecoveryPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

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

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10,
      },
    },
  }

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <motion.div
        ref={containerRef}
        className="container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity, scale }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          variants={itemVariants}
        >
          Crypto Recovery Services
        </motion.h1>
        
        <motion.p
          className="text-xl mb-12 text-center text-gray-300"
          variants={itemVariants}
        >
          Lost access to your cryptocurrency? We&apos;re here to help you recover your assets safely and securely.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
        >
          {[
            { icon: Shield, title: "Secure Process", description: "Our recovery process is designed with your security in mind." },
            { icon: Key, title: "Expert Team", description: "Our team of experts has years of experience in crypto recovery." },
            { icon: RefreshCw, title: "High Success Rate", description: "We've helped countless clients recover their lost crypto." },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div variants={iconVariants}>
                <item.icon className="w-12 h-12 mb-4 text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center mb-16"
          variants={itemVariants}
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-8 h-8 text-purple-400" />
          </motion.div>
        </motion.div>

        <motion.form
          className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg"
          variants={formVariants}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Request Recovery Assistance</h2>
          
          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="name" className="block mb-2">Name</label>
            <Input id="name" placeholder="Your Name" className="bg-gray-700 border-gray-600 text-white" />
          </motion.div>
          
          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="email" className="block mb-2">Email</label>
            <Input id="email" type="email" placeholder="Your Email" className="bg-gray-700 border-gray-600 text-white" />
          </motion.div>
          
          <motion.div className="mb-4" variants={itemVariants}>
            <label htmlFor="details" className="block mb-2">Recovery Details</label>
            <Textarea id="details" placeholder="Please provide details about your lost crypto" className="bg-gray-700 border-gray-600 text-white h-32" />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300"
              >
                Submit Request <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  )
}

