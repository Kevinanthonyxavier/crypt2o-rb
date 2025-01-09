'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

function Withdraw({ setCurrentPage }) {
  const [amount, setAmount] = useState('')
  const [crypto, setCrypto] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [showCommissionPopup, setShowCommissionPopup] = useState(false)
  const { toast } = useToast()

  const cryptoRates = {
    btc: 30000,
    eth: 2000,
    usdt: 1
  }

  const handleWithdraw = () => {
    if (!amount || !crypto || !walletAddress) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }
    setShowCommissionPopup(true)
  }

  const calculateCryptoAmount = (usdAmount, crypto) => {
    return (usdAmount / cryptoRates[crypto.toLowerCase()]).toFixed(8)
  }

  const handleMakePayment = () => {
    setShowCommissionPopup(false)
    setCurrentPage('/deposit')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Withdraw Funds</h2>
        <p className="text-gray-400">Transfer your crypto to an external wallet</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Withdrawal Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="crypto" className="text-white">Select Cryptocurrency</Label>
            <Select onValueChange={setCrypto}>
              <SelectTrigger id="crypto" className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                <SelectItem value="usdt">Tether (USDT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="wallet" className="text-white">Wallet Address</Label>
            <Input
              id="wallet"
              placeholder="Enter recipient wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          <Button onClick={handleWithdraw} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
            Withdraw
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showCommissionPopup} onOpenChange={setShowCommissionPopup}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>You are about to withdraw ${parseFloat(amount).toFixed(2)} USD ({calculateCryptoAmount(amount, crypto)} {crypto.toUpperCase()}) to:</p>
            <p className="font-mono mt-2">{walletAddress}</p>
            <p className="mt-4">A commission fee of 15% (${(parseFloat(amount) * 0.15).toFixed(2)} USD) will be applied.</p>
            <p className="mt-2">Please make a payment of ${(parseFloat(amount) * 0.15).toFixed(2)} USD to proceed with the withdrawal.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommissionPopup(false)}>Cancel</Button>
            <Button onClick={handleMakePayment} className="bg-purple-500 hover:bg-purple-600">Make Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Withdraw