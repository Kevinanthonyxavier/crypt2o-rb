import React, {  useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
//import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase'; // Adjust the import based on your file structure
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//import { showToast } from '@/utils/toast';

///////////////////////////////
import { format } from 'date-fns';





//import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CountdownTimer } from '@/components/dashboard/pre-release/countdown-timer'
import { MetricsCard } from '@/components/dashboard/pre-release/metrics-card'
import { PartnerLogo } from '@/components/dashboard/pre-release/partner-logo'
import { ParticleBackground } from '@/components/dashboard/pre-release/particle-background'
import { Coins, Users, Wallet, Shield, Target, Rocket, LineChartIcon as ChartLineUp, Lock, CheckCircle2, Zap, Globe, UsersIcon, Trophy, ArrowRight } from 'lucide-react'
import { BuyTokenModal } from '@/components/dashboard/pre-release/buy-token-modal'
import { CyberBorder } from '@/components/dashboard/pre-release/cyber-border'
import { HologramEffect } from '@/components/dashboard/pre-release/hologram-effect'
import { BalanceCard } from '@/components/dashboard/pre-release/balance-card'
//import { TransactionHistory } from '@/components/dashboard/pre-release/transaction-history'



// const gradientAnimation = {
//   '@keyframes gradient-x': {
//     '0%, 100%': {
//       'background-size': '200% 200%',
//       'background-position': 'left center'
//     },
//     '50%': {
//       'background-size': '200% 200%',
//       'background-position': 'right center'
//     },
//   },
//   '.animate-gradient-x': {
//     animation: 'gradient-x 15s ease infinite',
//   },
// }



const roadmapSteps = [
  {
    phase: "Phase 1",
    title: "Foundation",
    items: [
      "Token Smart Contract Development",
      "Security Audit Completion",
      "Website Launch",
      "Community Building"
    ]
  },
  {
    phase: "Phase 2",
    title: "Growth",
    items: [
      "DEX Listing",
      "Staking Platform Launch",
      "Partnership Announcements",
      "Marketing Campaign"
    ]
  },
  {
    phase: "Phase 3",
    title: "Expansion",
    items: [
      "CEX Listings",
      "Mobile App Development",
      "Cross-chain Integration",
      "Governance Implementation"
    ]
  }
]

const features = [
  {
    icon: Shield,
    title: "Security First",
    description: "Multi-layered security with regular audits and time-locked contracts"
  },
  {
    icon: Target,
    title: "Fair Distribution",
    description: "Transparent token distribution with anti-whale mechanisms"
  },
  {
    icon: ChartLineUp,
    title: "Sustainable Growth",
    description: "Built-in mechanisms for long-term value appreciation"
  },
  {
    icon: Lock,
    title: "Locked Liquidity",
    description: "Initial liquidity locked for 2 years to ensure stability"
  }
]

const metrics = [
  { title: "Total Value Locked", value: "$42.5M", change: "+12.3% this week", isPositive: true },
  { title: "Token Holders", value: "12,543", change: "+1,234 this month", isPositive: true },
  { title: "Market Cap", value: "$85M", change: "-2.5% this week", isPositive: false },
  { title: "Daily Volume", value: "$3.2M", change: "+15.7% today", isPositive: true }
]

const partners = [
  { name: "Binance", logo: "https://firebasestorage.googleapis.com/v0/b/cryptorecovery12-6-24.appspot.com/o/logos_for_frontpage%2Fbinance.svg?alt=media&token=7a220520-97d3-4117-a304-921b61c4f01e" },
  { name: "Blockchain", logo: "https://firebasestorage.googleapis.com/v0/b/cryptorecovery12-6-24.appspot.com/o/logos_for_frontpage%2Fblockchain.svg?alt=media&token=510dde30-6fc6-4c8b-9beb-222529b71cc6" },
  { name: "Coinbase", logo: "https://firebasestorage.googleapis.com/v0/b/cryptorecovery12-6-24.appspot.com/o/logos_for_frontpage%2Fcoinbase.svg?alt=media&token=b1c5512d-cd6e-4eba-b0ad-c26ae89510ea" },
  { name: "Crypto.com", logo: "https://firebasestorage.googleapis.com/v0/b/cryptorecovery12-6-24.appspot.com/o/logos_for_frontpage%2Fcrypto-com.svg?alt=media&token=9e2cb405-2955-4aef-afd3-564a15e474d1" },
  { name: "Kraken", logo: "https://firebasestorage.googleapis.com/v0/b/cryptorecovery12-6-24.appspot.com/o/logos_for_frontpage%2Fkraken.svg?alt=media&token=4e620719-2d4f-4a3c-9d3f-c2d7633232cf" },
  { name: "Uniswap", logo: "https://firebasestorage.googleapis.com/v0/b/cryptorecovery12-6-24.appspot.com/o/logos_for_frontpage%2Funiswap.svg?alt=media&token=e03734fb-73a7-4252-9728-8c34c63619d6" }
]

const utilityFeatures = [
  {
    icon: Trophy,
    title: "Staking Rewards",
    description: "Earn up to 15% APY by staking your tokens"
  },
  {
    icon: Zap,
    title: "Fast Transactions",
    description: "Lightning-fast cross-chain transfers"
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Available in 180+ countries"
  },
  {
    icon: UsersIcon,
    title: "Community Governance",
    description: "Vote on important protocol decisions"
  }
]



// const transactions = [
//   {
//     id: "1",
//     type: "buy",
//     token: "CBT",
//     amount: "50,000",
//     price: "$0.001",
//     total: "$50.00",
//     date: "2024-01-15 14:30",
//     status: "completed"
//   },
//   {
//     id: "2",
//     type: "buy",
//     token: "DFP",
//     amount: "25,000",
//     price: "$0.005",
//     total: "$125.00",
//     date: "2024-01-14 09:15",
//     status: "completed"
//   },
//   {
//     id: "3",
//     type: "buy",
//     token: "MTF",
//     amount: "100,000",
//     price: "$0.003",
//     total: "$300.00",
//     date: "2024-01-13 16:45",
//     status: "pending"
//   },
//   {
//     id: "4",
//     type: "sell",
//     token: "DFP",
//     amount: "5,000",
//     price: "$0.004",
//     total: "$20.00",
//     date: "2024-01-12 11:20",
//     status: "failed"
//   }
// ] as const


  //const launchDate = new Date('2024-03-01T00:00:00')
  // const [selectedToken, setSelectedToken] = useState<typeof earlyTokens[0] | null>(null);

  // const handleBuyNow = (token: typeof earlyTokens[0]) => {
  //   setSelectedToken(token);
  // };

  // const handleCloseModal = () => {
  //   setSelectedToken(null)
  // }




///////////////////

interface RecoveryRequest {
  date: Date | Timestamp; // Allow both Date and Firestore Timestamp
  id: string;
  name: string;
  potentialReturn: string;
  price: string;
  profitLoss: string;
  status: string;
  supply: string;
  symbol: string;
  
}
  
interface TokenData {
  balance: string;
  value: string;
  change: string;
  isPositive: boolean;
  symbol: string;
}

 



//////////////////////////////////////////////

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



const TokenPreReleaseTab: React.FC = () => {
//const OverviewTab: React.FC<OverviewTabProps> = ({  


const [email, setEmail] = React.useState<string | null>(null);
const [userName, setUserName] = React.useState<string | null>(null);
const [, setLoadingRequests] = React.useState(true);
const [, setLoadingg] = React.useState(false);
const [requests, setRequests] = React.useState<RecoveryRequest[]>([]);


//


///
  const [balanceData, setBalanceData] = useState<TokenData | null>(null);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("User not logged in.");
        setLoadingg(false);
        return;
      }

     // setUserEmail(user.email);
      setUserName(user.displayName);
      setLoadingg(true);

      try {
        const balancesRef = collection(db, "users", user.uid, "Prereleasetokenbalance");
        const querySnapshot = await getDocs(balancesRef);

        let tokenData: TokenData | null = null;
        querySnapshot.forEach((doc) => {
          tokenData = doc.data() as TokenData;
        });

        if (tokenData) {
          setBalanceData(tokenData);
        } else {
          console.error("No data found for the user's token balance.");
        }
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
//
React.useEffect(() => {
  // Listen for changes in the authentication state
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user && user.email) { 
      // Ensure user and email are defined
      setEmail(user.email); 
      setUserName(user.displayName || "User"); // Provide a fallback for displayName
      fetchUserRequests(); // Fetch all requests
    } else {
      setEmail(null); // Reset email if user is not authenticated
    }
  });

  // Clean up the listener on component unmount
  return () => unsubscribe();
}, []);

