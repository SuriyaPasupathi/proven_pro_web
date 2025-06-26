import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Clock, RefreshCw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toast } from "react-hot-toast";
import { verifyOTP, resendOTP } from "@/store/Services/RegisterService";
import { useOTPTimer } from "@/hooks/useOTPTimer";

const CODE_LENGTH = 6;

const CheckEmailCode: React.FC = () => {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { 
    email, 
    loading, 
    error, 
    verified 
  } = useAppSelector((state) => state.register);

  // Use the custom OTP timer hook
  const {
    otpTimer,
    otpExpired,
    resendCooldown,
    formatTime,
    isCooldownActive
  } = useOTPTimer();

  // Get email from URL params as fallback
  const emailFromUrl = searchParams.get('email');
  const emailFromStorage = localStorage.getItem('registrationEmail');
  const finalEmail = email || emailFromUrl || emailFromStorage;

  useEffect(() => {
    console.log('CheckEmailCode mounted - Redux state:', { 
      email, 
      loading, 
      error, 
      verified, 
      otpTimer, 
      otpExpired, 
      resendCooldown 
    });
    console.log('Email from URL params:', emailFromUrl);
    console.log('Email from localStorage:', emailFromStorage);
    console.log('Final email to use:', finalEmail);
  }, [email, loading, error, verified, otpTimer, otpExpired, resendCooldown, emailFromUrl, emailFromStorage, finalEmail]);

  useEffect(() => {
    if (verified) {
      // Clean up localStorage
      localStorage.removeItem('registrationEmail');
      navigate('/verified-email');
    }
  }, [verified, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // Show expiry warning when OTP expires
  useEffect(() => {
    if (otpExpired) {
      toast.error('OTP has expired. Please request a new one.', {
        duration: 5000,
      });
    }
  }, [otpExpired]);

  const handleChange = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newCode = [...code];
    newCode[idx] = value;
    setCode(newCode);

    if (value && idx < CODE_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").slice(0, CODE_LENGTH);
    if (/^[0-9]+$/.test(paste)) {
      setCode(paste.split("").concat(Array(CODE_LENGTH - paste.length).fill("")));
      const lastIdx = Math.min(paste.length, CODE_LENGTH) - 1;
      setTimeout(() => inputsRef.current[lastIdx]?.focus(), 0);
    }
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Current state:', { email: finalEmail, code: code.join(''), loading, verified, otpExpired });
    
    // Check if OTP has expired
    if (otpExpired) {
      toast.error("OTP has expired. Please request a new verification code.");
      return;
    }
    
    const otp = code.join("");
    if (otp.length !== CODE_LENGTH) {
      toast.error("Please enter all 6 digits of the verification code");
      return;
    }

    if (!finalEmail) {
      toast.error("Email not found");
      return;
    }

    try {
      console.log('Dispatching verifyOTP action with:', { email: finalEmail, otp });
      const result = await dispatch(verifyOTP({ email: finalEmail, otp })).unwrap();
      console.log('Verification result:', result);
      
      if (result.access) {
        toast.success("Email verified successfully!");
        navigate("/verified-email");
      } else {
        toast.error(result.message || "Verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    // Check cooldown
    if (isCooldownActive) {
      toast.error(`Please wait ${resendCooldown} seconds before requesting a new code.`);
      return;
    }

    if (!finalEmail) {
      toast.error("Email not found");
      return;
    }

    try {
      const result = await dispatch(resendOTP(finalEmail)).unwrap();
      console.log('Resend result:', result);
      
      if (result.message) {
        toast.success("Verification code resent successfully!");
        setCode(Array(CODE_LENGTH).fill(""));
        inputsRef.current[0]?.focus();
      } else {
        toast.error(result.message || "Failed to resend code. Please try again.");
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      
      // Handle cooldown error specifically
      if (error.code === 'COOLDOWN' && error.cooldown_remaining) {
        toast.error(`Please wait ${error.cooldown_remaining} seconds before requesting a new code.`);
      } else {
        toast.error(error.message || 'Failed to resend code. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="bg-gray-100 rounded-full p-2 sm:p-3 mb-4 sm:mb-6">
          <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">Check your email</h1>
        <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6">
          We sent a verification code to<br />
          <span className="text-gray-900 font-medium">{finalEmail}</span>
        </p>

        {/* Timer Display */}
        <div className="w-full mb-4 flex items-center justify-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            otpExpired 
              ? 'bg-red-50 text-red-600 border border-red-200' 
              : 'bg-blue-50 text-blue-600 border border-blue-200'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {otpExpired 
                ? 'OTP Expired' 
                : `Expires in ${formatTime(otpTimer)}`
              }
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="flex gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={el => (inputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                className={`w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-2xl sm:text-3xl text-center border-2 rounded-lg focus:outline-none transition ${
                  otpExpired 
                    ? 'border-red-300 bg-red-50 text-red-600' 
                    : 'border-[#6C63FF] focus:border-[#3C5979]'
                }`}
                style={{ boxShadow: "0 2px 6px 0 rgba(108,99,255,0.05)" }}
                autoFocus={idx === 0}
                disabled={loading || otpExpired}
              />
            ))}
          </div>
          <Button
            type="submit"
            className={`w-full mb-3 sm:mb-4 text-sm sm:text-base ${
              otpExpired 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#3C5979] hover:bg-[#2f4560]'
            }`}
            disabled={loading || otpExpired}
            onClick={() => console.log('Button clicked')}
          >
            {loading ? "Verifying..." : otpExpired ? "OTP Expired" : "Verify email"}
          </Button>
        </form>

        {/* Resend Section */}
        <div className="w-full text-center">
          <p className="text-xs sm:text-sm text-gray-700 mb-2">
            Didn&apos;t receive the code?
          </p>
          {isCooldownActive ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Resend available in {resendCooldown}s</span>
            </div>
          ) : (
            <button
              type="button"
              className={`text-sm font-medium transition-all duration-300 ${
                otpExpired 
                  ? 'text-[#6C63FF] hover:underline' 
                  : 'text-[#6C63FF] hover:underline'
              }`}
              onClick={handleResend}
              disabled={loading}
            >
              {loading ? "Sending..." : "Click to resend"}
            </button>
          )}
        </div>

        <button
          type="button"
          className="flex items-center text-xs sm:text-sm text-gray-700 hover:underline mt-4"
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          <span className="mr-2">&larr;</span> Back to log in
        </button>
      </div>
    </div>
  );
};

export default CheckEmailCode;
