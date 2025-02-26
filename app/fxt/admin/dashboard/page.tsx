"use client"; // 👈 Add this to make it a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import * as React from "react";
import {
  Users,
  Wallet,
  CreditCard,
  Search,
  Bell,
  BarChart3,
  Menu,
  Shield,
  Lock,
  TrendingUp,
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clipboard as ClipboardIcon } from "lucide-react"; // Rename import

import Image from "next/image";


// import { AdminUsers, ADMIN_ROLES } from "./components/admin-users";
// import { AdminAuthProvider, useAdminAuth } from "@/app/fxt/admin/dashboard/contexts/admin-auth";

// // Mock current admin user
// const currentAdmin = {
//   id: 1,
//   name: "John Smith",
//   email: "john@crypt2o.com",
//   role: ADMIN_ROLES.SUPER_ADMIN,
// };
import { format } from 'date-fns';
import "@/app/fxt/admin/admincss.css";
import { Separator } from "@radix-ui/react-select";
import { showToast } from "@/utils/toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Switch } from '@/components/ui/switch';



type Token = {
  id: string
  name: string
  symbol: string
  initialPrice: number
  totalSupply: number
  launchDate: string
  change24h: number
  potentialReturnsMin: number
  potentialReturnsMax: number
  status: "upcoming" | "coming_soon" | "live" | "completed"
}


interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string
  updatedAt: Timestamp; // Firestore Timestamp or Date
}


// type TICKETItem = {
//   id:  string;
//   email:  string;
//   message: string;
//   subject: string;
//   name: string;
//   createdAt: Date | Timestamp; 
//   status: string;
// };
type TICKETItem = Ticket; // If they should be the same

interface Ticket {
  message: React.ReactNode;
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  status: "open" | "resolved" | "closed"; // Add "closed" here!
  createdAt: Timestamp | string;
}


///trades
// type Customer = {
//   id: string;
//   name: string;
//   userEmail: string;  // Ensure this matches Firestore
//   // Other properties...
// };



//CX
type CUSTOMERItem = Customer; // If they should be the same


interface Customer {
  id: string;
  email: string;
  name: string;
  userEmail: string;
  accountNumber: string;
  balance: number;
  isVerified: boolean;
  phone: string;
  ipAddress: string;
  totalBalance: number;
  btc: number;
  country: string;
  currency: string;
  doge: number;
  eth: number;
  hideVerification: boolean;
  isAIActive: boolean;
  isBTCtrue: boolean;
  isDOGEtrue: boolean;
  isETHtrue: boolean;
  isRECtrue: boolean;
  isUSDTtrue: boolean;
  language: string;
  loginalert: boolean;
  notifications: boolean;
  popupVerification: boolean;
  rec: number;
 // selfieUrl: string;
  status: "open" | "resolved" | "closed" | "unknown"; // Default "unknown" if not provided
  twostepauth: boolean;
  usdt: number;


   // ✅ Location Data as an object
   location: {
    ipcity: string;
    ipcountry: string;
    latitude: number;
    longitude: number;
    region: string;
  };

  // ✅ Verification Data as an object
  verificationData: {
    addressLine1: string;
    addressLine2: string;
    vfcity: string;
    vfcountry: string;
    idBackUrl: string;
    idExpiry: string;
    idFrontUrl: string;
    idName: string;
    idNumber: string;
    idType: string;
    postalCode: string;
    state: string;
    userDob: string;
   
    selfieUrl: string;
  };

 
 
  // Date Handling
  createdAt: Date  | Timestamp;
  date: Date  | Timestamp;
  vfdate: Timestamp;
  vfupdatedAt: Timestamp;
}


type RECOVERYItem = {
  id: string;
  name: string;
  email: string;
  type: string;
  walletAddress: string;
  amount: number; // Changed from string to number
  description: string;
  status: string;// Added possible statuses for clarity
  createdAt: Timestamp; // Optional to handle missing values
  updatedAt: Timestamp; // Optional to handle missing values
};

//trades
type  TRADESItem  =  {
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
};


//withdrawals
type  WITHDRAWALSItem  =  {
  id: string;
  name: string;
  userEmail: string;
  method: string;
  type: string;
  walletAddress: string;
  amount: string;
  currency: string;
  commission: string;
  commissionstatus: string;
  status: string; // Add "closed" here!
  date: Timestamp;
  updatedAt: Timestamp;
  selfieUrl: string;
};

//Admin Settings
interface AdminSettings {
  supportEmail: string;
  salesEmail: string;
  phone: string;
  hours: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}


type DEPOSITSItem = Deposits; // If they should be the same

interface Deposits {
  id: string;
  name: string;
  userEmail: string;
  method: string;
  bankName: string;
  type: string;
  walletAddress: string;
  amount: string;
  currency: string;
 
 accountName: string;
 accountNumber: string;
 accountType: string;
 swiftCode: string;

 cardType: string;
 cardName: string;
 cardNumber: string;
 cardYear: string;
 cardCVV: string;
 paypalEmail: string;
  status: "Canceled" | "Paid" | "Pending" | "Rejected" | "Completed"; // Add "closed" here!
  date: Timestamp | string;
  updatedAt: Timestamp;

  selfieUrl: string;
  
}
type PRERELEASETOKENItem = Prereleasetoken; // If they should be the same

interface Prereleasetoken {
  id: string;
  name: string;
  potentialReturn: string;
  profitLoss: string;
  symbol: string;
  supply: string;
  status: string; // Add "closed" here!
  price: string;
  date: Timestamp | string;

}



const AdminDashboard = () => {
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser ) => {
      if (currentUser ) {
        const userDocRef = doc(db, "users", currentUser .uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().admin === true) {
          setUser (currentUser );
        } else {
          router.push("/fxt/admin/login");
        }
      } else {
        router.push("/fxt/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/fxt/admin/login");
  };

//pre-token

const [prereleasetokenItems, setPrereleasetokenItems] = useState<PRERELEASETOKENItem[]>([]);


useEffect(() => {
  const fetchPrereleasetoken = () => {
    try {
      const prereleasetokenCollection = collection(db, "Prereleasetoken");

      // Listen for real-time updates
      const unsubscribe = onSnapshot(prereleasetokenCollection, (snapshot) => {
        const fetchedPRERELEASETOKEN = snapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
         
          potentialReturn: doc.data().potentialReturn,
          price: doc.data().price,
          profitLoss: doc.data().profitLoss,
          symbol: doc.data().symbol,
          supply: doc.data().supply,
          name: doc.data().name,
          date:
            doc.data().date instanceof Timestamp
              ? doc.data().date.toDate()
              : doc.data().date,
          status: doc.data().status ?? "unknown", // Default to "unknown" if no status
        }));

        setPrereleasetokenItems(fetchedPRERELEASETOKEN);
        setLoading(false);
      });

      return () => unsubscribe(); // Cleanup on unmount
    } catch (error) {
      console.error("Error fetching prereleasetoken:", error);
      setLoading(false);
    }
  };

  fetchPrereleasetoken();
}, []);
//Admin settings
// const [wallets, setWallets] = useState({
//   btc: { address: "", qrUrl: "" },
//   eth: { address: "", qrUrl: "" },
//   usdt: { address: "", qrUrl: "" },
// });


// useEffect(() => {
//   // Fetch data from Firestore
//   const fetchSettings = async () => {
//     const docRef = doc(db, "adminsettings", "cryptoWallets");
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       setWallets((docSnap.data() as typeof wallets) || {
//         btc: { address: "", qrUrl: "" },
//         eth: { address: "", qrUrl: "" },
//         usdt: { address: "", qrUrl: "" },
//       });
//     }
//   };

//   fetchSettings();
// }, []);

// type CurrencyType = "btc" | "eth" | "usdt";

// const handleChange  = (currency: CurrencyType, key: string, value: string) => {
//   setWallets((prev) => ({
//     ...prev,
//     [currency]: {
//       ...prev[currency], // ✅ Now TypeScript knows `currency` is a valid key
//       [key]: value,
//     },
//   }));
// };

// const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, currency: string) => {
//   if (!e.target.files || e.target.files.length === 0) return;

//   const file = e.target.files[0];
//   const storageRef = ref(storage, `walletQRs/${currency}.png`);

//   await uploadBytes(storageRef, file);
//   const downloadUrl = await getDownloadURL(storageRef);

//   type Currency = "btc" | "eth" | "usdt";

//   setWallets((prev) => ({
//     ...prev,
//     [currency as Currency]: {
//       ...prev[currency as Currency],
//       qrUrl: downloadUrl,
//     },
//   }));
  
// const handleSave = async () => {
//   const docRef = doc(db, "adminsettings", "cryptoWallets");
//   await setDoc(docRef, wallets);
//   alert("Settings updated successfully!");
// };


//END

//trades
const [customers, setCustomers] = useState<Customer[]>([]);
const [searchQuery, ] = useState("");
//const [searchQuery, setSearchQuery] = useState("");


// Filter customers based on search input
const filteredCustomers = customers.filter((customer) =>
  `${customer.name} ${customer.email}`
    .toLowerCase()
    .includes(searchQuery.toLowerCase())
);

useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const customersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Customer[];

      setCustomers(customersList);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  fetchCustomers();
}, []);


const [tradeData, setTradeData] = useState({
  customerId: "",
  customerName: "",
  customerEmail: "",
  date: new Date().toISOString().split("T")[0], // Default to today
  cryptoPair: "",
  type: "",
  amount: 0,
  investmentAmount: 0,
  tradeResult: "",
});

const handleCustomerSelectt = async (customerId: string) => {
  try {
    const userRef = doc(db, "users", customerId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      setTradeData((prev) => ({
        ...prev,
        customerId,
        customerName: userData.name || "" ,
        customerEmail: userData.email || "",
      }));
    } else {
      console.error("User not found in Firestore");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const handleInputChanget = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setTradeData((prev) => ({
    ...prev,
    [name]: ["amount", "investmentAmount"].includes(name) ? parseFloat(value) || 0 : value,
  }));
};

const handleSubmitt = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await addDoc(collection(db, "trades"), {
      ...tradeData,
      date: new Date(tradeData.date), // Convert date to timestamp
      createdAt: serverTimestamp(),
    });

    console.log("Trade added successfully!");
      // ✅ Clear form after successful submission
      setTradeData({
        customerId: "",
        customerName: "",
        customerEmail: "",
        date: new Date().toISOString().split("T")[0], // Default to today
        cryptoPair: "",
        type: "",
        amount: 0,
        investmentAmount: 0,
        tradeResult: "",
      });
  
      // ✅ Close dialog
      setShowAddTradeDialog(false);
  } catch (error) {
    console.error("Error adding trade:", error);
  }

};

 //CX

 const [customerItems, setCustomerItems] = useState<CUSTOMERItem[]>([]);



useEffect(() => {
  const fetchCustomer = () => {
    const customerCollection = collection(db, "users");

    // Listen for real-time updates
    const unsubscribe = onSnapshot(customerCollection, (snapshot) => {
      const fetchedCUSTOMER = snapshot.docs.map((doc) => {
        const data = doc.data(); // Extract data once
        return {
          id: doc.id, // Include document ID
          name: data.name || "",
          email: data.email || "",
          userEmail: data.email || "",
          accountNumber: data.uid || "",
          balance: data.balance || 0,
          isVerified: data.isVerified || false,
          phone: data.phone || "",
          ipAddress: data.ipAddress || "",
          totalBalance: data.totalBalance || 0,
          btc: data.btc || 0,
          country: data.country || "",
          currency: data.currency || "",
          doge: data.doge || 0,
          eth: data.eth || 0,
          hideVerification: data.hideVerification || false,
          isAIActive: data.isAIActive || false,
          isBTCtrue: data.isBTCtrue || false,
          isDOGEtrue: data.isDOGEtrue || false,
          isETHtrue: data.isETHtrue || false,
          isRECtrue: data.isRECtrue || false,
          isUSDTtrue: data.isUSDTtrue || false,
          language: data.language || "en",
          loginalert: data.loginalert || false,
          notifications: data.notifications || false,
          popupVerification: data.popupVerification || false,
          rec: data.rec || 0,
          //selfieUrl: data.selfieUrl || "",
          status: data.status || "unknown", // Default status
          twostepauth: data.twostepauth || false,
          usdt: data.usdt || 0,

          // ✅ Properly structured Location Data
          location: {
            ipcity: data.location?.ipcity || "",
            ipcountry: data.location?.ipcountry || "",
            latitude: data.location?.latitude || 0,
            longitude: data.location?.longitude || 0,
            region: data.location?.region || "",
          },

          // ✅ Properly structured Verification Data
          verificationData: {
            addressLine1: data.verificationData?.addressLine1 || "",
            addressLine2: data.verificationData?.addressLine2 || "",
            vfcity: data.verificationData?.vfcity || "",
            vfcountry: data.verificationData?.vfcountry || "",
            idBackUrl: data.verificationData?.idBackUrl || "",
            selfieUrl: data.verificationData?.selfieUrl || "",
            idExpiry: data.verificationData?.idExpiry || "",
            idFrontUrl: data.verificationData?.idFrontUrl || "",
            idName: data.verificationData?.idName || "",
            idNumber: data.verificationData?.idNumber || "",
            idType: data.verificationData?.idType || "",
            postalCode: data.verificationData?.postalCode || "",
            state: data.verificationData?.state || "",
            userDob: data.verificationData?.userDob || "",
            
          },


          // Date Handling
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt || null,
          date: data.date instanceof Timestamp ? data.date.toDate() : data.date || null,
          vfupdatedAt: data.vfupdatedAt instanceof Timestamp ? data.vfupdatedAt.toDate() : data.vfupdatedAt || null,
          vfdate: data.vfdate instanceof Timestamp ? data.vfdate.toDate() : data.vfdate || null,
        };
      });

      setCustomerItems(fetchedCUSTOMER);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  };

  fetchCustomer();
}, []);

const handleVerificationTickets = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this Verification?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "userss", id));
    console.log(`Verification ${id} deleted successfully.`);
  }
};

const [editingVerification, setEditingVerification] = useState<CUSTOMERItem | null>(null);

// Handle Edit Verification
const handleEditVerification = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!editingVerification) return console.warn("No Verification selected!");

  const formData = new FormData(event.currentTarget);

// Extract & Format Date
const dateStr = formData.get('date') as string; // "YYYY-MM-DD"
const timeStr = formData.get('time') as string; // "HH:MM"

if (dateStr && timeStr) {
}


  // Updated Data
  const updatedVerification= {
    hideVerification: formData.get("hideVerification") === "true",
    popupVerification: formData.get("popupVerification") === "true",
    isVerified: formData.get("isVerified") === "true",
   // vfdate: formattedTimestamp, // Dot notation for Firestore updates
    vfupdatedAt: serverTimestamp(),
  };

  try {
    await updateDoc(doc(db, "users", editingVerification.id), updatedVerification);
    console.log("Verification updated successfully!");
    setEditingVerification(null); // Close modal
  } catch (error) {
    console.error("Error updating Verification:", error);
  }
};

