'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { auth, db } from '@/lib/firebase'; // Import Firebase config
import { getAuth } from 'firebase/auth';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import Link from 'next/link';
import { FaBitcoin, FaShieldAlt, FaWallet } from 'react-icons/fa';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FiTrendingUp } from 'react-icons/fi';
import { FaEthereum } from "react-icons/fa";
import { SiDogecoin, SiTether } from "react-icons/si";
import { LoaderCircle } from 'lucide-react';

type WithdrawProps = {
  setCurrentPage: (page: string) => void;
};

const Withdraw: React.FC<WithdrawProps> = ({  }) => {
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>(""); // State for the error message


  const [, setUserCurrency] = useState<number | 0>(0);
  const [recBalance, setRecBalance] = useState<number | 0>(0);
  const [btcBalance, setBtcBalance] = useState<number | 0>(0);
  const [ethBalance, setEthBalance] = useState<number | 0>(0);
  const [dogeBalance, setDogeBalance] = useState<number | 0>(0);
  const [usdtBalance, setUsdtBalance] = useState<number | 0>(0);
  const [ , setCurrentUser ] = useState<User | null>(null);

  const [currency, setCrypto] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showCommissionPopup, setShowCommissionPopup] = useState<boolean>(false);
  const [cryptoRates, setCryptoRates] = useState<Record<string, number>>({

    btc: 0,
    eth: 0,
    doge: 0,
    usdt: 0,
    rec: 0,
  });







  useEffect(() => {
    // Fetch cryptocurrency prices from CoinGecko
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,tether&vs_currencies=usd');
        const data = await response.json();
        setCryptoRates({
          btc: data.bitcoin.usd,
          eth: data.ethereum.usd,
          doge: data.dogecoin.usd,
          usdt: data.tether.usd,
        });
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch cryptocurrency prices',
          variant: 'destructive',
        });
      }
    };

    fetchCryptoPrices(); // Fetch BTC price on component mount

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser (user);

        // Fetch user data from Firestore
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            setUserCurrency(userData.currency || null); 
            setBtcBalance(userData.btc || 0);
            setRecBalance(userData.rec || 0);
            setEthBalance(userData.eth || 0);
            setDogeBalance(userData.doge || 0);
            setUsdtBalance(userData.usdt || 0);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
          toast({
            title: 'Error',
            description: 'Could not fetch user data',
            variant: 'destructive',
          });
        }
      } else {
        setCurrentUser (null); // Reset current user if not authenticated
      }
    });

    return () => unsubscribeAuth(); // Cleanup subscription on unmount
  }, [toast]);

  const handleWithdraw = () => {
    if (!amount || !crypto || !walletAddress) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }
    setShowCommissionPopup(true);
  };

  // const calculateCryptoAmount = (usdAmount: string, crypto: string): string => {
  //   const rate = cryptoRates[crypto.toLowerCase()];
  //   return rate ? (parseFloat(usdAmount) / rate).toFixed(2) : '0';
  // };

  const handleCancel = async () => {
    const user = getAuth().currentUser ;
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to cancel a withdrawal.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Upload data to Firestore
      await addDoc(collection(db, 'withdrawals'), {
        userEmail: user.email,
        amount: parseFloat(amount),
        currency,
        walletAddress,
        status: 'Canceled', // Indicate that the withdrawal was canceled
        date: new Date(), 
        type: 'Withdrawal',
        method: 'Crypto'

      });
  
      toast({
        title: "Cancellation Successful",
        description: "Your withdrawal has been canceled and recorded.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving cancellation to Firestore:", error);
      toast({
        title: "Error",
        description: "Failed to record the cancellation. Please try again later.",
        variant: "destructive",
      });
    } finally {
      // Close the dialog and reset the form fields
      setShowCommissionPopup(false);
      setAmount('');
      setCrypto('');
      setWalletAddress('');
    }
  }

  const handleDeposit = async () => {
    const user = getAuth().currentUser ;
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to cancel a withdrawal.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // Upload data to Firestore
      await addDoc(collection(db, 'withdrawals'), {
        userEmail: user.email,
        amount: parseFloat(amount),
        currency,
        walletAddress,
        status: 'Waiting', // Indicate that the withdrawal was canceled
        date: new Date(), 
        type: 'Withdrawal',
        method: 'Crypto'

      });
  
      toast({
        title: "Cancellation Successful",
        description: "Your withdrawal has been canceled and recorded.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving cancellation to Firestore:", error);
      toast({
        title: "Error",
        description: "Failed to record the cancellation. Please try again later.",
        variant: "destructive",
      });
    } finally {
      // Close the dialog and reset the form fields
      setShowCommissionPopup(false);
      setAmount('');
      setCrypto('');
      setWalletAddress('');
    }
  }


   // Calculate total balance based on coin balances and crypto rates
   const calculateTotalBalance = () => {
    return (
      (btcBalance|| 0) * cryptoRates.btc +
      (ethBalance || 0) * cryptoRates.eth +
      (dogeBalance || 0) * cryptoRates.doge +
      (usdtBalance || 0) * cryptoRates.usdt +
      (recBalance || 0) 
    );
  };
  const calculateCryptoAmount = (usdAmount: string, crypto: string): string => { const rate = cryptoRates[crypto.toLowerCase()]; return rate ? (parseFloat(usdAmount) / rate).toFixed(8) : '0'; };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
  
    // Additional logic
    if (parseFloat(value) < 1000) {
      setError(`The amount should be more than $1000.`);

      //setError(`The amount should be more than ${userCurrency} 1000.`);
    } else {
      setError("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-6 ">
        <h2 className="pl-8 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Withdraw Funds
        </h2>
        <p className="pl-12 text-xl text-gray-400">Transfer your crypto to an external wallet</p>
      </div>

      <div >
        <motion.div >
          <Card style={{ borderRadius: '2rem' }} className="mx-4 px-8 pb-12 w-auto h-auto bg-gray-100 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Portfolio</CardTitle>
              </CardHeader>


              <div className="mx-4  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 mt-12">
              {/* Balance Cards */}
   <div >
   {/* Total Balance Card */}
   <motion.div
    whileTap={{ scale: 0.98 }}
    whileHover={{ scale: 1.05 }}
    style={{
      height: "210px",
      width: "250px",
      padding: "20px",
      borderRadius: "1.5rem",
      background: "linear-gradient(to bottom right, #7F00FF, #E100FF)",
      boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
    }}
    className="text-white"
  >
    <h3 style={{ fontSize: "1.7rem", fontWeight: "600" }}>Total Balance</h3>
    
    <div
    
  style={{
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginTop: "1rem",
  }}
>
  <FaWallet style={{ fontSize: "1.5rem", color: "#fff" }}  />
  <span
    style={{
      fontSize: "1.7rem",
      fontWeight: "bold",
      color: "#fff",
    }}
  >
    ${calculateTotalBalance()}
  </span>
</div>

    <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.8 }}>
      Across all cryptocurrencies. <br />Rates may fluctuate based on market conditions</p>
      
    
  </motion.div>     
   </div>   
{/* BTC Balance Card */}
<motion.div
 whileTap={{ scale: 0.98 }}
  whileHover={{ scale: 1.05 }}
  style={{
    height: "210px",
    width: "250px",
    padding: "20px",
    borderRadius: "1.5rem",
    background: "linear-gradient(to bottom right, #FF512F, #F09819)",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
  }}
  className="text-black"
