'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CyberBorder } from "./cyber-border"
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

interface Transaction {
  id: string
  type: 'buy' | 'sell'
  token: string
  amount: string
  price: string
  total: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <CyberBorder>
      <Card className="w-full bg-gray-800/50 border-0">
        <CardHeader>
          <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-none border border-purple-500/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20 hover:bg-purple-500/5">
                  <TableHead className="text-purple-300">Type</TableHead>
                  <TableHead className="text-purple-300">Token</TableHead>
                  <TableHead className="text-purple-300">Amount</TableHead>
                  <TableHead className="text-purple-300">Price</TableHead>
                  <TableHead className="text-purple-300">Total</TableHead>
                  <TableHead className="text-purple-300">Date</TableHead>
                  <TableHead className="text-purple-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow 
                    key={tx.id}
                    className="border-purple-500/20 transition-all duration-300 hover:bg-purple-500/10"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.type === 'buy' ? (
                          <ArrowDownRight className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-400" />
                        )}
                        <span className={tx.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                          {tx.type.toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-white">{tx.token}</TableCell>
                    <TableCell className="text-gray-300">{tx.amount}</TableCell>
                    <TableCell className="text-gray-300">{tx.price}</TableCell>
                    <TableCell className="text-gray-300">{tx.total}</TableCell>
                    <TableCell className="text-gray-300">{tx.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full
                        ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
                          'bg-red-500/20 text-red-400'}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </CyberBorder>
  )
}

