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

const Verification = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.createProfile);
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
    dispatch(getProfile());
    dispatch(getVerificationStatus());
  }, [dispatch]);

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
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      const result = await dispatch(uploadVerificationDocument({
        document: selectedFile,
        document_type: 'gov_id'
      })).unwrap();

      toast.success(result.message);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddressUpload = async () => {
    if (!selectedAddressFile) {
      toast.error('Please select an address document first');
      return;
    }

    setIsAddressUploading(true);
    try {
      const result = await dispatch(uploadVerificationDocument({
        document: selectedAddressFile,
        document_type: 'address'
      })).unwrap();

      toast.success(result.message);
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
      dispatch(getVerificationStatus());
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center mt-8 sm:mt-12 mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Let's Verify Your Identity – Just 3 Easy Steps!</h1>
          <p className="text-gray-600 text-base sm:text-lg px-2">Proving your identity helps employers trust you more and feel confident about hiring Filipino workers like you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Government ID */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 flex flex-col items-center border">
            <div className="mb-3 sm:mb-4">
              <span className="inline-block bg-gray-100 p-3 sm:p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 0A4 4 0 005 15.13M15 11a4 4 0 10-8 0 4 4 0 008 0z" /></svg>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 text-center">Verify with a Government ID <br/>(Required)</h2>
            <div className="text-blue-900 font-semibold mb-2">+50 Proven Proof</div>
            <p className="text-gray-500 text-center mb-4 sm:mb-6 text-xs sm:text-sm">Provide a photo of your valid Government ID and a selfie showing it</p>
            <div className="space-y-3 sm:space-y-4 w-full">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              
              <div className="flex flex-col gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  className="w-full text-sm sm:text-base"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                >
                  {selectedFile ? 'Change File' : 'Select Government ID'}
                </Button>

                {selectedFile && (
                  <div className="p-3 sm:p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Selected File:</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {selectedFile.type.startsWith('image/') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
                            onClick={() => {
                              setPreviewType('gov_id');
                              setIsPreviewOpen(true);
                            }}
                          >
                            Preview
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                          onClick={handleRemoveFile}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFile && (
                  <Button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-[#5A8DB8] hover:bg-[#3C5979] text-white text-sm sm:text-base"
                  >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Address Validation */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 flex flex-col items-center border">
            <div className="mb-3 sm:mb-4">
              <span className="inline-block bg-gray-100 p-3 sm:p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v6m0 0H6m6 0h6" /></svg>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 text-center">Address Validation<br/>(Choose to Provide)</h2>
            <div className="text-blue-900 font-semibold mb-2">+25 Proven Proof</div>
            <p className="text-gray-500 text-center mb-4 sm:mb-6 text-xs sm:text-sm">Upload a picture of the document showing your billing address</p>
            <div className="space-y-3 sm:space-y-4 w-full">
              <input
                type="file"
                ref={addressFileInputRef}
                onChange={handleAddressFileSelect}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              
              <div className="flex flex-col gap-3 sm:gap-4">
                <Button 
                  variant="outline" 
                  className="w-full text-sm sm:text-base"
                  onClick={triggerAddressFileInput}
                  disabled={isAddressUploading}
                >
                  {selectedAddressFile ? 'Change Document' : 'Select Address Document'}
                </Button>

                {selectedAddressFile && (
                  <div className="p-3 sm:p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Selected Document:</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">{selectedAddressFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedAddressFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {selectedAddressFile.type.startsWith('image/') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 text-xs sm:text-sm"
                            onClick={() => {
                              setPreviewType('address');
                              setIsPreviewOpen(true);
                            }}
                          >
                            Preview
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                          onClick={handleRemoveAddressFile}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAddressFile && (
                  <Button 
                    onClick={handleAddressUpload}
                    disabled={isAddressUploading}
                    className="w-full bg-[#5A8DB8] hover:bg-[#3C5979] text-white text-sm sm:text-base"
                  >
                    {isAddressUploading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:p-8 flex flex-col items-center border">
            <div className="mb-3 sm:mb-4">
              <span className="inline-block bg-gray-100 p-3 sm:p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 2a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2h8zm-4 18a1 1 0 100-2 1 1 0 000 2z" /></svg>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold mb-2 text-center">Verify Mobile Number<br/>(Choose to Provide)</h2>
            <div className="text-blue-900 font-semibold mb-2">+25 Proven Proof</div>
            <p className="text-gray-500 text-center mb-4 sm:mb-6 text-xs sm:text-sm">Enter your mobile number to receive a verification code</p>
            
            <div className="w-full space-y-3 sm:space-y-4">
              <PhoneInput
                country={'ph'}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputClass="w-full !h-10 sm:!h-11 text-sm sm:text-base"
                containerClass="w-full"
                buttonClass="!border-gray-300 !h-10 sm:!h-11"
                dropdownClass="!border-gray-300"
              />
              <Button 
                variant="outline" 
                className="w-full text-sm sm:text-base"
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
        <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Enter Verification Code</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
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
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg"
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
                  className="text-[#5A8DB8] hover:text-[#3C5979] text-xs sm:text-sm"
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
              className="text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOtpSubmit}
              className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white text-sm sm:text-base"
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {previewType === 'gov_id' ? 'Government ID Preview' : 'Address Document Preview'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {previewUrl && (
              <div className="relative w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
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
              className="text-sm sm:text-base"
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
