'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CopyIcon, DollarSign, Users, LinkIcon } from 'lucide-react'

// Mock data for the chart
const performanceData = [
  { name: 'Jan', clicks: 400, signups: 240, revenue: 2400 },
  { name: 'Feb', clicks: 300, signups: 139, revenue: 1398 },
  { name: 'Mar', clicks: 200, signups: 980, revenue: 3800 },
  { name: 'Apr', clicks: 278, signups: 390, revenue: 3908 },
  { name: 'May', clicks: 189, signups: 480, revenue: 4800 },
  { name: 'Jun', clicks: 239, signups: 380, revenue: 3800 },
]

export default function AffiliateDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="links">Referral Links</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="materials">Promo Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,234.56</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">123</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.67%</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#8884d8" />
                  <Bar dataKey="signups" fill="#82ca9d" />
                  <Bar dataKey="revenue" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
              <CardDescription>View your performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add more detailed performance metrics here */}
              <p>Detailed performance metrics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Links</CardTitle>
              <CardDescription>Use these links to refer new users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value="https://crypt2o.com.com/?ref=your_unique_id" readOnly />
                <Button
                  onClick={() => copyToClipboard("https://crypt2o.com.com/?ref=your_unique_id")}
                  size="icon"
                >
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label htmlFor="custom-link">Custom Campaign Link</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input id="custom-link" placeholder="Enter campaign name" />
                  <Button>Generate</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Manage your payment details and view payment history</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add payment information and history here */}
              <p>Payment information and history coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotional Materials</CardTitle>
              <CardDescription>Access banners, text links, and other promotional content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Banner 300x250</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-700 h-[250px] w-[300px] flex items-center justify-center">
                      Banner Preview
                    </div>
                    <Button className="mt-2 w-full">Download</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Banner 728x90</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-700 h-[90px] w-full flex items-center justify-center">
                      Banner Preview
                    </div>
                    <Button className="mt-2 w-full">Download</Button>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Text Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Join Crypt2o.com today!</span>
                      <Button size="sm" onClick={() => copyToClipboard("Join Crypt2o.com today!")}>
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Earn interest on your crypto with Crypt2o.com</span>
                      <Button size="sm" onClick={() => copyToClipboard("Earn interest on your crypto with Crypt2o.com")}>
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

