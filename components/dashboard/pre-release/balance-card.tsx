'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HologramEffect } from "./hologram-effect";
import { Coins, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure Firebase is initialized properly
import { getAuth } from "firebase/auth";

interface TokenData {
  balance: string;
  value: string;
  change: string;
  isPositive: boolean;
  symbol: string; // Changed from boolean to string
}

export function BalanceCard() { // Fixed the function declaration
  const [balanceData, setBalanceData] = useState<TokenData | null>(null); // Set initial type

  useEffect(() => { // Added empty dependency array
    const fetchBalance = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          console.error("User not logged in.");
          return;
        }

        const balancesRef = collection(db, "users", user.uid, "Prereleasetokenbalance");
        const querySnapshot = await getDocs(balancesRef);

        // Look for the specific symbol document
        let tokenData: TokenData | null = null; // Explicitly declare as TokenData or null
        querySnapshot.forEach((doc) => {
          tokenData = doc.data() as TokenData; // Type assertion
        });

        if (tokenData) {
          setBalanceData(tokenData); // Directly set tokenData since it's already of type TokenData
        } else {
          console.error("No data found for the user's token balance.");
        }
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };

    fetchBalance();
  }, []); // Added empty dependency array

  if (!balanceData) {
    return (
      <Card className="bg-gray-800/50 border-purple-500/20">
        <CardContent>
          <div className="text-center text-gray-400">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  // Destructure the balanceData directly
  const { balance, value, change, isPositive, symbol } = balanceData;

  return (
    <Card className="bg-gray-800/50 border-purple-500/20 transition-all duration-500 group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              <Coins className="w-6 h-6 text-purple-400" />
            </div>
            <CardTitle className="text-lg text-gray-200">{symbol}</CardTitle>
          </div>
          <TrendingUp className="w-5 h-5 text-purple-400" />
        </div>
      </CardHeader>
      <CardContent>
        <HologramEffect>
          <div className="text-2xl font-bold text-white mb-1">{balance}</div>
        </HologramEffect>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">${value}</span>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
