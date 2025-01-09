'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from "framer-motion"
import { ArrowUp, ArrowDown } from "lucide-react"

interface CryptoData {
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}


// Cryptocurrency price interface
interface CryptoPrice {
  name: string
  symbol: string
  price: number
  change: number
}

const HeaderMarketPrices: React.FC = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch cryptocurrency prices from CoinGecko API
  const fetchCryptoPrices = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc', // Order by market cap
          per_page: 100, // Fetch up to 100 cryptocurrencies
          page: 1, // Get the first page
          sparkline: false, // Exclude sparkline data
        }
      })

      const updatedPrices: CryptoPrice[] = response.data.map((crypto: CryptoData) => ({
        name: crypto.name,
        symbol: crypto.symbol.toUpperCase(),
        price: crypto.current_price,
        change: crypto.price_change_percentage_24h,
      }));
      

      setPrices(updatedPrices)
    } catch (error) {
      setError('Error fetching crypto prices. Please try again later.')
      console.error('Error fetching crypto prices:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptoPrices()
    const interval = setInterval(fetchCryptoPrices, 30000)

    return () => clearInterval(interval)
  }, [])

  const loopedPrices = [...prices, ...prices] // Duplicate prices for continuous scrolling

  return (
    <div className="relative w-full overflow-hidden">
      {loading && <div className="text-white">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <motion.div
          className="flex items-center space-x-4"
          initial={{ x: 0 }}
          animate={{ 
            x: "-50%", 
            transition: {
              duration: 30, // Adjust the duration for speed
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }
          }}
        >
          {loopedPrices.map((crypto, index) => (
            <div 
              key={`${crypto.symbol}-${index}`} 
              className="flex items-center space-x-2 bg-white bg-opacity-10 px-2 py-1 rounded-md whitespace-nowrap text-xs"
            >
              <span className="font-bold text-white">{crypto.symbol}</span>
              <span className="text-white">${crypto.price.toFixed(2)}</span>
              <span 
                className={`flex items-center ${
                  crypto.change >= 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}
              >
                {crypto.change >= 0 ? (
                  <ArrowUp className="inline h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="inline h-3 w-3 mr-1" />
                )}
                {Math.abs(crypto.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default HeaderMarketPrices