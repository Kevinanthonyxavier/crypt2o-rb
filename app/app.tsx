'use client'
//new 26-2-31 v1
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Benefits from '@/components/Benefits'
import InterestCalculator from '@/components/InterestCalculator'
import AboutUs from '@/components/AboutUs'
import Footer from '@/components/Footer'
import FallingCryptoLogos from '@/components/FallingCryptoLogos'
import TawkToChat from '@/components/TawkToChat'
import { FirebaseProvider } from '@/contexts/FirebaseContext'
import CryptoRecoveryServices from '@/components/CryptoRecoveryServices'

export default function Home() {
  return (
    <FirebaseProvider>
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white ">
      {/* <ParticleBackground /> */}
      <FallingCryptoLogos />

      {/* Toaster Notifications
      <Toaster
        position="top-center"
        toastOptions={{
          className: '',
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      /> */}

      {/* App Content */}
      <div className="relative z-20">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <Features />
          <Benefits />
          <InterestCalculator />
          <CryptoRecoveryServices />
          <AboutUs />
        </motion.main>
        <Footer />
      </div>

      {/* Live Chat Integration */}
      <TawkToChat />
    </div>
    </FirebaseProvider>
  )
}