>
  {/* Card Header */}
  <div
  
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#fff" }}>
      BTC  <br /> Balance
    </h3>
    <FiTrendingUp style={{ fontSize: "1.2rem", color: "#fff" }} />
  </div>

  {/* Balance Details */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "1rem",
    }}
  >
    <FaBitcoin style={{ fontSize: "1.5rem", color: "#FFD700" }} />
    <span
      style={{
        fontSize: "1.7rem",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      {btcBalance !== undefined ? `${btcBalance}` : "Loading..."}
    </span>
  </div>

 {/* USD Value */}
<div style={{ fontSize: "1rem", color: "#fff", marginTop: "0.5rem" }}>
  {cryptoRates.btc ? (
    <p className="text-purple-200 text-sm">
      ${(btcBalance ? (btcBalance * cryptoRates.btc).toFixed(2) : 0).toLocaleString()} USD
    </p>
  ) : (
    <p className="text-purple-200 text-sm">Loading rate...</p>
  )}
</div>


  {/* Rate */}
  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.8, color: "#fff" }}>
    Rate: ${cryptoRates.btc.toFixed(2) || "Loading..."}
  </p>
</motion.div>


{/* ETH Balance Card */}
<motion.div
 whileTap={{ scale: 0.98 }}
  whileHover={{ scale: 1.05 }}
  style={{
    height: "210px",
    width: "250px",
    padding: "20px",
    borderRadius: "1.5rem",
    background: "linear-gradient(to bottom right, #43C6AC, #191654)",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
  }}
  className="text-black px-8"
