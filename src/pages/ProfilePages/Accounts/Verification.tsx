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
import { CheckCircle2, Clock, AlertCircle, Eye, Trash2, Upload, Shield, MapPin, Phone, ArrowRight, RefreshCw } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-[#5A8DB8]/5 to-white">
      <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5">
            <span className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent">
              Let's Verify Your Identity
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-black font-medium">
            Proving your identity helps employers trust you more and feel confident about hiring Filipino workers like you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Government ID */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#5A8DB8]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#5A8DB8]/10 to-[#5A8DB8]/5 flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#5A8DB8]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Government ID</h2>
                <p className="text-sm text-black/70">Required for verification</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#5A8DB8]/10 to-[#5A8DB8]/5">
                <span className="text-lg font-semibold text-black">+50 Proven Proof</span>
                <div className="h-1 w-1 rounded-full bg-[#5A8DB8]/40"></div>
                {profileData?.verification_details?.government_id && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(
                      profileData.verification_details.government_id.uploaded,
                      profileData.verification_details.government_id.verified
                    )}
                    {getStatusText(
                      profileData.verification_details.government_id.uploaded,
                      profileData.verification_details.government_id.verified
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-black/70 mb-6">Provide a photo of your valid Government ID and a selfie showing it</p>

            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              
              <div className="flex flex-col gap-4">
                <Button 
                  variant="outline" 
                  className="w-full border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:text-black transition-all duration-300 flex items-center gap-2"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  <Upload className="w-5 h-5" />
                  {selectedFile ? 'Change File' : 'Select Government ID'}
                </Button>

                {selectedFile && (
                  <div className="p-4 border rounded-xl bg-white/60 backdrop-blur-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black">Selected File:</p>
                        <p className="text-sm text-black/70 truncate">{selectedFile.name}</p>
                        <p className="text-xs text-black/50">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        {selectedFile.type.startsWith('image/') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-black hover:text-black hover:bg-[#5A8DB8]/10 transition-all duration-300"
                            onClick={() => {
                              setPreviewType('gov_id');
                              setIsPreviewOpen(true);
                            }}
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                          onClick={handleRemoveFile}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFile && (
                  <Button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition-all duration-300 flex items-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Upload File
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Address Validation */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#5A8DB8]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#5A8DB8]/10 to-[#5A8DB8]/5 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-[#5A8DB8]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Address Validation</h2>
                <p className="text-sm text-black/70">Optional verification</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#5A8DB8]/10 to-[#5A8DB8]/5">
                <span className="text-lg font-semibold text-black">+25 Proven Proof</span>
                <div className="h-1 w-1 rounded-full bg-[#5A8DB8]/40"></div>
                {profileData?.verification_details?.address_proof && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(
                      profileData.verification_details.address_proof.uploaded,
                      profileData.verification_details.address_proof.verified
                    )}
                    {getStatusText(
                      profileData.verification_details.address_proof.uploaded,
                      profileData.verification_details.address_proof.verified
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-black/70 mb-6">Upload a picture of the document showing your billing address</p>

            <div className="space-y-4">
              <input
                type="file"
                ref={addressFileInputRef}
                onChange={handleAddressFileSelect}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              
              <div className="flex flex-col gap-4">
                <Button 
                  variant="outline" 
                  className="w-full border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:text-black transition-all duration-300 flex items-center gap-2"
                  onClick={triggerAddressFileInput}
                  disabled={isAddressUploading}
                >
                  <Upload className="w-5 h-5" />
                  {selectedAddressFile ? 'Change Document' : 'Select Address Document'}
                </Button>

                {selectedAddressFile && (
                  <div className="p-4 border rounded-xl bg-white/60 backdrop-blur-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black">Selected Document:</p>
                        <p className="text-sm text-black/70 truncate">{selectedAddressFile.name}</p>
                        <p className="text-xs text-black/50">
                          {(selectedAddressFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2 ml-2">
                        {selectedAddressFile.type.startsWith('image/') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-black hover:text-black hover:bg-[#5A8DB8]/10 transition-all duration-300"
                            onClick={() => {
                              setPreviewType('address');
                              setIsPreviewOpen(true);
                            }}
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                          onClick={handleRemoveAddressFile}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAddressFile && (
                  <Button 
                    onClick={handleAddressUpload}
                    disabled={isAddressUploading}
                    className="w-full bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition-all duration-300 flex items-center gap-2"
                  >
                    {isAddressUploading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Upload Document
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#5A8DB8]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#5A8DB8]/10 to-[#5A8DB8]/5 flex items-center justify-center">
                <Phone className="h-6 w-6 text-[#5A8DB8]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Mobile Number</h2>
                <p className="text-sm text-black/70">Optional verification</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#5A8DB8]/10 to-[#5A8DB8]/5">
                <span className="text-lg font-semibold text-black">+25 Proven Proof</span>
                <div className="h-1 w-1 rounded-full bg-[#5A8DB8]/40"></div>
                {profileData?.verification_details?.mobile && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(
                      profileData.verification_details.mobile.provided,
                      profileData.verification_details.mobile.verified
                    )}
                    {getStatusText(
                      profileData.verification_details.mobile.provided,
                      profileData.verification_details.mobile.verified
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-black/70 mb-6">Enter your mobile number to receive a verification code</p>
            
            <div className="space-y-4">
              <PhoneInput
                country={'ph'}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputClass="w-full !h-11 text-sm border-[#5A8DB8]/20 bg-white/60 backdrop-blur-sm focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300"
                containerClass="w-full"
                buttonClass="!border-[#5A8DB8]/20 !h-11"
                dropdownClass="!border-[#5A8DB8]/20"
              />
              <Button 
                variant="outline" 
                className="w-full border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:text-black transition-all duration-300 flex items-center gap-2"
                onClick={handlePhoneSubmit}
              >
                <ArrowRight className="w-5 h-5" />
                Validate my mobile number
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-xl">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#5A8DB8]/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-[#5A8DB8]" />
              </div>
              <DialogTitle className="text-xl font-semibold text-black">Enter Verification Code</DialogTitle>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
          </DialogHeader>
          <div className="py-6">
            <p className="text-sm text-black/70 mb-4">
              We've sent a verification code to {phoneNumber}
            </p>
            <div className="flex justify-between gap-2 mb-4">
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
                  className="w-12 h-12 text-center text-lg border-[#5A8DB8]/20 bg-white/60 backdrop-blur-sm focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300"
                />
              ))}
            </div>
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-black/70">
                  Resend code in {countdown} seconds
                </p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResendOtp}
                  className="text-black hover:text-black text-sm transition-all duration-300"
                >
                  Resend code
                </Button>
              )}
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOtpDialogOpen(false)}
              className="border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:text-black transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOtpSubmit}
              className="bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition-all duration-300 flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-xl">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#5A8DB8]/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-[#5A8DB8]" />
              </div>
              <DialogTitle className="text-xl font-semibold text-black">
                {previewType === 'gov_id' ? 'Government ID Preview' : 'Address Document Preview'}
              </DialogTitle>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
          </DialogHeader>
          <div className="py-6">
            {previewUrl && (
              <div className="relative w-full h-[400px] flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden">
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
              className="border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:text-black transition-all duration-300"
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
