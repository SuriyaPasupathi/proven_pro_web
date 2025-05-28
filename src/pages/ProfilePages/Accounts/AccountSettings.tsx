import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../ProfileNav';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { requestEmailChange, verifyEmailOTP, changePassword } from '@/store/Services/CreateProfileService';
import { RootState } from '@/store/store';

const AccountSettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profileData, emailChangeLoading, otpVerificationLoading, passwordChangeLoading, error } = useSelector(
    (state: RootState) => state.createProfile
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Email state
  const [email, setEmail] = useState(profileData?.profile_mail || '');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [newEmail, setNewEmail] = useState(email || '');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Handlers
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');
    
    try {
      await dispatch(requestEmailChange(newEmail)).unwrap();
      setEmailSuccess('Verification code sent to your new email address');
      setShowEmailDialog(false);
      setShowOtpDialog(true);
      setOtpSent(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification code';
      setEmailError(errorMessage);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    
    try {
      await dispatch(verifyEmailOTP(otp)).unwrap();
      setEmailSuccess('Email updated successfully!');
      setShowOtpDialog(false);
      setOtp('');
      setOtpSent(false);
      setEmail(newEmail);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid verification code';
      setOtpError(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    setOtpError('');
    try {
      await dispatch(requestEmailChange(newEmail)).unwrap();
      setOtpSent(true);
      setEmailSuccess('Verification code resent successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend verification code';
      setOtpError(errorMessage);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    try {
      await dispatch(changePassword({
        current_password: currentPassword,
        new_password: newPassword
      })).unwrap();
      
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setPasswordError(errorMessage);
    }
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
                    <Button type="submit" className='bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-6 py-2 rounded-md font-semibold text-sm sm:text-base' disabled={emailChangeLoading}>
                      {emailChangeLoading ? 'Sending OTP...' : 'Send OTP'}
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

        {/* OTP Verification Dialog */}
        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify OTP</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleOtpVerification} className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
                {otpSent && (
                  <div className="text-sm text-gray-500 mt-1">
                    OTP has been sent to {newEmail}
                  </div>
                )}
              </div>
              {otpError && <div className="text-red-500 text-sm">{otpError}</div>}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#5A8DB8] hover:underline text-sm"
                  disabled={otpVerificationLoading}
                >
                  Resend OTP
                </button>
                <div className="flex gap-2">
                  <Button type="submit" className='bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-6 py-2 rounded-md font-semibold text-sm sm:text-base' disabled={otpVerificationLoading}>
                    {otpVerificationLoading ? 'Verifying...' : 'Verify'}
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

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
              <Button type="submit" className='bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-6 py-2 rounded-md font-semibold text-sm sm:text-base' disabled={passwordChangeLoading}>
                {passwordChangeLoading ? 'Changing...' : 'Change Password'}
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
