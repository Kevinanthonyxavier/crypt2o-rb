'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import  Checkbox  from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface AffiliateRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AffiliateRegistration({ isOpen, onClose }: AffiliateRegistrationProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    website: '',
    socialMedia: '',
    marketingExperience: '',
    referralSource: '',
    trafficSource: '',
    agreeTerms: true,
  })

  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!showOtpInput) {
      console.log('Affiliate registration submitted:', formData)
      // Here you would typically send the data to your backend
      // and trigger the OTP email to be sent
      setShowOtpInput(true)
    } else {
      console.log('OTP submitted:', otp)
      // Simulating OTP verification success
      toast({
        title: "Thank You",
        description: "Your application is under review. We will notify you when your application is approved.",
        duration: 5000,
      })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {showOtpInput ? 'Verify Email' : 'Affiliate Registration'}
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          {!showOtpInput ? (
            <>
              <p className="text-gray-300 mb-6 text-center">
                Join the Crypto-Bank affiliate program and earn rewards for referring new customers.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="countryCode">Country Code</Label>
                    <Select onValueChange={handleSelectChange('countryCode')} required>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select code" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
                        <SelectItem value="+1">+1 (US/CA)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                        <SelectItem value="+61">+61 (AU)</SelectItem>
                        <SelectItem value="+91">+91 (IN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="socialMedia">Social Media Handles (optional)</Label>
                  <Input
                    id="socialMedia"
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., @username (Twitter), /username (Facebook)"
                  />
                </div>
                <div>
                  <Label htmlFor="marketingExperience">Marketing Experience</Label>
                  <Select onValueChange={handleSelectChange('marketingExperience')} required>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="referralSource">How did you hear about us?</Label>
                  <Select onValueChange={handleSelectChange('referralSource')} required>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select referral source" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="search">Search Engine</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="friend">Friend or Colleague</SelectItem>
                      <SelectItem value="advertisement">Advertisement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="trafficSource">Explain your source of traffic</Label>
                  <Textarea
                    id="trafficSource"
                    name="trafficSource"
                    value={formData.trafficSource}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white h-24"
                    placeholder="Describe how you plan to drive traffic to Crypto-Bank (e.g., blog, YouTube channel, email list)"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))}
                    
                  />
                  <Label htmlFor="agreeTerms" className="text-sm text-gray-300">
                    I agree to the <a href="#" className="text-purple-400 hover:underline">Terms and Conditions</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
                  </Label>
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Submit Application
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-gray-300 mb-6 text-center">
                We&apos;ve sent a one-time pin to your email. Please enter it below to verify your email address.
              </p>
              <div>
                <Label htmlFor="otp">One-Time Pin</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter the 6-digit OTP"
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Verify Email
              </Button>
            </form>
          )}
        </motion.div>
      </DialogContent>
      <Toaster />
    </Dialog>
  )
}

