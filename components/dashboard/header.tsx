'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import HeaderMarketPrices from './HeaderMarketPrices';
import DashboardTabs from './DashboardTabs';
import { Search, Bell, MessageSquare } from "lucide-react";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Use User type

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const headerAnimation = useAnimation();

  if (!user) return null;

  return (
    <div className="bg-gray-900 min-h-screen overflow-auto">
      <header className="flex justify-between items-center mb-2 p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
        >
          <motion.h2 
            className="pt-4  font-bold ml-4"
            style={{
              fontSize: "clamp(1.0rem, 5vw, 1.8rem)", // Min size, fluid size, max size
            }}
            onMouseEnter={() => headerAnimation.start({ scale: 1.08 })}
            onMouseLeave={() => headerAnimation.start({ scale: 1 })}
            animate={headerAnimation} 
          >
            Welcome back {user.displayName || "User "}
          </motion.h2>
          <p className="text-white text-opacity-80 ml-4">
            Here&apos;s what&apos;s happening with your Account
          </p>
        </motion.div>

        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="outline" 
              size="icon" 
              className="text-white hover:text-white hover:bg-white hover:bg-opacity-20 bg-white bg-opacity-10"
            >
              <Search className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="outline" 
              size="icon" 
              className="text-white hover:text-white hover:bg-white hover:bg-opacity-20 bg-white bg-opacity-10"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              className="bg-gradient-to-r from-[#6C4DF7] to-[#5B3DE8] hover:from-[#5B3DE8] hover:to-[#4A2CD7]"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Live Chat
            </Button>
          </motion.div>
        </div>
      </header>

      <div className="bg-black bg-opacity-20 rounded-lg p-2 mb-4">
        <HeaderMarketPrices />
      </div>

      <DashboardTabs />
    </div>
  );
}

export default Header;
