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
import { FiActivity, FiTrendingUp  } from 'react-icons/fi';
import { FaWallet, FaShieldAlt, FaCopy, FaCreditCard, FaChartLine, FaEthereum, FaBitcoin  } from 'react-icons/fa';
//import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Adjust the import based on your file structure
import { onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';
import { SiDogecoin, SiTether } from 'react-icons/si';
import {  LoaderCircle } from 'lucide-react';
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
      (recBalance || 0) 
    );
  };

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };



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
            Welcome to Crypto-Bank
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





      <div>   
          <motion.div >
          <Card style={{ borderRadius: '2rem' }}   className=" mx-4 px-8 pb-12 w-auto h-auto bg-gray-800 border-gray-700 shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-3xl text-white">Portfolio</CardTitle>
              </CardHeader>
    {/* Balance Cards */}
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
       {/* Quick Links */}
<motion.div 
  className="mx-4 pt-4 rounded-lg "  
  // whileHover={{ scale: 1.02 }} 
  variants={cardVariants} 
  initial="hidden" 
  animate="visible" 
  
>
  <Card style={{ borderRadius: '1rem' }} className="pt-6  bg-gray-800 border-gray-700 px-12">
   
  
    <CardContent>
      <div className="grid grid-cols-4 gap-4">
      <motion.div
   whileTap={{ scale: 0.98 }}
    whileHover={{ scale: 1.15 }}
    
    >
      <Link href="/dashboard?tab=deposit">
        <Button 
          style={{ borderRadius: '2rem' }} 
          onClick={() => setCurrentPage('/deposit')} 
          className="w-full max-w-xs h-12 max-h-12 justify-self-center bg-green-500 hover:bg-green-600 flex items-center"
        >
          <FaWallet className="mr-2 h-4 w-4" />
          Deposit
        </Button>
        </Link>
         
        </motion.div> 
        <motion.div
   whileTap={{ scale: 0.98 }}
    whileHover={{ scale: 1.15 }}
    
    >
        <Link href="/dashboard?tab=withdraw">
        <Button 
          style={{ borderRadius: '2rem' }} 
          
          className="w-full max-w-xs h-12 max-h-12 justify-self-center bg-teal-500 hover:bg-teal-600 flex items-center"
        >
          <FaCreditCard className="mr-2 h-4 w-4" />
          Withdraw
        </Button></Link>
        </motion.div> 
        <motion.div
   whileTap={{ scale: 0.98 }}
    whileHover={{ scale: 1.15 }}
    
    >
        <Link href="/dashboard?tab=trade">
        <Button 
          style={{ borderRadius: '2rem' }} 
          onClick={() => setCurrentPage('/trade')} 
          className="w-full max-w-xs h-12 max-h-12 justify-self-center bg-blue-500 hover:bg-blue-600 flex items-center"
        >
          <FaChartLine className="mr-2 h-4 w-4" />
          Trade
        </Button>
        </Link>
        </motion.div> 
        <motion.div
   whileTap={{ scale: 0.98 }}
    whileHover={{ scale: 1.15 }}
    
    >
        <Link href="/dashboard?tab=transactions">
        <Button 
          style={{ borderRadius: '2rem' }} 
          onClick={() => setCurrentPage('/transactions')} 
          className="w-full max-w-xs h-12 max-h-12 justify-self-center bg-purple-500 hover:bg-purple-600 flex items-center"
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
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
        { name: 'Jul', value: 3490 },
        { name: 'Aug', value: 3490 },
        { name: 'Sep', value: 3490 },
        { name: 'Oct', value: 3490 },
        { name: 'Nov', value: 3490 },
        { name: 'Dec', value: 3490 },
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