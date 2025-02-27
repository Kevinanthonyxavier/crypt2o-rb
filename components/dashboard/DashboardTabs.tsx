'use client';

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from 'next/navigation';
import { 
  
  DollarSign as DollarSignIcon, 
  User as UserIcon, 
  
  HelpCircle as HelpCircleIcon 
} from 'lucide-react';

import TradeTab from './tabs/TradeTab';
import TransactionsTab from './tabs/TransactionTab';
import CryptoRecoveryTab from './tabs/CryptoRecoveryTab';
import DepositTab from './tabs/DepositTab';
import ProfileTab from './tabs/ProfileTab';
import VerificationTab from './tabs/VerificationTab';
import SupportTab from './tabs/SupportTab';
import { onAuthStateChanged, User as FirebaseUser  } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import WithdrawTab from './tabs/WithdrawTab';
import OverviewTab from './tabs/OverviewTab';
import { RxDashboard } from "react-icons/rx";
import { IoTrendingUp } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";
import { BsBank2 } from "react-icons/bs";
import { MdVerifiedUser } from "react-icons/md";
import { CgCompressRight } from "react-icons/cg";

type IconMapping = {
  [key: string]: React.ComponentType<{ className?: string }>
}

type TabConfig = {
  value: string;
  name: string;
  icon: string;
  component: React.ComponentType;
}

const DashboardTabs: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const searchParams = useSearchParams();
  const [, setCurrentUser ] = useState<FirebaseUser  | null>(null);
  const [hideVerification, setHideVerification] = useState(false);
  const [, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser (user);
        setIsClient(true);

        // Fetch user data from Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsVerified(userData?.isVerified === true);
          setHideVerification(userData?.hideVerification === true);
        }
      } else {
        setCurrentUser (null);
        setIsVerified(false);
        setHideVerification(false);
      }
      setLoading(false); // Set loading to false after fetching
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const tabFromUrl = searchParams?.get('tab');
    setActiveTab(tabFromUrl || 'overview');
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    window.history.pushState({}, '', `/dashboard?tab=${newTab}`);
  };

  if (!isClient || loading) return <div>Loading...</div>; // Show loading state

  const iconMap: IconMapping = {
    RxDashboard: RxDashboard,
    IoTrendingUp: IoTrendingUp,
    FiActivity: FiActivity,
    CgCompressRight: CgCompressRight,
    BsBank2: BsBank2,
    DollarSign: DollarSignIcon,
    User: UserIcon,
    MdVerifiedUser: MdVerifiedUser,
    HelpCircle: HelpCircleIcon
  };

  const tabConfig: TabConfig[] = [
    { value: 'overview', name: 'Overview', icon: 'RxDashboard', component: OverviewTab },
    { value: 'trade', name: 'Trade', icon: 'IoTrendingUp', component: TradeTab },
    { value: 'transactions', name: 'Transactions', icon: 'FiActivity', component: TransactionsTab },
    { value: 'crypto-recovery', name: 'Crypto Recovery', icon: 'CgCompressRight', component: CryptoRecoveryTab },
    { value: 'withdraw', name: 'Withdraw', icon: 'BsBank2', component: WithdrawTab },
    { value: 'deposit', name: 'Deposit', icon: 'DollarSign', component: DepositTab },
    { value: 'profile', name: 'Profile', icon: 'User', component: ProfileTab },
    { value: 'verification', name: 'Verification', icon: 'MdVerifiedUser', component: VerificationTab },
    { value: 'support', name: 'Support', icon: 'HelpCircle', component: SupportTab }
  ];

  // Filter routes based on verification status
  const filteredRoutes = tabConfig.filter(route => {
    return !(hideVerification && route.value === 'verification');
  });

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="bg-black bg-opacity-30 backdrop-blur-lg flex flex-wrap justify-start overflow-x-auto">
          {filteredRoutes.map(tab => {
            const Icon = iconMap[tab.icon];
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-purple-400 data-[state=active]: text-white data-[state=active]:text-white"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {tab.name}
                </motion.div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Dynamic Tab Content Rendering */}
        {filteredRoutes.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>

      {/* Display the current URL and copyright notice at the bottom of the screen
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-10 p-4 flex flex-col items-center">
        <span className="text-white">
          Current URL: <code>{typeof window !== 'undefined' ? window.location.href : ''}</code>
        </span>
        <p className="text-white mt-2">
          Copyright © 2012 - 2024 CCrypt2o.com®. All rights reserved.
        </p>
      </div>*/}
    </div> 
  );
}

export default DashboardTabs;