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
import { collection, addDoc, doc, getDoc, getDocs } from 'firebase/firestore'; // Import Firestore functions
import Link from 'next/link';
import { FaBitcoin, FaShieldAlt, FaWallet } from 'react-icons/fa';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FaEthereum } from "react-icons/fa";
import { SiDogecoin, SiTether } from "react-icons/si";
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

// type WithdrawProps = {
//   setCurrentPage: (page: string) => void;
//};

//const Withdraw: React.FC<WithdrawProps> = ({  }) => {
  const Withdraw: React.FC = () => {
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>('');
  


  const [, setUserCurrency] = useState<number | 0>(0);
  const [recBalance, setRecBalance] = useState<number | 0>(0);
  const [btcBalance, setBtcBalance] = useState<number | 0>(0);
  const [ethBalance, setEthBalance] = useState<number | 0>(0);
  const [dogeBalance, setDogeBalance] = useState<number | 0>(0);
  const [usdtBalance, setUsdtBalance] = useState<number | 0>(0);
  const [ , setCurrentUser ] = useState<User | null>(null);


 const [isBTCtrue, setBTCtrue] = useState(true);
  const [isETHtrue, setETHtrue] = useState(true);
  const [isDOGEtrue, setDOGEtrue] = useState(true);
  
  const [isUSDTtrue, setUSDTtrue] = useState(true);
  const [isRECtrue, setRECtrue] = useState(true);

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
            setBTCtrue(userData?.isBTCtrue === false);
            setETHtrue(userData?.isETHtrue === false);
            setDOGEtrue(userData?.isDOGEtrue === false);
            setUSDTtrue(userData?.isUSDTtrue === false);
            setRECtrue(userData?.isRECtrue === false);
            
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
        setBTCtrue(true);
        setETHtrue(true);
        setDOGEtrue(true);
        setUSDTtrue(true);
        setRECtrue(true);
        setCurrentUser (null); // Reset current user if not authenticated
      }
    });

    

    return () => unsubscribeAuth(); // Cleanup subscription on unmount
  }, [toast]);


  ////////

  interface TokenData {
    balance: string;
    value: number;
    change: string;
    isPositive: boolean;
    symbol: string; // Changed from boolean to string
  }
  
    const [error, setError] = useState<string | null>(null);
    const [, setLoadingg] = useState<boolean>(true);
    const [balanceData, setBalanceData] = useState<TokenData[] | null>(null);
   
    useEffect(() => {
     const auth = getAuth();
   
     const unsubscribe = onAuthStateChanged(auth, async (user) => {
       if (!user) {
         console.error("User not logged in.");
         setLoadingg(false);
         return;
       }
   
       setLoadingg(true);
   
       try {
         const balancesRef = collection(db, "users", user.uid, "Prereleasetokenbalance");
         const querySnapshot = await getDocs(balancesRef);
   
         // Convert documents into an array
         const tokens: TokenData[] = querySnapshot.docs.map((doc) => ({
           ...(doc.data() as TokenData),
         }));
   
         setBalanceData(tokens.length > 0 ? tokens : []); // Ensure it's always an array
       } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching balances:", error);
          setError(error.message || "Error fetching balances.");
        } else {
          console.error("Unknown error fetching balances:", error);
          setError("An unknown error occurred while fetching balances.");
        }
      } finally {
         setLoadingg(false);
       }
     });
   
     return () => unsubscribe(); // Cleanup listener on unmount
   }, []);
   
   
    
      if (error) {
       return (
         <div className="text-center p-2 sm:p-4 flex flex-col items-center">
           <p className="text-red-500 text-sm sm:text-base">{error}</p>
         </div>
       );
     }
     
     //
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
      (recBalance || 0) +
      (Array.isArray(balanceData) ? balanceData.reduce((acc, token) => acc + (Number(token.value) || 0), 0) : 0) // Sum up token values 

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
      className="space-y-6 overflow-y-auto px-4 sm:px-6 md:px-8"
    >
      {/* Header Section */}
      <div className="space-y-4">
      <h2 className="pl-4 sm:pl-8 text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
      Withdraw Funds
        </h2>
        <p className="pl-6 sm:pl-12 text-base sm:text-xl text-gray-400">
        Transfer your crypto to an external wallet
        </p>
      </div>
  
     {/* Portfolio Section */}
     <Card
             style={{ borderRadius: "2rem" }}
             className="px-4 sm:px-8 py-8 bg-gray-800 border-gray-700"
           >
             <CardHeader>
               <CardTitle className="text-2xl sm:text-3xl text-white">Portfolio</CardTitle>
             </CardHeader>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-6 gap-6 mt-12">
             {/* Balance Cards */}
             {/* Each card */}
             {[
               {
                 title: "Total Balance",
                 gradient: "linear-gradient(to bottom right, #7F00FF, #E100FF)",
                 icon: <FaWallet style={{ fontSize: "1.5rem", color: "#fff" }} />,
                 value: `$${calculateTotalBalance()}`,
                 description: "Across all cryptocurrencies. Rates may fluctuate based on market conditions.",
               },
               ...(!isBTCtrue
                ? [ {
                 title: "BTC Balance",
                 gradient: "linear-gradient(to bottom right, #FF512F, #F09819)",
                 icon: <FaBitcoin style={{ fontSize: "1.5rem", color: "#FFD700" }} />,
                 value: btcBalance  !== undefined ? `${btcBalance}` : "Loading...",
                 usdValue: cryptoRates.btc
                   ? `$${(btcBalance ? (btcBalance * cryptoRates.btc).toFixed(2) : 0).toLocaleString()} USD`
                   : "Loading rate...",
                 rate: cryptoRates.btc ? `$${cryptoRates.btc.toFixed(2)}` : "Loading...",
               },  ]
               : []),
               
               ...(!isETHtrue
                ? [ {
                 title: "ETH Balance",
                 gradient: "linear-gradient(to bottom right, #43C6AC, #191654)",
                 icon: <FaEthereum style={{ fontSize: "1.5rem", color: "#FFD700" }} />,
                 value: ethBalance !== undefined ? `${ethBalance}` : "Loading...",
                 usdValue: cryptoRates.eth
                   ? `$${(ethBalance ? (ethBalance * cryptoRates.eth).toFixed(2) : 0).toLocaleString()} USD`
                   : "Loading rate...",
                 rate: cryptoRates.eth ? `$${cryptoRates.eth.toFixed(2)}` : "Loading...",
                },
              ]
            : []),
               ...(!isDOGEtrue
                ? [ {
                 title: "DOGE Balance",
                 gradient: "linear-gradient(to bottom right, #2193B0, #6DD5ED)",
                 icon: <SiDogecoin style={{ fontSize: "1.5rem", color: "#FFD700" }} />,
                 value: dogeBalance  !== undefined ? `${dogeBalance}` : "Loading...",
                 usdValue: cryptoRates.doge
                   ? `$${(dogeBalance ? (dogeBalance * cryptoRates.doge).toFixed(2) : 0).toLocaleString()} USD`
                   : "Loading rate...",
                 rate: cryptoRates.doge ? `$${cryptoRates.doge.toFixed(2)}` : "Loading...",
                },
              ]
            : []),
               ...(!isUSDTtrue
                ? [ {
                 title: "USDT Balance",
                 gradient: "linear-gradient(to bottom right, #FF416C , #2196F3 )",
                 icon: <SiTether style={{ fontSize: "1.5rem", color: "#FFD700" }} />,
                 value: usdtBalance  !== undefined ? `${usdtBalance}` : "Loading...",
                 usdValue: cryptoRates.usdt
                   ? `$${(usdtBalance  !== undefined ? (usdtBalance * cryptoRates.usdt).toFixed(2) : 0).toLocaleString()} USD`
                   : "Loading rate...",
                 rate: cryptoRates.usdt ? `$${cryptoRates.usdt.toFixed(2)}` : "Loading...",
                },
              ]
            : []),
               ...(!isRECtrue
                ? [ {
                 title: "Recovered Balance",
                 gradient: "linear-gradient(to bottom right, #009E60, #4CAF50)",
                 icon: <FaShieldAlt style={{ fontSize: "1.5rem", color: "#FFD700" }} />,
                 value: recBalance  !== undefined ? `$${recBalance}` : "Loading...",
                 description: "This is your recovered balance from all lost transactions.",
                },
              ]
            : []),

             // Generate cards dynamically for each token in balanceData
                    ...(Array.isArray(balanceData) && balanceData.length > 0
                ? balanceData.map((token) => ({
                    title: token.symbol,
                    gradient: "linear-gradient(to bottom right, #2193B0, #6DD5ED)",
                    icon: <SiDogecoin style={{ fontSize: "1.5rem", color: "#FFD700" }} />,
                    value: token.balance !== undefined ? `${token.balance}` : "Loading...",
                    usdValue: (
                      <div className={`flex items-center gap-1 ${token.isPositive ? "text-green-400" : "text-red-400"}`}>
                        {token.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {token.change}
                      </div>
                    ),
                    rate: token.value !== undefined ? `$${token.value.toLocaleString()}` : "Loading...",
                    description: undefined, // Add this to ensure consistency
                  }))
                : []),
            
             ].map((card, index) => (
               <motion.div
                 key={index}
                 whileTap={{ scale: 0.98 }}
                 whileHover={{ scale: 1.05 }}
                 style={{
                   padding: "20px",
                   borderRadius: "1.5rem",
                   background: card.gradient, // Use the custom gradient directly here
                   boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
                 }}
                 className="text-white flex flex-col items-start"
               >
                 <div className="flex justify-between w-full items-center">
                   <h3 style={{ fontSize: "1.5rem", fontWeight: "600" }}>{card.title}</h3>
                   {card.icon}
                 </div>
                 <span style={{ fontSize: "1.7rem", fontWeight: "bold", marginTop: "1rem" }}>{card.value}</span>
                 {card.usdValue && <p className="text-sm text-purple-200 mt-1">{card.usdValue}</p>}
                 {card.rate && <p className="text-xs opacity-80 mt-1">Rate: {card.rate}</p>}
                 {card.description && <p className="text-xs opacity-80 mt-1">{card.description}</p>}
               </motion.div>
             ))}
           </div>
         </Card>

  
      {/* Wallet Form Section */}
      <div
        style={{ marginBottom: "100px", borderRadius: "2rem" }}
        className="py-4 bg-gray-800 border border-gray-700"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card
            className="w-full max-w-md mx-auto bg-gray-800 border-none"
            style={{ borderRadius: "2rem" }}
          >
            <div className="py-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl sm:text-3xl text-white">
                  Add your wallet details
                </CardTitle>
              </CardHeader>
  
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleWithdraw();
                  }}
                  className="space-y-6"
                >
                  {/* Cryptocurrency Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-base sm:text-lg text-white">
                      Select Cryptocurrency
                    </Label>
                    <Select onValueChange={setCrypto} value={currency}>
                      <SelectTrigger
                        id="currency"
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg"
                      >
                        <SelectValue placeholder="Select cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border border-gray-600">
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
  
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-base sm:text-lg text-white">
                      Amount (USD)
                    </Label>
                    <p className="text-sm text-gray-400">
                      Available balance: ${calculateTotalBalance()} USD
                    </p>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg"
                      min="1000"
                      max={calculateTotalBalance()}
                      step="0.01"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {parseFloat(amount) > calculateTotalBalance() && (
                      <p className="text-red-500 text-sm">You are exceeding your balance.</p>
                    )}
                  </div>
  
                  {/* Wallet Address Input */}
                  <div className="space-y-2">
                    <Label htmlFor="wallet" className="text-base sm:text-lg text-white">
                      Wallet Address
                    </Label>
                    <Input
                      id="wallet"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg"
                      maxLength={42}
                      minLength={26}
                      placeholder="Enter your wallet address"
                      required
                    />
                  </div>
  
                  <Button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white text-base sm:text-lg py-2 rounded-lg"
                  >
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
  className="bg-gray-800 text-white px-6 py-4 sm:px-8 sm:py-6"
>
  <DialogHeader>
    <DialogTitle className="text-lg sm:text-xl font-bold text-center">
      Confirm Withdrawal
    </DialogTitle>
  </DialogHeader>
  <div className="py-4 space-y-4 text-sm sm:text-base">
    <p className="leading-relaxed">
      You are about to withdraw ${parseFloat(amount).toFixed(2)} USD (
      {calculateCryptoAmount(amount, currency)} {currency.toUpperCase()}) to:
    </p>
    <p className="font-mono mt-2 break-all text-purple-400">{walletAddress}</p>
    <p className="mt-4 leading-relaxed">
      A commission fee of 15% (${(parseFloat(amount) * 0.15).toFixed(2)} USD) will be applied.
    </p>
    <p className="mt-2 leading-relaxed text-yellow-300">
      Please make a payment of ${(parseFloat(amount) * 0.15).toFixed(2)} USD to proceed with the withdrawal.
    </p>
  </div>
  <DialogFooter className="flex flex-col sm:flex-row gap-4 mt-4">
    <button
      onClick={handleCancel}
      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
    >
      Cancel
    </button>
    <Link href="/dashboard?tab=deposit">
      <button
        onClick={handleDeposit}
        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
      >
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