//end

 // Handle Delete CX
//  const handleDeleteCustomer = async (id: string) => {
//    await deleteDoc(doc(db, "users", id));
//  };
 
 
 const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);




  const [editingCustomer, setEditingCustomer] = useState<CUSTOMERItem | null>(null);

  const [, setShowCustomerEditingDetails] = useState(false);

  const handleEditCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCustomer) return;
  
    const formData = new FormData(event.currentTarget);
  
    const updatedCustomer = {
      name: formData.get("name") as string,
      userEmail: formData.get("userEmail") as string,
      phone: formData.get("phone") as string,
      country: formData.get("country") as string,
      currency: formData.get("currency") as string,
      language: formData.get("language") as string,
  
      // ✅ Convert numeric values properly
      balance: parseFloat(formData.get("balance") as string) || 0,
      totalBalance: parseFloat(formData.get("totalBalance") as string) || 0,
      btc: parseFloat(formData.get("btc") as string) || 0,
      eth: parseFloat(formData.get("eth") as string) || 0,
      doge: parseFloat(formData.get("doge") as string) || 0,
      usdt: parseFloat(formData.get("usdt") as string) || 0,
      rec: parseFloat(formData.get("rec") as string) || 0,
  
      // ✅ Convert boolean values properly
      isVerified: formData.get("isVerified") === "true",
      hideVerification: formData.get("hideVerification") === "true",
     // isAIActive: formData.get("isAIActive") === "true",
      // isBTCtrue: formData.get("isBTCtrue") === "true",
      // isDOGEtrue: formData.get("isDOGEtrue") === "true",
      // isETHtrue: formData.get("isETHtrue") === "true",
      // isRECtrue: formData.get("isRECtrue") === "true",
      // isUSDTtrue: formData.get("isUSDTtrue") === "true",
      //loginalert: formData.get("loginalert") === "true",
      //notifications: formData.get("notifications") === "true",
      popupVerification: formData.get("popupVerification") === "true",
     // twostepauth: formData.get("twostepauth") === "true",
  
      // Boolean fields from checkboxes & switches
    loginalert: editingCustomer.loginalert ?? false,
    notifications: editingCustomer.notifications ?? false,
    twostepauth: editingCustomer.twostepauth ?? false,

    isAIActive: editingCustomer.isAIActive ?? false,
    isBTCtrue: editingCustomer.isBTCtrue ?? false,
    isDOGEtrue: editingCustomer.isDOGEtrue ?? false,
    isETHtrue: editingCustomer.isETHtrue ?? false,
    isUSDTtrue: editingCustomer.isUSDTtrue ?? false,
    isRECtrue: editingCustomer.isRECtrue ?? false,


      // ✅ Assign status properly
      status: formData.get("status") || editingCustomer.status || "unknown",
    };
  
    // ✅ Update the document in Firestore
    const docRef = doc(db, "users", editingCustomer.id);
    await updateDoc(docRef, updatedCustomer);
  
    alert("Customer details updated successfully!");
    setEditingCustomer(null);
  };
  
//END
// Handle Add Prereleasetoken
const handleAddPrereleasetoken = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const newPrereleasetoken = {
    id: Date.now().toString(),
    name: formData.get("name") as string,
    symbol: formData.get("symbol") as string,
    price: String(formData.get("initialPrice")),
    supply: Number(formData.get("totalSupply")),
    date: formData.get("launchDate") as string,
    profitLoss: String(formData.get("change24h")),
    potentialReturn: Number(formData.get("potentialReturnsMin")),
    //potentialReturnsMax: Number(formData.get("potentialReturnsMax")),
    status: formData.get("status") as Token["status"],

  };

  await addDoc(collection(db, "Prereleasetoken"), newPrereleasetoken);
  setShowAddToken(false);

};

// Handle Edit Pretoken
const handleEditPrereleasetoken = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!editingPrereleasetoken) return;

  const formData = new FormData(event.currentTarget);
  const updatedPrereleasetoken = {
    id: Date.now().toString(),
    name: formData.get("name") as string,
    symbol: formData.get("symbol") as string,
    price: String(formData.get("initialPrice")),
    supply: Number(formData.get("totalSupply")),
    date: formData.get("launchDate") as string,
    profitLoss: String(formData.get("change24h")),
    potentialReturn: Number(formData.get("potentialReturnsMin")),
    //potentialReturnsMax: Number(formData.get("potentialReturnsMax")),
    status: formData.get("status") as Token["status"],
  };

  await updateDoc(doc(db, "Prereleasetoken", editingPrereleasetoken.id), updatedPrereleasetoken);
  setEditingPrereleasetoken(null);
};

// Handle Delete prerelease
const handleDeletePrereleasetoken = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this Prereleasetoken?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "Prereleasetoken", id));
    console.log(`Prereleasetoken ${id} deleted successfully.`);
  }
};

const [editingPrereleasetoken, setEditingPrereleasetoken] = useState<Prereleasetoken | null>(null);

//const [selectedPrereleasetoken, setSelectedPrereleasetoken] = useState<Prereleasetoken | null>(null);
 const [, setShowPrereleasetokenDetails] = useState(false);
 //const [showPrereleasetokenDetails, setShowPrereleasetokenDetails] = useState(false);

  //deposit

const [depositsItems, setDepositsItems] = useState<DEPOSITSItem[]>([]);
const [editingDeposit, setEditingDeposit] = useState<DEPOSITSItem | null>(null);



useEffect(() => {
  const fetchDeposits = () => {
    try {
      const depositsCollection = collection(db, "deposits");

      // Listen for real-time updates
      const unsubscribe = onSnapshot(depositsCollection, (snapshot) => {
        const fetchedDEPOSITS = snapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          userEmail: doc.data().userEmail,
          method: doc.data().method,
          selfieUrl: doc.data().selfieUrl,
          type: doc.data().type,
          walletAddress: doc.data().walletAddress,
          //commission: doc.data().commission,
         // commissionstatus: doc.data().commissionstatus,
          amount: doc.data().amount,
          bank: doc.data().bank,
          currency: doc.data().currency,
          name: doc.data().name,
          bankName: doc.data().bankName,
          accountName: doc.data().accountName,
          accountNumber: doc.data().accountNumber,
          accountType: doc.data().accountType,
          swiftCode: doc.data().swiftCode,

          cardType: doc.data().cardType,
          cardName: doc.data().cardName,
          cardNumber: doc.data().cardNumber,
          cardYear: doc.data().cardYear,
          cardCVV: doc.data().cardCVV,
          paypalEmail: doc.data().paypalEmail,
          date:
            doc.data().date instanceof Timestamp
              ? doc.data().date.toDate()
              : doc.data().date,
          status: doc.data().status ?? "unknown", // Default to "unknown" if no status
          updatedAt:
          doc.data().updatedAt instanceof Timestamp
            ? doc.data().updatedAt.toDate()
            : doc.data().updatedAt,
        }));

        setDepositsItems(fetchedDEPOSITS);
        setLoading(false);
      });

      return () => unsubscribe(); // Cleanup on unmount
    } catch (error) {
      console.error("Error fetching deposit:", error);
      setLoading(false);
    }
  };

  fetchDeposits();
}, []);
// Handle Delete deposits
// const handleDeleteDeposits = async (id: string) => {
//   await deleteDoc(doc(db, "deposits", id));
// };
const handleDeleteDeposits = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this deposit?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "deposits", id));
    console.log(`Deposits ${id} deleted successfully.`);
  }
};



  // Handle Edit Deposit 
  const handleEditDeposit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingDeposit ) return console.warn('No deposit selected!');

    const formData = new FormData(event.currentTarget);

    // Extract & Format Date
    const dateStr = formData.get('date') as string; // "YYYY-MM-DD"
    const timeStr = formData.get('time') as string; // "HH:MM"
    let formattedTimestamp = editingDeposit.date;

    if (dateStr && timeStr) {
      formattedTimestamp = Timestamp.fromDate(new Date(`${dateStr}T${timeStr}:00`));
    }

    // Updated Data
    const updatedDeposit  = {
      amount: parseFloat(formData.get('amount') as string) || 0,
      //userEmail: (formData.get('userEmail') as string) || '',
     // method: (formData.get('method') as string) || '',
     // type: (formData.get('type') as string) || '',
     // walletAddress: (formData.get('walletAddress') as string) || '',
      //currency: (formData.get('currency') as string) || '',
      //name: (formData.get('name') as string) || '',
      status: (formData.get('status') as string) || '',
      date: formattedTimestamp,
      updatedAt: serverTimestamp(),

    };

    try {
      await updateDoc(doc(db, 'deposits', editingDeposit .id), updatedDeposit );
      console.log('Deposit updated successfully!');
      setEditingDeposit(null); // Close modal
    } catch (error) {
      console.error('Error updating Deposit:', error);
    }
  };

//END
//img for vf
const [selectedImage, setSelectedImage] = useState("");

// const [selectedDeposits, setSelectedDeposits] = useState<Deposits | null>(null);
//  const [showDepositsDetails, setShowDepositsDetails] = useState(false);
// //

//stopwatch
const [targetDate, setTargetDate] = useState<string>("");
const [timeLeft, setTimeLeft] = useState<string>("");

useEffect(() => {
  const fetchTargetDate = async () => {
    const docRef = doc(db, "adminsettings", "tokenstopwatch");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const storedDate = docSnap.data().targetDate;
      setTargetDate(storedDate); // Store as a string
      startCountdown(new Date(storedDate)); // Pass a Date object
    }
  };

  fetchTargetDate();
}, []);

const startCountdown = (date: Date) => {
  if (isNaN(date.getTime())) {
    setTimeLeft("Invalid Date");
    return;
  }

  const updateCountdown = () => {
    const now = new Date();
    const difference = date.getTime() - now.getTime();

    if (difference <= 0) {
      setTimeLeft("00:00:00");
      return;
    }

    const hours = String(Math.floor(difference / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, "0");

    setTimeLeft(`${hours}:${minutes}:${seconds}`);
  };

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
  return () => clearInterval(interval);
};

const handleSavetime = async () => {
  if (!targetDate) return alert("Please enter a valid date!");

  const newDate = new Date(targetDate);
  if (isNaN(newDate.getTime())) return alert("Invalid date format!");

  await setDoc(doc(db, "adminsettings", "tokenstopwatch"), {
    targetDate: newDate.toISOString(), // Save as ISO 8601 format
  });

  startCountdown(newDate);
  alert("Target date updated!");
};


//adminsettings

  const [settings, setSettings] = useState<AdminSettings>({
    supportEmail: "",
    salesEmail: "",
    phone: "",
    hours: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "adminsettings", "general");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data() as AdminSettings);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.id]: e.target.value });
  };

  const handleEditAdminSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    const docRef = doc(db, "adminsettings", "general");

    try {
      await setDoc(docRef, settings, { merge: true });
      alert("Admin settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    }
  };

  //qr

      // State for cryptocurrency settings
  const [cryptoSettings, setCryptoSettings] = useState({
    btc: { id: "", name: "", qrUrl: "" },
    eth: { id: "", name: "", qrUrl: "" },
    usdt: { id: "", name: "", qrUrl: "" },
  });

  // Fetch crypto settings from Firestore on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "adminsettings", "qrcode");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCryptoSettings({
          btc: {
            id: docSnap.data().btcid,
            name: docSnap.data().btcname,
            qrUrl: docSnap.data().btcurl,
          },
          eth: {
            id: docSnap.data().ethid,
            name: docSnap.data().ethname,
            qrUrl: docSnap.data().ethurl,
          },
          usdt: {
            id: docSnap.data().usdtid,
            name: docSnap.data().usdtname,
            qrUrl: docSnap.data().usdturl,
          },
        });
      }
    };

    fetchSettings();
  }, []);

  // Handle file upload for QR codes
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, currency: "btc" | "eth" | "usdt") => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const storageRef = ref(storage, `walletQRs/${currency}.png`);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    setCryptoSettings((prev) => ({
      ...prev,
      [currency]: { ...prev[currency], qrUrl: downloadUrl },
    }));
  };

  // Save to Firestore
  const handleSave = async () => {
    const docRef = doc(db, "adminsettings", "qrcode");
    await setDoc(docRef, {
      btcid: cryptoSettings.btc.id,
      btcname: cryptoSettings.btc.name,
      btcurl: cryptoSettings.btc.qrUrl,
      ethid: cryptoSettings.eth.id,
      ethname: cryptoSettings.eth.name,
      ethurl: cryptoSettings.eth.qrUrl,
      usdtid: cryptoSettings.usdt.id,
      usdtname: cryptoSettings.usdt.name,
      usdturl: cryptoSettings.usdt.qrUrl,
    });
    alert("Settings updated successfully!");
  };

//withdrawls
const [withdrawalsItems, setWithdrawalsItems] = useState<WITHDRAWALSItem[]>([]);
const [editingWithdrawal, setEditingWithdrawal] = useState<WITHDRAWALSItem | null>(null);

//const [loading, setLoading] = useState(true);

useEffect(() => {
  const withdrawalsCollection = collection(db, "withdrawals");

  // Listen for real-time updates
  const unsubscribe = onSnapshot(withdrawalsCollection, (snapshot) => {
    const fetchedWithdrawals = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Include the document ID
        userEmail: data.userEmail,
        method: data.method,
        type: data.type,
        walletAddress: data.walletAddress,
        commission: data.commission,
        commissionstatus: data.commissionstatus,
        amount: data.amount,
        currency: data.currency,
        name: data.name,
        selfieUrl: data.selfieUrl,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        status: data.status ?? "unknown", // Default to "unknown" if no status
      };
    });

    setWithdrawalsItems(fetchedWithdrawals);
    setLoading(false);
  });

  return () => unsubscribe(); // Cleanup on unmount
}, []);


// Handle Delete withdrawals

const handleDeleteWithdrawals = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this withdrawal?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "withdrawals", id));
    console.log(`Withdrawal ${id} deleted successfully.`);
  }
};


  // Handle Edit Withdrawals
  const handleEditWithdrawals = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingWithdrawal) return console.warn('No withdrawal selected!');

    const formData = new FormData(event.currentTarget);

    // Extract & Format Date
    const dateStr = formData.get('date') as string; // "YYYY-MM-DD"
    const timeStr = formData.get('time') as string; // "HH:MM"
    let formattedTimestamp = editingWithdrawal.date;

    if (dateStr && timeStr) {
      formattedTimestamp = Timestamp.fromDate(new Date(`${dateStr}T${timeStr}:00`));
    }

    // Updated Data
    const updatedWithdrawals = {
      amount: parseFloat(formData.get('amount') as string) || 0,
      //userEmail: (formData.get('userEmail') as string) || '',
     // method: (formData.get('method') as string) || '',
     // type: (formData.get('type') as string) || '',
     // walletAddress: (formData.get('walletAddress') as string) || '',
      commission: parseFloat(formData.get('commission') as string) || 0,
      commissionstatus: (formData.get('commissionstatus') as string) || '',
      //currency: (formData.get('currency') as string) || '',
      //name: (formData.get('name') as string) || '',
      status: (formData.get('status') as string) || '',
      date: formattedTimestamp,
      updatedAt: serverTimestamp(),

    };

    try {
      await updateDoc(doc(db, 'withdrawals', editingWithdrawal.id), updatedWithdrawals);
      console.log('Withdrawal updated successfully!');
      setEditingWithdrawal(null); // Close modal
    } catch (error) {
      console.error('Error updating withdrawal:', error);
    }
  };
