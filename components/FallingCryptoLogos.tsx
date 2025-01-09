'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Bitcoin, EclipseIcon as Ethereum, DollarSign, Coins, CreditCard, Wallet } from 'lucide-react'

interface Logo {
  id: number
  Icon: React.ElementType
  x: number // Random x position (0% to 100%)
  delay: number
  duration: number
  size: number
  color: string
}

const logoIcons = [Bitcoin, Ethereum, DollarSign, Coins, CreditCard, Wallet]
const colors = ['text-purple-400', 'text-pink-400', 'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-red-400']

export default function FullScreenFallingCryptoLogos() {
  const [logos, setLogos] = useState<Logo[]>([])

  useEffect(() => {
    const newLogos: Logo[] = []
    for (let i = 0; i < 30; i++) {
      newLogos.push({
        id: i,
        Icon: logoIcons[Math.floor(Math.random() * logoIcons.length)],
        x: Math.random() * 100, // Random x position (0% to 100%)
        delay: Math.random() * 10,
        duration: 100 + Math.random() * 20,
        size: 16 + Math.random() * 24,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    setLogos(newLogos)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {logos.map((logo) => (
        <motion.div
          key={logo.id}
          initial={{ y: -100, x: `${logo.x}%`, opacity: 0 }} // Start from above the viewport at a random x position
          animate={{ y: '100vh', opacity: [0, 1, 1, 0] }} // Animate to the bottom of the viewport
          transition={{
            duration: logo.duration,
            delay: logo.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute" // Use absolute positioning to ensure logos can move freely
        >
          <logo.Icon size={logo.size} className={`${logo.color} opacity-30`} />
        </motion.div>
      ))}
    </div>
  )
}
