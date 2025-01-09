'use client'

import { useState, useEffect } from 'react'
import AffiliateDashboard from '@/components/AffiliateDashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AffiliateDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Check if the user is logged in (you would typically check a token in localStorage or a cookie)
    const loggedIn = localStorage.getItem('affiliateLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically validate the credentials with your backend
    // For this example, we'll just check if both fields are filled
    if (email && password) {
      localStorage.setItem('affiliateLoggedIn', 'true')
      setIsLoggedIn(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('affiliateLoggedIn')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Affiliate Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Affiliate Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <AffiliateDashboard />
      </div>
    </div>
  )
}

