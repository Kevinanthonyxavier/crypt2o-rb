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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore"; 
import { onAuthStateChanged } from "firebase/auth"; 
import { db, auth } from "@/lib/firebase"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { format } from 'date-fns';

interface Trade {
  id: string;
  email: string; // User's email
  name: string; // User's email
  date: Timestamp;
  pair: string;
  type: "Buy" | "Sell";
  buyPrice: number;
  sellPrice: number;
  amount: number;
  profitLoss: number;
  status: "Win" | "Loss" | "Pending";
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
            const tradesQuery = query(tradesCollection, where("email", "==", user.email));
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-6">
        <h2 className="pl-8 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Trade Cryptocurrencies</h2>
        <p className="pl-12 text-xl text-gray-400">Buy and sell cryptocurrencies instantly</p>
      </div>

      <div  style={{ borderRadius: '2rem' }} className="py-4 mx-12 flex items-center justify-center bg-gray-800 border border-gray-700"> {/* Full-height centering container with gray background */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card
          // Maintain margin and border-radius
          
          className="mx-8 w-auto sm:w-[500px] sm:w-py-8 md:w-[500px] lg:w-[600px]  h-auto  bg-gray-800 card-no-border" // Use the same gray color for the card
        >
          <div className="  items-center justify-center w-[800] py-8"> {/* Centering content */}
            <CardHeader className="w-full text-center">
              <CardTitle className="text-3xl text-white">Place Order</CardTitle>
            </CardHeader>
            <CardContent className=" pb-12 w-full sm:w-[500px] md:w-[500px] lg:w-[600px] h-auto ">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button 
                    variant={tradeType === 'buy' ? 'default' : 'outline'}
                    onClick={() => setTradeType('buy')}
                    style={{ borderRadius: '0.5rem' }}
                    className={`text-lg flex-1 bg-green-500 hover:bg-green-600 hover:text-white-600 text-white ${tradeType === 'buy' ? 'border-4 border-purple-600' : 'border-none'}`}
                  >
                    Buy
                  </Button>
                  <Button 
                    variant={tradeType === 'sell' ? 'default' : 'outline'}
                    onClick={() => setTradeType('sell')}
                    style={{ borderRadius: '0.5rem' }}
                    className={`text-lg flex-1 bg-red-500 hover:bg-red-600 hover:text-white-600 text-white ${tradeType === 'sell' ? 'border-4 border-purple-600' : 'border-none'}`}
                  >
                    Sell
                  </Button>
                </div>
                <Select>
                  <SelectTrigger 
                    style={{ borderRadius: '0.5rem' }} 
                    className="text-lg bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <SelectValue 
                      placeholder="Select cryptocurrency" 

                    />
                  </SelectTrigger>
                  <SelectContent className="text-lg bg-gray-700 text-white border border-gray-600">
                    <SelectItem className="text-lg" value="btc">Bitcoin (BTC)</SelectItem>
                    <SelectItem className="text-lg" value="eth">Ethereum (ETH)</SelectItem>
                    <SelectItem className="text-lg" value="usdt">Tether (USDT)</SelectItem>
                  </SelectContent>
                </Select>


                <Input 
                  style={{ borderRadius: '0.5rem' }} 
                  type="number" 
                  placeholder="Amount" 
                  className="text-lg  bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <Button 
                  style={{ borderRadius: '0.5rem' }} 
                  className="text-lg w-full bg-purple-500 hover:bg-purple-600 text-white" 
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </CardContent>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div className='px-12 pb-36 py-8 rounded-lg' > 
  <Card style={{ borderRadius: '2rem' }} className="bg-gray-800 border-gray-700 rounded-lg shadow-lg p-4">
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}> 
    <CardHeader>
      <CardTitle className="mx-4 text-3xl text-white">Recent Trades</CardTitle>
    </CardHeader>
    <CardContent>
    {loadingg ? (
  <div className="flex flex-col justify-center items-center h-40">
    {/* Tailwind CSS spinner */}
    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-white mt-2">Loading your transactions...</p>
  </div>
) : error ? (
        <p className="text-red-500">{error}</p>
      ) : trades.length === 0 ? (
        
        <p className="text-xl text-white text-center" >Hi {userName}, <br/>No trades found for {userEmail}.</p>
      ) : (
        <Table className="text-base text-white">
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg font-bold text-purple-500">Date</TableHead>
              <TableHead className="text-lg font-bold text-purple-500">Pair</TableHead>
              <TableHead className="text-lg font-bold text-purple-500">Type</TableHead>
              <TableHead className="text-lg font-bold text-purple-500">Buy Price</TableHead>
              <TableHead className="text-lg font-bold text-purple-500">Sell Price</TableHead>
              <TableHead className="text-lg font-bold text-purple-500">Amount</TableHead>
              <TableHead className="text-lg font-bold text-purple-500">Profit/Loss</TableHead>
              <TableHead className="text-lg font-bold text-purple-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell className="text-base">
                  {trade.date instanceof Timestamp
                    ? format(trade.date.toDate(), 'dd-MMM-yyyy') // Full month name (e.g., December)
                    : trade.date}
                </TableCell>
                <TableCell>
                  {trade.pair}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      trade.type === "Buy" ? "text-green-500" : "text-blue-500"
                    }`}
                  >
                    {trade.type}
                  </Badge>
                </TableCell>
                <TableCell>${trade.buyPrice.toFixed(2)}</TableCell>
                <TableCell>${trade.sellPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {trade.amount} {trade.pair.split("/")[0]}
                </TableCell>
                <TableCell
                  className={`text-base ${
                    trade.profitLoss >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ${Math.abs(trade.profitLoss).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-base text-white 
                      ${trade.status === "Win" ? "bg-green-500" : ""}
                      ${trade.status === "Loss" ? "bg-red-500" : ""}
                      ${trade.status === "Pending" ? "bg-yellow-500" : ""}
                    `}
                  >
                    {trade.status}
                  </Badge>
                </TableCell>
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
    <p>You are not allowed to execute trades at this time.</p>
    <DialogFooter>
      <Button style={{ borderRadius: '0.5rem' }} onClick={() => setShowTradePopup(false)} className="bg-purple-500 hover:bg-purple-600">Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </motion.div>
  );
};

export default TradeTab;