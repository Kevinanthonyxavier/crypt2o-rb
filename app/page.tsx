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
//import { useEffect, useRef } from 'react'



export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white ">
     {/* <ParticleBackground /> */}
     
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