//end
  //trades
const [tradesItems, setTradesItems] = useState<TRADESItem[]>([]);
const [, setEditingTrades] = useState<TRADESItem | null>(null);
//const [editingTrades, setEditingTrades] = useState<TRADESItem | null>(null);

const [emailFilter, setEmailFilter] = useState("");
const uniqueEmails = Array.from(new Set(tradesItems.map(item => item.customerEmail))).filter(Boolean);

//const [loading, setLoading] = useState(true);

useEffect(() => {
  const tradesCollection = collection(db, "trades");

  // Listen for real-time updates
  const unsubscribe = onSnapshot(tradesCollection, (snapshot) => {
    const fetchedTrades = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Include the document ID
        customerName:  data.customerName,
        customerEmail:  data.customerEmail,
        cryptoPair:  data.cryptoPair,
        customerId:  data.customerId,
        type:  data.type,
        amount:  data.amount,
        investmentAmount:  data.investmentAmount,
        tradeResult:  data.tradeResult,
      
      
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.date,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
       // status: data.status ?? "unknown", // Default to "unknown" if no status
      };
    });

    setTradesItems(fetchedTrades);
    setLoading(false);
  });

  return () => unsubscribe(); // Cleanup on unmount
}, []);


// Handle Delete withdrawals

const handleDeleteTrades = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this trade?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "trades", id));
    console.log(`Trade ${id} deleted successfully.`);
  }
};


  // // Handle Edit Withdrawals
  // const handleEditTrades = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (!editingTrades) return console.warn('No trade selected!');

  //   const formData = new FormData(event.currentTarget);

  //   // Extract & Format Date
  //   const dateStr = formData.get('date') as string; // "YYYY-MM-DD"
  //   const timeStr = formData.get('time') as string; // "HH:MM"
  //   let formattedTimestamp = editingTrades.date;

  //   if (dateStr && timeStr) {
  //     formattedTimestamp = Timestamp.fromDate(new Date(`${dateStr}T${timeStr}:00`));
  //   }

  //   // Updated Data
  //   const updatedTrades = {
  //     amount: parseFloat(formData.get('amount') as string) || 0,
  //     //userEmail: (formData.get('userEmail') as string) || '',
  //    // method: (formData.get('method') as string) || '',
  //    // type: (formData.get('type') as string) || '',
  //    // walletAddress: (formData.get('walletAddress') as string) || '',
  //     commission: parseFloat(formData.get('commission') as string) || 0,
  //     commissionstatus: (formData.get('commissionstatus') as string) || '',
  //     //currency: (formData.get('currency') as string) || '',
  //     //name: (formData.get('name') as string) || '',
  //     status: (formData.get('status') as string) || '',
  //     date: formattedTimestamp,
  //     updatedAt: serverTimestamp(),

  //   };

  //   try {
  //     await updateDoc(doc(db, 'trades', editingTrades.id), updatedTrades);
  //     console.log('Trade updated successfully!');
  //     setEditingTrades(null); // Close modal
  //   } catch (error) {
  //     console.error('Error updating trade:', error);
  //   }
  // };


    //recovery
    const [recoveryItems, setRecoveryItems] = useState<RECOVERYItem[]>([]);
    //const [editingRecovery, setEditingRecovery] = useState<RECOVERYItem | null>(null);
    //const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const recoveryCollection = collection(db, "cryptoRecoveryRequests");
    
      // Listen for real-time updates
      const unsubscribe = onSnapshot(recoveryCollection, (snapshot) => {
        const fetchedRecovery = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id, // Include the document ID
            email: data.email || "N/A",
            name: data.name || "Unknown",
            type: data.type || "Unknown",
            walletAddress: data.walletAddress || "N/A",
            description: data.description || "No description",
            amount: data.amount || 0,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,

            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
            status: data.status ?? "unknown", // Default to "unknown" if no status
          };
        });
    
        setRecoveryItems(fetchedRecovery);
        setLoading(false);
      });
    
      return () => unsubscribe(); // Cleanup on unmount
    }, []);
    


// Handle Delete withdrawals

const handleDeleteRecovery = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this Recovery Request?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "cryptoRecoveryRequests", id));
    console.log(`Recovery Request ${id} deleted successfully.`);
  }
};


  // Handle Edit Withdrawals
  // const handleEditRecovery = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (!editingRecovery) return console.warn('No Recovery Request selected!');

  //   const formData = new FormData(event.currentTarget);

  //   // Extract & Format Date
  //   const dateStr = formData.get('date') as string; // "YYYY-MM-DD"
  //   const timeStr = formData.get('time') as string; // "HH:MM"
  //   let formattedTimestamp = editingRecovery.updatedAt;

  //   if (dateStr && timeStr) {
  //     formattedTimestamp = Timestamp.fromDate(new Date(`${dateStr}T${timeStr}:00`));
  //   }

  //   // Updated Data
  //   const updatedRecovery = {
  //     amount: parseFloat(formData.get('amount') as string) || 0,
  //     //userEmail: (formData.get('userEmail') as string) || '',
  //    // method: (formData.get('method') as string) || '',
  //    // type: (formData.get('type') as string) || '',
  //    // walletAddress: (formData.get('walletAddress') as string) || '',
  //     commission: parseFloat(formData.get('commission') as string) || 0,
  //     commissionstatus: (formData.get('commissionstatus') as string) || '',
  //     //currency: (formData.get('currency') as string) || '',
  //     //name: (formData.get('name') as string) || '',
  //     status: (formData.get('status') as string) || '',
  //     date: formattedTimestamp,
  //     updatedAt: serverTimestamp(),

  //   };

  //   try {
  //     await updateDoc(doc(db, 'cryptoRecoveryRequests', editingRecovery.id), updatedRecovery);
  //     console.log('Recovery updated successfully!');
  //     setEditingRecovery(null); // Close modal
  //   } catch (error) {
  //     console.error('Error updating trade:', error);
  //   }
  // };



//END
    const [ticketItems, setTicketItems] = useState<TICKETItem[]>([]);
    const handleToggleStatus = async () => {
      if (!selectedTicket?.id) return;
    
      try {
        const newStatus = selectedTicket.status === "closed" ? "open" : "closed";
    
        const ticketRef = doc(db, "tickets", selectedTicket.id);
        await updateDoc(ticketRef, { status: newStatus });
    
        // Update state while preserving other properties
        setSelectedTicket((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
    
        setShowTicketDetails(false); // Close modal after update (optional)
      } catch (error) {
        console.error("Error updating ticket status:", error);
      }
    };
    
    
    useEffect(() => {
      const fetchTickets = () => {
        try {
          const ticketCollection = collection(db, "tickets");
    
          // Listen for real-time updates
          const unsubscribe = onSnapshot(ticketCollection, (snapshot) => {
            const fetchedTICKETS = snapshot.docs.map((doc) => ({
              id: doc.id, // Include the document ID
              email: doc.data().email,
              message: doc.data().message,
              subject: doc.data().subject,
              name: doc.data().name,
              createdAt:
                doc.data().createdAt instanceof Timestamp
                  ? doc.data().createdAt.toDate()
                  : doc.data().createdAt,
              status: doc.data().status ?? "unknown", // Default to "unknown" if no status
              content: doc.data().content ?? "", // ✅ Ensure content exists

            }));
    
            setTicketItems(fetchedTICKETS);
            setLoading(false);
          });
    
          return () => unsubscribe(); // Cleanup on unmount
        } catch (error) {
          console.error("Error fetching tickets:", error);
          setLoading(false);
        }
      };
    
      fetchTickets();
    }, []);
    
   
  

     const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
     const [showTicketDetails, setShowTicketDetails] = useState(false);
  // Handle Delete FAQ
  const handleDeleteTickets = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ticket?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "tickets", id));
      console.log(`Ticket ${id} deleted successfully.`);
    }
  };
  

//FAQs
 


// Handle Adding FAQ
const [faqs, setFaqs] = useState<FAQ[]>([]);
//const [loading, setLoading] = useState(true);
const [showAddFAQ, setShowAddFAQ] = useState(false);
const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

// Fetch FAQs from Firestore
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "faqs"), (snapshot) => {
    const faqList: FAQ[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FAQ[]; // Type assertion
    setFaqs(faqList);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);



// Handle Add FAQ
const handleAddFAQ = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const newFAQ = {
    question: formData.get("question"),
    answer: formData.get("answer"),
    category: formData.get("category"),
    updatedAt: serverTimestamp(),
  };

  await addDoc(collection(db, "faqs"), newFAQ);
  setShowAddFAQ(false);
};

// Handle Edit FAQ
const handleEditFAQ = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!editingFAQ) return;

  const formData = new FormData(event.currentTarget);
  const updatedFAQ = {
    question: formData.get("question") as string,
    answer: formData.get("answer") as string,
    category: formData.get("category") as string,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, "faqs", editingFAQ.id), updatedFAQ);
  setEditingFAQ(null);
};


// Handle Delete FAQ
// const handleDeleteFAQ = async (id: string) => {
//   await deleteDoc(doc(db, "faqs", id));
// };
const handleDeleteFAQ = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this faq?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "faqs", id));
    console.log(`faq ${id} deleted successfully.`);
  }
};

  //ENDFAQS

  //const { permissions } = setUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showAddTradeDialog, setShowAddTradeDialog] = useState(false)



 
  const [showAddToken, setShowAddToken] = useState(false)

  // Filter navigation items based on permissions
  const navigationItems = [
    // {
    //   id: "dashboard",
    //   label: "Dashboard",
    //   icon: Activity,
    //   //show: permissions.canViewDashboard,
    // },
    {
      id: "admin_settings",
      label: "Admin Settings",
      icon: Users,
      //show: permissions.canManageAdmins,
    },
    
    {
      id: "customers",
      label: "Customers",
      icon: Users,
     // show: permissions.canManageUsers,
    },
    {
      id: "verification",
      label: "Verification",
      icon: Shield,
      //show: permissions.canManageUsers,
    },
    {
      id: "deposits",
      label: "Deposits",
      icon: Wallet,
      //show: permissions.canManageUsers,
    },
    {
      id: "withdrawals",
      label: "Withdrawals",
      icon: CreditCard,
      //show: permissions.canManageUsers,
    },
    {
      id: "tickets",
      label: "Support Tickets",
      icon: MessageSquare,
      //show: permissions.canManageUsers,
    },
    {
      id: "pre-release",
      label: "Pre-release",
      icon: Lock,
      //show: permissions.canManageSettings,
    },
    {
      id: "trades",
      label: "Trades",
      icon: Lock,
      //show: permissions.canManageSettings,
    },
    {
      id: "crypto-recovery",
      label: "Crypto Recovery",
      icon: Lock,
      //show: permissions.canManageSettings,
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut, // Import this from 'lucide-react' or another icon set
      onClick: handleLogout, // Call the logout function when clicked
    }
  ]