>
  {/* Card Header */}
  <div
  
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#fff" }}>
      ETH  <br /> Balance
    </h3>
    <FiTrendingUp style={{ fontSize: "1.2rem", color: "#fff" }} />
  </div>

  {/* Balance Details */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "1rem",
    }}
  >
    <FaEthereum  style={{ fontSize: "1.5rem", color: "#FFD700" }} />
    <span
      style={{
        fontSize: "1.7rem",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      {ethBalance !== undefined ? `${ethBalance}` : "Loading..."}
    </span>
  </div>

 {/* USD Value */}
<div style={{ fontSize: "1rem", color: "#fff", marginTop: "0.5rem" }}>
  {cryptoRates.btc ? (
    <p className="text-purple-200 text-sm">
      ${(ethBalance ? (ethBalance * cryptoRates.eth).toFixed(2) : 0).toLocaleString()} USD
    </p>
  ) : (
    <p className="text-purple-200 text-sm">Loading rate...</p>
  )}
</div>


  {/* Rate */}
  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.8, color: "#fff" }}>
    Rate: ${cryptoRates.eth.toFixed(2) || "Loading..."}
  </p>
</motion.div>



{/* DOGE Balance Card */}
<motion.div
 whileTap={{ scale: 0.98 }}
  whileHover={{ scale: 1.05 }}
  style={{
    height: "210px",
    width: "250px",
    padding: "20px",
    borderRadius: "1.5rem",
    background: "linear-gradient(to bottom right, #2193B0, #6DD5ED)",




    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
  }}
  className="text-black"
>
  {/* Card Header */}
  <div
 
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#fff" }}>
      DOGE <br /> Balance
    </h3>
    <FiTrendingUp style={{ fontSize: "1.2rem", color: "#fff" }} />
  </div>

  {/* Balance Details */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "1rem",
    }}
  >
    <SiDogecoin  style={{ fontSize: "1.5rem", color: "#FFD700" }} />
    <span
      style={{
        fontSize: "1.7rem",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      {dogeBalance !== undefined ? `${dogeBalance}` : "Loading..."}
    </span>
  </div>

 {/* USD Value */}
<div style={{ fontSize: "1rem", color: "#fff", marginTop: "0.5rem" }}>
  {cryptoRates.doge ? (
    <p className="text-purple-200 text-sm">
      ${(dogeBalance ? (dogeBalance * cryptoRates.doge).toFixed(2) : 0).toLocaleString()} USD
    </p>
  ) : (
    <p className="text-purple-200 text-sm">Loading rate...</p>
  )}
</div>


  {/* Rate */}
  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.8, color: "#fff" }}>
    Rate: ${cryptoRates.doge.toFixed(2) || "Loading..."}
  </p>
</motion.div>

{/* USDT Balance Card */}
<motion.div
 whileTap={{ scale: 0.98 }}
  whileHover={{ scale: 1.05 }}
  style={{
    height: "210px",
    width: "250px",
    padding: "20px",
    borderRadius: "1.5rem",
    background: "linear-gradient(to bottom right, #FF416C , #2196F3 )",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
  }}
  className="text-black"
>
  {/* Card Header */}
  <div
  
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#fff" }}>
      USDT  <br /> Balance
    </h3>
    <FiTrendingUp style={{ fontSize: "1.2rem", color: "#fff" }} />
  </div>

  {/* Balance Details */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "1rem",
    }}
  >
    <SiTether  style={{ fontSize: "1.5rem", color: "#FFD700" }} />
    <span
      style={{
        fontSize: "1.7rem",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      {usdtBalance !== undefined ? `${usdtBalance}` : "Loading..."}
    </span>
  </div>

 {/* USD Value */}
<div style={{ fontSize: "1rem", color: "#fff", marginTop: "0.5rem" }}>
  {cryptoRates.usdt ? (
    <p className="text-purple-200 text-sm">
      ${(usdtBalance ? (usdtBalance * cryptoRates.usdt).toFixed(2) : 0).toLocaleString()} USD
    </p>
  ) : (
    <p className="text-purple-200 text-sm">Loading rate...</p>
  )}
</div>


  {/* Rate */}
  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.8, color: "#fff" }}>
    Rate: ${cryptoRates.usdt.toFixed(2) || "Loading..."}
  </p>
</motion.div>


{/* Recovered Balance Card */}
<motion.div
 whileTap={{ scale: 0.98 }}
  whileHover={{ scale: 1.05 }}
  style={{
    height: "210px",
    width: "250px",
    padding: "20px",
    borderRadius: "1.5rem",
    background: "linear-gradient(to bottom right, #009E60, #4CAF50)",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
  }}
  className="text-black"
