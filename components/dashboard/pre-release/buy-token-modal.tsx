'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { showToast } from '@/utils/toast';
import {  db } from '@/lib/firebase'; // Import Firebase config
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { useRouter } from 'next/navigation'; // Correct hook for App Directory


interface BuyTokenModalProps {
  isOpen: boolean
  onClose: () => void
  tokenName: string
  tokenSymbol: string
  tokenSupply: string
  tokenPrice: string
  tokenPotentialReturn: string
  tokenProfitLoss: string
}

export function BuyTokenModal({ isOpen, onClose, tokenName, tokenSymbol, tokenPrice, tokenSupply, tokenPotentialReturn, tokenProfitLoss  }: BuyTokenModalProps) {
  const [quantity, setQuantity] = useState<string>("")
  const price = parseFloat(tokenPrice.replace("$", ""))
  const minUsdAmount = 500
  const minQuantity = Math.ceil(minUsdAmount / price)
  
  const totalAmount = quantity ? (parseFloat(quantity) * price).toFixed(3) : "0.000"
  //const isValidQuantity = quantity && parseFloat(quantity) >= minQuantity

  const router = useRouter();

  // const handleContinue = () => {
  //   if (isValidQuantity) {
  //     // Handle purchase logic here
  //     console.log(`Purchasing ${quantity} ${tokenSymbol} for $${totalAmount}`)
  //     onClose()
  //   }
  // }
  const handleContinue = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      showToast({
        title: "Error",
        description: "You need to be logged in.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Upload data to Firestore
      await addDoc(collection(db, 'prereleasetokenbought'), {
        userEmail: user.email,
        tokenName,
        tokenSymbol,
        tokenPrice,
        tokenSupply,
        totalAmount,
        tokenPotentialReturn,
        tokenProfitLoss,
        status: 'Pending', // Indicate that the withdrawal was canceled
        date: new Date(), 
        type: 'Buy',
        method: 'Token Pre-Release'
      });
      
      showToast({
        title: "Pending Purchasing Pre-Release Token",
        description: "Your purchase of Pre-Release Token is pending go to Deposit.",
        variant: "success",
      });
       // Redirect to /dashboard?tab=deposit after 3 seconds
   
       setTimeout(() => {
        router.push('/dashboard?tab=deposit');
      }, 1500);    
     onClose();
    } catch (error) {
      console.error("Error saving cancellation to Database:", error);
      showToast({
        title: "Error",
        description: "Failed to add to Database. Please try again later.",
        variant: "destructive",
      });
      
    }
  }


  

  const handleCancel = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      showToast({
        title: "Error",
        description: "You need to be logged in.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Upload data to Firestore
      await addDoc(collection(db, 'prereleasetokenbought'), {
        userEmail: user.email,
        tokenName,
        tokenSymbol,
        tokenPrice,
        tokenSupply,
        tokenPotentialReturn,
        tokenProfitLoss,
        totalAmount,
        status: 'Failed', // Indicate that the withdrawal was canceled
        date: new Date(), 
        type: 'Buy',
        method: 'Token Pre-Release'
      });
      
      showToast({
        title: "Canceled Purchasing Pre-Release Token",
        description: "Your purchase of Pre-Release Token has been canceled.",
        variant: "default",
      });
      onClose()
      
    } catch (error) {
      console.error("Error saving cancellation to Database:", error);
      showToast({
        title: "Error",
        description: "Failed to add to Database. Please try again later.",
        variant: "destructive",
      });
      
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-[425px] w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">Buy {tokenName}</DialogTitle>
          <DialogDescription className="text-gray-400 text-sm sm:text-base">
            Enter the amount of tokens you want to purchase
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity" className="text-sm">Quantity ({tokenSymbol})</Label>
            <Input
              id="quantity"
              type="number"
              placeholder={`Min. ${minQuantity.toLocaleString()} tokens`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
            <p className="text-sm text-gray-400">
              Minimum purchase: ${minUsdAmount.toLocaleString()}
            </p>
          </div>
          <div className="grid gap-2">
            <Label className="text-sm">Total Amount</Label>
            <div className="text-2xl font-bold text-purple-400">
              ${totalAmount}
            </div>
            <p className="text-sm text-gray-400">
              Price per token: {tokenPrice}
            </p>
            <p className="text-sm text-gray-400">{tokenSupply} </p>
          </div>
          
          <Button 
  onClick={handleContinue}
  disabled={!quantity || parseFloat(quantity) < minQuantity} // Disable if no value or below minQuantity
  className={`w-full ${
    !quantity || parseFloat(quantity) < minQuantity 
      ? 'bg-gray-700 cursor-not-allowed' 
      : 'bg-purple-500 hover:bg-purple-600'
  }`}
>
  Continue
</Button>
         
          <Button
            onClick={handleCancel}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
