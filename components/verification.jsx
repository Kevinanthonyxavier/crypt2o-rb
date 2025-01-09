'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Upload, AlertCircle } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

const steps = ['Personal Information', 'Address Details', 'Document Upload']

export function VerificationJsx() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    idExpiryDate: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    idFront: null,
    idBack: null,
    selfie: null,
  })
  const [errors, setErrors] = useState({})
  const { toast } = useToast()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData(prev => ({ ...prev, [name]: files[0] }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateStep = () => {
    const newErrors = {}
    if (currentStep === 0) {
      if (!formData.idType) newErrors.idType = 'ID Type is required'
      if (!formData.idNumber) newErrors.idNumber = 'ID Number is required'
      if (!formData.idExpiryDate) newErrors.idExpiryDate = 'Expiry Date is required'
    } else if (currentStep === 1) {
      if (!formData.addressLine1) newErrors.addressLine1 = 'Address Line 1 is required'
      if (!formData.city) newErrors.city = 'City is required'
      if (!formData.stateProvince) newErrors.stateProvince = 'State/Province is required'
      if (!formData.postalCode) newErrors.postalCode = 'Postal Code is required'
      if (!formData.country) newErrors.country = 'Country is required'
    } else if (currentStep === 2) {
      if (!formData.idFront) newErrors.idFront = 'ID Front is required'
      if (!formData.idBack) newErrors.idBack = 'ID Back is required'
      if (!formData.selfie) newErrors.selfie = 'Selfie is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateStep()) {
      // Here you would typically send the formData to your backend
      console.log('Form submitted:', formData)
      toast({
        title: "Verification Submitted",
        description: "Your verification documents have been submitted successfully. We'll review them and get back to you shortly.",
      })
      // Reset form or redirect user
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Account Verification</h2>
        <p className="text-gray-400">Complete your account verification</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Verification Process</CardTitle>
          <CardDescription>Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="idType" className="text-white">ID Type</Label>
                    <Select name="idType" value={formData.idType} onValueChange={(value) => handleInputChange({ target: { name: 'idType', value } })}>
                      <SelectTrigger id="idType" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driverLicense">Driver&apos;s License</SelectItem>
                        <SelectItem value="nationalId">National ID</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.idType && <p className="text-red-500 text-sm mt-1">{errors.idType}</p>}
                  </div>
                  <div>
                    <Label htmlFor="idNumber" className="text-white">ID Number</Label>
                    <Input
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white border-gray-600"
                      placeholder="Enter ID number"
                    />
                    {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="idExpiryDate" className="text-white">ID Expiry Date</Label>
                    <Input
                      id="idExpiryDate"
                      name="idExpiryDate"
                      type="date"
                      value={formData.idExpiryDate}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                    {errors.idExpiryDate && <p className="text-red-500 text-sm mt-1">{errors.idExpiryDate}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="addressLine1" className="text-white">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white border-gray-600"
                      placeholder="Enter address line 1"
                    />
                    {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                  </div>
                  <div>
                    <Label htmlFor="addressLine2" className="text-white">Address Line 2 (Optional)</Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white border-gray-600"
                      placeholder="Enter address line 2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-white">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white border-gray-600"
                      placeholder="Enter city"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="stateProvince" className="text-white">State/Province</Label>
                    <Input
                      id="stateProvince"
                      name="stateProvince"
                      value={formData.stateProvince}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white border-gray-600"
                      placeholder="Enter state or province"
                    />
                    {errors.stateProvince && <p className="text-red-500 text-sm mt-1">{errors.stateProvince}</p>}
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-white">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="bg-gray-700 text-white border-gray-600"
                      placeholder="Enter postal code"
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-white">Country</Label>
                    <Select name="country" value={formData.country} onValueChange={(value) => handleInputChange({ target: { name: 'country', value } })}>
                      <SelectTrigger id="country" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        {/* Add more countries as needed */}
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="idFront" className="text-white">Upload ID Front</Label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                          <label
                            htmlFor="idFront"
                            className="relative cursor-pointer rounded-md bg-gray-700 px-3 py-2 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                          >
                            <span>Upload a file</span>
                            <input id="idFront" name="idFront" type="file" className="sr-only" onChange={handleFileChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    {errors.idFront && <p className="text-red-500 text-sm mt-1">{errors.idFront}</p>}
                  </div>
                  <div>
                    <Label htmlFor="idBack" className="text-white">Upload ID Back</Label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                          <label
                            htmlFor="idBack"
                            className="relative cursor-pointer rounded-md bg-gray-700 px-3 py-2 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                          >
                            <span>Upload a file</span>
                            <input id="idBack" name="idBack" type="file" className="sr-only" onChange={handleFileChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    {errors.idBack && <p className="text-red-500 text-sm mt-1">{errors.idBack}</p>}
                  </div>
                  <div>
                    <Label htmlFor="selfie" className="text-white">Upload Selfie</Label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                          <label
                            htmlFor="selfie"
                            className="relative cursor-pointer rounded-md bg-gray-700 px-3 py-2 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                          >
                            <span>Upload a file</span>
                            <input id="selfie" name="selfie" type="file" className="sr-only" onChange={handleFileChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    {errors.selfie && <p className="text-red-500 text-sm mt-1">{errors.selfie}</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700 text-white">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
              Submit for Verification <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      <Alert variant="info" className="bg-blue-900 border-blue-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Verification Process</AlertTitle>
        <AlertDescription>
          Your information will be securely processed and verified. This process typically takes 1-3 business days.
        </AlertDescription>
      </Alert>
    </motion.div>
  )
}