import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Adjust the path as necessary
import { Button } from "@/components/ui/button"; // Adjust the path as necessary
//import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"; // Adjust import based on your chart library
import { TabsContent } from "@radix-ui/react-tabs";
import { db } from "@/lib/firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore functions

//const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6699']; // Add more colors as needed

type CryptoHolding = {
  name: string;
  symbol: string;
  holdings: number;
  value: number; // The total value of the holdings
};

interface User {
  uid: string;
  displayName?: string; // Optional property
  email?: string; // Optional property
  // Add other properties as needed
}


type PortfolioProps = {
  user: User; // User object containing uid
  setActiveTab: (tab: string) => void; // Function to set the active tab
};

const Portfolio: React.FC<PortfolioProps> = ({ user, setActiveTab }) => {
  const [portfolio, setPortfolio] = useState<CryptoHolding[]>([]); // State for portfolio data
  const [newHolding, setNewHolding] = useState<CryptoHolding>({ name: '', symbol: '', holdings: 0, value: 0 }); // State for new holding input

  // Fetch user portfolio data from Firestore
  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData?.portfolioData) {
            setPortfolio(userData.portfolioData.holdings || []); // Assuming portfolioData holds an array of holdings
          }
        }
      }
    };
    fetchPortfolioData();
  }, [user?.uid]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHolding(prev => ({
      ...prev,
      [name]: name === 'holdings' || name === 'value' ? parseFloat(value) : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.uid) {
      const userRef = doc(db, 'users', user.uid);
      const updatedPortfolio = [...portfolio, newHolding];

      // Update Firestore with new portfolio data
      await updateDoc(userRef, {
        portfolioData: {
          holdings: updatedPortfolio
        }
      });

      // Update local state
      setPortfolio(updatedPortfolio);
      // Reset the form
      setNewHolding({ name: '', symbol: '', holdings: 0, value: 0 });
    }
  };

  return (
    <TabsContent value="portfolio">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-black bg-opacity-30 backdrop-blur-lg border-white border-opacity-20">
          <CardHeader>
            <CardTitle>Your Portfolio</CardTitle>
            <CardDescription className="text-white text-opacity-80">
              An overview of your top 5 cryptocurrency holdings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Holdings</h3>
                <div className="space-y-2">
                  {portfolio.length > 0 ? (
                    portfolio.slice(0, 5).map((crypto) => (
                      <motion.div
                        key={crypto.symbol}
                        className="flex justify-between items-center"
                        whileHover={{ scale: 1.05, x: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span>{crypto.name}</span>
                        <span>{crypto.holdings.toFixed(4)} {crypto.symbol}</span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-white">No holdings available.</p>
                  )}
                </div>
              </div>
              {/* <div>
                <h3 className="text-lg font-semibold mb-2">Portfolio Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={portfolio.slice(0, 5)}
                      dataKey="value"
                      nameKey="symbol"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {portfolio.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#00000080', border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div> */}
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Add New Holding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Cryptocurrency Name"
                  value={newHolding.name}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="symbol"
                  placeholder="Symbol (e.g., BTC)"
                  value={newHolding.symbol}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="number"
                  name="holdings"
                  placeholder="Holdings"
                  value={newHolding.holdings}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="number"
                  name="value"
                  placeholder="Total Value"
                  value={newHolding.value}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mt-4 flex justify-center">
                <Button type="submit">Add Holding</Button>
              </div>
            </form>
            <div className="mt-4 flex justify-center space-x-4">
              <Button onClick={() => setActiveTab('deposit')}>Deposit</Button>
              <Button onClick={() => setActiveTab('withdraw')}>Withdraw</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TabsContent>
  );
};

export default Portfolio;