"use client"

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";


interface Crypto {
  id: string;
  name: string;
  symbol: string;
}

interface RecoveryRequest {
  createdAt: Date; // Assuming createdAt is a Date object
  id: string;
  walletAddress: string;
  description: string;
  status: string;
  amount: string;
  type: string;
  submittedAt: string;
}

const CryptoRecoveryTab: React.FC = () => {
  const [email, setEmail] = React.useState<string | null>(null);
  const [walletAddress, setWalletAddress] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingg, setLoadingg] = React.useState(false);
  const [requests, setRequests] = React.useState<RecoveryRequest[]>([]);
  const [, setLoadingRequests] = React.useState(true);
  const [amount, setAmount] = React.useState("");
  //const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [userName, setUserName] = React.useState<string | null>(null);

  const [, setMissingFields] = React.useState<string[]>([]);



  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) { // Ensure user.email is not null
        setEmail(user.email);
        setUserName(user.displayName);
        
        fetchUserRequests(user.email); // Safe to call with user.email as string
      } else {
        setEmail(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const [cryptos, setCryptos] = useState<Crypto[]>([]);

  const [type, setType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  //const [selectedCrypto, setSelectedCrypto] = useState("");
  
  // Filter cryptos dynamically
  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
        );
        if (!response.ok) throw new Error("Failed to fetch cryptocurrencies");

        const data: Crypto[] = await response.json();
        setCryptos(data);
      } catch (error) {
        console.error("Error fetching cryptocurrencies:", error);
      }
    };

    fetchCryptos();
  }, []);


  const fetchUserRequests = async (userEmail: string) => {
    setLoadingRequests(true);
    setLoadingg(true);
   
    try {
      const requestsCollection = collection(db, 'cryptoRecoveryRequests');
      const q = query(requestsCollection, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);
      
      
      const userRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as RecoveryRequest));
      setLoadingg(false);
      setRequests(userRequests);
    } catch (error) {
      console.error("Error fetching user requests: ", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

     const user = getAuth().currentUser ;
        if (!user) {
          toast({
            title: "Error",
            description: "You need to be logged in to cancel a withdrawal.",
            variant: "destructive",
          });
          return;
        }
  
    if (!email || !amount || !type || !walletAddress || !description) {
      setError('All fields are required.');
      return;
    }
    //
    
    setMissingFields([]);
    //resetFieldss(); 
    //
    setError('');
    setSuccess('');
    setLoading(true);
  
    try {
      // Proceed to submit to Firestore
      const docRef = await addDoc(collection(db, 'cryptoRecoveryRequests'), {
        email,
        walletAddress,
        description,
        type,
        name: user.displayName ,
        amount,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });
  
      console.log("Document written with ID: ", docRef.id);
      setSuccess('Your recovery request has been submitted successfully!');
      
      // Refresh the list of requests after submitting
      fetchUserRequests(email);  // Refresh the requests list

      // Clear the wallet address and description fields
    setWalletAddress('');
    setDescription('');
    setAmount('');
    setType('');

    
    } catch (error) {
      console.error("Error submitting recovery request:", error);
      setError('Failed to submit recovery request. Please try again.');
    } finally {
      setLoading(false);
      setLoadingg(false);
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
      Crypto Recovery
    </h2>
    <p className="pl-6 sm:pl-12 text-base sm:text-xl text-gray-400">
      Recover lost or stuck cryptocurrency
    </p>
  </div>

  {/* Recovery Form */}
  <div
    style={{ borderRadius: '2rem' }}
    className="py-4 mx-4 sm:mx-12 flex items-center justify-center bg-gray-800 border border-gray-700"
  >
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="w-full sm:w-[500px] md:w-[600px] bg-gray-800 card-no-border">
        <div className="py-6 px-4">
          <CardHeader className="w-full text-center">
            <CardTitle className="text-2xl sm:text-3xl text-white">Recover Crypto Now</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email (Hidden) */}
              <div className="hidden">
                <Label className="text-base sm:text-lg text-white" htmlFor="recovery-email">
                  Email
                </Label>
                <Input
                  id="recovery-email"
                  type="email"
                  value={email || ''}
                  readOnly
                  className="bg-gray-700 text-white border-gray-600"
                  style={{ borderRadius: '0.5rem' }}
                />
              </div>
              

<div className="grid grid-cols-2 gap-1">
  {/* Amount */}
  <div className="space-y-2">
    <Label className="text-base sm:text-lg text-white" htmlFor="amount">
      Amount
    </Label>
    <Input
      id="amount"
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      className="text-sm sm:text-base bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      style={{ borderRadius: "0.5rem" }}
      maxLength={5}
      minLength={1}
      min = {100}
      placeholder="$"
      required
      onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please enter a valid amount.")}
      onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
    />
  </div>

  {/* Crypto Name */}
 
  <div className="space-y-2">
  <label className="text-base sm:text-lg text-white" htmlFor="crypto-dropdown">
    Crypto Name
  </label>

  <Select
     value={type.toLowerCase()} // Convert to lowercase for matching
     onValueChange={(value) => {
       console.log("Selected value:", value);
       setType(value.toUpperCase()); // Store in uppercase
     }}
  >
    <SelectTrigger id="crypto-dropdown" className="text-white bg-gray-700 border border-gray-600 rounded-lg">
      <SelectValue placeholder="Select a cryptocurrency" />
    </SelectTrigger>

    <SelectContent className="bg-gray-800 text-white max-h-64 overflow-y-auto">
      {/* Add Search Input */}
      <div className="p-2">
        <input
          type="text"
          placeholder="Search cryptocurrency..."
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredCryptos.length > 0 ? (
        filteredCryptos.map((crypto) => (
          <SelectItem key={crypto.id} value={crypto.symbol.toLowerCase()}>
      {crypto.name} ({crypto.symbol.toUpperCase()})
          </SelectItem>
        ))
      ) : (
        <div className="text-gray-400 px-2 py-1">No matching cryptocurrency found.</div>
      )}
    </SelectContent>
  </Select>
</div>
</div>
              {/* Wallet Address */}
              <div className="space-y-2">
                <Label className="text-base sm:text-lg text-white" htmlFor="wallet-address">
                  Wallet Address
                </Label>
                <Input
                  id="wallet-address"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="text-sm sm:text-base bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: '0.5rem' }}
                  maxLength={50}
                  minLength={10}
                  placeholder="JGFYSFYWJgB&WEYIWEGYDFG"
                  required
                  onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please enter a valid Wallet Address.')}
                  onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-base sm:text-lg text-white" htmlFor="description">
                  Description
                </Label>
                <Input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-sm sm:text-base bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderRadius: '0.5rem' }}
                  placeholder="When and How?"
                  required
                />
              </div>

              {/* Error/Success Messages */}
              {error && <p className="text-center text-sm sm:text-base text-red-500">{error}</p>}
              {success && <p className="text-center text-sm sm:text-base text-green-500">{success}</p>}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-sm sm:text-base bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  </div>

  {/* Recovery Requests Table */}
  <motion.div className="px-4 sm:px-12 pb-36">
    <Card style={{ borderRadius: '2rem' }} className="bg-gray-800 border border-gray-700">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <CardHeader>
          <CardTitle className=" text-2xl sm:text-3xl text-white">Your Recovery Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingg ? (
            <div className="flex flex-col justify-center items-center h-40">
              <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-2 text-sm sm:text-base">Loading your transactions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="text-sm sm:text-base text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-purple-500 font-bold" style={{ width: '40%' }} >Submitted At</TableHead>
                    <TableHead className="text-purple-500 font-bold">Wallet Address</TableHead>
                    <TableHead className="text-purple-500 font-bold">Description</TableHead>
                    <TableHead className="text-purple-500 font-bold">Crypto Name</TableHead>
                    <TableHead className="text-purple-500 font-bold">Amount</TableHead>
                    <TableHead className="text-purple-500 font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length > 0 ? (
                    requests
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell style={{ width: '40%' }}>{request.createdAt ? format(new Date(request.createdAt), 'MMMM dd, yyyy') : 'Invalid Date'}</TableCell>
                          <TableCell>{request.walletAddress}</TableCell>
                          <TableCell>{request.description}</TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.amount}</TableCell>

                          <TableCell>
                            <Badge
                              className={`${
                                request.status === 'Completed'
                                  ? 'bg-green-500 text-white'
                                  : request.status === 'Pending'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-red-500 text-white'
                              }`}
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
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
          )}
        </CardContent>
      </motion.div>
    </Card>
  </motion.div>
