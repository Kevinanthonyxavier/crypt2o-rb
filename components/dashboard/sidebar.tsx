import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {  DollarSign, User, HelpCircle, LogOut, Menu, X, HandCoins } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { RxDashboard } from "react-icons/rx";
import { IoTrendingUp } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";
import { BsBank2 } from "react-icons/bs";
import { MdVerifiedUser } from "react-icons/md";
import { CgCompressRight } from "react-icons/cg";



interface DashboardRoute {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Sidebar: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [hideVerification, setHideVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get('tab') : null;

  const [showSidebar, setShowSidebar] = useState(() => {
    // Check if the window width is greater than or equal to the desktop breakpoint (e.g., 768px)
    return typeof window !== "undefined" && window.innerWidth >= 768;
  });
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Update sidebar visibility on window resize
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true); // Always show sidebar for desktop
      } else {
        setShowSidebar(false); // Collapse sidebar for smaller screens
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  

  // Close sidebar after selecting a menu item
  const handleMenuItemClick = () => {
    if (window.innerWidth < 768) {
      setShowSidebar(false); // Close sidebar on mobile
    }
  };


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
  
        try {
          // Fetch user data from Firestore
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsVerified(userData?.isVerified === true);
            setHideVerification(userData?.hideVerification === true);
          }
  
          // Fetch selfie URL
          const verificationDocRef = doc(db, 'users', user.uid, );
          const verificationDoc = await getDoc(verificationDocRef);
          if (verificationDoc.exists()) {
            // Get selfieUrl from the document data
            const data = verificationDoc.data();
            setSelfieUrl(data.verificationData.selfieUrl || null);
          } else {
            console.log('No verification data found for user.');
          }
        } catch (error) {
          console.error('Error fetching user or verification data:', error);
        }
      } else {
        setCurrentUser(null);
        setIsVerified(false);
        setHideVerification(false);
        setSelfieUrl(null);
      }
    });
  
    return () => unsubscribeAuth();
  }, []);
  

  const dashboardRoutes: DashboardRoute[] = [
    { path: '/dashboard?tab=token-pre-release', label: 'Token Pre Release', icon: HandCoins  },
    { path: '/dashboard?tab=overview', label: 'Overview', icon: RxDashboard  },
    { path: '/dashboard?tab=trade', label: 'Trade', icon: IoTrendingUp },
    { path: '/dashboard?tab=transactions', label: 'Transactions', icon: FiActivity  },
    { path: '/dashboard?tab=crypto-recovery', label: 'Crypto Recovery', icon: CgCompressRight  },
    { path: '/dashboard?tab=withdraw', label: 'Withdraw', icon: BsBank2 },
    { path: '/dashboard?tab=deposit', label: 'Deposit', icon: DollarSign },
    { path: '/dashboard?tab=profile', label: 'Profile', icon: User },
    { path: '/dashboard?tab=verification', label: 'Verification', icon: MdVerifiedUser },
    { path: '/dashboard?tab=support', label: 'Support', icon: HelpCircle },
  ];

  const filteredRoutes = dashboardRoutes.filter(
    (route) => !(hideVerification && route.label === 'Verification')
  );

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    if (typeof window !== 'undefined') {
      console.log(window.location.href  = "/#"); // This will only execute in the browser
    }

  };

  return (
    <>

      {/* Hamburger Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-purple-600 text-white rounded focus:outline-none"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {showSidebar && window.innerWidth < 768 && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-30"
    onClick={() => setShowSidebar(false)}
  ></div>
)}


      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-black bg-opacity-30 backdrop-blur-lg p-6 z-40 transform ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0`}
        initial={{ x: '-100%' }}
        animate={{ x: showSidebar ? '0%' : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
      <div className="relative h-full overflow-auto">
        {/* Logo */}
        <motion.h1
          className="text-right pr-2 pl-2 text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-600"
          whileHover={{ scale: 1.05 }}
        >
          Crypt2o.com
        </motion.h1>

            {/* User Info */}
            <div className="mb-6 flex items-center space-x-3">
  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
    {selfieUrl ? (
      <Image
        src={selfieUrl} // This should be a publicly accessible URL
        alt="User selfie"
        className="w-full h-full object-cover rounded-full"
        width={120} // Match the size of the div
        height={120} // Match the size of the div
        onError={() => setSelfieUrl(null)} // Fallback to initials on error
      />
    ) : (
      <span className="text-lg font-semibold text-white">
        {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
      </span>
    )}
  </div>
  <div>
    <p className="text-sm font-semibold text-white">
      {currentUser?.displayName || 'User'}
    </p>
    <p className="text-xs text-white text-opacity-70">
      {currentUser?.email || 'Not signed in'}
    </p>
  </div>
</div>


        {/* Navigation */}
        <nav>
          <ul className="space-y-4">
            {filteredRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = currentTab === route.path.split('=')[1];

              return (
                <motion.li key={route.path} whileHover={{ scale: 1.05 }}
                onClick={handleMenuItemClick} // Close sidebar on click
                  >
                  <Button
                    asChild
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-400 text-white border-l-4 border-blue-500'
                        : 'text-white hover:bg-purple-300 border-blue-50 hover:border-l-4'
                    }`}
                  >
                    <Link href={route.path} className="flex items-center">
                      <Icon className="mr-2 h-4 w-4" />
                      {route.label}
                    </Link>
                  </Button>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <motion.div className="mt-6" whileHover={{ scale: 1.05 }}>
          {/* Divider Line */}
  <div className="border-t border-white border-opacity-30 mb-4"></div>

          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white hover:bg-purple-300"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </motion.div>

        {/* Account Verification */}
        <div className="mt-6 pb-16">
          <div style={{ borderRadius: '1rem' }} className="bg-white bg-opacity-10 p-3 rounded-lg">
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
      </div>
    
      </motion.aside>

       
      </>
    
  );
};

export default Sidebar;
