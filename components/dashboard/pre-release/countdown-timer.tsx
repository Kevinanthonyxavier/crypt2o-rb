'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CountdownProps {
  targetDate: Date
}

export function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [isAnimating, setIsAnimating] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      const newTimeLeft = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      }

      // Trigger animations for changed values
      Object.keys(newTimeLeft).forEach((key) => {
        const typedKey = key as keyof typeof newTimeLeft; // Explicitly type `key`
        if (newTimeLeft[typedKey] !== timeLeft[typedKey]) {
          setIsAnimating((prev) => ({ ...prev, [typedKey]: true }));
          setTimeout(() => {
            setIsAnimating((prev) => ({ ...prev, [typedKey]: false }));
          }, 300); // Animation duration
        }
      });
      

      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, timeLeft])

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 blur-3xl -z-10" />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {Object.entries(timeLeft).map(([key, value]) => (
  <Card 
    key={key}
    className={cn(
      "relative overflow-hidden bg-gray-800/50 border-purple-500/20 backdrop-blur-sm",
      "transition-all duration-300 group hover:border-purple-500/40 hover:bg-gray-800/80",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-500/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
      "hover:before:opacity-100"
    )}
  >
    <CardContent className="pt-6">
      <div className="relative z-10">
        <div 
          className={cn(
            "text-4xl md:text-5xl font-bold text-center mb-2 tabular-nums",
            "bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent",
            "transition-transform duration-300",
            isAnimating[key as keyof typeof isAnimating] && "scale-125" // Ensure key is typed correctly
          )}
        >
          {value.toString().padStart(2, '0')}
        </div>
        <div className="text-sm text-center text-gray-400 capitalize group-hover:text-purple-300 transition-colors">
          {key}
        </div>
      </div>
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)' }} />
    </CardContent>
  </Card>
))}

      </div>
    </div>
  )
}

