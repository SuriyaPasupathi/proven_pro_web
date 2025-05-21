import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toast } from "react-hot-toast";
import { verifyOTP, resendOTP } from "@/store/Services/RegisterService";

const CODE_LENGTH = 6;

const CheckEmailCode: React.FC = () => {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { email, loading, error, verified } = useAppSelector((state) => state.register);

  useEffect(() => {
    if (verified) {
      navigate('/verified-email');
    }
  }, [verified, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

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
    console.log('Current state:', { email, code: code.join(''), loading, verified });
    
    const otp = code.join("");
    if (otp.length !== CODE_LENGTH) {
      toast.error("Please enter all 6 digits of the verification code");
      return;
    }

    if (!email) {
      toast.error("Email not found");
      return;
    }

    try {
      console.log('Dispatching verifyOTP action with:', { email, otp });
      const result = await dispatch(verifyOTP({ email, otp })).unwrap();
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
    if (!email) {
      toast.error("Email not found");
      return;
    }

    try {
      const result = await dispatch(resendOTP(email)).unwrap();
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
      toast.error(error.message || 'Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 flex flex-col items-center">
        <div className="bg-gray-100 rounded-full p-3 mb-6">
          <Mail className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Check your email</h1>
        <p className="text-gray-700 text-center mb-6">
          We sent a verification code to<br />
          <span className="text-gray-900 font-medium">{email}</span>
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="flex gap-4 mb-6">
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
                className="w-14 h-16 text-3xl text-center border-2 border-[#6C63FF] rounded-lg focus:outline-none focus:border-[#3C5979] transition"
                style={{ boxShadow: "0 2px 6px 0 rgba(108,99,255,0.05)" }}
                autoFocus={idx === 0}
                disabled={loading}
              />
            ))}
          </div>
          <Button
            type="submit"
            className="w-full bg-[#3C5979] hover:bg-[#2f4560] mb-4"
            disabled={loading}
            onClick={() => console.log('Button clicked')}
          >
            {loading ? "Verifying..." : "Verify email"}
          </Button>
        </form>
        <p className="text-sm text-gray-700 mb-6 text-center">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            className="text-[#6C63FF] font-medium hover:underline"
            onClick={handleResend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Click to resend"}
          </button>
        </p>
        <button
          type="button"
          className="flex items-center text-sm text-gray-700 hover:underline"
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
