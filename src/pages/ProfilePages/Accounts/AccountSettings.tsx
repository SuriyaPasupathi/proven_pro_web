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
  const { profileData, emailChangeLoading, otpVerificationLoading, passwordChangeLoading } = useSelector(
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
    <div className="min-h-screen bg-gradient-to-b from-[#5A8DB8]/10 to-white">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent font-bold mb-2 sm:mb-3 md:mb-4">Account Settings</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2 sm:px-4 md:px-6 font-semibold">Manage your account preferences and security settings</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Email Section */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 md:p-8 border border-[#5A8DB8]/10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="font-semibold text-base sm:text-lg md:text-xl text-[#5A8DB8]">Email address</h2>
              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <button className="text-[#5A8DB8] hover:text-[#3C5979] text-sm sm:text-base font-medium transition-all duration-300 hover:bg-[#5A8DB8]/5 px-3 py-1 rounded-md" onClick={() => setShowEmailDialog(true)}>
                    change
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-3 sm:p-4 md:p-6 bg-gradient-to-br from-white to-gray-50/50">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg md:text-xl text-[#5A8DB8]">Change Email</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEmailChange} className="space-y-4">
                    <div>
                      <Label htmlFor="new-email" className="text-sm sm:text-base text-gray-700">New Email</Label>
                      <Input
                        id="new-email"
                        type="email"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        className="mt-1 text-sm sm:text-base border-[#5A8DB8]/20 bg-gradient-to-br from-gray-50 to-white focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 transition-all duration-300"
                        required
                      />
                    </div>
                    {emailError && <div className="text-red-500 text-xs sm:text-sm">{emailError}</div>}
                    {emailSuccess && <div className="text-green-600 text-xs sm:text-sm">{emailSuccess}</div>}
                    <DialogFooter className="gap-2 sm:gap-4">
                      <Button type="submit" className='bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white text-xs sm:text-sm md:text-base transition-all duration-300' disabled={emailChangeLoading}>
                        {emailChangeLoading ? 'Sending OTP...' : 'Send OTP'}
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className="text-xs sm:text-sm md:text-base border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-sm sm:text-base text-gray-600">Your email address is <span className="font-semibold text-[#5A8DB8]">{email}</span></div>
          </div>

          {/* Password Section */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 md:p-8 border border-[#5A8DB8]/10">
            <h2 className="font-semibold text-base sm:text-lg md:text-xl text-[#5A8DB8] mb-4 sm:mb-6">Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current-password" className="text-sm sm:text-base text-gray-700">Current Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="text-sm sm:text-base border-[#5A8DB8]/20 bg-gradient-to-br from-gray-50 to-white focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5A8DB8] transition-colors duration-300"
                      onClick={() => setShowCurrentPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-password" className="text-sm sm:text-base text-gray-700">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="text-sm sm:text-base border-[#5A8DB8]/20 bg-gradient-to-br from-gray-50 to-white focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5A8DB8] transition-colors duration-300"
                      onClick={() => setShowNewPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button type="submit" className='bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white text-xs sm:text-sm md:text-base transition-all duration-300' disabled={passwordChangeLoading}>
                  {passwordChangeLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
              {passwordError && <div className="text-red-500 text-xs sm:text-sm">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-600 text-xs sm:text-sm">{passwordSuccess}</div>}
            </form>
          </div>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-[425px] p-3 sm:p-4 md:p-6 bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl text-[#5A8DB8]">Verify OTP</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <div>
              <Label htmlFor="otp" className="text-sm sm:text-base text-gray-700">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="mt-1 text-sm sm:text-base border-[#5A8DB8]/20 bg-gradient-to-br from-gray-50 to-white focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 transition-all duration-300"
                required
              />
              {otpSent && (
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  OTP has been sent to {newEmail}
                </div>
              )}
            </div>
            {otpError && <div className="text-red-500 text-xs sm:text-sm">{otpError}</div>}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[#5A8DB8] hover:text-[#3C5979] text-xs sm:text-sm transition-all duration-300 hover:bg-[#5A8DB8]/5 px-3 py-1 rounded-md"
                disabled={otpVerificationLoading}
              >
                Resend OTP
              </button>
              <div className="flex gap-2 sm:gap-4">
                <Button type="submit" className='bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white text-xs sm:text-sm md:text-base transition-all duration-300' disabled={otpVerificationLoading}>
                  {otpVerificationLoading ? 'Verifying...' : 'Verify'}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="text-xs sm:text-sm md:text-base border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300">Cancel</Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountSettings;
