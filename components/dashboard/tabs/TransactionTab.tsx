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

import { collection, query, where, getDocs, Timestamp } from "firebase/firestore"; 
import { onAuthStateChanged } from "firebase/auth"; 
import { db, auth } from "@/lib/firebase"; 


interface Trade {
  id: string;
  email: string; // User's email
  date: Timestamp;
  currency: string;
  method: string;
  type: "Buy" | "Sell";
  buyPrice: number;
  sellPrice: number;
  amount: string;
  profitLoss: number;
  status: "Completed" | "Waiting" | "Pending" | "Failed" | "Processing";
  tokenSymbol: string;
  tokenPrice: string;
  totalAmount: string;

}

interface Withdrawal {
  id: string;
  userEmail: string;
  amount: number;
  currency: string;
  walletAddress: string;
  commissionFee: number;
  date: Timestamp;
  status: "Completed" | "Waiting" | "Pending" | "Failed" | "Processing";
  type: string;
  method: string;
  tokenSymbol: string;
  tokenPrice: string;
  totalAmount: string;

}


interface Deposit {
  id: string;
  email: string;
  date: Timestamp;
  currency: string;
  method: string;
  amount: string;
  type: "Deposit" | "Withdrawal" | "Interest" |"Trade";
  status: "Completed" | "Waiting" | "Pending" | "Failed" | "Processing";
  tokenSymbol: string;
  tokenPrice: string;
  totalAmount: string;

}

interface Interest {
  id: string;
  email: string;
  date: Timestamp;
  currency: string;
  method: string;
  amount: string;
  type: string;
  status: "Completed" | "Waiting" | "Pending" | "Failed" | "Processing";
  tokenSymbol: string;
  tokenPrice: string;
  totalAmount: string;

}


interface Prereleasetokenbought {
  id: string;
  email: string;
  date: Timestamp;
  tokenName: string;
  tokenSymbol: string;
  tokenSupply: string;
  tokenPrice: string;
  tokenPotentialReturn: string;
  tokenProfitLoss: string;
  type: string;
  status: "Completed" | "Waiting" | "Pending" | "Failed" | "Processing";
  currency: string;
  method: string;
  amount: string;
  totalAmount: string;
}


