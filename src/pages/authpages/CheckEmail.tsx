import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react"; // or any mail icon you use
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from '@/store/store';
import { requestPasswordReset } from '@/store/Services/AuthService';
import { toast } from 'sonner';

const CheckEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isResending, setIsResending] = useState(false);

  // Get email from navigation state
  const userEmail = location.state?.email;

  // Redirect if no email is provided
  if (!userEmail) {
    navigate('/forget-password');
    return null;
  }

  // You can implement the open email app and resend logic as needed
  const handleOpenEmailApp = () => {
    window.open('https://mail.google.com', '_blank');
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await dispatch(requestPasswordReset(userEmail)).unwrap();
      if (result.success) {
        toast.success('Reset link resent successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend reset link');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 flex flex-col items-center">
        <div className="bg-gray-100 rounded-full p-3 mb-6">
          <Mail className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Check your email</h1>
        <p className="text-gray-700 text-center mb-1">
          We sent a password reset link to
        </p>
        <p className="text-gray-900 font-medium text-center mb-6">
          {userEmail}
        </p>
        <Button
          className="w-full bg-[#3C5979] hover:bg-[#2f4560] mb-4"
          onClick={handleOpenEmailApp}
        >
          Open email app
        </Button>
        <p className="text-sm text-gray-700 mb-6 text-center">
          Didn&apos;t receive the email?{" "}
          <button
            type="button"
            className="text-[#3C5979] font-medium hover:underline"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Click to resend"}
          </button>
        </p>
        <button
          type="button"
          className="flex items-center text-sm text-gray-700 hover:underline"
          onClick={() => navigate("/login")}
        >
          <span className="mr-2">&larr;</span> Back to log in
        </button>
      </div>
    </div>
  );
};

export default CheckEmail;