</motion.div>

  );
};

export default CryptoRecoveryTab;











      //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      //     {[
      //       {
      //         title: "Total Balance",
      //         gradient: "linear-gradient(to bottom right, #7F00FF, #E100FF)",
      //         icon: <FaWallet style={{ fontSize: "1.5rem", color: "#fff" }} />,
      //         value: `$${calculateTotalBalance()}`,
      //         description: "Across all cryptocurrencies. Rates may fluctuate based on market conditions.",
      //       },
      //       // Additional card definitions...
      //     ].map((card, index) => (
      //       <motion.div
      //         key={index}
      //         whileTap={{ scale: 0.98 }}
      //         whileHover={{ scale: 1.05 }}
      //         style={{
      //           padding: "20px",
      //           borderRadius: "1.5rem",
      //           background: card.gradient,
      //           boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
      //         }}
      //         className="text-white flex flex-col items-start"
      //       >
      //         <div className="flex justify-between w-full items-center">
      //           <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>{card.title}</h3>
      //           {card.icon}
      //         </div>
      //         <span style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>{card.value}</span>
      //         {card.description && (
      //           <p className="text-sm text-purple-200 mt-2">{card.description}</p>
      //         )}
      //       </motion.div>
      //     ))}
      //   </div>
      // </Card>