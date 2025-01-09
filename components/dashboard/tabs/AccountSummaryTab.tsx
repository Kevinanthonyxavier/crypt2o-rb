import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Wallet, Star } from 'lucide-react';

interface PortfolioItem {
  name: string;
  amount: number;
  value: number;
}

interface AccountSummaryProps {
  userData: {
    accountNumber: string;
    isVerified: boolean;
    name: string;
  };
  totalBalance: number;
  totalBalanceBTC: number;
  portfolio: Array<PortfolioItem>;
  setActiveTab: (tab: string) => void;
}

// Helper function to determine account level
const getAccountLevel = (totalBalance: number): string => {
  if (totalBalance < 10000) return 'Basic';
  if (totalBalance < 50000) return 'Silver';
  if (totalBalance < 100000) return 'Gold';
  return 'Platinum';
};

// Helper function to determine next account level
const getNextAccountLevel = (currentLevel: string): string => {
  const levels = ['Basic', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const currentIndex = levels.indexOf(currentLevel);
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : 'Max Level';
};

const AccountSummary: React.FC<AccountSummaryProps> = ({
  userData,
  totalBalance,
  totalBalanceBTC,
  portfolio,
  setActiveTab
}) => {
  const dailyChange = 2.5; // Mock data, replace with actual calculation
  const dailyChangeAmount = (totalBalance * (dailyChange / 100)).toFixed(2);
  const accountLevel = getAccountLevel(totalBalance);

  return (
    <Card className="bg-black bg-opacity-30 backdrop-blur-lg border-white border-opacity-20 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Account Summary</span>
          {!userData.isVerified ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button 
                size="sm" 
                onClick={() => setActiveTab('verification')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center"
              >
                <Shield className="mr-2 h-4 w-4" />
                Verify Account
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center space-x-2 bg-green-500 px-2 py-1 rounded-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Shield className="h-4 w-4 text-white" />
              <span className="text-sm text-white">Verified</span>
            </motion.div>
          )}
        </CardTitle>
        <CardDescription className="text-white text-opacity-80">
          Account Number: {userData.accountNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Balance */}
          <motion.div 
            className="bg-white bg-opacity-10 p-4 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white text-opacity-70">Total Balance</h3>
              <Wallet className="h-4 w-4 text-white text-opacity-50" />
            </div>
            <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
            <p className="text-xs text-white text-opacity-50">
              {totalBalanceBTC.toFixed(8)} BTC
            </p>
          </motion.div>

          {/* 24h Change */}
          <motion.div 
            className="bg-white bg-opacity-10 p-4 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white text-opacity-70">24h Change</h3>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className={`text-2xl font-bold ${dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {dailyChange >= 0 ? '+' : ''}{dailyChange}%
            </p>
            <p className="text-xs text-white text-opacity-50">
              +${dailyChangeAmount}
            </p>
          </motion.div>

          {/* Active Positions */}
          <motion.div 
            className="bg-white bg-opacity-10 p-4 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white text-opacity-70">Active Positions</h3>
              <Star className="h-4 w-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold">{portfolio.length}</p>
            <p className="text-xs text-white text-opacity-50">
              Across {portfolio.length} cryptocurrencies
            </p>
          </motion.div>

          {/* Account Level */}
          <motion.div 
            className="bg-white bg-opacity-10 p-4 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white text-opacity-70">Account Level</h3>
              <Star className="h-4 w-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold">{accountLevel}</p>
            <p className="text-xs text-white text-opacity-50">
              Next level: {getNextAccountLevel(accountLevel)}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSummary;
