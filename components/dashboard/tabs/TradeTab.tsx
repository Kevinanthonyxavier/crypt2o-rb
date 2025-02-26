import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from "firebase/firestore"; 
import { onAuthStateChanged } from "firebase/auth"; 
import { db, auth } from "@/lib/firebase"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { format } from 'date-fns';
//import { showToast } from "@/utils/toast";

interface Trade {
  
  email: string; // User's email
  name: string; // User's email
 
  pair: string;
 
  buyPrice: number;
  sellPrice: number;
 
  profitLoss: number;
  status: "Win" | "Loss" | "Pending";
  id: string;
  customerName: string;
  customerEmail: string;
  cryptoPair: string;
  customerId: string;
  type: string;
  amount: string;
  investmentAmount: string;
  tradeResult: string; // Add "closed" here!
  createdAt: Timestamp;
  date: Timestamp;
}

const TradeTab: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [showTradePopup, setShowTradePopup] = useState(false);
  const [loadingg, setLoadingg] = useState<boolean>(true);
  const [aiToggle, setAiToggle] = useState(false);
  const [canToggle, ] = useState(false)
  const [showPopup, setShowPopup] = useState(false);


  // Fetch current user and their trades
  useEffect(() => {
    const fetchUserTrades = async () => {
      setLoading(true);
      setError(null);
      

      try {
        // Watch for auth state changes
        onAuthStateChanged(auth, async (user) => {
          if (user?.email) {
            setUserEmail(user.email);
            setUserName(user.displayName);
            setLoadingg(true);

            // Query trades collection for trades belonging to the current user
            const tradesCollection = collection(db, "trades");
            const tradesQuery = query(tradesCollection, where("customerEmail", "==", user.email));
            const snapshot = await getDocs(tradesQuery);

            const tradeData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Trade[];

            setTrades(tradeData);
            setLoadingg(false);
          } else {
            setError("No user logged in.");
            setTrades([]);
          }
        });
      } catch (err) {
        console.error("Error fetching trades:", err);
        setError("Failed to load trade data. Please try again later.");
      } finally {
        setLoading(false);
        setLoadingg(false);

      }
    };

    fetchUserTrades();
  }, []);

  const handlePlaceOrder = () => {
    // Check if the user is allowed to place an order
    if (userEmail) {
      setShowTradePopup(true);
    } else {
      setError("You must be logged in to place an order.");
    }
  };

  //

  useEffect(() => {
    const fetchAIToggleStatus = async () => {
      const user = auth.currentUser;
  
      if (user) {
        const statusDocRef = doc(db, "users", user.uid, );
  
        try {
          const docSnap = await getDoc(statusDocRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAiToggle(data.isAIActive || false);
          } else {
            setAiToggle(false);
          }
        } catch (error) {
          console.error("Failed to fetch AI trading status:", error);
        }
      }
    };
  
    fetchAIToggleStatus();
  }, []);
  
  // const handleAIToggle = async () => {
  //   const newStatus = !aiToggle;
  //   setAiToggle(newStatus);
  //   const user = auth.currentUser;
  
  //   if (user) {
  //     const statusDocRef = doc(db, "users", user.uid, );
  
  //     try {
  //       await setDoc(statusDocRef, { isAIActive: newStatus }, { merge: true });
  //       showToast({
  //         title: "Success",
  //         description: `AI Trading ${newStatus ? "enabled" : "disabled"}.`,
  //         variant: "success",
  //       });
  //     } catch (error) {
  //       console.error("Failed to update AI trading status:", error);
  //     }
  //   }
  // };

  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 px-4 sm:px-6"
    >
      {/* Header */}
      <div className="space-y-4 sm:space-y-6 flex flex-col sm:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Trade Cryptocurrencies
          </h2>
          <p className="text-base sm:text-xl text-gray-400">
            Buy and sell cryptocurrencies instantly
          </p>
        </div>
  
        {/* AI Trading Toggle */}
