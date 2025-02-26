import React, { useState, useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import Link from 'next/link';
import Image from "next/image";


interface UserData {
  uid: string;
  idNumber: string;
}

interface VerificationTabProps {
  userData?: UserData;
}

type FormData = {
  idName: string;
  idType: string;
  idNumber: string;
  idExpiry: string;
  userDob: string;
  addressLine1: string;
  addressLine2: string;
  vfcity: string;
  state: string;
  postalCode: string;
  vfcountry: string;
  idFront: File | null;
  idBack: File | null;
  selfie: File | null;
  popupVerification: string;
};

type Errors = {
  [key in keyof FormData]?: string;
};

const VerificationTab: React.FC<VerificationTabProps> = ({  }) => {
  const { user } = useFirebase();
  const { toast } = useToast();
  const [popupVerification, setPopupVerification] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    idType: '',
    idName: '',
    idNumber: '',
    idExpiry: '',
    userDob: '',
    addressLine1: '',
    addressLine2: '',
    vfcity: '',
    state: '',
    postalCode: '',
    vfcountry: '',
    idFront: null,
    idBack: null,
    selfie: null,
    popupVerification: '',
  });

  const [previewUrls, setPreviewUrls] = useState({
    idFront: '',
    idBack: '',
    selfie: '',
  });

  

  const [, setSubmissionStatus] = useState<string | null>(null);
  const [, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSubmissionPopup, setshowSubmissionPopup] = useState<boolean>(false);

  const steps = ['Personal Information', 'Address Verification', 'Identity Verification', 'Document Verification', 'Selfie Verification'];

  // Fetch user verification data from Firestore
  useEffect(() => {
    if (user?.uid) {
      const fetchVerificationData = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPopupVerification(userData?.popupVerification === true); // Fetch hideVerification from Firestore

          if (userData?.verificationData) {
            setFormData((prev) => ({
              ...prev,
              ...userData.verificationData,
            }));
            
          }
        }
      };
      fetchVerificationData();
    } else {
      setPopupVerification(false);
    }
  }, [user?.uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create a URL for the preview
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({
        ...prev,
        [name]: url,
      }));
    }
  };

 

  const validateStep = (): boolean => {
    const newErrors: Errors = {};
    if (currentStep === 0) {
      if (!formData.idName) newErrors.idName = 'Full Name is required';
      if (!formData.userDob) newErrors.userDob = 'Date of Birth is required';
    } else if (currentStep === 1) {
      if (!formData.addressLine1) newErrors.addressLine1 = 'Address Line 1 is required';
      if (!formData.vfcity) newErrors.vfcity = 'City is required';
      if (!formData.state) newErrors.state = 'State/Province is required';
      if (!formData.postalCode) newErrors.postalCode = 'Postal Code is required';
      if (!formData.vfcountry) newErrors.vfcountry = 'Country is required';
     } else if (currentStep === 2) {
        if (!formData.idType) newErrors.idType = 'ID Type is required';
        if (!formData.idName) newErrors.idNumber = 'ID Number is required';
        if (!formData.idExpiry) newErrors.idExpiry = 'Expiry Date is required';
    } else if (currentStep === 3) {
      if (!formData.idFront) newErrors.idFront = 'ID Front is required';
      if (!formData.idBack) newErrors.idBack = 'ID Back is required';
    }else if (currentStep === 4) {
            if (!formData.selfie) newErrors.selfie = 'Selfie is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleButtonClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setMessage(null);
  
    if (loading) return; // Prevent multiple submissions
  
    setLoading(true);
    try {
      await handleVerificationSubmit(); // Pass the correctly typed event
    } catch {
      setMessage('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerificationSubmit = async () => {
    //event.preventDefault();
    setSubmissionStatus(null);
    setIsLoading(true);
  
    if (!user?.uid) {
      setSubmissionStatus("User ID is missing. Please try again.");
      setIsLoading(false);
      return;
    }
  
    if (!validateStep()) {
      setIsLoading(false);
      return;
    }
  
    try {
      const userRef = doc(db, 'users', user.uid);
      const idFrontUrl = await uploadFile(formData.idFront);
      const idBackUrl = await uploadFile(formData.idBack);
      const selfieUrl = await uploadFile(formData.selfie);
  
      await updateDoc(userRef, {
        popupVerification: true,
        vfdate: serverTimestamp(),
        verificationData: {
          idName: formData.idName,
          idType: formData.idType,
          idNumber: formData.idNumber,
          idExpiry: formData.idExpiry,
          userDob: formData.userDob,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          vfcity: formData.vfcity,
          state: formData.state,
          postalCode: formData.postalCode,
          vfcountry: formData.vfcountry,
          idFrontUrl,
          idBackUrl,
          selfieUrl,
        },
        selfieUrl,
        
      });
  
      setshowSubmissionPopup(true);
      toast({
        title: 'Verification Submitted',
        description:
          "Your verification documents have been submitted successfully. We'll review them and get back to you shortly.",
      });
  
      setFormData({
        idName: '',
        idType: '',
        idNumber: '',
        idExpiry: '',
        userDob: '',
        addressLine1: '',
        addressLine2: '',
        vfcity: '',
        state: '',
        postalCode: '',
        vfcountry: '',
        idFront: null,
        idBack: null,
        selfie: null,
        popupVerification: "true",
        
      });
    } catch (error) {
      console.error("Error submitting verification:", error);
      setSubmissionStatus(
        "An error occurred while submitting your verification. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  

  const uploadFile = async (file: File | null) => {
    if (!file) return '';
    const storage = getStorage();
    const fileRef = ref(storage, `verification/${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };


  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  if (!user?.uid) {
    return <p>Please log in to submit your verification.</p>;
  }

  

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-6">
        <h2 className="pl-8 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Account Verification</h2>
        <p className="pl-12 text-xl text-gray-400">Complete your account verification</p>
      </div>
      <div className="flex items-center justify-center ">
        <Card style={{ borderRadius: '1rem' }} className="w-full sm:w-[500px] md:w-[500px] lg:w-[600px]  bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Verification Process</CardTitle>
            <CardDescription className="text-base text-white" >Step {currentStep + 1} of {steps.length}: {steps[currentStep]}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
            {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                  
                    <div>
                      <Label htmlFor="idName" className="text-lg text-white">Name</Label>
                      <Input
                        id="idName"
                        name="idName"
                        value={formData.idName}
                        onChange={handleChange}
                        className="text-lg bg-gray-700 text-white border-gray-600"
                        placeholder="Enter Full Name"
                      />
                      {errors.idName && <p className="text-red-500 text-sm mt-1">{errors.idName}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="userDob" className="text-lg text-white">Date of Birth</Label>
                      <Input
                        id="userDob"
                        name="userDob"
                        type="date"
                        value={formData.userDob}
                        onChange={handleChange}
                        className="text-lg bg-gray-700 text-white border-gray-600"
                      />
                      {errors.userDob && <p className="text-red-500 text-sm mt-1">{errors.userDob}</p>}
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
                      <Label htmlFor="addressLine1" className="text-lg text-white">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        className="text-lg bg-gray-700 text-white border-gray-600"
                        placeholder="Enter address line 1"
                      />
                      {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                    </div>
                    <div>
                      <Label htmlFor="addressLine2" className="text-lg text-white">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        className="text-lg bg-gray-700 text-white border-gray-600"
                        placeholder="Enter address line 2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vfcity" className="text-lg text-white">City</Label>
                      <Input
                        id="vfcity"
                        name="vfcity"
                        value={formData.vfcity}
                        onChange={handleChange}
                        className="text-lg bg-gray-700 text-white border-gray-600"
                        placeholder="Enter city"
                      />
                      {errors.vfcity && <p className="text-red-500 text-sm mt-1">{errors.vfcity}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-lg text-white">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="text-lg bg-gray-700 text-white border-gray-600"
                        placeholder="Enter state or province"
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-lg text-white">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="text-lg bg-gray-700 text-white border-gray-600"
                        placeholder="Enter postal code"
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>
                    <div>
                      <Label htmlFor="vfcountry" className="text-lg text-white">Country</Label>
                      <Select name="vfcountry" value={formData.vfcountry} onValueChange={(value) => handleSelectChange('vfcountry', value)}>
                        <SelectTrigger id="vfcountry" className="text-lg bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-gray-700">
                          <SelectItem className="text-lg" value="United States">United States</SelectItem>
                          <SelectItem className="text-lg" value="Canada">Canada</SelectItem>
                          <SelectItem className="text-lg" value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem className="text-lg" value="Australia">Australia</SelectItem>
                          {/* Add more countries as needed */}
                        </SelectContent>
                      </Select>
                      {errors.vfcountry && <p className="text-red-500 text-sm mt-1">{errors.vfcountry}</p>}
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
                      <Label htmlFor="idType" className="text-lg text-white">ID Type</Label>
                      <Select name="idType" value={formData.idType} onValueChange={(value) => handleSelectChange('idType', value)}>
                        <SelectTrigger id="idType" className="text-lg bg-gray-700 text-white border-gray-600">
                          <SelectValue className="text-lg" placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent className="text-lg bg-gray-800 text-white border-gray-700">
                          <SelectItem className="text-lg" value="Passport">Passport</SelectItem>
                          <SelectItem className="text-lg" value="Drivers License">Driver&apos;s License</SelectItem>
                          <SelectItem className="text-lg" value="National ID">National ID</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.idType && <p className="text-red-500 text-sm mt-1">{errors.idType}</p>}
                    </div>

                    <div>
                      <Label htmlFor="idNumber" className="text-lg text-white">ID Number</Label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        className="text-lg bg-gray-700 text-white border-gray-600"
                        placeholder="Enter ID number"
                      />
                      {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                    </div>
                    <div>
                      <Label htmlFor="idExpiry" className="text-lg text-white">ID Expiry Date</Label>
                      <Input
                        id="idExpiry"
                        name="idExpiry"
                        type="date"
                        value={formData.idExpiry}
                        onChange={handleChange}
                        className="text-lg bg-gray-700 text-white border-gray-600"
                      />
                      {errors.idExpiry && <p className="text-red-500 text-sm mt-1">{errors.idExpiry}</p>}
                    </div>

                    
                  </div>
                  
                  
                </motion.div>
              )}

{currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            {/* Upload ID Front */}
            <div>
              <Label htmlFor="idFront" className="text-lg text-white">Upload ID Front</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10 relative">
               {/* Image Preview Positioned Behind */}
    {previewUrls.idFront && (
      <Image 
        src={previewUrls.idFront} 
        alt="Front ID  Preview" 
        className="absolute inset-0 h-full w-full object-cover rounded-lg opacity-40 z-0" // Centered image with transparency
        width={500}
        height={300}
        />
    )}
              
              
              
              <div className="text-center z-10">
                  <Upload className="mx-auto h-12 w-12 text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500" />
                  <div className="pt-4 text-sm leading-6 text-gray-400">
                    <label
                      htmlFor="idFront"
                      className="relative cursor-pointer rounded-md bg-gray-700 px-3 py-2 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                    >
                      <span>Upload a file</span>
                      <input id="idFront" name="idFront" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    </div>
                  <div className="pt-4">
                      <p className=" rounded-md bg-gray-600 px-3 py-2 text-base leading-5 text-white">or drag and drop <br /> PNG, JPG, GIF up to 10MB</p>
                      
                    </div>
                </div>
              </div>
             
              {errors.idFront && <p className="text-red-500 text-sm mt-1">{errors.idFront}</p>}
            </div>

            {/* Upload ID Back */}
            <div>
              <Label htmlFor="idBack" className="text-lg text-white">Upload ID Back</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10 relative">
              {/* Image Preview Positioned Behind */}
                {previewUrls.idBack && (
                  <Image 
                    src={previewUrls.idBack} 
                    alt="Back ID  Preview" 
                    className="absolute inset-0 h-full w-full object-cover rounded-lg opacity-40 z-0" // Centered image with transparency
                    width={500}
                    height={300}
                  
                  />
                )}  
                            
                
                
                
                
                
              <div className="text-center z-10"> {/* Ensure content is above the image */}
                  <Upload className="mx-auto h-12 w-12 text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"/>
                  <div className="pt-4 text-sm leading-6 text-gray-400">
                    <label
                      htmlFor="idBack"
                      className="text-center cursor-pointer rounded-md bg-gray-700 px-3 py-2 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
                    >
                      <span>Upload a file</span>
                      <input id="idBack" name="idBack" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                    
                  </div>
                  <div className="pt-4">
                      <p className=" rounded-md bg-gray-600 px-3 py-2 text-base leading-5 text-white">or drag and drop <br /> PNG, JPG, GIF up to 10MB</p>
                      
                    </div>
                </div>
              </div>
              {errors.idBack && <p className="text-red-500 text-sm mt-1">{errors.idBack}</p>}
            </div>

           

          </div>
        </motion.div>
)}
{currentStep === 4  && (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="space-y-4">
      
        

      {/* Upload Selfie */}
      <div className="relative">
<Label htmlFor="selfie" className="text-lg text-white">Upload Selfie</Label>
<div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10 relative">
{/* Image Preview Positioned Behind */}
{previewUrls.selfie && (
<Image 
  src={previewUrls.selfie} 
  alt="Selfie Preview" 
  className="absolute inset-0 h-full w-full object-cover rounded-lg opacity-40 z-0" // Centered image with transparency
  width={500}
  height={300}
/>
)}
<div className="text-center z-10"> {/* Ensure content is above the image */}
<Upload className="mx-auto h-12 w-12 text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500" />
<div className="pt-2 text-sm leading-6 text-gray-400">
  <label
    htmlFor="selfie"
    className="text-center cursor-pointer rounded-md bg-gray-700 px-3 py-2 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500"
  >
    <span>Upload a file</span>
    <input id="selfie" name="selfie" type="file" className="sr-only" onChange={handleFileChange} />
  </label>
  
</div >
<div className="pt-4">
<p className=" rounded-md bg-gray-600 px-3 py-2 text-base leading-5 text-white">or drag and drop <br /> PNG, JPG, GIF up to 10MB</p>

</div>
</div>
</div>
{errors.selfie && <p className="text-red-500 text-sm mt-1">{errors.selfie}</p>}
</div>

    </div>
  </motion.div>
)}
              {message && (
                <div className="mt-4 text-center">
                  <p>{message}</p>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-lg w-[25%] bg-purple-500 hover:bg-purple-600 text-white  "
              style={{ borderRadius: '1rem' }}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button style={{ borderRadius: '1rem' }} onClick={handleNext} className="text-lg w-[25%] bg-purple-500 hover:bg-purple-600 text-white">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleButtonClick}
                className="text-lg bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    
                    Submitting...
                  </>
                ) : (
                  <>Submit for Verification <Check className="ml-2 h-4 w-4" /></>
                ) }
              </Button>
            )}
          </CardFooter>
        </Card>
        </div>
        <Dialog open={showSubmissionPopup} onOpenChange={setshowSubmissionPopup}>
          <DialogContent style={{ borderRadius: '1rem' }} className="bg-gray-800 text-white">
            <DialogHeader>
              <AlertTitle>Verification Process</AlertTitle> </DialogHeader>
            <div className="py-4">
              <p className=" font-mono mt-2 break-all"></p>
              <p className="text-xl mt-4">
                Your information will be securely processed and verified. This process typically takes 1-3 business days.
              </p>
              <p className="mt-2">
                Contact Support if you have any issues.
              </p>
            </div>
            <DialogFooter>
            <Button 
  style={{ borderRadius: '0.5rem' }} 
  className="w-[25%] bg-purple-500 hover:bg-purple-600 text-white text-base" 
  onClick={() => {
    setshowSubmissionPopup(false); // Close the popup
    window.location.reload(); // Refresh the page
  }}
>
  Close
</Button>

              
<Link  href="/dashboard?tab=overview">
<button
      style={{ borderRadius: '0.5rem' }}
      className="w-[115%] bg-purple-500 hover:bg-purple-600 text-white text-base py-2"
    >
      Go to Overview
    </button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog 
          open={popupVerification} 
          onOpenChange={(open) => {
            if (open) {
              setPopupVerification(true);
            }
          }}
        >
           <DialogContent 
    style={{ borderRadius: '1rem' }} // Reduce border radius for mobile
    className="bg-gray-800 text-white p-4 sm:p-6 md:p-8" // Responsive padding
  >
    <DialogHeader>
      <AlertTitle className="text-lg sm:text-xl">Your Verification Is Under Process</AlertTitle>
    </DialogHeader>
    <div className="py-2 sm:py-4">
      <p className="text-base sm:text-lg font-mono mt-2 break-all"></p>
      <p className="text-base sm:text-lg mt-4">
        Your information will be securely processed and verified. This process typically takes 1-3 business days.
      </p>
      <p className="mt-2 text-base sm:text-lg">
        Contact Support if you have any issues.
      </p>
    </div>
    <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <Link href="/dashboard?tab=support">
        <button className="bg-purple-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full sm:w-auto">
          Go to Support
        </button>
      </Link>
      <Link href="/dashboard?tab=overview">
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded w-full sm:w-auto">
          Go to Overview
        </button>
      </Link>
    </DialogFooter>
  </DialogContent>
</Dialog>
<div className='pb-36'>
        <Alert variant="destructive" className=" bg-blue-900 border-blue-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Process</AlertTitle>
          <AlertDescription>
            Your information will be securely processed and verified. This process typically takes 1-3 business days.
          </AlertDescription>
        </Alert>
        </div>
      </motion.div>
    );
};

export default VerificationTab;