'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from "framer-motion";
import HeaderMarketPrices from './HeaderMarketPrices';
import DashboardTabs from './DashboardTabs';
import { Badge } from '@/components/ui/badge';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

import { doc, getDoc } from 'firebase/firestore';




const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  //const [liveChatOpen, setLiveChatOpen] = useState(false); // State for managing the Dialog

  const [isVerified, setIsVerified] = useState(false);
  
  // const openChat = () => {
  //   if (typeof Tawk_API !== 'undefined') {
  //     Tawk_API.maximize(); // Use the Tawk API to maximize the chat
  //   }
  // };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
  
      const fetchUserData = async () => {
        try {
          if (currentUser) {
            // Fetch user data from Firestore
            const userRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userRef);
  
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setIsVerified(userData?.isVerified === true);
            } else {
              setIsVerified(false);
            }
          } else {
            setIsVerified(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsVerified(false);
        }
      };
  
      fetchUserData();
    });
  
    return () => unsubscribe();
  }, []);
  

  const headerAnimation = useAnimation();

  if (!user) return null;

  return (
    <div className="bg-gray-900 min-h-screen overflow-y-auto">
      <header className="flex justify-between items-center mb-2 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
  className="ml-4 font-bold pt-12 pl-4 sm:pt-0" // Add padding only on small screens
  style={{
    fontSize: "clamp(1.0rem, 5vw, 1.8rem)", // Min size, fluid size, max size
  }}
  onMouseEnter={() => headerAnimation.start({ scale: 1.08 })}
  onMouseLeave={() => headerAnimation.start({ scale: 1 })}
  animate={headerAnimation}
>
  Welcome Back, <div>{user.displayName || "User"}</div>
</motion.h2>
          {/* <p className="text-white text-opacity-80 ml-4">
            Here&apos;s what&apos;s happening with your Account
          </p> */}
        </motion.div>

        <div className="flex items-center space-x-4">
  {/* Motion wrapper for hover/tap animations */}
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
    {/* Badge to show verification status */}
    <Badge
      className={`rounded px-2 py-1 ${
        isVerified ? 'bg-green-500 text-white hover:bg-green-500' : 'bg-red-500 text-white hover:bg-red-500'
      }`}
    >
      {isVerified ? 'Verified' : 'Not Verified'}
    </Badge>
    
  </motion.div>
</div>

      </header>

      <div className="bg-black bg-opacity-20 rounded-lg p-2 mb-4">
        <HeaderMarketPrices />
      </div>

      

      <DashboardTabs />
          


      {/* Tawk Messenger */}
      {/* <TawkMessengerReact
        propertyId="64b66b5d94cf5d49dc644d65"
        widgetId="1h5k96q8t"

      /> */}
    </div>
    
  );
};

export default Header;
