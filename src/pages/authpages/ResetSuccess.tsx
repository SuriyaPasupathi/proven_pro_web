import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const ResetSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show success message when component mounts
    toast.success("Your password has been successfully reset!");
  }, []);

  // You can add resend logic here
  const handleResend = () => {
    // Implement resend logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="bg-green-100 rounded-full p-2 sm:p-3 mb-4 sm:mb-6">
          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">Password Reset Successful</h1>
        <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6">
          Your password has been successfully reset.<br />
          You can now log in with your new password.
        </p>
        <Button
          className="w-full bg-[#3C5979] hover:bg-[#2f4560] mb-3 sm:mb-4 text-sm sm:text-base"
          onClick={() => navigate("/login")}
        >
          Continue to Login
        </Button>
        <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6 text-center">
          Didn&apos;t receive the email?{" "}
          <button
            type="button"
            className="text-[#6C63FF] font-medium hover:underline"
            onClick={handleResend}
          >
            Click to resend
          </button>
        </p>
        <button
          type="button"
          className="flex items-center text-xs sm:text-sm text-gray-700 hover:underline"
          onClick={() => navigate("/login")}
        >
          <span className="mr-2">&larr;</span> Back to log in
        </button>
      </div>
    </div>
  );
};

export default ResetSuccess;