>
  {/* Card Header */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#fff" }}>
    Recovered  <br /> Balance
    </h3>
    <LoaderCircle style={{ fontSize: "1.2rem", color: "#fff" }} />
  </div>

  {/* Balance Details */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "1rem",
    }}
  >
    <FaShieldAlt     style={{ fontSize: "1.5rem", color: "#FFD700" }} />
    <span
      style={{
        fontSize: "1.7rem",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      {recBalance !== undefined ? `$ ${recBalance} ` : "Loading..."}
    </span>
  </div>

 {/* USD Value */}
<div style={{ fontSize: "1rem", color: "#fff", marginTop: "0.5rem" }}>
  
    <p className="text-purple-200 text-sm">
    This is your recovered balance from all lost transactions..
    </p>
  
    <p className="text-purple-200 text-sm"></p>
  
</div>


  {/* Rate */}
  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.8, color: "#fff" }}>
    
  </p>
</motion.div>

  
  






  
     

            </div>
          </Card>
        </motion.div>
      </div>

      <div  style={{ marginBottom: '150px', borderRadius: '2rem' }} className="py-4 mx-4 flex items-center justify-center bg-gray-800 border border-gray-700"> {/* Full-height centering container with gray background */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card
          // Maintain margin and border-radius
          
          className="mx-8 w-auto sm:w-[500px] sm:w-py-8 md:w-[500px] lg:w-[600px]  h-auto  bg-gray-800 card-no-border" // Use the same gray color for the card
        >
          <div className="  items-center justify-center w-[800] py-8"> {/* Centering content */}
            <CardHeader className="w-full text-center">
              <CardTitle className="text-3xl text-white">Add your wallet details.</CardTitle>
              </CardHeader>









  
     

            <CardContent className=" pb-12 w-full sm:w-[500px] md:w-[500px] lg:w-[600px] h-auto ">

            <form onSubmit={(e) => { e.preventDefault(); handleWithdraw(); }} className="space-y-4">
      {/* Cryptocurrency Selection */}
      <div className="space-y-2">
        <Label htmlFor="currency" className="text-white">Select Cryptocurrency</Label>
        <Select onValueChange={setCrypto} value={currency}>
          <SelectTrigger style={{ borderRadius: '0.5rem' }} id="currency"                     
          className="text-lg bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
            <SelectValue placeholder="Select cryptocurrency" />
          </SelectTrigger>
          <SelectContent className="text-lg bg-gray-700 text-white border border-gray-600">
            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
            <SelectItem value="USDT">Tether (USDT)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-lg text-white">Amount (USD)</Label>
        <p className="text-gray-400 text-base">Available balance: ${calculateTotalBalance()} USD</p>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={handleChange}
          className="text-lg  bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ appearance: "none", borderRadius: '0.5rem' }}
          min="0"
          max={calculateTotalBalance()}
          step="0.01"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {parseFloat(amount) > calculateTotalBalance() && (
          <p className="text-red-500 text-sm mt-1">You are exceeding your balance.</p>
        )}
      </div>

      {/* Wallet Address Input */}
      <div>
        <Label htmlFor="wallet" className="text-lg text-white">Wallet Address</Label>
        <Input
          id="wallet"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="text-lg bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ borderRadius: '0.5rem' }}
          maxLength={42} // Adjusted for standard Ethereum address length
          minLength={26} // Adjusted for common cryptocurrency address length
          placeholder="Enter your wallet address"
          required
        />
      </div>

                <Button style={{ borderRadius: '0.5rem' }} type="submit" className="text-lg w-full bg-purple-500 hover:bg-purple-600 text-white">
                  Withdraw
                </Button>
              </form>
            </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>

      <Dialog open={showCommissionPopup} onOpenChange={() => {}}>

  <DialogContent
    style={{ borderRadius: '2rem' }}
    className="bg-gray-800 text-white"
    
  >
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              You are about to withdraw ${parseFloat(amount).toFixed(2)} USD (
              {calculateCryptoAmount(amount, currency)} {currency.toUpperCase()}) to:
            </p>
            <p className="font-mono mt-2 break-all">{walletAddress}</p>
            <p className="mt-4">
              A commission fee of 15% (${(parseFloat(amount) * 0.15).toFixed(2)} USD) will be applied.
            </p>
 <p className="mt-2">
              Please make a payment of ${(parseFloat(amount) * 0.15).toFixed(2)} USD to proceed with the withdrawal.
            </p>
          </div>
          <DialogFooter>
            <button 
             onClick={handleCancel}
              className="bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <Link href="/dashboard?tab=deposit">
              <button onClick={handleDeposit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Go to Deposit
                
              </button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Withdraw;