'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import AffiliateRegistration from './AffiliateRegistration'

export default function Footer() {
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false)
  return (
    <footer className="bg-gray-900 py-12 px-4 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Crypt2o.com</h3>
            <p className="text-gray-400">Secure and innovative cryptocurrency banking solutions.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Home</Link></li>
              <li><Link href="#features" className="text-gray-400 hover:text-purple-400 transition-colors">Features</Link></li>
              <li><Link href="#benefits" className="text-gray-400 hover:text-purple-400 transition-colors">Benefits</Link></li>
              <li><Link href="#about" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</Link></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Contact Us</h4>
            <p className="text-gray-400">support@cryptobank.com</p>
            <p className="text-gray-400">+1 (555) 123-4567</p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 pt-8 mt-8"
        >
          <h4 className="text-lg font-semibold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Become an Affiliate</h4>
          <p className="text-gray-400 text-center mb-4">Join our affiliate program and earn rewards for referring new customers to Crypt2o.com</p>
          <div className="flex flex-col items-center">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              onClick={() => setIsAffiliateModalOpen(true)}
            >
              Sign Up as an Affiliate
            </Button>
            <Link href="/affiliate-dashboard">
              <Button 
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Log in
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} Crypt2o.com All rights reserved.</p>
        </motion.div>
      </div>
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
          className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"
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
          className="absolute bottom-40 right-10 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl"
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
          className="absolute bottom-10 left-1/2 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl"
        ></motion.div>
      </div>
      <AffiliateRegistration 
        isOpen={isAffiliateModalOpen} 
        onClose={() => setIsAffiliateModalOpen(false)} 
      />
    </footer>
  )
}

