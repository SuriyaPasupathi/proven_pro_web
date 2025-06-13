import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { getProfile, uploadVerificationDocument, requestMobileVerification, verifyMobileOTP, getVerificationStatus } from '../../../store/Services/CreateProfileService';
import ProfileNav from '../ProfileNav';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { CheckCircle2, Clock, AlertCircle, Eye, Trash2, Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Verification = () => {
  const { profileId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, profileData } = useSelector((state: RootState) => state.createProfile);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Address validation states
  const [selectedAddressFile, setSelectedAddressFile] = useState<File | null>(null);
  const [isAddressUploading, setIsAddressUploading] = useState(false);
  const addressFileInputRef = useRef<HTMLInputElement>(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'gov_id' | 'address' | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (profileId) {
      dispatch(getProfile(profileId));
      dispatch(getVerificationStatus(profileId));
    }
  }, [dispatch, profileId]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid file (JPEG, PNG, or PDF)');
        return;
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setPreviewType('gov_id');
      }
      toast.success('File selected successfully');
    }
  };

  const handleAddressFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid file (JPEG, PNG, or PDF)');
        return;
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setSelectedAddressFile(file);
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setPreviewType('address');
      }
      toast.success('Address document selected successfully');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await dispatch(uploadVerificationDocument({
        document: selectedFile,
        document_type: 'gov_id',
        user_id: profileId || ''
      })).unwrap();
      toast.success('Document uploaded successfully');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddressUpload = async () => {
    if (!selectedAddressFile) return;

    setIsAddressUploading(true);
    try {
      await dispatch(uploadVerificationDocument({
        document: selectedAddressFile,
        document_type: 'address',
        user_id: profileId || ''
      })).unwrap();
      toast.success('Address document uploaded successfully');
      setSelectedAddressFile(null);
      if (addressFileInputRef.current) {
        addressFileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to upload address document');
    } finally {
      setIsAddressUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (previewUrl && previewType === 'gov_id') {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setPreviewType(null);
    }
    toast.success('Government ID document removed');
  };

  const handleRemoveAddressFile = () => {
    setSelectedAddressFile(null);
    if (addressFileInputRef.current) {
      addressFileInputRef.current.value = '';
    }
    if (previewUrl && previewType === 'address') {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setPreviewType(null);
    }
    toast.success('Address document removed');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerAddressFileInput = () => {
    addressFileInputRef.current?.click();
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      const result = await dispatch(requestMobileVerification(phoneNumber)).unwrap();
      setIsOtpDialogOpen(true);
      setCountdown(60);
      startCountdown();
      toast.success(result.message);
    } catch (error) {
      toast.error('Failed to send verification code');
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid OTP');
      return;
    }

    try {
      const result = await dispatch(verifyMobileOTP(otpValue)).unwrap();
      toast.success(result.message);
      setIsOtpDialogOpen(false);
      setOtp(['', '', '', '', '', '']);
      setCountdown(0);
      
      // Refresh verification status
      if (profileId) {
        dispatch(getVerificationStatus(profileId));
      }
    } catch (error) {
      toast.error('Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) {
      toast.error(`Please wait ${countdown} seconds before requesting a new OTP`);
      return;
    }

    try {
      const result = await dispatch(requestMobileVerification(phoneNumber)).unwrap();
      setCountdown(60);
      startCountdown();
      toast.success(result.message);
      if (profileId) {
        dispatch(getVerificationStatus(profileId));
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getStatusIcon = (uploaded: boolean, verified: boolean) => {
    if (verified) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    } else if (uploaded) {
      return <Clock className="w-5 h-5 text-yellow-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusText = (uploaded: boolean, verified: boolean) => {
    if (verified) {
      return <span className="text-green-500 font-medium">Verified</span>;
    } else if (uploaded) {
      return <span className="text-yellow-500 font-medium">Pending Verification</span>;
    }
    return <span className="text-gray-500 font-medium">Not Uploaded</span>;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5A8DB8]/10 to-white">
      <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-12 lg:pb-16">
        <div className="max-w-4xl mx-auto text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent font-bold mb-2 sm:mb-3 md:mb-4">Let's Verify Your Identity – Just 3 Easy Steps!</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2 sm:px-4 md:px-6 font-semibold">Proving your identity helps employers trust you more and feel confident about hiring Filipino workers like you.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Government ID */}
          <div className="bg-gradient-to-br from-white to-[#5A8DB8]/5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center border border-[#5A8DB8]/10">
            <div className="mb-2 sm:mb-3 md:mb-4">
              <span className="inline-block bg-gradient-to-br from-[#5A8DB8]/10 to-[#3C5979]/10 p-2 sm:p-3 md:p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#5A8DB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 0A4 4 0 005 15.13M15 11a4 4 0 10-8 0 4 4 0 008 0z" /></svg>
              </span>
            </div> 
            <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center text-[#5A8DB8]">Verify with a Government ID <br/>(Required)</h2>
            <div className="text-[#3C5979] font-semibold mb-2 text-sm sm:text-base">+50 Proven Proof</div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              {profileData?.verification_details?.government_id && getStatusIcon(
                profileData.verification_details.government_id.uploaded,
                profileData.verification_details.government_id.verified
              )}
              {profileData?.verification_details?.government_id && getStatusText(
                profileData.verification_details.government_id.uploaded,
                profileData.verification_details.government_id.verified
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-3 sm:mb-4 md:mb-6">Provide a photo of your valid Government ID and a selfie showing it</p>
            <div className="space-y-2 sm:space-y-3 md:space-y-4 w-full">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                <Button 
                  variant="outline" 
                  className="w-full text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  {selectedFile ? 'Change File' : 'Select Government ID'}
                </Button>

                {selectedFile && (
                  <div className="p-2 sm:p-3 md:p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-[#5A8DB8]">Selected File:</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-1 sm:gap-2 ml-2">
                        {selectedFile.type.startsWith('image/') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 text-xs sm:text-sm flex items-center gap-1 p-1 sm:p-2 transition-all duration-300"
                            onClick={() => {
                              setPreviewType('gov_id');
                              setIsPreviewOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm flex items-center gap-1 p-1 sm:p-2 transition-all duration-300"
                          onClick={handleRemoveFile}
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFile && (
                  <Button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white text-xs sm:text-sm md:text-base transition-all duration-300"
                  >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Address Validation */}
          <div className="bg-gradient-to-br from-white to-[#5A8DB8]/5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center border border-[#5A8DB8]/10">
            <div className="mb-2 sm:mb-3 md:mb-4">
              <span className="inline-block bg-gradient-to-br from-[#5A8DB8]/10 to-[#3C5979]/10 p-2 sm:p-3 md:p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#5A8DB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v6m0 0H6m6 0h6" /></svg>
              </span>
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center text-[#5A8DB8]">Address Validation<br/>(Choose to Provide)</h2>
            <div className="text-[#3C5979] font-semibold mb-2 text-sm sm:text-base">+25 Proven Proof</div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              {profileData?.verification_details?.address_proof && getStatusIcon(
                profileData.verification_details.address_proof.uploaded,
                profileData.verification_details.address_proof.verified
              )}
              {profileData?.verification_details?.address_proof && getStatusText(
                profileData.verification_details.address_proof.uploaded,
                profileData.verification_details.address_proof.verified
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-3 sm:mb-4 md:mb-6">Upload a picture of the document showing your billing address</p>
            <div className="space-y-2 sm:space-y-3 md:space-y-4 w-full">
              <input
                type="file"
                ref={addressFileInputRef}
                onChange={handleAddressFileSelect}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                <Button 
                  variant="outline" 
                  className="w-full text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
                  onClick={triggerAddressFileInput}
                  disabled={isAddressUploading}
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  {selectedAddressFile ? 'Change Document' : 'Select Address Document'}
                </Button>

                {selectedAddressFile && (
                  <div className="p-2 sm:p-3 md:p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-[#5A8DB8]">Selected Document:</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{selectedAddressFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedAddressFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-1 sm:gap-2 ml-2">
                        {selectedAddressFile.type.startsWith('image/') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 text-xs sm:text-sm flex items-center gap-1 p-1 sm:p-2 transition-all duration-300"
                            onClick={() => {
                              setPreviewType('address');
                              setIsPreviewOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm flex items-center gap-1 p-1 sm:p-2 transition-all duration-300"
                          onClick={handleRemoveAddressFile}
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAddressFile && (
                  <Button 
                    onClick={handleAddressUpload}
                    disabled={isAddressUploading}
                    className="w-full bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white text-xs sm:text-sm md:text-base transition-all duration-300"
                  >
                    {isAddressUploading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="bg-gradient-to-br from-white to-[#5A8DB8]/5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center border border-[#5A8DB8]/10">
            <div className="mb-2 sm:mb-3 md:mb-4">
              <span className="inline-block bg-gradient-to-br from-[#5A8DB8]/10 to-[#3C5979]/10 p-2 sm:p-3 md:p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#5A8DB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 2a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2h8zm-4 18a1 1 0 100-2 1 1 0 000 2z" /></svg>
              </span>
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center text-[#5A8DB8]">Verify Mobile Number<br/>(Choose to Provide)</h2>
            <div className="text-[#3C5979] font-semibold mb-2 text-sm sm:text-base">+25 Proven Proof</div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              {profileData?.verification_details?.mobile && getStatusIcon(
                profileData.verification_details.mobile.provided,
                profileData.verification_details.mobile.verified
              )}
              {profileData?.verification_details?.mobile && getStatusText(
                profileData.verification_details.mobile.provided,
                profileData.verification_details.mobile.verified
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-3 sm:mb-4 md:mb-6">Enter your mobile number to receive a verification code</p>
            
            <div className="w-full space-y-2 sm:space-y-3 md:space-y-4">
              <PhoneInput
                country={'ph'}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputClass="w-full !h-8 sm:!h-9 md:!h-10 lg:!h-11 text-xs sm:text-sm md:text-base border-[#5A8DB8]/20 bg-gradient-to-br from-gray-50 to-white focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 transition-all duration-300"
                containerClass="w-full"
                buttonClass="!border-[#5A8DB8]/20 !h-8 sm:!h-9 md:!h-10 lg:!h-11"
                dropdownClass="!border-[#5A8DB8]/20"
              />
              <Button 
                variant="outline" 
                className="w-full text-xs sm:text-sm md:text-base border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
                onClick={handlePhoneSubmit}
              >
                Validate my mobile number
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-3 sm:p-4 md:p-6 bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl text-[#5A8DB8]">Enter Verification Code</DialogTitle>
          </DialogHeader>
          <div className="py-3 sm:py-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              We've sent a verification code to {phoneNumber}
            </p>
            <div className="flex justify-between gap-1 sm:gap-2 mb-3 sm:mb-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center text-sm sm:text-base md:text-lg border-[#5A8DB8]/20 bg-gradient-to-br from-gray-50 to-white focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 transition-all duration-300"
                />
              ))}
            </div>
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-xs sm:text-sm text-gray-500">
                  Resend code in {countdown} seconds
                </p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResendOtp}
                  className="text-[#5A8DB8] hover:text-[#3C5979] text-xs sm:text-sm transition-all duration-300"
                >
                  Resend code
                </Button>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => setIsOtpDialogOpen(false)}
              className="text-xs sm:text-sm md:text-base border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOtpSubmit}
              className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white text-xs sm:text-sm md:text-base transition-all duration-300"
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] p-3 sm:p-4 md:p-6 bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl text-[#5A8DB8]">
              {previewType === 'gov_id' ? 'Government ID Preview' : 'Address Document Preview'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 sm:py-4">
            {previewUrl && (
              <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Document preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="text-xs sm:text-sm md:text-base border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Verification;
