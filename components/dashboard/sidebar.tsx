import React, { useEffect, useState } from 'react';
import Link from 'next/link';
//import { usePathname, useSearchParams } from 'next/navigation';
import {  useSearchParams } from 'next/navigation';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  
  ArrowUp,
  DollarSign,
  ArrowDown,
  User,
  Shield,
  Lock,
  HelpCircle,
  LogOut,
 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DashboardRoute {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Sidebar: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [hideVerification, setHideVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  //const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') : null;

  useEffect(() => {
    // Listener for Firebase Authentication
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Fetch user data from Firestore
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsVerified(userData?.isVerified === true);
          setHideVerification(userData?.hideVerification === true); // Fetch hideVerification from Firestore
        }
      } else {
        setCurrentUser(null);
        setIsVerified(false);
        setHideVerification(false);
      }
    });

    // Cleanup Authentication listener
    return () => unsubscribeAuth();
  }, []);

  const dashboardRoutes: DashboardRoute[] = [
    { path: '/dashboard?tab=overview', label: 'Overview', icon: Home },
    { path: '/dashboard?tab=trade', label: 'Trade', icon: ArrowUp },
    { path: '/dashboard?tab=transactions', label: 'Transactions', icon: Lock },
    { path: '/dashboard?tab=crypto-recovery', label: 'Crypto Recovery', icon: Lock },
    { path: '/dashboard?tab=withdraw', label: 'Withdraw', icon: ArrowDown },
    { path: '/dashboard?tab=deposit', label: 'Deposit', icon: DollarSign },
    { path: '/dashboard?tab=profile', label: 'Profile', icon: User },
    { path: '/dashboard?tab=verification', label: 'Verification', icon: Shield },
    { path: '/dashboard?tab=support', label: 'Support', icon: HelpCircle },
  ];

  const filteredRoutes = dashboardRoutes.filter((route) => {
    return !(hideVerification && route.label === 'Verification');
  });

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-black bg-opacity-30 backdrop-blur-lg p-6 hidden md:block relative">
      {/* Logo */}
      <motion.h1
        className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-600"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        Crypto-Bank
      </motion.h1>

      {/* User Info */}
      <div className="mb-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          {currentUser?.displayName?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="text-sm font-semibold">{currentUser?.displayName || 'User'}</p>
          <p className="text-xs text-white text-opacity-70">{currentUser?.email || 'Not signed in'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-4">
          {filteredRoutes.map((route) => {
            const Icon = route.icon;
            const isActive = currentTab === route.path.split('=')[1];

            return (
              <motion.li key={route.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive
                      ? 'bg-white bg-opacity-20 text-white border-l-4 border-blue-500'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <Link href={route.path}>
                    <Icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                </Button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

{/* Account Verification */}
<div className="absolute bottom-20 left-4 right-4">
  <div  style={{ borderRadius: '1rem' }}  className="bg-white bg-opacity-10 p-3 rounded-lg">
    <div className="flex justify-between items-center">
      <span className="text-sm">Account Level</span>
      <Badge
        className={`rounded px-2 py-1 ${
          isVerified ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}
      >
        {isVerified ? 'Verified' : 'Not Verified'}
      </Badge>
    </div>
    <div className="relative mt-2 h-2 w-full bg-gray-300 rounded">
      <div
        className={`absolute h-full rounded ${
          isVerified ? 'bg-green-500' : 'bg-orange-500'
        }`}
        style={{
          width: `${isVerified ? 100 : 50}%`,
          transition: 'width 0.5s ease-in-out',
        }}
      ></div>
    </div>
    <p className="text-xs text-white text-opacity-70 mt-1">
      {isVerified
        ? 'Your account is verified!'
        : 'Complete verification to unlock full features.'}
    </p>
  </div>
</div>



      {/* Settings & Logout */}
      {/* <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button asChild variant="ghost" className="w-full justify-start text-white hover:bg-white hover:bg-opacity-20">
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </motion.li> */}
      <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:bg-opacity-20" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </motion.li>
    </aside>
  );
};

export default Sidebar;
