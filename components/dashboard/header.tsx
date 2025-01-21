'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import HeaderMarketPrices from './HeaderMarketPrices';
import DashboardTabs from './DashboardTabs';
import { MessageSquare } from "lucide-react";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '../ui/dialog';




const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [liveChatOpen, setLiveChatOpen] = useState(false); // State for managing the Dialog

  const openChat = () => {
    if (typeof Tawk_API !== 'undefined') {
      Tawk_API.maximize(); // Use the Tawk API to maximize the chat
    }
  };


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
            className="pt-4 font-bold ml-4"
            style={{
              fontSize: "clamp(1.0rem, 5vw, 1.8rem)", // Min size, fluid size, max size
            }}
            onMouseEnter={() => headerAnimation.start({ scale: 1.08 })}
            onMouseLeave={() => headerAnimation.start({ scale: 1 })}
            animate={headerAnimation}
          >
            Welcome back {user.displayName || "User"}
          </motion.h2>
          <p className="text-white text-opacity-80 ml-4">
            Here&apos;s what&apos;s happening with your Account
          </p>
        </motion.div>

        <div className="flex items-center space-x-4">
          {/* Button to Open Live Chat */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              className="bg-gradient-to-r from-[#6C4DF7] to-[#5B3DE8] hover:from-[#5B3DE8] hover:to-[#4A2CD7]"
              onClick={() => setLiveChatOpen(true)} // Opens the Dialog
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
          {/* Dialog for Live Chat */}
          <Dialog open={liveChatOpen} onOpenChange={setLiveChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Live Support Chat</DialogTitle>
            <DialogDescription>
              Connect with our support team in real-time.
            </DialogDescription>
          </DialogHeader>
          <Button className="mt-4" onClick={openChat}>
            Open Chat
          </Button>
        </DialogContent>
      </Dialog>


      {/* Tawk Messenger */}
      <TawkMessengerReact
        propertyId="64b66b5d94cf5d49dc644d65"
        widgetId="1h5k96q8t"

      />
    </div>
    
  );
};

export default Header;