const fetchUserRequests = async () => {
  setLoadingRequests(true);
  setLoadingg(true);

  try {
    // Reference the 'Prereleasetoken' collection
    const requestsCollection = collection(db, "Prereleasetoken");
    
    // Fetch all documents from the collection
    const querySnapshot = await getDocs(requestsCollection);

    // Map through documents to extract request data
    const userRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread all other document fields
      date: doc.data().date instanceof Timestamp ? doc.data().date.toDate() : doc.data().date,

    } as RecoveryRequest));

    // Update the requests state with the fetched data
    setRequests(userRequests);
  } catch (error) {
    console.error("Error fetching user requests: ", error);
  } finally {
    // Ensure loading states are reset
    setLoadingg(false);
    setLoadingRequests(false);
  }
};


const [selectedToken, setSelectedToken] = useState<RecoveryRequest | null>(null);

const handleBuyNow = (request: RecoveryRequest) => {
 // console.log('Buy Now clicked for:', request);
  setSelectedToken(request);
};



const handleCloseModal = () => {
  setSelectedToken(null)
}


  
//}) => {
  // const [, setCurrentPage] = useState<string>('');

  // //const { toast } = ToastContainer();
  // const [btcBalance, setBtcBalance] = useState<number | 0>(0);
  // const [ethBalance, setEthBalance] = useState<number | 0>(0);
  // const [dogeBalance, setDogeBalance] = useState<number | 0>(0);
  // const [usdtBalance, setUsdtBalance] = useState<number | 0>(0);
  // const [currentUser , setCurrentUser ] = useState<User | null>(null);
 
  // const [recBalance , setRecBalance ] = useState<number | 0>(0);
  // const [ ,setHideVerification] = useState(false);
  // const [isVerified, setIsVerified] = useState(false);
  // const memoizedShowToast = React.useCallback(showToast, []);


  // const [cryptoRates, setCryptoRates] = useState<Record<string, number>>({
  //   btc: 0,
  //   eth: 0,
  //   doge: 0,
  //   usdt: 0,
  //   rec: 0,
  // });

  // // useEffect(() => {
  //   // Fetch cryptocurrency prices from CoinGecko
  //   const fetchCryptoPrices = async () => {
  //     try {
  //       const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,tether&vs_currencies=usd');
  //       const data = await response.json();
  //       setCryptoRates({
  //         btc: data.bitcoin.usd,
  //         eth: data.ethereum.usd,
  //         doge: data.dogecoin.usd,
  //         usdt: data.tether.usd,
  //       });
  //     } catch {
  //       //console.error('Error fetching crypto prices:', error);
  //       showToast({
  //         title: 'Error',
  //         description: 'Could not fetch cryptocurrency prices',
  //         variant: 'error',
  //       });
  //     }
  //   };

  //   fetchCryptoPrices(); // Fetch BTC price on component mount

  //   const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setCurrentUser (user);

  //       // Fetch user data from Firestore
  //       try {
  //         const userRef = doc(db, 'users', user.uid);
  //         const userDoc = await getDoc(userRef);
  //         if (userDoc.exists()) {
  //           const userData = userDoc.data();
  //           setIsVerified(userData?.isVerified === true);
  //           setHideVerification(userData?.hideVerification === true); // Fetch hideVerification from Firestore


  //           setBtcBalance(userData.btc || 0);
  //           setRecBalance(userData.rec || 0);
  //           setEthBalance(userData.eth || 0);
  //           setDogeBalance(userData.doge || 0);
  //           setUsdtBalance(userData.usdt || 0);
  //         } else {
           
  //           console.log('No such document!');
  //         }
  //       } catch (error) {
  //         console.error('Error fetching user data: ', error);
  //         showToast({
  //           title: 'Error',
  //           description: 'Could not fetch user data',
  //           variant: 'success',
  //         });
  //       }
  //     } else {
  //       setHideVerification(false);
  //       setIsVerified(false);
  //       setCurrentUser (null); // Reset current user if not authenticated
  //     }
  //   });

  //   return () => unsubscribeAuth(); // Cleanup subscription on unmount
  // },  [memoizedShowToast]);


  // Calculate total balance based on coin balances and crypto rates
  // const calculateTotalBalance = () => {
  //   return (
  //     (btcBalance|| 0) * cryptoRates.btc +
  //     (ethBalance || 0) * cryptoRates.eth +
  //     (dogeBalance || 0) * cryptoRates.doge +
  //     (usdtBalance || 0) * cryptoRates.usdt +
  //     (recBalance || 0) 
  //   );
  // };

  // // Animation variants for Framer Motion
  // const cardVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { opacity: 1, y: 0 },
  // };



  return (
    <div className="min-h-screen scroll-smooth bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-800 text-white overflow-hidden">
    <ParticleBackground />
    
    {/* Hero Section with enhanced animation */}
    <section className="relative container mx-auto px-4 py-32">
      <div className="text-center space-y-8 relative z-10">
        <HologramEffect>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl opacity-30 animate-pulse" />
            <h1 className="relative text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-500 animate-gradient-x leading-tight">
              Crypto Token<br />Pre-Release
            </h1>
          </div>
        </HologramEffect>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
          Be among the first to participate in the next generation of decentralized banking
        </p>
        <div className="flex justify-center gap-6 animate-fade-in-up delay-200">
          <Button 
            size="lg" 
            className="relative group overflow-hidden bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-none transition-all duration-300 hover:scale-105"
            onClick={() => {
              const section = document.getElementById('token-launches');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}>
            <span className="relative z-10 flex items-center gap-2">
              Buy Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(147,51,234,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-matrix-rain" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="relative overflow-hidden border-purple-500/50 text-purple-400 hover:bg-purple-500/10 px-8 py-6 text-lg rounded-none transition-all duration-300 hover:scale-105 group"
            onClick={() => {
              const section = document.getElementById('learn-more');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}>
            <span className="relative z-10">Learn More</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x" />
          </Button>
        </div>
      </div>

      {/* Enhanced Countdown Timer Section */}
      <div className="mt-24 relative">
        <div className="text-center space-y-8">
          <HologramEffect>
            <h2 className="text-3xl md:text-4xl font-bold inline-block bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
              Token Sale Starts In
            </h2>
          </HologramEffect>
          <div className="max-w-4xl mx-auto px-4">
          <CountdownTimer />

          </div>
        </div>
      </div>
    </section>

   {/* Enhanced Early Tokens Table */}
   <section   id="token-launches"
className="container mx-auto px-4 py-20 relative z-10">
        <CyberBorder>
          <Card className="w-full bg-gray-800/50 border-0">
            <CardHeader>
              <HologramEffect>
                <CardTitle className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Upcoming Token Launches
                </CardTitle>
              </HologramEffect>
              <CardDescription className="text-gray-400 text-lg">
                Complete list of upcoming token launches and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-none border border-purple-500/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-500/20 hover:bg-purple-500/5">
                      <TableHead className="text-purple-300">Name</TableHead>
                      <TableHead className="text-purple-300">Symbol</TableHead>
                      <TableHead className="text-purple-300">Initial Price</TableHead>
                      <TableHead className="text-purple-300 hidden md:table-cell">Total Supply</TableHead>
                      <TableHead className="text-purple-300 hidden md:table-cell">Launch Date</TableHead>
                      <TableHead className="text-purple-300">24h Change</TableHead>
                      <TableHead className="text-purple-300">Potential Returns</TableHead>
                      <TableHead className="text-purple-300">Status</TableHead>
                      <TableHead className="text-purple-300">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {requests.length > 0 ? (
  requests
    .sort((a, b) => {
      const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
      const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
      return dateB.getTime() - dateA.getTime(); // Sort in descending order
    })
    .map((request) => (
                        <TableRow key={request.id}
                        className="border-purple-500/20 transition-all duration-300 hover:bg-purple-500/10"
                      >
                        <TableCell className="font-medium text-white">{request.name}</TableCell>
                        <TableCell className="text-purple-300">{request.symbol}</TableCell>
                        <TableCell className="text-purple-300">${request.price}</TableCell>
                        <TableCell className="text-purple-300 hidden md:table-cell">{request.supply}</TableCell>
                        <TableCell  className="text-purple-300 hidden md:table-cell">
  {request.date
    ? format(
        request.date instanceof Timestamp
          ? request.date.toDate() // Convert Firestore Timestamp to Date
          : request.date, // Use Date directly
        'MMMM dd, yyyy'
      )
    : 'Invalid Date'}
</TableCell>
                        <TableCell className={`font-medium ${
                          request.profitLoss.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {request.profitLoss}
                        </TableCell>
                        <TableCell className="text-purple-400 font-medium">{request.potentialReturn}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium transition-all duration-300
                            ${request.status === 'Upcoming' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
                              request.status === 'Whitelist Open' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                              request.status === 'Registration Open' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' :
                            'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'}`}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={`
                              group relative overflow-hidden
                              ${request.status === 'Upcoming' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 hover:text-white'}
                              border-purple-500/20 text-purple-400 transition-all duration-300 rounded-none
                            `}
                            disabled={request.status === 'Upcoming'}
                            onClick={() => handleBuyNow(request)} // Pass the current request
                            >
                            <span className="relative z-10 flex items-center gap-2">
                              Buy Now
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Hi {userName},<br />
                          No Recovery Request Found for {email}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </CyberBorder>
      </section>

      {balanceData && (
  <section className="container mx-auto px-4 py-20 relative z-10">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
        Your Pre-Release Balance
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Track your pre-release token holdings and their current value
      </p>
    </div>
    <div className="">
      <BalanceCard />
    </div>
  </section>
)}

    {/* Transaction History Section */}
    <section className="container mx-auto px-4 py-20 relative z-10">
      {/* <TransactionHistory transactions={transactions} /> */}
    </section>

    {/* Enhanced Features Section */}
    <section className="container mx-auto px-4 py-20 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Why Choose CryptoBank Token?
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Built with security, scalability, and sustainability in mind
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => (
          <Card 
            key={feature.title} 
            className="group bg-gray-800/50 border-purple-500/20 transition-all duration-500 hover:scale-105 hover:bg-gray-800/80"
          >
            <CardHeader>
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <feature.icon className="w-16 h-16 text-purple-400 relative z-10 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>

      {/* Key Metrics Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Key Metrics</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track our growth and performance metrics
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric) => (
            <MetricsCard key={metric.title} {...metric} />
          ))}
        </div>
      </section>

      {/* Token Utility Section */}
      <section id="learn-more" className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Token Utility</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore the various benefits and use cases of our token
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {utilityFeatures.map((feature) => (
            <Card key={feature.title} className="bg-gray-800/50 border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-800/80">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Our Partners</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Working with industry leaders to build the future of finance
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
          {partners.map((partner) => (
            <PartnerLogo key={partner.name} {...partner} />
          ))}
        </div>
      </section>


      {/* Token Details Tabs
      <section className="container mx-auto px-4 py-20 relative z-10">
        <GlowCard>
          <Card className="w-full bg-gray-800/50 border-0">
            <CardHeader>
              <CardTitle className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Token Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid grid-cols-3 gap-4 bg-gray-900">
                  <TabsTrigger value="overview" className="transition-all duration-300 data-[state=active]:bg-purple-500 data-[state=active]:text-white">Overview</TabsTrigger>
                  <TabsTrigger value="utility" className="transition-all duration-300 data-[state=active]:bg-purple-500 data-[state=active]:text-white">Utility</TabsTrigger>
                  <TabsTrigger value="security" className="transition-all duration-300 data-[state=active]:bg-purple-500 data-[state=active]:text-white">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4">
                    <h3 className="text-xl font-semibold">CryptoBank Token Overview</h3>
                    <p className="text-gray-400">
                      CryptoBank Token (CBT) is designed to revolutionize decentralized banking through innovative DeFi solutions.
                      Our ecosystem combines traditional banking services with blockchain technology.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="font-semibold">Token Type</div>
                        <div className="text-gray-400">ERC-20</div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-semibold">Network</div>
                        <div className="text-gray-400">Ethereum</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="utility" className="space-y-4">
                  <div className="grid gap-4">
                    <h3 className="text-xl font-semibold">Token Utility</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Governance voting rights
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Platform fee discounts
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Staking rewards
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Exclusive feature access
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="security" className="space-y-4">
                  <div className="grid gap-4">
                    <h3 className="text-xl font-semibold">Security Measures</h3>
                    <div className="space-y-4 text-gray-400">
                      <p>
                        Our smart contracts have undergone rigorous security audits by leading firms:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>CertiK Security Audit - Score: 95/100</li>
                        <li>PeckShield Verification - Passed</li>
                        <li>SlowMist Security Assessment - Approved</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </GlowCard>
      </section> */}


      {/* Roadmap Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Development Roadmap</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our strategic plan for continuous growth and development
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {roadmapSteps.map((step) => (
            <Card key={step.phase} className="bg-gray-800/50 border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-800/80 hover:border-purple-500/50">
              <CardHeader>
                <Rocket className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle>{step.phase}: {step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Tokenomics</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-800/80 hover:border-purple-500/50">
            <CardHeader>
              <Coins className="w-8 h-8 mb-4 text-purple-400" />
              <CardTitle>Total Supply</CardTitle>
              <CardDescription className="text-gray-400">
                1,000,000,000 CBT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Fixed supply with deflationary mechanism through token burning
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-800/80 hover:border-purple-500/50">
            <CardHeader>
              <Users className="w-8 h-8 mb-4 text-purple-400" />
              <CardTitle>Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Fair Launch Model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• 40% Public Sale</li>
                <li>• 30% Liquidity Pool</li>
                <li>• 20% Development</li>
                <li>• 10% Team (Locked)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gray-800/80 hover:border-purple-500/50">
            <CardHeader>
              <Wallet className="w-8 h-8 mb-4 text-purple-400" />
              <CardTitle>Initial Price</CardTitle>
              <CardDescription className="text-gray-400">
                0.001 ETH per CBT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Soft cap: 1000 ETH<br />
                Hard cap: 5000 ETH
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Buy Token Modal */}
{selectedToken && (
  <BuyTokenModal
    isOpen={!!selectedToken}
    onClose={handleCloseModal}
    tokenName={selectedToken.name}
    tokenSymbol={selectedToken.symbol}
    tokenPrice={selectedToken.price}
    tokenSupply={selectedToken.supply}
    tokenPotentialReturn={selectedToken.potentialReturn}
    tokenProfitLoss={selectedToken.profitLoss}
    

  />
)}

  </div>
  );

};

export default TokenPreReleaseTab;