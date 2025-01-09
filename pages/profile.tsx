// pages/profile.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    language: '',
    notifications: false,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, update the profile data on the backend
    console.log(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-black bg-opacity-30 backdrop-blur-lg border-white border-opacity-20">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription className="text-white text-opacity-80">Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="bg-white bg-opacity-10 border-white border-opacity-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="bg-white bg-opacity-10 border-white border-opacity-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone</Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  className="bg-white bg-opacity-10 border-white border-opacity-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-country">Country</Label>
                <Select
                  value={userData.country}
                  onValueChange={(value) => setUserData({ ...userData, country: value })}
                >
                  <SelectTrigger id="profile-country" className="bg-white bg-opacity-10 border-white border-opacity-20">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-language">Preferred Language</Label>
                <Select
                  value={userData.language}
                  onValueChange={(value) => setUserData({ ...userData, language: value })}
                >
                  <SelectTrigger id="profile-language" className="bg-white bg-opacity-10 border-white border-opacity-20">
                    <SelectValue placeholder="Select your language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="profile-notifications"
                  checked={userData.notifications}
                  onCheckedChange={() => setUserData({ ...userData, notifications: !userData.notifications })}
                />
                <Label htmlFor="profile-notifications">Receive email notifications</Label>
              </div>
              <Button type="submit" className="w-full">Update Profile</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-4 bg-black bg-opacity-30 backdrop-blur-lg border-white border-opacity-20">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Two-Factor Authentication</h4>
                  <p className="text-sm text-white text-opacity-80">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Login Alerts</h4>
                  <p className="text-sm text-white text-opacity-80">Receive alerts for unusual login activity</p>
                </div>
                <Switch />
              </div>
              <Button variant="outline" className="w-full">Change Password</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
