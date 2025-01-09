import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
//import { TabsContent } from '@/components/ui/tabs';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from 'lucide-react';

interface User {
  uid: string;
  displayName: string | null; // Adjusted to allow null
  email: string | null; // Adjust this if necessary
  phone?: string; // Optional
  currency?: string; // Optional
  country?: string; // Optional
  language?: string; // Optional
  notifications?: boolean; // Optional
  twostepauth?: boolean; // Optional
  loginalert?: boolean; // Optional
}


interface UserData {
  name: string;
  email: string;
  phone: string;
  currency: string;
  country: string;
  language: string;
  notifications: boolean;
  twostepauth: boolean;
  loginalert: boolean;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // This should now work without type errors
  
        const fetchUserData = async () => {
          const userDoc = doc(db, 'users', currentUser.uid);
          const userSnapshot = await getDoc(userDoc);
  
          if (userSnapshot.exists()) {
            const data = userSnapshot.data() as DocumentData;
  
            setUserData({
              name: data.name || currentUser.displayName || '',
              email: data.email || currentUser.email || '',
              phone: data.phone || '',
              currency: data.currency || '',
              country: data.country || '',
              language: data.language || '',
              notifications: data.notifications || false,
              twostepauth: data.twostepauth || false,
              loginalert: data.loginalert || false,
            });
          }
        };
  
        fetchUserData();
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null); // Reset any previous messages
  
    // Check if user is null
    if (!user) {
      setSuccessMessage("User is not logged in. Please log in to update your profile.");
      return;
    }
  
    try {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, userData, { merge: true }); // Update the user document
      console.log('Profile updated:', userData);
      
      // Set success message
      setSuccessMessage("Profile updated successfully!");
      
      // Set a timer to hide the message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null); // Clear the success message after 3 seconds
      }, 2000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSuccessMessage("An error occurred while updating your profile. Please try again.");
    }
  };
  

  // Update Two-Factor Authentication
  const updateTwoFactorAuth = async (enabled: boolean) => {
    if (!user || !user.uid) {
      console.error('No authenticated user found.');
      return;
    }

    try {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { twostepauth: enabled }, { merge: true });
      console.log('Two-Factor Authentication updated:', enabled);
      alert('Two-Factor Authentication updated successfully!');
      //setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating Two-Factor Authentication:', error);
      alert('Failed to update Two-Factor Authentication.');
    }
  };

  // Update Login Alerts
  const updateLoginAlerts = async (enabled: boolean) => {
    if (!user || !user.uid) {
      console.error('No authenticated user found.');
      return;
    }

    try {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { loginalert: enabled }, { merge: true });
      console.log('Login Alerts updated:', enabled);
      alert('Login Alerts updated successfully!');
    } catch (error) {
      console.error('Error updating Login Alerts:', error);
      alert('Failed to update Login Alerts.');
    }
  };

  // Update receive mails Alerts
  const receiveMailsAlerts = async (enabled: boolean) => {
    if (!user || !user.uid) {
      console.error('No authenticated user found.');
      return;
    }

    try {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { notifications: enabled }, { merge: true });
      console.log('Receive Email Notifications updated:', enabled);
      alert('Receive Email Notificationss updated successfully!');
    } catch (error) {
      console.error('Error updating Receive Email Notifications:', error);
      alert('Failed to update Receive Email Notifications.');
    }
  };

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-6"
  >
    <div className="space-y-6">
      <h2 className="pl-8 text-4xl  font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Profile</h2>
      <p className="pl-12 text-xl text-gray-400">Manage your account information</p>
    </div>
    <div className=" pb-36 "   >
    <div  style={{ borderRadius: '2rem' }} className=" py-4 mx-12 mb-12 flex items-center justify-center bg-gray-800 border border-gray-700"> {/* Full-height centering container with gray background */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card
          // Maintain margin and border-radius
          
          className="mx-8 w-auto sm:w-[500px] sm:w-py-8 md:w-[500px] lg:w-[600px]  h-auto  bg-gray-800 card-no-border" // Use the same gray color for the card
        >
          <div className="  items-center justify-center w-[800] py-8"> {/* Centering content */}
            <CardHeader className="w-full text-center">
            <CardTitle className=" text-3xl  text-white">Hi {User.name},</CardTitle>
            <p className="text-base text-white text-opacity-80 opacity-50">If your not able to make changes. Please contact Support!</p>
          </CardHeader>
          <CardContent >
          <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Side: Full Name, Email, Phone */}
            <div className="space-y-4">
            <div>
  <Label className="text-lg text-white" htmlFor="profile-name">
    Full Name
  </Label>
  <Input
    style={{ borderRadius: '0.5rem' }}
    id="profile-name"
    value={userData?.name || ''} // Use optional chaining and provide a default value
    onChange={(e) => userData && setUserData({ ...userData, name: e.target.value })} // Ensure userData is not null
    className="text-lg text-white bg-white bg-opacity-10 border-white border-opacity-20 placeholder:text-gray-400"
  />
