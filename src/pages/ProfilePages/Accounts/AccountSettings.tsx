import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../ProfileNav';
import AccountDropdown from '../AccountDropdown';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

// Mock: get email from localStorage (replace with Redux or API as needed)
const getUserEmail = () => localStorage.getItem('user_email') || 'john_doe@gmail.com';

const AccountSettings: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Email state
  const [email, setEmail] = useState(getUserEmail());
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Handlers
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError('');
    setEmailSuccess('');
    // TODO: Replace with real API call
    setTimeout(() => {
      setEmail(newEmail);
      localStorage.setItem('user_email', newEmail);
      setEmailSuccess('Email updated successfully!');
      setEmailLoading(false);
      setShowEmailDialog(false);
    }, 1000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');
    // TODO: Replace with real API call
    setTimeout(() => {
      if (!currentPassword || !newPassword) {
        setPasswordError('Please fill in all fields.');
        setPasswordLoading(false);
        return;
      }
      setPasswordSuccess('Password changed successfully!');
      setPasswordLoading(false);
      setCurrentPassword('');
      setNewPassword('');
    }, 1000);
  };

  return (
    <div>
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-8">Account Settings</h1>

        {/* Email Section */}
        <div className="bg-white rounded-md shadow p-6 mb-8 border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg">Email address</h2>
            <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
              <DialogTrigger asChild>
                <button className="text-[#5A8DB8] hover:underline text-base font-medium" onClick={() => setShowEmailDialog(true)}>
                  change
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Email</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEmailChange} className="space-y-4">
                  <div>
                    <Label htmlFor="new-email">New Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      required
                    />
                  </div>
                  {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
                  {emailSuccess && <div className="text-green-600 text-sm">{emailSuccess}</div>}
                  <DialogFooter>
                    <Button type="submit" className='bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-6 py-2 rounded-md font-semibold text-sm sm:text-base' disabled={emailLoading}>
                      {emailLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div>Your email address is <span className="font-semibold">{email}</span></div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-md shadow p-6 border">
          <h2 className="font-semibold text-lg mb-4">Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowCurrentPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNewPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <a href="/forget-password" className="text-[#5A8DB8] hover:underline text-sm">Reset password</a>
              </div>
              <Button type="submit" className='bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-6 py-2 rounded-md font-semibold text-sm sm:text-base' disabled={passwordLoading}>
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
            {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-600 text-sm">{passwordSuccess}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
