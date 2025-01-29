'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {  Menu, X } from 'lucide-react'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

export default function Header() {
 // const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const menuItems = ['Home', 'Features', 'Benefits', 'Calculator', 'Crypto Recovery', 'About'];


  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode)
  //   document.documentElement.classList.toggle('dark')
  // }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed w-full bg-gray-900 bg-opacity-90 backdrop-blur-sm z-50 "
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
       
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold"
          
        >
          {/* <Link href="/" className="inline-block"> */}
          <motion.span
          
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          >
           <a href="#home" className="inline-block">
            Crypt2o.com</a> 
            
          </motion.span>
        </motion.div>
       
        {/* <nav className="hidden md:flex space-x-4">
          {['Home', 'Features', 'Benefits', 'Calculator', 'Crypto Recovery', 'About' ].map((item, index) => (
            <motion.a
              key={item}
              href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
              // href={item === 'Crypto Recovery' ? '/crypto-recovery' : `#${item.toLowerCase()}`}
              className="hover:text-purple-400 transition-colors"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {item}
            </motion.a>
          ))}
        </nav> */}
          <nav className="flex items-center justify-between px-6 py-4 text-white">
      <div className="text-2xl font-bold">
        {/* Menu */}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-4">
        {menuItems.map((item, index) => (
          <motion.a
            key={item}
            href={item === 'Home' ? '#home' : `#${item.toLowerCase()}`}
            className="hover:text-purple-400 transition-colors"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            {item}
          </motion.a>
        ))}
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          className="p-2 rounded-md hover:bg-transprant-700 transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 left-0 w-full bg-gray-900 text-white shadow-lg"
        >
          <div className="flex flex-col items-center space-y-4 py-6">
            {menuItems.map((item) => (
              <a
                key={item}
                href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                className="hover:text-purple-400 transition-colors"
                onClick={() => setIsMenuOpen(false)} // Close menu on item click
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
        <div className="hidden md:flex flex items-center space-x-4">
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button variant="outline" size="sm" onClick={toggleDarkMode} className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </Button>
          </motion.div> */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button variant="outline" onClick={() => setIsLoginModalOpen(true)} className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">Login</Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button onClick={() => setIsRegisterModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">Register</Button>
          </motion.div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </motion.header>
  )
}

