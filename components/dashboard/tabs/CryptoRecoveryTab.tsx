"use client"

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface RecoveryRequest {
  createdAt: Date; // Assuming createdAt is a Date object
  id: string;
  walletAddress: string;
  description: string;
  status: string;
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
  
    if (!email || !walletAddress || !description) {
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
   
      className="space-y-6"
    >

<div className="space-y-6 ">
        <h2 className="pl-8 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Crypto Recovery</h2>
        <p className="pl-12 text-xl text-gray-400">Recover lost or stuck cryptocurrency</p>
      </div>

      <div  style={{ borderRadius: '2rem' }} className="py-4 mx-12 flex items-center justify-center bg-gray-800 border border-gray-700"> {/* Full-height centering container with gray background */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card
          // Maintain margin and border-radius
          
          className="mx-8 w-auto sm:w-[500px] sm:w-py-8 md:w-[500px] lg:w-[600px]  h-auto  bg-gray-800 card-no-border" // Use the same gray color for the card
        >
          <div className="  items-center justify-center w-[800] py-8"> {/* Centering content */}
            <CardHeader className="w-full text-center">
              <CardTitle className="text-3xl text-white">Recover Crypto Now</CardTitle>
            </CardHeader>
     
        <CardContent className="pb-12 w-full sm:w-[500px] md:w-[500px] lg:w-[600px] h-auto ">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 hidden">
              <Label className="text-lg text-white" htmlFor="recovery-email">Email</Label>
              <Input
                id="recovery-email"
                type="email"
                value={email || ''}
                readOnly
                className=" text-lg bg-gray-700 text-white border-gray-600"
                style={{ borderRadius: '0.5rem' }}
                
              />
              
            </div>
            <div className="space-y-2">
              <Label className="text-lg text-white" htmlFor="wallet-address">Wallet Address</Label>
              <Input
                id="wallet-address"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="text-lg bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Added focus styles
                style={{ borderRadius: '0.5rem' }}
                maxLength={15}
                minLength={10}
                placeholder="JGFYSFYWJgB&WEYIWEGYDFG"
                required
                pattern="^0x[a-fA-F0-9]{40}$" // Optional: add a regex pattern for Ethereum wallet addresses
                onInvalid={(e) => {
                  const input = e.target as HTMLInputElement; // Type assertion
                  input.setCustomValidity('Please enter a valid Wallet Address.');
                }}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement; // Type assertion
                  input.setCustomValidity(''); // Clears custom message on valid input
                }}
                 />
              
            </div>
            <div className="space-y-2">
              <Label className="text-lg text-white" htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-lg bg-gray-700 text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Added focus styles
                style={{ borderRadius: '0.5rem' }}
                placeholder="When and How?"
                required
              />
            </div>
            {error && <p className="text-lg text-red-500">{error}</p>}
            {success && <p className="text-lg text-green-500">{success}</p>}
            <Button style={{ borderRadius: '0.5rem' }} type="submit" disabled={loading} className="text-lg w-full bg-purple-500 hover:bg-purple-600 text-white">
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
          </CardContent>
          </div>
          </Card>

          </motion.div>
      </div>

      <motion.div className='px-12 pb-36'>
        <Card style={{ borderRadius: '2rem' }} className="bg-gray-800 border-gray-700 ">
        <motion.div  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <CardHeader>
            <CardTitle className="text-3xl text-white">Your Recovery Requests</CardTitle>
          </CardHeader>
          <CardContent>
          
          {loadingg ? (
  <div className="flex flex-col justify-center items-center h-40">
    {/* Tailwind CSS spinner */}
    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-white mt-2">Loading your transactions...</p>
  </div>
      ) : (
              <Table className="text-base text-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg font-bold text-purple-500">Submitted At</TableHead>
                    <TableHead className="text-lg font-bold text-purple-500">Wallet Address</TableHead>
                    <TableHead className="text-lg font-bold text-purple-500">Description</TableHead>
                    <TableHead className="text-lg font-bold text-purple-500">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
                  {requests.length > 0 ? (
                    requests
                    .sort((a, b) => {
                      // Sort by createdAt date in descending order
                      const dateA = new Date(a.createdAt);
                      const dateB = new Date(b.createdAt);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="text-base">
                          {request.createdAt ? format(new Date(request.createdAt), 'MMMM dd, yyyy') : 'Invalid Date'}
                        </TableCell>
                        <TableCell>{request.walletAddress}</TableCell>
                        <TableCell>{request.description}</TableCell>
                        <TableCell>
                        <Badge
                        className={`${
                          request.status === "Completed"
                            ? "bg-green-500 text-white"
                            :  request.status === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        { request.status}
                      </Badge>
                      </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Hi {userName},<br/>No Recovery Request Found found for {email}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            </CardContent>
            </motion.div>
        </Card>
      </motion.div>

      </motion.div>
  );
};

export default CryptoRecoveryTab;