const TransactionTab: React.FC = () => {
  const [combinedData, setCombinedData] = useState<(Trade | Withdrawal | Deposit | Interest | Prereleasetokenbought)[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingg, setLoadingg] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserTransactionTab = async () => {
      setLoading(true);
      setError(null);

      try {
        onAuthStateChanged(auth, async (user) => {
          if (user?.email) {
            setUserEmail(user.email);
            setUserName(user.displayName);
            setLoadingg(true);

           // Fetch trades
           const tradesCollection = collection(db, "trades");
           const tradesQuery = query(tradesCollection, where("email", "==", user.email));
           const tradesSnapshot = await getDocs(tradesQuery);
           const tradeData = tradesSnapshot.docs.map((doc) => ({
             id: doc.id,
             ...doc.data(),
           })) as Trade[];

           
           // Fetch withdrawals
           const withdrawalsCollection = collection(db, "withdrawals");
           const withdrawalsQuery = query(withdrawalsCollection, where("userEmail", "==", user.email));
           const withdrawalsSnapshot = await getDocs(withdrawalsQuery);
           const withdrawalData = withdrawalsSnapshot.docs.map((doc) => ({
             id: doc.id,
             ...doc.data(),
           })) as Withdrawal[];

           

            // Fetch deposits
            const depositsCollection = collection(db, "deposits");
            const depositsQuery = query(depositsCollection, where("userEmail", "==", user.email));
            const depositsSnapshot = await getDocs(depositsQuery);
            const depositData = depositsSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Deposit[];

             // Fetch interest
             const interestsCollection = collection(db, "interests");
             const interestsQuery = query(interestsCollection, where("userEmail", "==", user.email));
             const interestsSnapshot = await getDocs(interestsQuery);
             const interestData = interestsSnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
             })) as Interest[];

             // Fetch interest
             const prereleasetokenboughtCollection = collection(db, "prereleasetokenbought");
             const prereleasetokenboughtQuery = query(prereleasetokenboughtCollection, where("userEmail", "==", user.email));
             const prereleasetokenboughtSnapshot = await getDocs(prereleasetokenboughtQuery);
             const prereleasetokenboughtData = prereleasetokenboughtSnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
             })) as Prereleasetokenbought[];


            // Combine all data
            const combined = [...tradeData, ...withdrawalData, ...depositData, ...interestData, ...prereleasetokenboughtData].sort((a, b) => {
             const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
             const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
             return dateB.getTime() - dateA.getTime();
           });
           setCombinedData(combined);
           setLoadingg(false);
         } else {
           setError("No user logged in.");
           
         }
       });
     } catch (err) {
       console.error("Error fetching trades or withdrawals:", err);
       setError("Failed to load data. Please try again later.");
     } finally {
       setLoading(false);
       setLoadingg(false);
     }
   };

    fetchUserTransactionTab();
  }, []);

  const getStatusColor = (status: Trade["status"] | Withdrawal["status"]) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Processing':
        return 'bg-blue-500';
      case 'Failed':
        return 'bg-red-500';
        case 'Waiting':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: Trade["type"] | Withdrawal["type"] |  Deposit["type"] |  Interest["type"]) => {
    switch (type) {
      case 'Deposit':
        return 'bg-green-700';
      case 'Buy':
        return 'bg-green-700';
      case 'Sell':
        return 'bg-Orange-700';
      case 'Interest':
        return 'bg-yellow-500';
      case 'Trade':
        return 'text-blue-500';
      case 'Withdrawal':
        return 'bg-orange-700';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
 <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-xl font-semibold text-primary">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="space-y-6"
>
  <div className="space-y-4">
    <h2 className="pl-4 text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
      Transaction History
    </h2>
    <p className="pl-6 text-base sm:text-xl text-gray-400">
      View your recent transactions
    </p>
  </div>

  <motion.div className="px-4 sm:px-12 py-6 rounded-lg">
    <Card style={{ borderRadius: '2rem' }} className="bg-gray-800 border-gray-700 rounded-lg shadow-lg p-4">
      <motion.div >
        <CardHeader>
          <CardTitle className="text-xl sm:text-3xl text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div>
            <div className="p-2 sm:p-4">
              {loadingg ? (
                <div className="flex flex-col justify-center items-center h-40">
                  {/* Tailwind CSS spinner */}
                  <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white mt-2 text-sm sm:text-base">Loading your transactions...</p>
                </div>
              ) : error ? (
                <p className="text-red-500 text-sm sm:text-base">{error}</p>
              ) : combinedData.length === 0 ? (
                <p className="text-lg sm:text-xl text-white text-center">
                  Hi {userName}, <br />
                  No transactions found for {userEmail}.
                </p>
              ) : (
                <Table className="text-sm sm:text-base text-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm sm:text-lg font-bold text-purple-500">Date</TableHead>
                      <TableHead className="text-sm sm:text-lg font-bold text-purple-500">Type</TableHead>
                      <TableHead className="text-sm sm:text-lg font-bold text-purple-500">Method</TableHead>
                      <TableHead className="text-sm sm:text-lg font-bold text-purple-500">Currency</TableHead>
                      <TableHead className="text-sm sm:text-lg font-bold text-purple-500">Amount</TableHead>
                      <TableHead className="text-sm sm:text-lg font-bold text-purple-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {combinedData.map((item) => (
                      <TableRow key={item.id} className="text-xs sm:text-sm">
                        <TableCell className="text-white">{item.date instanceof Timestamp ? item.date.toDate().toLocaleString() : item.date}</TableCell>
                        <TableCell>
                          <Badge className={`${getTypeColor(item.type)} text-xs sm:text-sm`}>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs sm:text-sm ${
                              item.method === 'Buy'
                                ? 'text-green-500'
                                : item.method === 'Sell'
                                ? 'text-red-500'
                                : item.method === 'Crypto'
                                ? 'text-yellow-500'
                                : 'text-blue-500'
                            }`}
                          >
                            {item.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{item.currency}{item.tokenSymbol}</TableCell>
                        <TableCell className="text-white">{item.amount}{item.totalAmount}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(item.status)} text-xs sm:text-sm`}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </motion.div>
        </CardContent>
      </motion.div>
    </Card>
  </motion.div>
</motion.div>
  );
};

export default TransactionTab;