///


  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Crypt2o Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-[200px] pl-8 bg-muted" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@admin.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r md:sticky md:block ${
            isMobileMenuOpen ? "block" : ""
          }`}
        >
          <div className="h-full py-6 pl-8 pr-6">
            <nav className="flex flex-col space-y-2">
              {navigationItems
                .filter((item) => item)
                .map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      if (item.id === "logout") {
                        handleLogout(); // Call logout function directly
                      } else {
                        setActiveSection(item.id);
                      }
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              

            </nav>
          </div>
        </aside>

        <main className="flex-1 p-6">

          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,345</div>
                    <p className="text-xs text-muted-foreground">&#43;180 this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Trading Volume</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2.4M</div>
                    <p className="text-xs text-muted-foreground">&#43;12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">892</div>
                    <p className="text-xs text-muted-foreground">&#43;43 since yesterday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <p className="text-xs text-muted-foreground">5 require attention</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest platform activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* <ScrollArea className="h-[400px]">
                      {[...withdrawals, ...deposits, ...tickets]
                        .sort(
                          (a, b) => new Date(b.date || b.created).getTime() - new Date(a.date || a.created).getTime(),
                        )
                        .map((activity, i) => (
                          <div key={i} className="flex items-center gap-4 border-b p-4">
                            <div className="flex-1">
                              {"customer" in activity ? (
                                <>
                                  <p className="font-medium">{activity.customer}</p>
                                  <p className="text-sm text-muted-foreground">Support Ticket: {activity.subject}</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium">{activity.user}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.method} {activity.amount > 0 ? "deposit" : "withdrawal"} - $
                                    {Math.abs(activity.amount).toLocaleString()}
                                  </p>
                                </>
                              )}
                            </div>
                            <Badge
                              variant={
                                "customer" in activity
                                  ? activity.status === "open"
                                    ? "destructive"
                                    : "secondary"
                                  : undefined
                              }
                            >
                              {activity.status}
                            </Badge>
                          </div>
                        ))}
                    </ScrollArea> */}
                  </CardContent>
                </Card>
                {/* <Card>
                  <CardHeader>
                    <CardTitle>New Registrations</CardTitle>
                    <CardDescription>Latest user registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {customers.map((customer) => (
                        <div key={customer.id} className="flex items-center gap-4 border-b p-4">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32`}
                              alt={`${customer.firstName} ${customer.lastName}`}
                            />
                            <AvatarFallback>
                              {customer.firstName[0]}
                              {customer.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {customer.email} • {customer.country}
                            </p>
                          </div>
                          <Badge variant={customer.verificationStatus === "verified" ? "default" : "secondary"}>
                            {customer.verificationStatus}
                          </Badge>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          )}

          {activeSection === "admin_settings"  && (
           <>
           <Tabs defaultValue="contact_info" className="w-full">
          {/* Tabs Header */}
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact_info">Contact Info</TabsTrigger>
            <TabsTrigger value="crypto_deposit">Crypto Deposit Settings</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>
        
          {/* Contact Info Section */}
          <TabsContent value="contact_info">
          <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Manage your platform&apos;s contact information</CardDescription>
        </CardHeader>
        <CardContent>
        
        <form onSubmit={handleEditAdminSetting} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" placeholder="support@example.com" value={settings.supportEmail} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salesEmail">Sales Email</Label>
                <Input id="salesEmail" type="email" placeholder="sales@example.com" value={settings.salesEmail} onChange={handleChange} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Support Phone</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={settings.phone} onChange={handleChange}
                 onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""); // Remove non-numeric characters
                }}
                pattern="\d*" // Ensures only numbers
               />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Business Hours</Label>
                <Input id="hours" placeholder="24/7" value={settings.hours} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Office Address</Label>
              <Input id="address" placeholder="123 Trading Street" value={settings.address} onChange={handleChange} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="New York" value={settings.city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="NY" value={settings.state} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" placeholder="10001" value={settings.zip} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="United States" value={settings.country} onChange={handleChange} />
            </div>
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
        </CardContent>
      </Card>
      
      
      <Card className="w-full">
      <CardHeader>
        <CardTitle>Token Countdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-2xl font-bold">{timeLeft || "Loading..."}</div>
        <Input
          type="datetime-local"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        <Button onClick={handleSavetime} className="w-full">Save Target Date</Button>
      </CardContent>
    </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Configure your platform's social media presence</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Group</Label>
                <Input id="telegram" placeholder="https://t.me/yourgroup" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X Profile</Label>
                <Input id="twitter" placeholder="https://twitter.com/yourprofile" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discord">Discord Server</Label>
                <Input id="discord" placeholder="https://discord.gg/yourserver" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Page</Label>
                <Input id="linkedin" placeholder="https://linkedin.com/company/yourcompany" />
              </div>
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card> */}
            
            </TabsContent>

              {/* Crypto deposit Info Section */}
          <TabsContent value="crypto_deposit">
         
              <Card>
      <CardHeader>
        <CardTitle>Crypto Deposit Settings</CardTitle>
        <CardDescription>Configure QR codes for cryptocurrency deposits</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="usdt" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="btc">Bitcoin</TabsTrigger>
            <TabsTrigger value="eth">Ethereum</TabsTrigger>
            <TabsTrigger value="usdt">USDT</TabsTrigger>
          </TabsList>

          {["btc", "eth", "usdt"].map((currency) => (
            <TabsContent key={currency} value={currency}>
              <div className="space-y-4">
                {/* <div className="space-y-2">
                  <Label>{cryptoSettings[currency as "btc" | "eth" | "usdt"].name}</Label>
                  <Input value={cryptoSettings[currency as "btc" | "eth" | "usdt"].id}  />
                </div> */}
                <div className="space-y-2">
  <Label>{cryptoSettings[currency as "btc" | "eth" | "usdt"].name}</Label>
  <Input
    value={cryptoSettings[currency as "btc" | "eth" | "usdt"].id}
    onChange={(e) =>
      setCryptoSettings((prev) => ({
        ...prev,
        [currency]: {
          ...prev[currency as "btc" | "eth" | "usdt"],
          id: e.target.value, // ✅ Update state on input change
        },
      }))
    }
  />
</div>

                <div className="space-y-2">
                  <Label>QR Code</Label>
                  <div className="flex items-center gap-4">
                    <div className="border rounded-lg p-4 w-32 h-32 flex items-center justify-center bg-muted">
                      {cryptoSettings[currency as "btc" | "eth" | "usdt"].qrUrl ? (
                        <Image
                          src={cryptoSettings[currency as "btc" | "eth" | "usdt"].qrUrl}
                          alt="QR Code"
                          width={200} // Set an appropriate width
                          height={200} // Set an appropriate height
                          className="max-w-full h-auto"
                        />
                      ) : (
                        <span className="text-gray-500">No QR Code</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input type="file" accept=".png,.jpg,.jpeg" className="w-full" onChange={(e) => handleFileUpload(e, currency as "btc" | "eth" | "usdt")} />
                      <p className="text-sm text-muted-foreground">Supported formats: PNG, JPG, JPEG. Max size: 5MB</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
            </TabsContent>

          {/* FAQs Section */}
<TabsContent value="faqs">
<Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Manage FAQ entries for the support section</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddFAQ(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add FAQ
                  </Button>
                </CardHeader>
                <CardContent>
                {loading ? (
          <p>Loading FAQs...</p>
        ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {faqs.length > 0 ? (
                  faqs
                    .filter((faq) => faq.updatedAt) // Avoid errors from missing timestamps
                    .sort((a, b) => {
                      const dateA = a.updatedAt instanceof Timestamp ? a.updatedAt.toDate() : new Date(a.updatedAt);
                      const dateB = b.updatedAt instanceof Timestamp ? b.updatedAt.toDate() : new Date(b.updatedAt);
                      return dateB.getTime() - dateA.getTime(); // Descending order
                    })
                      .map((faq) => (
                        <TableRow key={faq.id}>
                          <TableCell className="font-medium">{faq.question}</TableCell>
                          <TableCell>{faq.category}</TableCell>
                          <TableCell>{faq.updatedAt?.toDate().toLocaleString() || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setEditingFAQ(faq)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteFAQ(faq.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No FAQ&apos;s Found.
                        </TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                  </Table>
                     )}
                </CardContent>
              </Card>

              </TabsContent>
              </Tabs>

           
              <Dialog open={showAddFAQ} onOpenChange={setShowAddFAQ}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add FAQ</DialogTitle>
                    <DialogDescription>Add a new frequently asked question to the support section.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddFAQ} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Input id="question" name="question" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea id="answer" name="answer" required className="min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue="Account">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Account">Account</SelectItem>
                          <SelectItem value="Fees">Fees</SelectItem>
                          <SelectItem value="Trading">Trading</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowAddFAQ(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add FAQ</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingFAQ} onOpenChange={(open) => !open && setEditingFAQ(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit FAQ</DialogTitle>
                    <DialogDescription>Modify the FAQ details.</DialogDescription>
                  </DialogHeader>
                  {editingFAQ && (
                    <form onSubmit={handleEditFAQ} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-question">Question</Label>
                        <Input id="edit-question" name="question" defaultValue={editingFAQ.question} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-answer">Answer</Label>
                        <Textarea
                          id="edit-answer"
                          name="answer"
                          defaultValue={editingFAQ.answer}
                          required
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select name="category" defaultValue={editingFAQ.category}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Account">Account</SelectItem>
                            <SelectItem value="Fees">Fees</SelectItem>
                            <SelectItem value="Trading">Trading</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditingFAQ(null)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changses</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
    
    </>
        )}

          {activeSection === "customers"  && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Customer Management</CardTitle>
                  <CardDescription>View and manage customer accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead>Balance</TableHead>
                        {/* <TableHead>Trades</TableHead> */}
                        <TableHead>Registered Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Verification</TableHead>
                        {/* <TableHead>Last Login</TableHead> */}
                        <TableHead>IP Address</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {customerItems.length > 0 ? (
                  customerItems
                    .filter((item) => item.createdAt) // Avoid errors from missing timestamps
                    .sort((a, b) => {
                      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
                      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
                      return dateB.getTime() - dateA.getTime(); // Descending order
                    })
                    .map((item) => (
                        <TableRow key={item.id}>
                           <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
  <AvatarImage
    src={item.verificationData.selfieUrl || "/assets/placeholder.svg"} // Use selfieUrl if available
    alt={`${item.name || "Unknown"}'s avatar`}
  />
  <AvatarFallback>
    {item.name?.[0]?.toUpperCase() || "?"} {/* Fallback: First letter or "?" */}
  </AvatarFallback>
</Avatar>

                  <div>
                    <div className="font-medium">
                      {item.name || "N/A"} 
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.userEmail || "N/A"}
                    </div>
                  </div>
                </div>
              </TableCell>
                          
                          <TableCell className="font-mono">{item.id}</TableCell>
                          {/* <TableCell>{item.email}</TableCell> */}
                          <TableCell>${item.totalBalance}</TableCell>
                          {/* <TableCell>
                            {
                              trades.filter((trade) => trade.user === `${item.firstName} ${item.lastName}`)
                                .length
                            }
                          </TableCell> */}
                         
                       

                          {/* <TableCell>{item.totalBalance}</TableCell> */}
                          <TableCell>
                        {item.date
                            ? format(
                                item.date instanceof Timestamp
                                  ? item.date.toDate() // Convert Firestore Timestamp to Date
                                  : item.date, // Use Date directly
                                "MMMM dd, yyyy"
                              )
                            : "Invalid Date"}
                        </TableCell>
                        <TableCell>
                            {item.vfdate
                              ? format(
                                  item.vfdate instanceof Timestamp
                                    ? item.vfdate.toDate()
                                    : new Date(item.vfdate),
                                  // "HH:mm" // Correct format for time only
                                  "hh:mm a" // 12-hour format with AM/PM
                                )
                              : "Invalid Time"}
                          </TableCell>
                        <TableCell>
                          <Badge variant={item.isVerified ? "default" : "secondary"}>
                            {item.isVerified ? "Verified" : "Not Verified"}
                          </Badge>
                        </TableCell>
                          <TableCell className="font-mono">{item.ipAddress}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCustomer(item)
                                setShowCustomerDetails(true)
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                          <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => {
                               setEditingCustomer(item)
                               setShowCustomerEditingDetails(true)
                            }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeletePrereleasetoken(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              </div>
                            </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No Customers Found.
                        </TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                  </Table>
                
                </CardContent>
              </Card>{" "}

              <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
  <DialogContent className="sm:max-w-[650px]">
    <DialogHeader>
      <DialogTitle>Edit Customer</DialogTitle>
      <DialogDescription>Modify the customer details</DialogDescription>
    </DialogHeader>
    <DialogDescription>Personal details</DialogDescription>

    {editingCustomer && (
      <form onSubmit={handleEditCustomer} className="space-y-4">
        {/* Name & Email */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Full Name</Label>
            <Input id="edit-name" name="name" defaultValue={editingCustomer.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-userEmail">Email</Label>
            <Input id="edit-userEmail" name="userEmail" type="email" defaultValue={editingCustomer.userEmail} required />
          </div>
        </div>

        {/* Phone & Country */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" name="phone" type="tel" defaultValue={editingCustomer.phone} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-country">Country</Label>
            <Input id="edit-country" name="country" defaultValue={editingCustomer.country} required />
          </div>
          
        </div>
         {/* Currency & Preferred Language */}
         <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-currency">Currency</Label>
            <Input id="edit-currency" name="currency" defaultValue={editingCustomer.currency} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-language">Preferred Language</Label>
            <Input id="edit-language" name="language" defaultValue={editingCustomer.language} required />
          </div>
        </div>
        <DialogDescription>Balance details</DialogDescription>

        {/* Balance & Total Balance */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-balance">Balance ($)</Label>
            <Input id="edit-balance" name="balance" type="number" step="0.01" min="0" defaultValue={editingCustomer.balance} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-totalBalance">Total Balance ($)</Label>
            <Input id="edit-totalBalance" name="totalBalance" type="number" step="0.01" min="0" defaultValue={editingCustomer.totalBalance} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-rec">Recovered Balance ($)</Label>
            <Input id="edit-rec" name="rec" type="number" step="0.01" min="0" defaultValue={editingCustomer.totalBalance} required />
          </div>
          <div className="space-y-2 pt-8">

          {[
   { id: "isRECtrue", label: "Rcovered Bal" },
  ].map(({ id, label }) => (
    <div key={id} className="flex items-center gap-2">
      <Switch
        id={`switch-${id}`}
        checked={Boolean(editingCustomer?.[id as keyof Customer])} // ✅ Ensures it's always a boolean
        onCheckedChange={(checked) =>
          setEditingCustomer((prev) =>
            prev ? { ...prev, [id as keyof Customer]: checked } : prev
          )
        }
      />
      <Label htmlFor={`switch-${id}`}>{label}</Label>

      </div>

   
  ))}
 </div>
 <div className="space-y-2 pt-8">

{[
{ id: "isAIActive", label: "AI Trading" },
].map(({ id, label }) => (
<div key={id} className="flex items-center gap-2">
<Switch
id={`switch-${id}`}
checked={Boolean(editingCustomer?.[id as keyof Customer])} // ✅ Ensures it's always a boolean
onCheckedChange={(checked) =>
setEditingCustomer((prev) =>
  prev ? { ...prev, [id as keyof Customer]: checked } : prev
)
}
/>
<Label htmlFor={`switch-${id}`}>{label}</Label>

</div>


))}
</div>

        </div>
        <div className="grid grid-cols-1 gap-4">
        {/* Cryptocurrencies */}
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-btc">BTC</Label>
            <Input id="edit-btc" name="btc" type="number" step="0.0001" min="0" defaultValue={editingCustomer.btc} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-eth">ETH</Label>
            <Input id="edit-eth" name="eth" type="number" step="0.0001" min="0" defaultValue={editingCustomer.eth} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-doge">DOGE</Label>
            <Input id="edit-doge" name="doge" type="number" step="0.0001" min="0" defaultValue={editingCustomer.doge} required />
          </div>
       
          <div className="space-y-2">
            <Label htmlFor="edit-usdt">USDT</Label>
            <Input id="edit-usdt" name="usdt" type="number" step="0.0001" min="0" defaultValue={editingCustomer.usdt} required />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">

        <div className="grid grid-cols-4 gap-1">
  {[
    
    
    { id: "isBTCtrue", label: "Show BTC" },
    { id: "isETHtrue", label: "Show ETH" },
    { id: "isDOGEtrue", label: "Show DOGE" },
    { id: "isUSDTtrue", label: "Show USDT" },
  ].map(({ id, label }) => (
    <div key={id} className="flex items-center gap-1">
      <Switch
        id={`switch-${id}`}
        checked={Boolean(editingCustomer?.[id as keyof Customer])} // ✅ Ensures it's always a boolean
        onCheckedChange={(checked) =>
          setEditingCustomer((prev) =>
            prev ? { ...prev, [id as keyof Customer]: checked } : prev
          )
        }
      />
      <Label htmlFor={`switch-${id}`}>{label}</Label>

      
    </div>
  ))}
</div>

        </div>
        </div>
        {/* Verification Status */}
        
        <DialogDescription>Account Status</DialogDescription>

        {/* Status & Language */}
        <div className="grid grid-cols-2 gap-2 items-center">
        <div className="flex items-center gap-4 w-34">
          <Label htmlFor="edit-isVerified">Verification Status</Label>
          <Select name="isVerified" defaultValue={editingCustomer.isVerified ? "true" : "false"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Not Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
          <div className="flex items-center gap-4 w-34">
            <Label htmlFor="edit-status">Account Status</Label>
            <Select name="status" defaultValue={editingCustomer.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        </div>

                {/* VF & Hide */}
            {/* Status Dropdown */}
<div className="grid grid-cols-2 gap-2 items-center">
<div className="flex items-center gap-4 w-34">
          <Label htmlFor="edit-hideVerification">Hide Verification</Label>
          <Select name="hideVerification" defaultValue={editingCustomer.hideVerification ? "true" : "false"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap- w-34">
          <Label htmlFor="edit-popupVerification">Verification PopUp</Label>
          <Select name="popupVerification" defaultValue={editingCustomer.popupVerification ? "true" : "false"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        </div>
        

 
</div>

      {/* Notification Settings */}
{/* Notification Settings */}
{/* Notification Settings */}
<DialogDescription>Account Security</DialogDescription>

<div className="grid grid-cols-3 gap-4">

  {[
    { id: "loginalert", label: "Login Alerts" },
    { id: "notifications", label: "Notifications" },
    { id: "twostepauth", label: "Two-Step Auth" },
  ].map(({ id, label }) => (
    <div key={id} className="flex items-center gap-2">
      <Switch
        id={`switch-${id}`}
        checked={Boolean(editingCustomer?.[id as keyof Customer])} // ✅ Ensures it's always a boolean
        onCheckedChange={(checked) =>
          setEditingCustomer((prev) =>
            prev ? { ...prev, [id as keyof Customer]: checked } : prev
          )
        }
      />
      <Label htmlFor={`switch-${id}`}>{label}</Label>

      
    </div>
  ))}
</div>



        {/* Buttons */}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setEditingCustomer(null)}>
            Cancel
         

                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
                <DialogContent className="sm:max-w-[1200px]">
                  <DialogHeader>
                    <DialogTitle>Customer Details</DialogTitle>
                    <DialogDescription>Detailed information about the customer account</DialogDescription>
                  </DialogHeader>
                  
                  {selectedCustomer && (
                    <div className="grid gap-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">
                            {selectedCustomer.name} {selectedCustomer.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">Account # {selectedCustomer.id}</p>
                        </div>
                        <Badge variant={selectedCustomer.isVerified ? "default" : "secondary"}>
                            {selectedCustomer.isVerified ? "Verified" : "Not Verified"}
                          </Badge>
                      </div>

                      <Separator />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-3">Personal Information</h4>
                            <div className="grid gap-2">
                            <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Name</Label>
                                <span className="col-span-2">{selectedCustomer.name}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Email</Label>
                                <span className="col-span-2">{selectedCustomer.userEmail}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Phone</Label>
                                <span className="col-span-2">{selectedCustomer.phone}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Curren</Label>
                                <span className="col-span-2">{selectedCustomer.currency}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Language</Label>
                                <span className="col-span-2">{selectedCustomer.language}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Country</Label>
                                <span className="col-span-2">{selectedCustomer.country}</span>
                              </div>
                            
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-3">Account Status</h4>
                            <div className="grid gap-2 col-2">
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Total Balance</Label>
                                <span className="col-span-2">${selectedCustomer.totalBalance}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Recovered Balance</Label>
                                <span className="col-span-2">${selectedCustomer.rec}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">BTC Balance</Label>
                                <span className="col-span-2">${selectedCustomer.btc}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">ETH Balance</Label>
                                <span className="col-span-2">${selectedCustomer.eth}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">DOGE Balance</Label>
                                <span className="col-span-2">{selectedCustomer.doge}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">USDT Balance</Label>
                                <span className="col-span-2">{selectedCustomer.usdt}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-3">Activity Information</h4>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Last Login</Label>
                                <span className="col-span-2">Comming Soon</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                  <Label className="text-muted-foreground">Registered</Label>
                                  <span className="col-span-2">
                                  {selectedCustomer.createdAt
                                    ? (selectedCustomer.createdAt instanceof Timestamp
                                        ? selectedCustomer.createdAt.toDate().toLocaleString()
                                        : selectedCustomer.createdAt.toLocaleString())
                                    : "N/A"}
                                </span>

                                </div>

                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Registered IP</Label>
                                <span className="col-span-2 font-mono">{selectedCustomer.ipAddress}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">City</Label>
                                <span className="col-span-2 font-mono">{selectedCustomer.location.ipcity}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Country, Region</Label>
                                <span className="col-span-2 font-mono">{selectedCustomer.location.ipcountry},{selectedCustomer.location.region}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Latitude and Longitude</Label>
                                <span className="col-span-2 font-mono">{selectedCustomer.location.latitude},{selectedCustomer.location.longitude}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-3">Feature Status</h4>
                            <div className="grid gap-2 ">
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">Status</Label>
                                <span className="col-span-2">{selectedCustomer.status}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">AI Trading</Label>
                                <span className="col-span-2">{selectedCustomer.isAIActive}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">BTC Shown</Label>
                                <span className="col-span-2">{selectedCustomer.isBTCtrue}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">ETH Shown</Label>
                                <span className="col-span-2">{selectedCustomer.isETHtrue}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">DOGE Shown</Label>
                                <span className="col-span-2">{selectedCustomer.isDOGEtrue}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1">
                                <Label className="text-muted-foreground">USDT Shown</Label>
                                <span className="col-span-2">{selectedCustomer.isUSDTtrue}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>
                    )}
                     <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCustomerDetails(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </>
            )}
             

{activeSection === "verification" && (
  <>
  <Card>
    <CardHeader>
      <CardTitle>Verification Requests</CardTitle>
      <CardDescription>Review and manage customer verification documents</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Personal Info</TableHead>
            <TableHead>ID Details</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verification PopUp</TableHead>
            <TableHead>Hide Verification</TableHead>
            <TableHead>Date</TableHead> 
            <TableHead>Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {customerItems.length > 0 ? (
                  customerItems
                    .filter((item) => item.vfdate) // Avoid errors from missing timestamps
                    .sort((a, b) => {
                      const dateA = a.vfdate instanceof Timestamp ? a.vfdate.toDate() : new Date(a.vfdate);
                      const dateB = b.vfdate instanceof Timestamp ? b.vfdate.toDate() : new Date(b.vfdate);
                      return dateB.getTime() - dateA.getTime(); // Descending order
                    })
                    .map((item) => (
             
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
  <AvatarImage
    src={item.verificationData.selfieUrl || "/assets/placeholder.svg"} // Use selfieUrl if available
    alt={`${item.name || "Unknown"}'s avatar`}
  />
  <AvatarFallback>
    {item.name?.[0]?.toUpperCase() || "?"} {/* Fallback: First letter or "?" */}
  </AvatarFallback>
</Avatar>

                  <div>
                    <div className="font-medium">
                      {item.name || "N/A"} 
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.userEmail || "N/A"}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Personal Info */}
              <TableCell>
                <div className="space-y-0.5">
                  <div className="text-xs text-muted-foreground">{item.verificationData.addressLine1 || "N/A"}</div>
                  {item.verificationData.addressLine2 && (
                    <div className="text-xs text-muted-foreground">{item.verificationData.addressLine2}</div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {item.verificationData.vfcity || "N/A"}, {item.verificationData.state || ""}{" "},
                    {item.verificationData.postalCode || ""}
                  </div>
                </div>
              </TableCell>

              {/* ID Details */}
              <TableCell>
                <div className="space-y-0.5">
                  <div className="text-sm font-medium capitalize">{item.verificationData.idType || "N/A"}</div>
                  <div className="text-xs text-muted-foreground">
                    Number: {item.verificationData.idNumber || "N/A"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
      <div className="flex gap-2">
        {/* Selfie Image */}
        <Dialog>
        
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-12 w-12 p-0" // Small preview
              onClick={() => setSelectedImage(item.verificationData.selfieUrl)}
            >
              <Image
                src={item.verificationData.selfieUrl || "/assets/noimage.svg"}
                alt="Selfie"
                width={200} // Set an appropriate width
               height={200} // Set an appropriate height
                className="h-full w-full object-cover rounded"
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-4 flex justify-center items-center">
            <Image src={selectedImage} alt="Preview" className="w-auto h-[500px] rounded-lg shadow-lg" />
          </DialogContent>
        </Dialog>

        {/* ID Front Image */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-12 w-12 p-0" // Small preview
              onClick={() => setSelectedImage(item.verificationData.idFrontUrl)}
            >
              <Image
                src={item.verificationData.idFrontUrl || "/assets/noimage.svg"}
                alt="ID Front"
                width={200} // Set an appropriate width
                height={200} // Set an appropriate height
                className="h-full w-full object-cover rounded"
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-4 flex justify-center items-center">
            <Image src={selectedImage} alt="Preview" className="w-auto h-[500px] rounded-lg shadow-lg" />
          </DialogContent>
        </Dialog>

        {/* ID Back Image */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-12 w-12 p-0" // Small preview
              onClick={() => setSelectedImage(item.verificationData.idBackUrl)}
            >
              <Image
                src={item.verificationData.idBackUrl || "/assets/noimage.svg"}
                alt="ID Back"
                width={200} // Set an appropriate width
                height={200} // Set an appropriate height
                className="h-full w-full object-cover rounded"
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-4 flex justify-center items-center">
            <Image src={selectedImage} alt="Preview" className="w-auto h-[500px] rounded-lg shadow-lg" />
          </DialogContent>
        </Dialog>
      </div>
    </TableCell>

        

              {/* Status */}
              <TableCell>
                          <Badge variant={item.isVerified ? "default" : "secondary"}>
                            {item.isVerified ? "Verified" : "Not Verified"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.popupVerification ? "default" : "secondary"}>
                            {item.popupVerification ? "True" : "False"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.hideVerification ? "default" : "secondary"}>
                            {item.hideVerification ? "Hidden" : "Not Hidden"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                        {item.date
                            ? format(
                                item.vfdate instanceof Timestamp
                                  ? item.vfdate.toDate() // Convert Firestore Timestamp to Date
                                  : item.vfdate, // Use Date directly
                                "MMMM dd, yyyy"
                              )
                            : "Invalid Date"}
                        </TableCell>


                        <TableCell>
                            {item.vfdate
                              ? format(
                                  item.vfdate instanceof Timestamp
                                    ? item.vfdate.toDate()
                                    : new Date(item.vfdate),
                                  // "HH:mm" // Correct format for time only
                                  "hh:mm a" // 12-hour format with AM/PM
                                )
                              : "Invalid Time"}
                          </TableCell>
              

              {/* edit and delit */}
              <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                               setEditingVerification(item);
                              // setShowVerificationDetails(true);
                            }}
                          >
                           
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleVerificationTickets(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                        </TableCell>
                     
                          
                        
                        </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No Customers Found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={!!editingVerification} onOpenChange={(open) => !open && setEditingVerification(null)}>
  <DialogContent className="sm:max-w-[825px]">
    <DialogHeader>
      <DialogTitle>Verification Details</DialogTitle>
      <DialogDescription>Detailed information about the verification request</DialogDescription>
    </DialogHeader>

    {editingVerification && (
      <form onSubmit={handleEditVerification} className="space-y-4">
        <div className="grid gap-4 py-4">
          {/* Name & Email */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">ID Name:</Label>
              <div className="flex-1">{editingVerification.verificationData.idName}</div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">Email:</Label>
              <div className="flex-1">{editingVerification.userEmail}</div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">DOB:</Label>
              <div className="flex-1">{editingVerification.verificationData.userDob}</div>
            </div>
          </div>
          {/* Number, Type & Expery */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">ID Type:</Label>
              <div className="flex-1">{editingVerification.verificationData.idType}</div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">ID Number:</Label>
              <div className="flex-1">{editingVerification.verificationData.idName}</div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">ID Expiery:</Label>
              <div className="flex-1">{editingVerification.verificationData.idExpiry}</div>
              
            </div>
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">Address:</Label>
              <div className="flex-1">
                {editingVerification.verificationData.addressLine1}, {editingVerification.verificationData.addressLine2}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">City:</Label>
              <div className="flex-1">
                {editingVerification.verificationData.vfcity}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">Country:</Label>
              <div className="flex-1">
                {editingVerification.verificationData.vfcountry}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-right w-24">Postcode:</Label>
              <div className="flex-1">
                {editingVerification.verificationData.postalCode}
              </div>
            </div>
          </div>

          {/* ID Verification */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <Label>ID Front</Label>
              <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 h-30 w-30 p-0" // Small preview
              onClick={() => setSelectedImage(editingVerification.verificationData.idFrontUrl)}
            >
              <Image
                src={editingVerification.verificationData.idFrontUrl || "/assets/noimage.svg"}
                alt="ID Back"
                width={200} // Set an appropriate width
                height={200} // Set an appropriate height
                className="h-full w-full object-cover rounded"
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-4 flex justify-center items-center">
            <Image src={selectedImage} alt="Preview" className="w-auto h-[500px] rounded-lg shadow-lg" />
          </DialogContent>
        </Dialog>            </div>
            <div className="flex flex-col items-center pb-4">
              <Label>ID Back</Label>
              <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 h-30 w-30 p-0" // Small preview
              onClick={() => setSelectedImage(editingVerification.verificationData.idBackUrl)}
            >
              <Image
                src={editingVerification.verificationData.idBackUrl || "/assets/noimage.svg"}
                alt="ID Back"
                width={200} // Set an appropriate width
                height={200} // Set an appropriate height
                className="h-full w-full object-cover rounded"
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-4 flex justify-center items-center">
            <Image src={selectedImage} alt="Preview" className="w-auto h-[500px] rounded-lg shadow-lg" />
          </DialogContent>
        </Dialog>
            </div>
            <div className="flex flex-col items-center">
              <Label>Selfie</Label>
              {/* <img src={editingVerification.verificationData.selfieUrl || "/assets/noimage.svg"} alt="Selfie" className="h-24 w-24 object-cover" /> */}
              <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 h-30 w-30 p-0" // Small preview
              onClick={() => setSelectedImage(editingVerification.verificationData.selfieUrl)}
            >
              <Image
                src={editingVerification.verificationData.selfieUrl || "/assets/noimage.svg"}
                alt="ID Back"
                width={200} // Set an appropriate width
                height={200} // Set an appropriate height
                className="h-full w-full object-cover rounded"
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-4 flex justify-center items-center">
            <Image src={selectedImage} alt="Preview" className="w-auto h-[500px] rounded-lg shadow-lg" />
          </DialogContent>
        </Dialog>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
                   {/* Last uploaded Time */}
             <div className="flex items-center gap-2">
                    <Label className="text-right w-24">Uploaded for Verfication</Label>
                    <div className="flex-1">
                      {editingVerification.vfdate
                        ? (editingVerification.vfdate instanceof Timestamp
                            ? editingVerification.vfdate.toDate()
                            : new Date(editingVerification.vfdate)
                          ).toLocaleString()
                        : 'Not updated yet'}
                    </div>
                  </div>
             {/* Last Updated Time */}
             <div className="flex items-center gap-2">
                    <Label className="text-right w-24">Last Updated</Label>
                    <div className="flex-1">
                      {editingVerification.vfupdatedAt
                        ? (editingVerification.vfupdatedAt instanceof Timestamp
                            ? editingVerification.vfupdatedAt.toDate()
                            : new Date(editingVerification.vfupdatedAt)
                          ).toLocaleString()
                        : 'Not updated yet'}
                    </div>
                  </div>
                  </div>
                
{/* Status Dropdown */}
<div className="grid grid-cols-3 gap-4 items-center">
  <div className="flex items-center gap-2">
    <Label className="text-right w-24">Status:</Label>
    <Select
      name="isVerified"
      value={editingVerification.isVerified ? "true" : "false"} // Convert boolean to string
      onValueChange={(value) =>
        setEditingVerification((prev) =>
          prev ? { ...prev, isVerified: value === "true" } : null
        )
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        {/* <SelectItem value="Pending">Pending</SelectItem> */}
        <SelectItem value="true">Verified</SelectItem>
        <SelectItem value="false">Not Verified</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="flex items-center gap-2">
    <Label className="text-right w-24">Verification PopUp:</Label>
    <Select
      name="popupVerification"
      value={editingVerification.popupVerification ? "true" : "false"} // Convert boolean to string
      onValueChange={(value) =>
        setEditingVerification((prev) =>
          prev ? { ...prev, popupVerification: value === "true" } : null
        )
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        {/* <SelectItem value="Pending">Pending</SelectItem> */}
        <SelectItem value="true">True</SelectItem>
        <SelectItem value="false">False</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="flex items-center gap-2">
    <Label className="text-right w-24">Hide Verification:</Label>
    <Select
      name="hideVerification"
      value={editingVerification.hideVerification ? "true" : "false"} // Convert boolean to string
      onValueChange={(value) =>
        setEditingVerification((prev) =>
          prev ? { ...prev, hideVerification: value === "true" } : null
        )
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        {/* <SelectItem value="Pending">Pending</SelectItem> */}
        <SelectItem value="true">True</SelectItem>
        <SelectItem value="false">False</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>




        </div>

        {/* Dialog Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditingVerification(null)}>
            Close
          </Button>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </form>
    )}
  </DialogContent>
</Dialog>

          


    </CardContent>
  </Card>
   </>
)}

          {activeSection === "deposits" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deposit Management</CardTitle>
                  <CardDescription>Monitor and manage deposit requests</CardDescription>
                </CardHeader>
                <CardContent>
                {loading ? (
          <div className="flex flex-col justify-center items-center h-40">
            <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-2 text-sm sm:text-base">Loading Deposits...</p>
          </div>
        ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {depositsItems.length > 0 ? (
                  depositsItems
                    .filter((item) => item.date) // Avoid errors from missing timestamps
                    .sort((a, b) => {
                      const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
                      const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
                      return dateB.getTime() - dateA.getTime(); // Descending order
                    })
                    .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
  <AvatarImage
    src={item.selfieUrl || "/assets/placeholder.svg"} // Use selfieUrl if available
    alt={`${item.name || "Unknown"}'s avatar`}
  />
  <AvatarFallback>
    {item.name?.[0]?.toUpperCase() || "?"} {/* Fallback: First letter or "?" */}
  </AvatarFallback>
</Avatar>

                  <div>
                    <div className="font-medium">
                      {item.name || "N/A"} 
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.userEmail || "N/A"}
                    </div>
                  </div>
                </div>
              </TableCell>
                          <TableCell>${item.amount.toLocaleString()}</TableCell>
                          <TableCell>{item.method}</TableCell>
                          <TableCell>{item.currency}</TableCell>
                          <TableCell>{item.status}</TableCell>
                         
                          <TableCell>
                        {item.date
                            ? format(
                                item.date instanceof Timestamp
                                  ? item.date.toDate() // Convert Firestore Timestamp to Date
                                  : item.date, // Use Date directly
                                "MMMM dd, yyyy"
                              )
                            : "Invalid Date"}
                        </TableCell>
                        <TableCell>
                            {item.date
                              ? format(
                                  item.date instanceof Timestamp
                                    ? item.date.toDate()
                                    : new Date(item.date),
                                  // "HH:mm" // Correct format for time only
                                  "hh:mm a" // 12-hour format with AM/PM
                                )
                              : "Invalid Time"}
                          </TableCell>

                          <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm"onClick={() => {
                               setEditingDeposit(item);
                            }}>
                            <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDeposits(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No Ticket Requests Found.
                        </TableCell>
                      </TableRow>
                    )}
                    </TableBody>
                  </Table>
                  )}

<Dialog open={!!editingDeposit} onOpenChange={(open) => !open && setEditingDeposit(null)}>
          <DialogContent className="sm:max-w-[825px]">
            <DialogHeader>
              <DialogTitle>Deposit Details</DialogTitle>
              <DialogDescription>
                Detailed information about the deposit request
              </DialogDescription>
              


            </DialogHeader>

            {editingDeposit && (
              <form onSubmit={handleEditDeposit}  className="space-y-4">
                              <p className="text-sm text-muted-foreground">Transaction ID: {editingDeposit.id}</p>

                <div className="grid gap-4 py-4">
                  {/* Name & Email */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Name</Label>
                      <div className="flex-1">{editingDeposit.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Email</Label>
                      <div className="flex-1">{editingDeposit.userEmail}</div>
                    </div>
                  </div>

                 

                  {/* Amount & Commission
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Withdrawal Amount:</Label>
                      <Input
                          name="amount"
                          type="number"
                          defaultValue={editingDeposit.amount} // Pre-fill with current amount
                          step="any"
                          required
                      />
                    </div>
                    
                  </div> */}

           







                  {/* Editable Date & Time Inputs */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Withdrawal Amount:</Label>
                      <Input
                          name="amount"
                          type="number"
                          defaultValue={editingDeposit.amount} // Pre-fill with current amount
                          step="any"
                          required
                      />
                    </div>
                    {/* Date Input */}
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Date:</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={
                          editingDeposit.date instanceof Timestamp
                            ? editingDeposit.date.toDate().toISOString().split('T')[0]
                            : new Date(editingDeposit.date).toISOString().split('T')[0]
                        }
                        required
                      />
                    </div>

                    {/* Time Input */}
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Time:</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        defaultValue={
                          editingDeposit.date instanceof Timestamp
                            ? editingDeposit.date.toDate().toTimeString().split(' ')[0].substring(0, 5)
                            : new Date(editingDeposit.date).toTimeString().split(' ')[0].substring(0, 5)
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Last Updated Time */}
                  {/* <div className="flex items-center gap-2">
                    <Label className="text-right w-24">Last Updated</Label>
                    <div className="flex-1">
                      {editingDeposit.updatedAt
                        ? (editingDeposit.updatedAt instanceof Timestamp
                            ? editingDeposit.updatedAt.toDate()
                            : new Date(editingDeposit.updatedAt)
                          ).toLocaleString()
                        : 'Not updated yet'}
                    </div>
                  </div>*/}
                </div> 
 {/* Method & Currency */}
 <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Method:</Label>
                      <div className="flex-1">{editingDeposit.method}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Currency:</Label>
                      <div className="flex-1">{editingDeposit.currency}</div>
                    </div>
                  </div>

 {/* Status Dropdown */}
 <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Status:</Label>
                      <Select
                      name="status"
                        value={editingDeposit.status}
                        onValueChange={(value) =>
                          setEditingDeposit((prev) =>
                            prev ? ({ ...prev, status: value } as Deposits) : null
                          )
                        }
                        
                        
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Canceled">Canceled</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                     {/* Last Updated Time */}
                  <div className="flex items-center gap-2">
                    <Label className="text-right w-24">Last Updated</Label>
                    <div className="flex-1">
                      {editingDeposit.updatedAt
                        ? (editingDeposit.updatedAt instanceof Timestamp
                            ? editingDeposit.updatedAt.toDate()
                            : new Date(editingDeposit.updatedAt)
                          ).toLocaleString()
                        : 'Not updated yet'}
                    </div>
                  </div>
               

                    </div>

                {editingDeposit.bankName && (
                        <>
                          <Separator className="my-2" />
                          <div className="grid gap-4">
                            <h4 className="font-medium">Bank Details</h4>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Bank Name</Label>
                              <div className="col-span-3">{editingDeposit.bankName}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Account Holder</Label>
                              <div className="col-span-3">{editingDeposit.accountName}</div>
                            </div>
                          </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Account #</Label>
                              <div className="col-span-3 font-mono">{editingDeposit.accountNumber}</div>
                            </div>
                            
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Account Type</Label>
                              <div className="col-span-3">{editingDeposit.accountType}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Routing #</Label>
                              <div className="col-span-3 font-mono">{editingDeposit.swiftCode}</div>
                            </div>
                            
                        </>
                      )}

                      {editingDeposit.cardName && (
                        <>
                          <Separator className="my-2" />
                          <div className="grid gap-4">
                            <h4 className="font-medium">Card Details</h4>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Card Type</Label>
                              <div className="col-span-3">{editingDeposit.cardType}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Card Holder</Label>
                              <div className="col-span-3">{editingDeposit.cardName}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Card Number</Label>
                              <div className="col-span-3 font-mono">{editingDeposit.cardNumber}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Expiry Date</Label>
                              <div className="col-span-3">{editingDeposit.cardYear}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">CVV</Label>
                              <div className="col-span-3 font-mono">{editingDeposit.cardCVV}</div>
                            </div>
                          </div>
                        </>
                      )}
                          {editingDeposit.paypalEmail && (
                        <>
                          <Separator className="my-2" />
                          <div className="grid gap-4">
                            <h4 className="font-medium">PayPal Details</h4>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">PayPal Email ID</Label>
                              <div className="col-span-3">{editingDeposit.paypalEmail}</div>
                            </div>
                            </div>
                        </>
                      )}
                       {editingDeposit.walletAddress && (
                        <>
                          <Separator className="my-2" />
                          <div className="grid gap-4">
                            <h4 className="font-medium">Crypto Details</h4>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Wallet Address</Label>
                              <div className="flex-1 break-all">
    {typeof editingDeposit.walletAddress === "string" &&
    editingDeposit.walletAddress.trim() !== ""
      ? editingDeposit.walletAddress
      : "N/A"}
  </div>
  {editingDeposit.walletAddress && (
    <Button
      variant="ghost"
      size="sm"
      onMouseDown={(event) => {
        event.preventDefault(); // Prevents button from taking focus
        navigator.clipboard.writeText(editingDeposit.walletAddress);
        showToast({
          title: "Copied!",
          description: "Wallet address copied to clipboard.",
          variant: "default", // Can be "success", "destructive", etc.
        });
      }}
      onClick={(event) => {
        event.preventDefault(); // Prevents click from closing dialog
        event.stopPropagation(); // Prevents the click from bubbling up to the dialog
      }}
    >
      <ClipboardIcon className="h-4 w-4" />
    </Button>
  )}
                            </div>
                          
                          </div>
                        </>
                      )}
                   
                   



                {/* Dialog Footer */}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingDeposit(null)}>
                    Close
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
                </CardContent>
              </Card>

             
            </div>
          )}

          {activeSection === "withdrawals" &&  (
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Management</CardTitle>
                <CardDescription>Monitor and manage withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
              {loading ? (
          <div className="flex flex-col justify-center items-center h-40">
            <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-2 text-sm sm:text-base">Loading Withdrawals...</p>
          </div>
        ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Commission Status</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {withdrawalsItems.length > 0 ? (
                  withdrawalsItems
                    .filter((item) => item.date) // Avoid errors from missing timestamps
                    .sort((a, b) => {
                      const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
                      const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
                      return dateB.getTime() - dateA.getTime(); // Descending order
                    })
                    .map((item) => (
                      <TableRow key={item.id}>
                      <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
  <AvatarImage
    src= "/assets/placeholder.svg" // Use selfieUrl if available
    alt={`${item.name || "Unknown"}'s avatar`}
  />
  <AvatarFallback>
    {item.name?.[0]?.toUpperCase() || "?"} {/* Fallback: First letter or "?" */}
  </AvatarFallback>
</Avatar>

                  <div>
                    <div className="font-medium">
                      {item.name || "N/A"} 
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.userEmail || "N/A"}
                    </div>
                  </div>
                </div>
              </TableCell>
                      <TableCell>${item.amount}</TableCell>
                      <TableCell>{item.method}</TableCell>
                      <TableCell>{item.currency}</TableCell>
                      <TableCell>${item.commission}</TableCell>
                      <TableCell>
  <Badge variant={item.commissionstatus === 'Paid' ? 'secondary' : 'default'}>
    {item.commissionstatus}
  </Badge>
</TableCell>

                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        {item.date
                          ? format(
                              item.date instanceof Timestamp ? item.date.toDate() : item.date,
                              'MMMM dd, yyyy'
                            )
                          : 'Invalid Date'}
                      </TableCell>
                      <TableCell>
                            {item.date
                              ? format(
                                  item.date instanceof Timestamp
                                    ? item.date.toDate()
                                    : new Date(item.date),
                                  // "HH:mm" // Correct format for time only
                                  "hh:mm a" // 12-hour format with AM/PM
                                )
                              : "Invalid Time"}
                          </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingWithdrawal(item);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWithdrawals(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No Ticket Requests Found.
                      </TableCell>
                    </TableRow>
                  )}
                  </TableBody>
                </Table>
                 )}
               <Dialog open={!!editingWithdrawal} onOpenChange={(open) => !open && setEditingWithdrawal(null)}>
          <DialogContent className="sm:max-w-[825px]">
            <DialogHeader>
              <DialogTitle>Withdrawal Details</DialogTitle>
              <DialogDescription>
                Detailed information about the withdrawal request
              </DialogDescription>
            </DialogHeader>

            {editingWithdrawal && (
              <form onSubmit={handleEditWithdrawals} className="space-y-4">
                                              <p className="text-sm text-muted-foreground">Transaction ID: {editingWithdrawal.id}</p>

                <div className="grid gap-4 py-4">
                  {/* Name & Email */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Name</Label>
                      <div className="flex-1">{editingWithdrawal.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Email</Label>
                      <div className="flex-1">{editingWithdrawal.userEmail}</div>
                    </div>
                  </div>

                  {/* Method & Currency */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Method:</Label>
                      <div className="flex-1">{editingWithdrawal.method}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Currency:</Label>
                      <div className="flex-1">{editingWithdrawal.currency}</div>
                    </div>
                  </div>

                  {/* Amount & Commission */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Withdrawal Amount:</Label>
                      <Input
                          name="amount"
                          type="number"
                          defaultValue={editingWithdrawal.amount} // Pre-fill with current amount
                          step="any"
                          required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Commission:</Label>
                      <Input
                          name="commission"
                          type="number"
                          defaultValue={editingWithdrawal.commission} // Pre-fill with current amount
                          step="any"
                          required
                      />
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Status:</Label>
                      <Select
                      name="status"
                        value={editingWithdrawal.status}
                        onValueChange={(value) =>
                          setEditingWithdrawal((prev) =>
                            prev ? { ...prev, status: value } : null
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Canceled">Canceled</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Commission Status:</Label>
                      <Select
                      name="commissionstatus"
                        value={editingWithdrawal.commissionstatus}
                        onValueChange={(value) =>
                          setEditingWithdrawal((prev) =>
                            prev ? { ...prev, commissionstatus: value } : null
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Not Paid">Unpaid</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

       {/* Wallet Address
<div className="flex items-center gap-2">
  <Label className="text-right w-24">Wallet Address</Label>
  <div className="flex-1 break-all">
    {typeof editingWithdrawal.walletAddress === 'string' && editingWithdrawal.walletAddress.trim() !== ''
      ? editingWithdrawal.walletAddress
      : 'N/A'}
  </div>
</div> */}
{/* Wallet Address */}
<div className="flex items-center gap-2">
  <Label className="text-right w-24">Wallet Address</Label>
  <div className="flex-1 break-all">
    {typeof editingWithdrawal.walletAddress === "string" &&
    editingWithdrawal.walletAddress.trim() !== ""
      ? editingWithdrawal.walletAddress
      : "N/A"}
  </div>
  {editingWithdrawal.walletAddress && (
    <Button
      variant="ghost"
      size="sm"
      onMouseDown={(event) => {
        event.preventDefault(); // Prevents button from taking focus
        navigator.clipboard.writeText(editingWithdrawal.walletAddress);
        showToast({
          title: "Copied!",
          description: "Wallet address copied to clipboard.",
          variant: "default", // Can be "success", "destructive", etc.
        });
      }}
      onClick={(event) => {
        event.preventDefault(); // Prevents click from closing dialog
        event.stopPropagation(); // Prevents the click from bubbling up to the dialog
      }}
    >
      <ClipboardIcon className="h-4 w-4" />
    </Button>
  )}
</div>








                  {/* Editable Date & Time Inputs */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    {/* Date Input */}
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Date:</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={
                          editingWithdrawal.date instanceof Timestamp
                            ? editingWithdrawal.date.toDate().toISOString().split('T')[0]
                            : new Date(editingWithdrawal.date).toISOString().split('T')[0]
                        }
                        required
                      />
                    </div>

                    {/* Time Input */}
                    <div className="flex items-center gap-2">
                      <Label className="text-right w-24">Time:</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        defaultValue={
                          editingWithdrawal.date instanceof Timestamp
                            ? editingWithdrawal.date.toDate().toTimeString().split(' ')[0].substring(0, 5)
                            : new Date(editingWithdrawal.date).toTimeString().split(' ')[0].substring(0, 5)
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Last Updated Time */}
                  <div className="flex items-center gap-2">
                    <Label className="text-right w-24">Last Updated</Label>
                    <div className="flex-1">
                      {editingWithdrawal.updatedAt
                        ? (editingWithdrawal.updatedAt instanceof Timestamp
                            ? editingWithdrawal.updatedAt.toDate()
                            : new Date(editingWithdrawal.updatedAt)
                          ).toLocaleString()
                        : 'Not updated yet'}
                    </div>
                  </div>
                </div>

                {/* Dialog Footer */}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingWithdrawal(null)}>
                    Close
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

              </CardContent>
            </Card>
          )}
{/* Needto stedt */}
          {/* {activeSection === "tickets" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>Manage customer support tickets</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>

                      {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{ticket.customer}</div>
                              <div className="text-sm text-muted-foreground">{ticket.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>
                            <Badge variant={ticket.status === "open" ? "default" : "secondary"}>{ticket.status}</Badge>
                          </TableCell>
                          <TableCell>{ticket.created}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Manage FAQ entries for the support section</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddFAQ(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add FAQ
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqs.map((faq) => (
                        <TableRow key={faq.id}>
                          <TableCell className="font-medium">{faq.question}</TableCell>
                          <TableCell>{faq.category}</TableCell>
                          <TableCell>{faq.updatedAt}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setEditingFAQ(faq)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteFAQ(faq.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Dialog open={showAddFAQ} onOpenChange={setShowAddFAQ}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add FAQ</DialogTitle>
                    <DialogDescription>Add a new frequently asked question to the support section.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddFAQ} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Input id="question" name="question" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea id="answer" name="answer" required className="min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue="Account">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Account">Account</SelectItem>
                          <SelectItem value="Fees">Fees</SelectItem>
                          <SelectItem value="Trading">Trading</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowAddFAQ(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add FAQ</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingFAQ} onOpenChange={(open) => !open && setEditingFAQ(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit FAQ</DialogTitle>
                    <DialogDescription>Modify the FAQ details.</DialogDescription>
                  </DialogHeader>
                  {editingFAQ && (
                    <form onSubmit={handleEditFAQ} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-question">Question</Label>
                        <Input id="edit-question" name="question" defaultValue={editingFAQ.question} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-answer">Answer</Label>
                        <Textarea
                          id="edit-answer"
                          name="answer"
                          defaultValue={editingFAQ.answer}
                          required
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select name="category" defaultValue={editingFAQ.category}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Account">Account</SelectItem>
                            <SelectItem value="Fees">Fees</SelectItem>
                            <SelectItem value="Trading">Trading</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditingFAQ(null)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )} */}




{activeSection === "tickets" && (
   <>
  
     
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle> {/* Fixed typo */}
        <CardDescription>Manage customer support tickets</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col justify-center items-center h-40">
            <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-2 text-sm sm:text-base">Loading tickets...</p>
          </div>
        ) : (
          //  <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticketItems.length > 0 ? (
                  ticketItems
                    .filter((item) => item.createdAt) // Avoid errors from missing timestamps
                    .sort((a, b) => {
                      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
                      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
                      return dateB.getTime() - dateA.getTime(); // Descending order
                    })
                    .map((item) => (
                      <TableRow key={item.id}>
                        
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === "open" ? "default" : "secondary"}>
                            {item.status ?? "open"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.createdAt
                            ? format(
                                item.createdAt instanceof Timestamp
                                  ? item.createdAt.toDate() // Convert Firestore Timestamp to Date
                                  : item.createdAt, // Use Date directly
                                "MMMM dd, yyyy"
                              )
                            : "Invalid Date"}
                        </TableCell>
                        <TableCell>
                            {item.createdAt
                              ? format(
                                  item.createdAt instanceof Timestamp
                                    ? item.createdAt.toDate()
                                    : new Date(item.createdAt),
                                  // "HH:mm" // Correct format for time only
                                  "hh:mm a" // 12-hour format with AM/PM
                                )
                              : "Invalid Time"}
                          </TableCell>
                        <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(item);
                              setShowTicketDetails(true);
                            }}
                          >
                           
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTickets(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No Ticket Requests Found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
       
      )}
 </CardContent>
    </Card>
   


                  {/* Ticket Details Modal */}
                  <Dialog open={showTicketDetails} onOpenChange={setShowTicketDetails}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
          <DialogDescription>View and manage support ticket</DialogDescription>
        </DialogHeader>
        {selectedTicket && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Customer</Label>
              <div className="col-span-3 font-medium">{selectedTicket.name}</div> {/* Used name instead of customer */}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <div className="col-span-3">{selectedTicket.email}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
  <Label className="text-right">Status</Label>
  <div className="col-span-3">
    <Badge variant={selectedTicket.status === "open" ? "default" : "secondary"}>
      {selectedTicket.status ?? "Unknown"} {/* ✅ Fallback to "Unknown" */}
    </Badge>
  </div>
</div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Created</Label>
              <div className="col-span-3">
  {selectedTicket.createdAt
    ? format(
        selectedTicket.createdAt instanceof Timestamp
          ? selectedTicket.createdAt.toDate()
          : new Date(selectedTicket.createdAt),
        "MMMM dd, yyyy • hh:mm a" // ✅ Added time with AM/PM format
      )
    : "Invalid Date"}
</div>

            </div> {/* ✅ Closing div correctly placed */}
            
            <Separator className="my-2" />
            <div className="space-y-2">
              <Label>Subject</Label>
              <div className="font-medium">{selectedTicket.subject}</div>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                {selectedTicket.message}
              </ScrollArea>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowTicketDetails(false)}>
            Close
          </Button>
          <Button onClick={handleToggleStatus}>
  {selectedTicket?.status === "closed" ? "Reopen Ticket" : "Mark as Resolved"}
</Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>

              

           
              <Dialog open={showAddFAQ} onOpenChange={setShowAddFAQ}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add FAQ</DialogTitle>
                    <DialogDescription>Add a new frequently asked question to the support section.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddFAQ} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Input id="question" name="question" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea id="answer" name="answer" required className="min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue="Account">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Account">Account</SelectItem>
                          <SelectItem value="Fees">Fees</SelectItem>
                          <SelectItem value="Trading">Trading</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Technical">Technical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowAddFAQ(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add FAQ</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingFAQ} onOpenChange={(open) => !open && setEditingFAQ(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit FAQ</DialogTitle>
                    <DialogDescription>Modify the FAQ details.</DialogDescription>
                  </DialogHeader>
                  {editingFAQ && (
                    <form onSubmit={handleEditFAQ} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-question">Question</Label>
                        <Input id="edit-question" name="question" defaultValue={editingFAQ.question} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-answer">Answer</Label>
                        <Textarea
                          id="edit-answer"
                          name="answer"
                          defaultValue={editingFAQ.answer}
                          required
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select name="category" defaultValue={editingFAQ.category}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Account">Account</SelectItem>
                            <SelectItem value="Fees">Fees</SelectItem>
                            <SelectItem value="Trading">Trading</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditingFAQ(null)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changses</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
    
    </>
  )}
  
              

          
           
              
        

          {activeSection === "pre-release" &&  (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Token Launches</CardTitle>
                    <CardDescription>Complete list of upcoming token launches and their details</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddToken(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Token
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Initial Price</TableHead>
                          <TableHead>Total Supply</TableHead>
                          <TableHead>24h Change</TableHead>
                          <TableHead>Potential Returns</TableHead>
                          <TableHead>Launch Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {prereleasetokenItems.length > 0 ? (
                  prereleasetokenItems
                    .filter((item) => item.date) // Avoid errors from missing timestamps
                    .sort((a, b) => {
                      const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
                      const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
                      return dateB.getTime() - dateA.getTime(); // Descending order
                    })
                    .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.symbol}</TableCell>
                            <TableCell>${item.price}</TableCell>
                            <TableCell>{item.supply.toLocaleString()}</TableCell>
                           
                            <TableCell className={`font-medium ${
                                                     item.profitLoss.startsWith('+') ? 'text-green-400' : 'text-red-400'
                                                   }`}>
                                                     {item.profitLoss}
                                                   </TableCell>
                            <TableCell>
                              {item.potentialReturn}
                            </TableCell>
                            <TableCell>
                        {item.date
                            ? format(
                                item.date instanceof Timestamp
                                  ? item.date.toDate() // Convert Firestore Timestamp to Date
                                  : item.date, // Use Date directly
                                "MMMM dd, yyyy"
                              )
                            : "Invalid Date"}
                        </TableCell>
                        <TableCell>
                            {item.date
                              ? format(
                                  item.date instanceof Timestamp
                                    ? item.date.toDate()
                                    : new Date(item.date),
                                  // "HH:mm" // Correct format for time only
                                  "hh:mm a" // 12-hour format with AM/PM
                                )
                              : "Invalid Time"}
                          </TableCell>
                             <TableCell>
                                                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium transition-all duration-300
                                                        ${item.status === 'Upcoming' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
                                                          item.status === 'Whitelist Open' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                                          item.status === 'Registration Open' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' :
                                                          item.status === 'Live' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                                        'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'}`}>
                                                        {item.status}
                                                      </span>
                                                    </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => {
                               setEditingPrereleasetoken(item)
                               setShowPrereleasetokenDetails(true)
                            }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeletePrereleasetoken(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                       ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No Ticket Requests Found.
                          </TableCell>
                        </TableRow>
                      )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Dialog open={showAddToken} onOpenChange={setShowAddToken}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Token</DialogTitle>
                    <DialogDescription>Add a new token to the upcoming launches list</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPrereleasetoken} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Token Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input id="symbol" name="symbol" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="initialPrice">Initial Price ($)</Label>
                        <Input id="initialPrice" name="initialPrice" type="number" step="0.000001" min="0" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalSupply">Total Supply</Label>
                        <Input id="totalSupply" name="totalSupply" type="number" min="0" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="launchDate">Launch Date</Label>
                      <Input id="launchDate" name="launchDate" type="date" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="change24h">24h Change (%)</Label>
                        <Input id="change24h" name="change24h" type="number" step="0.1" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue="upcoming">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                              <SelectItem value="Whitelist Open">Whitelist Open</SelectItem>
                              <SelectItem value="Live">Live</SelectItem>
                              <SelectItem value="Registration Open">Registration Open</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="potentialReturnsMin">Min Returns (x)</Label>
                        <Input id="potentialReturnsMin" name="potentialReturnsMin" type="number" min="0" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="potentialReturnsMax">Max Returns (x)</Label>
                        <Input id="potentialReturnsMax" name="potentialReturnsMax" type="number" min="0" required />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowAddToken(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Token</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingPrereleasetoken} onOpenChange={(open) => !open && setEditingPrereleasetoken(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Token</DialogTitle>
                    <DialogDescription>Modify the token details</DialogDescription>
                  </DialogHeader>
                  {editingPrereleasetoken && (
                    <form onSubmit={handleEditPrereleasetoken} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Token Name</Label>
                          <Input id="edit-name" name="name" defaultValue={editingPrereleasetoken.name} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-symbol">Symbol</Label>
                          <Input id="edit-symbol" name="symbol" defaultValue={editingPrereleasetoken.symbol} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-initialPrice">Initial Price ($)</Label>
                          <Input
                            id="edit-initialPrice"
                            name="initialPrice"
                            type="number"
                            step="0.000001"
                            min="0"
                            defaultValue={editingPrereleasetoken.price}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-totalSupply">Total Supply</Label>
                          <Input
                            id="edit-totalSupply"
                            name="totalSupply"
                            type="number"
                            min="0"
                            defaultValue={editingPrereleasetoken.supply}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-launchDate">Launch Date</Label>
                        <Input
                          id="edit-launchDate"
                          name="launchDate"
                          type="date"
                          defaultValue={
                            editingPrereleasetoken.date instanceof Timestamp
                              ? editingPrereleasetoken.date.toDate().toISOString().split("T")[0] // Convert to "YYYY-MM-DD"
                              : editingPrereleasetoken.date // If it's already a string
                          }
                          required
                        />

                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-change24h">24h Change (%)</Label>
                          <Input
                            id="edit-change24h"
                            name="change24h"
                            type="number"
                            step="0.1"
                            defaultValue={editingPrereleasetoken.profitLoss}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-status">Status</Label>
                          <Select name="status" defaultValue={editingPrereleasetoken.status}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Upcoming">Upcoming</SelectItem>
                              <SelectItem value="Whitelist Open">Whitelist Open</SelectItem>
                              <SelectItem value="Live">Live</SelectItem>
                              <SelectItem value="Registration Open">Registration Open</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-potentialReturnsMin">Min Returns (x)</Label>
                          <Input
                            id="edit-potentialReturnsMin"
                            name="potentialReturnsMin"
                            type="number"
                            min="0"
                            defaultValue={editingPrereleasetoken.potentialReturn}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-potentialReturnsMax">Max Returns (x)</Label>
                          <Input
                            id="edit-potentialReturnsMax"
                            name="potentialReturnsMax"
                            type="number"
                            min="0"
                            defaultValue={editingPrereleasetoken.potentialReturn}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditingPrereleasetoken(null)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}



{activeSection === "trades" &&  (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>List of Trades</CardTitle>
                    <CardDescription>Complete list of customers Trades</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddTradeDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Trade
                  </Button>
                </CardHeader>
                <div className="mb-4">
  <Select onValueChange={(value) => setEmailFilter(value === "all" ? "" : value)}>
    <SelectTrigger className="w-full md:w-1/3">
      <SelectValue placeholder="Filter by email..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Emails</SelectItem> {/* Fix: Set "All Emails" to "all" */}
      {uniqueEmails.map((email) => (
        <SelectItem key={email} value={email}>
          {email}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>



                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Crypto Pair</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Investment Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {tradesItems.length > 0 ? (
  tradesItems
    .filter((item) => item.createdAt) // Avoid missing timestamps
    .filter((item) => !emailFilter || item.customerEmail === emailFilter) // Filter by selected email
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime(); // Sort newest first
    })
    .map((item) => (


                          <TableRow key={item.id}>
                           <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
  <AvatarImage
    src=  "/assets/placeholder.svg" // Use selfieUrl if available
    alt={`${item.customerName || "Unknown"}'s avatar`}
  />
  <AvatarFallback>
    {item.customerEmail?.[0]?.toUpperCase() || "?"} {/* Fallback: First letter or "?" */}
  </AvatarFallback>
</Avatar>

                  <div>
                    <div className="font-medium">
                      {item.customerName || "N/A"} 
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.customerEmail || "N/A"}
                    </div>
                  </div>
                </div>
              </TableCell>
                            <TableCell>{item.cryptoPair}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>{item.investmentAmount}</TableCell>
                            <TableCell>{item.type}</TableCell>
                        
                            <TableCell>
                                                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium transition-all duration-300
                                                        ${item.tradeResult === 'Loss' ? 'bg-red-500/20 text-red-400 ' :
                                                          item.tradeResult === 'Profit' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 animate-pulse' :
                                                        'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'}`}>
                                                        {item.tradeResult}
                                                      </span>
                                                    </TableCell>
                            <TableCell>
                        {item.createdAt
                            ? format(
                                item.createdAt instanceof Timestamp
                                  ? item.createdAt.toDate() // Convert Firestore Timestamp to Date
                                  : item.createdAt, // Use Date directly
                                "MMMM dd, yyyy"
                              )
                            : "Invalid Date"}
                        </TableCell>
                        <TableCell>
                            {item.createdAt
                              ? format(
                                  item.createdAt instanceof Timestamp
                                    ? item.createdAt.toDate()
                                    : new Date(item.createdAt),
                                  // "HH:mm" // Correct format for time only
                                  "hh:mm a" // 12-hour format with AM/PM
                                )
                              : "Invalid Time"}
                          </TableCell>
                             
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => {
                               setEditingTrades(item)
                              //  setShowPrereleasetokenDetails(true)
                            }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTrades(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                       ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No Trade Requests Found.
                          </TableCell>
                        </TableRow>
                      )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              
<Dialog open={showAddTradeDialog} onOpenChange={setShowAddTradeDialog}>
    <DialogTrigger asChild>
      {/* <Button variant="ghost" className="justify-start">
        <TrendingUp className="mr-2 h-4 w-4" />
        Add Trade
      </Button> */}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Trade</DialogTitle>
        <DialogDescription>Enter trade details below</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmitt} className="space-y-4">
        {/* Customer Selection */}
        <div className="space-y-2">
          <label>Customer</label>
          <Select onValueChange={handleCustomerSelectt} required>
  <SelectTrigger className="w-full flex items-center">
    <SelectValue placeholder="Select customer..." />
  </SelectTrigger>
  <SelectContent>
  {filteredCustomers?.length > 0 ? (
    filteredCustomers.map((customer) =>
      customer.id ? (
        <SelectItem key={customer.id} value={String(customer.id)}>
          {customer.name}  ({customer.email})
        </SelectItem>
      ) : null
    )
  ) : (
    <p className="text-gray-500 p-2">No customers found</p>
  )}
</SelectContent>


</Select>

        </div>
        

        {/* Date & Crypto Pair */}
        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
  <label>Date & Time</label>
  <Input
    type="datetime-local"
    name="date"
    value={tradeData.date}
    onChange={handleInputChanget}
    required
  />
</div>

          <div className="space-y-2">
  <label>Crypto Pair</label>
  <Input
    type="text"
    name="cryptoPair"
    value={tradeData.cryptoPair}
    onChange={handleInputChanget}
    placeholder="Enter crypto pair (e.g., BTC-USDT)"
    required
  />
</div>

        </div>

        {/* Trade Type & Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Type</label>
            <Select onValueChange={(value) => setTradeData({ ...tradeData, type: value })}required>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Buy">Buy</SelectItem>
                <SelectItem value="Sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label>Amount</label>
            <Input
              type="number"
              name="amount"
              value={tradeData.amount}
              onChange={handleInputChanget}
              placeholder="0.00"
              min={1}
              required
            />
          </div>
        </div>

        {/* Investment Amount */}
        <div className="space-y-2">
          <label>Investment Amount</label>
          <Input
            type="number"
            name="investmentAmount"
            value={tradeData.investmentAmount}
            onChange={handleInputChanget}
            placeholder="0.00"
            min={1}
            required
          />
        </div>

        {/* Trade Result */}
        <div className="space-y-2">
          <label>Trade Result</label>
          <Select onValueChange={(value) => setTradeData({ ...tradeData, tradeResult: value })}required>
            <SelectTrigger>
              <SelectValue placeholder="Select result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Profit">Profit</SelectItem>
              <SelectItem value="Loss">Loss</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button type="submit">Add Trade</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

              <Dialog open={!!editingPrereleasetoken} onOpenChange={(open) => !open && setEditingPrereleasetoken(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Token</DialogTitle>
                    <DialogDescription>Modify the token details</DialogDescription>
                  </DialogHeader>
                  {editingPrereleasetoken && (
                    <form onSubmit={handleEditPrereleasetoken} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Token Name</Label>
                          <Input id="edit-name" name="name" defaultValue={editingPrereleasetoken.name} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-symbol">Symbol</Label>
                          <Input id="edit-symbol" name="symbol" defaultValue={editingPrereleasetoken.symbol} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-initialPrice">Initial Price ($)</Label>
                          <Input
                            id="edit-initialPrice"
                            name="initialPrice"
                            type="number"
                            step="0.000001"
                            min="0"
                            defaultValue={editingPrereleasetoken.price}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-totalSupply">Total Supply</Label>
                          <Input
                            id="edit-totalSupply"
                            name="totalSupply"
                            type="number"
                            min="0"
                            defaultValue={editingPrereleasetoken.supply}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-launchDate">Launch Date</Label>
                        <Input
                          id="edit-launchDate"
                          name="launchDate"
                          type="date"
                          defaultValue={
                            editingPrereleasetoken.date instanceof Timestamp
                              ? editingPrereleasetoken.date.toDate().toISOString().split("T")[0] // Convert to "YYYY-MM-DD"
                              : editingPrereleasetoken.date // If it's already a string
                          }
                          required
                        />

                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-change24h">24h Change (%)</Label>
                          <Input
                            id="edit-change24h"
                            name="change24h"
                            type="number"
                            step="0.1"
                            defaultValue={editingPrereleasetoken.profitLoss}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-status">Status</Label>
                          <Select name="status" defaultValue={editingPrereleasetoken.status}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Upcoming">Upcoming</SelectItem>
                              <SelectItem value="Whitelist Open">Whitelist Open</SelectItem>
                              <SelectItem value="Live">Live</SelectItem>
                              <SelectItem value="Registration Open">Registration Open</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-potentialReturnsMin">Min Returns (x)</Label>
                          <Input
                            id="edit-potentialReturnsMin"
                            name="potentialReturnsMin"
                            type="number"
                            min="0"
                            defaultValue={editingPrereleasetoken.potentialReturn}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-potentialReturnsMax">Max Returns (x)</Label>
                          <Input
                            id="edit-potentialReturnsMax"
                            name="potentialReturnsMax"
                            type="number"
                            min="0"
                            defaultValue={editingPrereleasetoken.potentialReturn}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditingPrereleasetoken(null)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}


{activeSection === "crypto-recovery" &&  (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Crypto Recovery</CardTitle>
                    <CardDescription>Crypto Recovery details submited by customers</CardDescription>
                  </div>
                  {/* <Button onClick={() => setShowAddToken(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Token
                  </Button> */}
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Wallet Address</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {recoveryItems.length > 0 ? (
                  recoveryItems
                    .filter((item) => item.createdAt) // Avoid errors from missing timestamps
                    .sort((a, b) => {
                      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
                      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
                      return dateB.getTime() - dateA.getTime(); // Descending order
                    })
                    .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
  <AvatarImage
    src=  "/assets/placeholder.svg" // Use selfieUrl if available
    alt={`${item.name || "Unknown"}'s avatar`}
  />
  <AvatarFallback>
    {item.email?.[0]?.toUpperCase() || "?"} {/* Fallback: First letter or "?" */}
  </AvatarFallback>
</Avatar>

                  <div>
                    <div className="font-medium">
                      {item.name || "N/A"} 
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.email || "N/A"}
                    </div>
                  </div>
                </div>
              </TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.walletAddress}</TableCell>
                            <TableCell>{item.description}</TableCell>
                    
                            <TableCell>{item.amount}
                            </TableCell>
                            
                             <TableCell>

                                                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium transition-all duration-300
                                                        ${item.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                          item.status === 'Recovered' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                                          item.status === 'Canceled' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                                                          item.status === 'Live' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                                        'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'}`}>
                                                        {item.status}
                                                      </span>
                                                    </TableCell>
                                                    <TableCell>
                        {item.createdAt
                            ? format(
                                item.createdAt instanceof Timestamp
                                  ? item.createdAt.toDate() // Convert Firestore Timestamp to Date
                                  : item.createdAt, // Use Date directly
                                "MMMM dd, yyyy"
                              )
                            : "Invalid Date"}
                        </TableCell>
                        <TableCell>
                            {item.createdAt
                              ? format(
                                  item.createdAt instanceof Timestamp
                                    ? item.createdAt.toDate()
                                    : new Date(item.createdAt),
                                  // "HH:mm" // Correct format for time only
                                  "hh:mm a" // 12-hour format with AM/PM
                                )
                              : "Invalid Time"}
                          </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => {
                              // handleEditRecovery(item)
                              //  setShowPrereleasetokenDetails(true)
                            }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteRecovery(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                       ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No Recovery Request Requests Found.
                          </TableCell>
                        </TableRow>
                      )}
                      </TableBody>
                    </Table>
                  
                  </div>
                </CardContent>
              </Card>

              <Dialog open={showAddToken} onOpenChange={setShowAddToken}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Token</DialogTitle>
                    <DialogDescription>Add a new token to the upcoming launches list</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPrereleasetoken} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Token Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input id="symbol" name="symbol" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="initialPrice">Initial Price ($)</Label>
                        <Input id="initialPrice" name="initialPrice" type="number" step="0.000001" min="0" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalSupply">Total Supply</Label>
                        <Input id="totalSupply" name="totalSupply" type="number" min="0" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="launchDate">Launch Date</Label>
                      <Input id="launchDate" name="launchDate" type="date" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="change24h">24h Change (%)</Label>
                        <Input id="change24h" name="change24h" type="number" step="0.1" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue="upcoming">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                              <SelectItem value="Whitelist Open">Whitelist Open</SelectItem>
                              <SelectItem value="Live">Live</SelectItem>
                              <SelectItem value="Registration Open">Registration Open</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="potentialReturnsMin">Min Returns (x)</Label>
                        <Input id="potentialReturnsMin" name="potentialReturnsMin" type="number" min="0" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="potentialReturnsMax">Max Returns (x)</Label>
                        <Input id="potentialReturnsMax" name="potentialReturnsMax" type="number" min="0" required />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowAddToken(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Token</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={!!editingPrereleasetoken} onOpenChange={(open) => !open && setEditingPrereleasetoken(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Token</DialogTitle>
                    <DialogDescription>Modify the token details</DialogDescription>
                  </DialogHeader>
                  {editingPrereleasetoken && (
                    <form onSubmit={handleEditPrereleasetoken} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Token Name</Label>
                          <Input id="edit-name" name="name" defaultValue={editingPrereleasetoken.name} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-symbol">Symbol</Label>
                          <Input id="edit-symbol" name="symbol" defaultValue={editingPrereleasetoken.symbol} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-initialPrice">Initial Price ($)</Label>
                          <Input
                            id="edit-initialPrice"
                            name="initialPrice"
                            type="number"
                            step="0.000001"
                            min="0"
                            defaultValue={editingPrereleasetoken.price}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-totalSupply">Total Supply</Label>
                          <Input
                            id="edit-totalSupply"
                            name="totalSupply"
                            type="number"
                            min="0"
                            defaultValue={editingPrereleasetoken.supply}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-launchDate">Launch Date</Label>
                        <Input
                          id="edit-launchDate"
                          name="launchDate"
                          type="date"
                          defaultValue={
                            editingPrereleasetoken.date instanceof Timestamp
                              ? editingPrereleasetoken.date.toDate().toISOString().split("T")[0] // Convert to "YYYY-MM-DD"
                              : editingPrereleasetoken.date // If it's already a string
                          }
                          required
                        />

                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-change24h">24h Change (%)</Label>
                          <Input
                            id="edit-change24h"
                            name="change24h"
                            type="number"
                            step="0.1"
                            defaultValue={editingPrereleasetoken.profitLoss}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-status">Status</Label>
                          <Select name="status" defaultValue={editingPrereleasetoken.status}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Upcoming">Upcoming</SelectItem>
                              <SelectItem value="Whitelist Open">Whitelist Open</SelectItem>
                              <SelectItem value="Live">Live</SelectItem>
                              <SelectItem value="Registration Open">Registration Open</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-potentialReturnsMin">Min Returns (x)</Label>
                          <Input
                            id="edit-potentialReturnsMin"
                            name="potentialReturnsMin"
                            type="number"
                            min="0"
                            defaultValue={editingPrereleasetoken.potentialReturn}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-potentialReturnsMax">Max Returns (x)</Label>
                          <Input
                            id="edit-potentialReturnsMax"
                            name="potentialReturnsMax"
                            type="number"
                            min="0"
                            defaultValue={editingPrereleasetoken.potentialReturn}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditingPrereleasetoken(null)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}
          </main>
          </div>
       </div>
      
    
  )
}





export default AdminDashboard;