</div>
              
              <div>
                <Label className="text-lg text-white" htmlFor="profile-email">Email</Label>
                <Input
                 style={{ borderRadius: '0.5rem' }}
                  id="profile-email"
                  type="email"
                  value={userData?.email || ''}
                  onChange={(e) => userData && setUserData({ ...userData, email: e.target.value })}
                  className="text-lg text-white bg-white bg-opacity-10 border-white border-opacity-20 placeholder:text-white"
                  disabled
                />
              </div>
              <div >
                <Label className="text-lg text-white" htmlFor="profile-phone">Phone</Label>
                <Input
                 style={{ borderRadius: '0.5rem' }}
                  id="profile-phone"
                  type="tel"
                  value={userData?.phone || ''}
                  onChange={(e) => userData && setUserData({ ...userData, phone: e.target.value })}
                  className="text-lg text-white bg-white bg-opacity-10 border-white border-opacity-20 placeholder:text-white"
                  disabled
                />
              </div>
              </div>
              {/* Right Side: Currency, Country, Preferred Currency */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg text-white" htmlFor="profile-currency">Currency</Label>
                <Select
                  value={userData?.currency || ''}
                  onValueChange={(value) => userData && setUserData({ ...userData, currency: value })}
                >
                  <SelectTrigger  style={{ borderRadius: '0.5rem' }} id="profile-country" className="text-lg text-white  bg-white bg-opacity-10 border-white border-opacity-20 placeholder:text-gray-400">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">  {/* Set dropdown background color */}
                  <SelectItem className="text-lg" value="aud">AUD</SelectItem>
                    <SelectItem className="text-lg" value="cad">CAD</SelectItem>
                    <SelectItem className="text-lg" value="eur">EUR</SelectItem>
                    <SelectItem className="text-lg" value="sgd">SGD</SelectItem>
                    <SelectItem className="text-lg" value="aed">AED</SelectItem>
                    <SelectItem className="text-lg" value="gbp">GBP</SelectItem>
                    <SelectItem className="text-lg" value="usd">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div >
                <Label className="text-lg text-white" htmlFor="profile-country">Country</Label>
                <Select
                  value={userData?.country  || ''}
                  onValueChange={(value) => userData && setUserData({ ...userData, country: value })}
                >
                  <SelectTrigger style={{ borderRadius: '0.5rem' }} id="profile-country" className="text-lg text-white  bg-white bg-opacity-10 border-white border-opacity-20 ">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent   className="bg-gray-800 text-white">  {/* Set dropdown background color */}
                  <SelectItem className="text-lg" value="au">Australia</SelectItem>
                    <SelectItem className="text-lg" value="ca">Canada</SelectItem>
                    <SelectItem className="text-lg" value="ir">Ireland</SelectItem>
                    <SelectItem className="text-lg" value="sg">Singapore</SelectItem>
                    <SelectItem className="text-lg" value="uae">United Arab Emirates</SelectItem>
                    <SelectItem className="text-lg" value="uk">United Kingdom</SelectItem>
                    <SelectItem className="text-lg" value="us">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-lg text-white" htmlFor="profile-language">Preferred Language</Label>
                <Select
                  value={userData?.language || ''}
                  onValueChange={(value) => userData && setUserData({ ...userData, language: value })}
                >
                  <SelectTrigger  style={{ borderRadius: '0.5rem' }} id="profile-language" className="text-lg text-white  bg-white bg-opacity-10 border-white border-opacity-20 placeholder:text-gray-400">
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">  {/* Set dropdown background color */}
                    <SelectItem className="text-lg" value="en">English</SelectItem>
                    <SelectItem className="text-lg" value="es">Spanish</SelectItem>
                    <SelectItem className="text-lg" value="fr">French</SelectItem>
                    <SelectItem className="text-lg" value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              
                </div>
                </div>
                </div>
              
                <CardTitle className="text-2xl text-white">Security Settings</CardTitle>

              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xl text-white text-opacity-70 font-semibold">Notifications</h4>
                  <p className="text-base text-white text-opacity-80 opacity-50">Receive email notifications</p>
                </div>
                <Switch
                      id="receive-mails-alerts"
                      checked={userData?.notifications}
                      onCheckedChange={(checked) => {
                        if (userData) {
                          setUserData({ ...userData, notifications: checked });
                          receiveMailsAlerts(checked);
                        }
                      }}
                    />

              </div>
            
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xl text-white text-opacity-70 font-semibold">Two-Factor Authentication</h4>
                  <p className="text-base text-white text-opacity-80 opacity-50">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="two-factor-auth"
                  checked={userData?.twostepauth}
                  onCheckedChange={(checked) => {
                    if (userData) { 
                      setUserData({ ...userData, twostepauth: checked });
                    updateTwoFactorAuth(checked);
                    }
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xl text-white text-opacity-70 font-semibold">Login Alerts</h4>
                  <p className="text-base text-white text-opacity-80 opacity-50">Receive alerts for unusual login activity</p>
                </div>
                <Switch
                  id="login-alerts"
                  checked={userData?.loginalert || false}
                  onCheckedChange={(checked) => {
                    if (userData) {
                       setUserData({ ...userData, loginalert: checked });
                    updateLoginAlerts(checked);
                    }
                  }}
                />
              </div>
              <div className="flex justify-end">
              <Button style={{ borderRadius: '0.5rem' }} type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white">Update Profile</Button>
              </div>
            </form>
            {successMessage && (
        <div className="mt-4 p-2 text-green-600 border border-green-500 rounded">
          {successMessage}
        </div>
        
      )}
          </CardContent>
          
          </div>
        </Card>
      </motion.div>
    </div>
    </div>
    {/* <motion.div className='px-12 flex items-center justify-center' whileHover={{ scale: 1.02 }} >
        <Card style={{ borderRadius: '2rem' }} className="w-full sm:w-[500px] md:w-[500px] lg:w-[800px] h-auto  bg-gray-100 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
              {/* Two-Factor Authentication */}
               {/*<div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Two-Factor Authentication</h4>
                  <p className="text-sm text-white text-opacity-80 opacity-50">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="two-factor-auth"
                  checked={userData.twostepauth}
                  onCheckedChange={(checked) => {
                    setUserData({ ...userData, twostepauth: checked });
                    updateTwoFactorAuth(checked);
                  }}
                />
              </div>

              {/* Login Alerts */}
              {/* <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Login Alerts</h4>
                  <p className="text-sm text-white text-opacity-80 opacity-50">Receive alerts for unusual login activity</p>
                </div>
                <Switch
                  id="login-alerts"
                  checked={userData.loginalert}
                  onCheckedChange={(checked) => {
                    setUserData({ ...userData, loginalert: checked });
                    updateLoginAlerts(checked);
                  }}
                />
              </div>
                    <Button variant="secondary" className="w-full">Change Password</Button>
                  </div>
          </CardContent>
        </Card>
      </motion.div> */}

  </motion.div>
  
  );
};

export default UserProfile;
