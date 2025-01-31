'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HologramEffect } from "./hologram-effect";
import { Coins, TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface TokenData {
  balance: string;
  value: string;
  change: string;
  isPositive: boolean;
  symbol: string;
}

export function BalanceCard() {
  const [balanceData, setBalanceData] = useState<TokenData[]>([]); // Change to array
  const [loadingg, setLoadingg] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("User not logged in.");
        setLoadingg(false);
        return;
      }

      setUserEmail(user.email);
      setUserName(user.displayName);
      setLoadingg(true);

      try {
        const balancesRef = collection(db, "users", user.uid, "Prereleasetokenbalance");
        const querySnapshot = await getDocs(balancesRef);

        const tokenDataArray: TokenData[] = []; // Create an array to hold all token data
        querySnapshot.forEach((doc) => {
          tokenDataArray.push(doc.data() as TokenData); // Push each token data into the array
        });

        if (tokenDataArray.length > 0) {
          setBalanceData(tokenDataArray); // Set the state with the array of token data
        } else {
          console.error("No data found for the user's token balance.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching balances:", error);
          setError(error.message || "Error fetching balances.");
        } else {
          console.error("Unknown error fetching balances:", error);
          setError("An unknown error occurred while fetching balances.");
        }
      }finally {
        setLoadingg(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loadingg) {
    return (
      <Card className="bg-gray-800/50 border-purple-500/20">
        <CardContent>
          <div className="p-2 sm:p-4">
            <div className="justify-center items-center h-40">
              <Loader2 className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500 animate-spin" />
              <p className="text-white mt-2 text-sm sm:text-base">Loading your transactions...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || balanceData.length === 0) {
    return (
      <div className="text-center ">
        {error ? (
          <p className="text-red-500 text-sm sm:text-base">{error}</p>
        ) : (
          <p className="text-lg sm:text-xl text-white text-center">
            Hi {userName || "User"}, <br />
            No Balance found for {userEmail || "your account"}.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-6 gap-6 mt-12">
      {balanceData.map((token, index) => {
        const { balance, value, change, isPositive, symbol } = token; // Destructure each token data

        return (
          <Card key={index} className="bg-gray-800/50 border-purple-500/20 transition-all duration-500 group mb-4">
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
      })}
    </div>
  );
}
