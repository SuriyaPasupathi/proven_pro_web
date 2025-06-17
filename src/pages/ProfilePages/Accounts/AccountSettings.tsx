import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, RefreshCw } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-[#5A8DB8]/5 to-white">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5">
            <span className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent">
              Account Settings
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#5A8DB8]/80 font-medium">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Email Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#5A8DB8]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#5A8DB8]/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-[#5A8DB8]" />
                </div>
                <h2 className="text-xl font-semibold text-[#3C5979]">Email Address</h2>
              </div>
              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
                    onClick={() => setShowEmailDialog(true)}
                  >
                    Change Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-xl">
                  <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#5A8DB8]/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-[#5A8DB8]" />
                      </div>
                      <DialogTitle className="text-xl font-semibold text-[#3C5979]">Change Email</DialogTitle>
                    </div>
                    <div className="h-1 w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
                  </DialogHeader>
                  <form onSubmit={handleEmailChange} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="new-email" className="text-sm font-medium text-[#3C5979]">New Email</Label>
                      <div className="relative">
                        <Input
                          id="new-email"
                          type="email"
                          value={newEmail}
                          onChange={e => setNewEmail(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300"
                          required
                        />
                        <Mail className="h-5 w-5 text-[#5A8DB8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    {emailError && (
                      <div className="text-red-500 text-sm bg-red-50/50 p-3 rounded-lg border border-red-100">
                        {emailError}
                      </div>
                    )}
                    {emailSuccess && (
                      <div className="text-green-600 text-sm bg-green-50/50 p-3 rounded-lg border border-green-100">
                        {emailSuccess}
                      </div>
                    )}
                    <DialogFooter className="gap-3">
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition-all duration-300 flex items-center gap-2"
                        disabled={emailChangeLoading}
                      >
                        {emailChangeLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="h-4 w-4" />
                            Send OTP
                          </>
                        )}
                      </Button>
                      <DialogClose asChild>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-base text-[#5A8DB8]/80">
              Your email address is <span className="font-semibold text-[#3C5979]">{email}</span>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#5A8DB8]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-[#5A8DB8]/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-[#5A8DB8]" />
              </div>
              <h2 className="text-xl font-semibold text-[#3C5979]">Password</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm font-medium text-[#3C5979]">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="pl-10 pr-10 py-2 bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300"
                      required
                    />
                    <Lock className="h-5 w-5 text-[#5A8DB8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A8DB8]/40 hover:text-[#5A8DB8] transition-colors duration-300"
                      onClick={() => setShowCurrentPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium text-[#3C5979]">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 py-2 bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300"
                      required
                    />
                    <Shield className="h-5 w-5 text-[#5A8DB8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A8DB8]/40 hover:text-[#5A8DB8] transition-colors duration-300"
                      onClick={() => setShowNewPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition-all duration-300 flex items-center gap-2"
                  disabled={passwordChangeLoading}
                >
                  {passwordChangeLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm bg-red-50/50 p-3 rounded-lg border border-red-100">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="text-green-600 text-sm bg-green-50/50 p-3 rounded-lg border border-green-100">
                  {passwordSuccess}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-xl">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#5A8DB8]/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-[#5A8DB8]" />
              </div>
              <DialogTitle className="text-xl font-semibold text-[#3C5979]">Verify OTP</DialogTitle>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
          </DialogHeader>
          <form onSubmit={handleOtpVerification} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-[#3C5979]">Enter OTP</Label>
              <div className="relative">
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300"
                  required
                />
                <Shield className="h-5 w-5 text-[#5A8DB8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {otpSent && (
                <div className="text-sm text-[#5A8DB8]/70 bg-[#5A8DB8]/5 p-3 rounded-lg border border-[#5A8DB8]/10">
                  OTP has been sent to {newEmail}
                </div>
              )}
            </div>
            {otpError && (
              <div className="text-red-500 text-sm bg-red-50/50 p-3 rounded-lg border border-red-100">
                {otpError}
              </div>
            )}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                className="border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300 flex items-center gap-2"
                disabled={otpVerificationLoading}
              >
                <RefreshCw className="h-4 w-4" />
                Resend OTP
              </Button>
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition-all duration-300 flex items-center gap-2"
                  disabled={otpVerificationLoading}
                >
                  {otpVerificationLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Verify
                    </>
                  )}
                </Button>
                <DialogClose asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
                  >
                    Cancel
                  </Button>
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
