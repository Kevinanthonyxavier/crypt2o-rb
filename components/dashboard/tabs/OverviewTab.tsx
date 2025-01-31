import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { FiActivity  } from 'react-icons/fi';
import { FaWallet, FaShieldAlt, FaCopy, FaCreditCard, FaChartLine, FaEthereum, FaBitcoin  } from 'react-icons/fa';
//import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Adjust the import based on your file structure
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';
import { SiDogecoin, SiTether } from 'react-icons/si';
import {  ArrowDownRight, ArrowUpRight} from 'lucide-react';
import { showToast } from '@/utils/toast';
import  {ToastContainer}  from '@/components/ui/toastcontainer'; // Update the path to the correct file


// interface OverviewTabProps {
//   setCurrentPage: (page: string) => void;
//   copyToClipboard: (text: string) => void;
// }
// Inside OverviewTab.tsx
export interface OverviewTabProps {
  totalBalance: number;
  coinBalances: Record<string, number>;
  cryptoRates: Record<string, number>;
  accountNumber: string;
  setCurrentPage: (page: string) => void;
  copyToClipboard: (text: string) => void;
  isVerified: boolean;
  isBTCtrue: boolean;
  isETHtrue: boolean;
  isDOGEtrue: boolean;
  isUSDTtrue: boolean;
  isRECtrue: boolean;
}



const OverviewTab: React.FC = () => {
//const OverviewTab: React.FC<OverviewTabProps> = ({  
  
//}) => {
  const [, setCurrentPage] = useState<string>('');

  //const { toast } = ToastContainer();
  const [btcBalance, setBtcBalance] = useState<number | 0>(0);
  const [ethBalance, setEthBalance] = useState<number | 0>(0);
  const [dogeBalance, setDogeBalance] = useState<number | 0>(0);
  const [usdtBalance, setUsdtBalance] = useState<number | 0>(0);
  const [currentUser , setCurrentUser ] = useState<User | null>(null);
 
  const [recBalance , setRecBalance ] = useState<number | 0>(0);
  const [ ,setHideVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const memoizedShowToast = React.useCallback(showToast, []);

  const [isBTCtrue, setBTCtrue] = useState(true);
  const [isETHtrue, setETHtrue] = useState(true);
  const [isDOGEtrue, setDOGEtrue] = useState(true);
  
  const [isUSDTtrue, setUSDTtrue] = useState(true);
  const [isRECtrue, setRECtrue] = useState(true);


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
      } catch {
        //console.error('Error fetching crypto prices:', error);
        showToast({
          title: 'Error',
          description: 'Could not fetch cryptocurrency prices',
          variant: 'error',
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
            setIsVerified(userData?.isVerified === true);
            setBTCtrue(userData?.isBTCtrue === false);
            setETHtrue(userData?.isETHtrue === false);
            setDOGEtrue(userData?.isDOGEtrue === false);
            setUSDTtrue(userData?.isUSDTtrue === false);
            setRECtrue(userData?.isRECtrue === false);



            setHideVerification(userData?.hideVerification === true); // Fetch hideVerification from Firestore


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
          showToast({
            title: 'Error',
            description: 'Could not fetch user data',
            variant: 'success',
          });
        }
      } else {
        setHideVerification(false);
        setIsVerified(false);
        setBTCtrue(true);
        setETHtrue(true);
        setDOGEtrue(true);
        setUSDTtrue(true);
        setRECtrue(true);
        setCurrentUser (null); // Reset current user if not authenticated
      }
    });

    return () => unsubscribeAuth(); // Cleanup subscription on unmount
  },  [memoizedShowToast]);


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

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
////////////

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
    }finally {
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
  
  // Extract necessary values safely
 //const { balance, value, change, isPositive, symbol } = balanceData || {};
  
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.header
        className="flex justify-between items-center mb-8 "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1
            className="pl-8 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome to Crypt2o.com
          </motion.h1>
          <motion.div
            className="flex items-center mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="mx-4 pl-12 text-gray-400 mr-2">Account ID: {currentUser ?.uid || 'Not signed in'}</p>
            <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        if (currentUser) {
          // Copy to clipboard logic
          navigator.clipboard.writeText(currentUser.uid)
            .then(() => {
              showToast({
                title: 'Copied',
                description: 'Account number copied to clipboard',
                variant: 'default', // You can change this to 'success' if applicable
              });
            })
            .catch(() => {
              showToast({
                title: 'Error',
                description: 'Failed to copy to clipboard',
                variant: 'error', // Use 'error' for failure cases
              });
            });
        }
      }}
    >
      <FaCopy className="h-4 w-4" />
      <span className="sr-only">Copy account id</span>
    </Button>
            <ToastContainer />
          </motion.div>
        </div>
        {!isVerified && (
        <Link href="/dashboard?tab=verification">
        
          
  <Button
  
    onClick={() => setCurrentPage('/verification')}
    className="flex items-center space-x-2 rounded bg-green-500 hover:bg-green-600 px-4 py-2 text-white"
  >
    <FaShieldAlt className="h-4 w-4 mr-2" />
    <span>Verify Account</span>
  </Button>
  </Link>
)}
      </motion.header>

     
 <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 overflow-y-auto px-4 sm:px-6 md:px-4"
    >


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

        //     ...(balanceData
        //       ? [
        //           {
        //       title: symbol,
        //       gradient: "linear-gradient(to bottom right, #2193B0, #6DD5ED)",
        //       icon: <SiDogecoin style={{ fontSize: "1.5rem", color: "#FFD700" }} />,
        //       value: balance !== undefined ? `${balance}` : "Loading...",
        //       usdValue: (
        //         <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        //           {isPositive ? (
        //             <ArrowUpRight className="w-4 h-4" />
        //           ) : (
        //             <ArrowDownRight className="w-4 h-4" />
        //           )}
        //           {change}
        //         </div>
        //       ),
        //       rate: value !== undefined ? `$${value.toLocaleString()}` : "Loading...",
        //     },
        //   ]
        // : []),

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

         </motion.div>
         {/* <motion.div
    whileTap={{ scale: 0.98 }}
    whileHover={{ scale: 1.05 }}
    style={{
      padding: "20px",
      borderRadius: "1.5rem",
      background: cardData.gradient,
      boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
    }}
    className="text-white flex flex-col items-start"
  >
    <div className="flex justify-between w-full items-center">
      <h3 style={{ fontSize: "1.5rem", fontWeight: "600" }}>{cardData.title}</h3>
      {cardData.icon}
    </div>
    <span style={{ fontSize: "1.7rem", fontWeight: "bold", marginTop: "1rem" }}>
      {cardData.value}
    </span>
    {cardData.usdValue && <p className="text-sm text-purple-200 mt-1">{cardData.usdValue}</p>}
    {cardData.rate && <p className="text-xs opacity-80 mt-1">Rate: {cardData.rate}</p>}
  </motion.div> */}
       {/* Quick Links */}
