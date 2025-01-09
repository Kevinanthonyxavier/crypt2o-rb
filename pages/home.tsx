'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bitcoin, Wallet, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CryptoDashboardHome() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // Simulated login process
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Login Successful!', {
        description: 'Welcome to your Crypto Dashboard'
      })
      // Redirect logic would go here
    } catch {
      toast.error('Login Failed', {
        description: 'Please try again',
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card/60 backdrop-blur-lg rounded-lg border border-border p-8 w-full max-w-md shadow-lg"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Logo and Title */}
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex items-center space-x-3"
          >
            <Bitcoin className="w-12 h-12 text-primary" strokeWidth={1.5} />
            <h1 className="text-3xl font-bold text-primary">
              CryptoDash
            </h1>
          </motion.div>

          {/* Headline */}
          <p className="text-center text-muted-foreground text-sm">
            Secure, Intuitive Crypto Portfolio Management
          </p>

          {/* Login Section */}
          <div className="w-full space-y-4">
            {/* Wallet Connect Button */}
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <span className="animate-spin">🔄</span>
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </div>
              )}
            </Button>

            {/* Security Notice */}
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Secure Connection Guaranteed</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>
              New to CryptoDash? {' '}
              <a 
                href="#" 
                className="text-accent hover:underline"
              >
                Create Account
              </a>
            </p>
            <p>
              By connecting, you agree to our {' '}
              <a 
                href="#" 
                className="text-accent hover:underline"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}