<div className="flex space-x-2 sm:space-x-4">
  <button
    onClick={() => {
      
        setShowPopup(true); // Show popup when toggling is disabled
      
      
    }}
   
    className={`px-4 py-2 text-sm sm:text-lg font-medium rounded-lg transition-colors duration-200 ${
      aiToggle
        ? "bg-green-500/20 text-orange-400 hover:bg-green-500/30 motion-safe:animate-[pulse_0.5s_ease-in-out_infinite]"
        : "bg-orange-500/20 text-orange-400"
    } ${!canToggle ? "cursor-not-allowed " : ""}`}
  >
    {aiToggle ? "AI Trading On" : "AI Trading Off"}
  </button>

  {/* Popup Dialog */}
  {showPopup && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold">Action Disabled</h2>
        <p className="mt-2 text-gray-400">
          You are not allowed to toggle AI Trading at this moment. Please try again later.
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
            onClick={() => setShowPopup(false)} // Close the popup
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>
</div>
  
      {/* Place Order Card */}
      <div
        style={{ borderRadius: "2rem" }}
        className="py-4 mx-4 sm:mx-12 flex items-center justify-center bg-gray-800 border border-gray-700"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card
            className="w-full sm:w-[500px] lg:w-[600px] bg-gray-800 card-no-border"
          >
            <div className="py-6">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-3xl text-white">
                  Place Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Buy/Sell Buttons */}
                <div className="flex space-x-2">
                  <Button
                    variant={tradeType === "buy" ? "default" : "outline"}
                    onClick={() => setTradeType("buy")}
                    className={`text-sm sm:text-lg flex-1 bg-green-500 hover:bg-green-600 text-white ${
                      tradeType === "buy" ? "border-4 border-purple-600" : "border-none"
                    }`}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    Buy
                  </Button>
                  <Button
                    variant={tradeType === "sell" ? "default" : "outline"}
                    onClick={() => setTradeType("sell")}
                    className={`text-sm sm:text-lg flex-1 bg-red-500 hover:bg-red-600 text-white ${
                      tradeType === "sell" ? "border-4 border-purple-600" : "border-none"
                    }`}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    Sell
                  </Button>
                </div>
  
                {/* Cryptocurrency Selector */}
                <Select>
                  <SelectTrigger
                    style={{ borderRadius: "0.5rem" }}
                    className="text-sm sm:text-lg bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white">
                    <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                    <SelectItem value="usdt">Tether (USDT)</SelectItem>
                  </SelectContent>
                </Select>
  
                {/* Amount Input */}
                <Input
                  type="number"
                  placeholder="Amount"
                  className="w-full text-sm sm:text-lg bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: "0.5rem" }}
                />
  
                {/* Place Order Button */}
                <Button
                  className="w-full text-sm sm:text-lg bg-purple-500 hover:bg-purple-600 text-white"
                  style={{ borderRadius: "0.5rem" }}
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>
  
      {/* Recent Trades */}
      <motion.div className="px-4 sm:px-12 pb-12">
        <Card
          style={{ borderRadius: "2rem" }}
          className="bg-gray-800 border-gray-700 shadow-lg p-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <CardHeader>
              <CardTitle className="text-xl sm:text-3xl text-white">
                Recent Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingg ? (
                <div className="flex flex-col justify-center items-center h-40">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white mt-2">Loading your transactions...</p>
                </div>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : trades.length === 0 ? (
                <p className="text-center text-white">
                  Hi {userName}, <br />
                  No trades found for {userEmail}.
                </p>
              ) : (
                <Table className="text-sm sm:text-base text-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Pair</TableHead>
                      <TableHead>Type</TableHead>
                     
                      <TableHead>Investment Amount</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Trade Result
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>
                          {trade.date instanceof Timestamp
                            ? format(trade.date.toDate(), "dd-MMM-yyyy")
                            : trade.date}
                        </TableCell>
                        <TableCell>{trade.cryptoPair}</TableCell>
                        <TableCell>{trade.type}</TableCell>
                        <TableCell>${trade.investmentAmount}</TableCell>
                        <TableCell>${trade.amount}</TableCell>
                       
                        <TableCell>
                        <span className={`inline-flex items-center px-3 py-1 text-xl font-medium transition-all duration-300
                        ${trade.tradeResult === 'Loss' ? 'bg-orange-500/20 text-orange-400 ' :
                                                          trade.tradeResult === 'Profit' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 animate-pulse' :
                                                        'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'}`}>
                                                        {trade.tradeResult}
                                                        </span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>
      <Dialog open={showTradePopup} onOpenChange={setShowTradePopup}>
  <DialogContent style={{ borderRadius: '1rem' }} className="bg-gray-800 text-white">
    <DialogHeader>
      <DialogTitle>Trade Execution Restricted</DialogTitle>
    </DialogHeader>
    <p>AI Trading is turned on.</p>
    <DialogFooter>
      <Button style={{ borderRadius: '0.5rem' }} onClick={() => setShowTradePopup(false)} className="bg-purple-500 hover:bg-purple-600">Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </motion.div>
  );
  
};

export default TradeTab;