<motion.div 
  className="mx-4 sm:mx-4  rounded-lg"  
  variants={cardVariants} 
  initial="hidden" 
  animate="visible"
>
  <Card 
    style={{ borderRadius: '1rem' }} 
    className="pt-6 bg-gray-800 border-gray-700 px-6 sm:px-12"
  >
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        
        {/* Deposit Button */}
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.1 }}>
          <Link href="/dashboard?tab=deposit">
            <Button 
              style={{ borderRadius: '2rem' }} 
              onClick={() => setCurrentPage('/deposit')} 
              className="w-full h-10 sm:h-12 justify-self-center bg-green-500 hover:bg-green-600 flex items-center text-sm sm:text-base"
            >
              <FaWallet className="mr-2 h-4 w-4" />
              Deposit
            </Button>
          </Link>
        </motion.div>

        {/* Withdraw Button */}
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.1 }}>
          <Link href="/dashboard?tab=withdraw">
            <Button 
              style={{ borderRadius: '2rem' }} 
              className="w-full h-10 sm:h-12 justify-self-center bg-teal-500 hover:bg-teal-600 flex items-center text-sm sm:text-base"
            >
              <FaCreditCard className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          </Link>
        </motion.div>

        {/* Trade Button */}
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.1 }}>
          <Link href="/dashboard?tab=trade">
            <Button 
              style={{ borderRadius: '2rem' }} 
              onClick={() => setCurrentPage('/trade')} 
              className="w-full h-10 sm:h-12 justify-self-center bg-blue-500 hover:bg-blue-600 flex items-center text-sm sm:text-base"
            >
              <FaChartLine className="mr-2 h-4 w-4" />
              Trade
            </Button>
          </Link>
        </motion.div>

        {/* Transactions Button */}
        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.1 }}>
          <Link href="/dashboard?tab=transactions">
            <Button 
              style={{ borderRadius: '2rem' }} 
              onClick={() => setCurrentPage('/transactions')} 
              className="w-full h-10 sm:h-12 justify-self-center bg-purple-500 hover:bg-purple-600 flex items-center text-sm sm:text-base"
            >
              <FiActivity className="mr-2 h-4 w-4" />
              Transactions
            </Button>
          </Link>
        </motion.div>

      </div>
    </CardContent>
  </Card>
</motion.div>


        {/* Portfolio Performance */}
        <div className="mx-4 pb-36 ">
        <motion.div>
        
          <Card  style={{ borderRadius: '2rem' }} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="mx-4 px-8 text-3xl text-white">Portfolio Performance</CardTitle>
              <CardDescription  className="mx-4 px-8 text-base text-gray-400" >Your portfolio value over time</CardDescription>
            </CardHeader>
            <motion.div style={{ borderRadius: '2rem', maxWidth:"1000rem" }}  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          
          // 
        >
            <CardContent className="h-[300px]">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart  
      data={[
        { name: 'Jan', value: 0 },
        { name: 'Feb', value: 0 },
        { name: 'Mar', value: 0 },
        { name: 'Apr', value: 0 },
        { name: 'May', value: 0 },
        { name: 'Jun', value: 0 },
        { name: 'Jul', value: 0 },
        { name: 'Aug', value: 0 },
        { name: 'Sep', value: 0 },
        { name: 'Oct', value: 0 },
        { name: 'Nov', value: 0 },
        { name: 'Dec', value: 0 },
      ]}
    >
      <CartesianGrid  stroke="#1e88e5" strokeDasharray="3 9" />
      <XAxis 
        dataKey="name" 
        tick={{ fill: '#FFF', fontSize: 16 }} // Month label color
        axisLine={{ stroke: '#1e88e5', strokeWidth: 2 }} 
      />
      <YAxis 
      tick={{ fill: '#FFF', fontSize: 16 }} // Y-axis label color
      axisLine={{ stroke: '#1e88e5', strokeWidth: 2 }} // Y-axis line color
      />
      <Tooltip
        contentStyle={{ backgroundColor: '#333', color: '#FFF' }} // Tooltip styling
        labelStyle={{ color: '#fff' }} // Label color
        itemStyle={{ color: 'E100FF' }} // Value color
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#1e88e5" // Line color
        strokeWidth={3} // Line thickness
        dot={{ stroke: '#ff5722', strokeWidth: 2, fill: '#1e88e5' }} // Dot styling
      />
    </LineChart>
  </ResponsiveContainer>
</CardContent>
</motion.div>
          </Card>
        </motion.div>
        
        </div>

    </div>
  );
};

export default OverviewTab;