'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useInView } from 'react-intersection-observer'

const cryptocurrencies = [
  { name: 'Bitcoin (BTC)', symbol: 'BTC' },
  { name: 'Ethereum (ETH)', symbol: 'ETH' },
  { name: 'Cardano (ADA)', symbol: 'ADA' },
  { name: 'Solana (SOL)', symbol: 'SOL' },
]

export default function InterestCalculator() {
  const [investment, setInvestment] = useState<number>(1000)
  const [selectedCrypto, setSelectedCrypto] = useState<string>(cryptocurrencies[0].symbol)
  const [showResults, setShowResults] = useState(false)
  const annualRate = 15 // 15% annual return

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
      setShowResults(false)
    }
  }, [controls, inView])

  const calculateReturns = () => {
    const yearlyReturn = investment * (annualRate / 100)
    const monthlyReturn = yearlyReturn / 12
    const dailyReturn = yearlyReturn / 365

    return {
      yearly: yearlyReturn.toFixed(2),
      monthly: monthlyReturn.toFixed(2),
      daily: dailyReturn.toFixed(2),
    }
  }

  const handleCalculate = () => {
    setShowResults(true)
  }

  const returns = calculateReturns()

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
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

  const titleText = "Crypto Investment Calculator"
  const letterVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 10,
        delay: i * 0.1,
      },
    }),
  }

  return (
    <section id="calculator" ref={ref} className="py-20 px-4 bg-gray-800 relative overflow-hidden flex flex-col items-center justify-center min-h-screen">
      <div className="container mx-auto relative z-10 flex flex-col items-center">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center bg-gray-900 bg-opacity-80 p-4 rounded-lg inline-block w-full max-w-3xl shadow-lg"
        >
          {titleText.split('').map((letter, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate={controls}
              style={{ display: 'inline-block' }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="max-w-md mx-auto bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <div className="space-y-4">
            <motion.div variants={itemVariants}>
              <Label htmlFor="investment">Investment Amount ($)</Label>
              <Input
                id="investment"
                type="number"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="mt-1 bg-gray-800 border-purple-500 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Label htmlFor="crypto">Select Cryptocurrency</Label>
              <Select onValueChange={setSelectedCrypto} defaultValue={selectedCrypto}>
                <SelectTrigger className="w-full mt-1 bg-gray-800 border-purple-500 text-white focus:ring-purple-500 focus:border-purple-500">
                  <SelectValue placeholder="Select a cryptocurrency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-purple-500 text-white">
                  {cryptocurrencies.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol} className="focus:bg-purple-700">
                      {crypto.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button onClick={handleCalculate} className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
                Calculate Returns
              </Button>
            </motion.div>
          </div>
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-gray-600 rounded-lg overflow-hidden"
              >
                <h3 className="text-lg font-semibold mb-2">Potential Returns (15% PA):</h3>
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-2"
                >
                  Yearly: ${returns.yearly}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-2"
                >
                  Monthly: ${returns.monthly}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Daily: ${returns.daily}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-xs text-gray-400 text-center"
          >
            Disclaimer: Cryptocurrency investments carry high risk. Past performance does not guarantee future results. Always invest responsibly and within your means.
          </motion.p>
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
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 40, 0],
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute bottom-40 right-10 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl"
      />
      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute bottom-10 left-1/2 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl"
      />
    </div>
  )
}

