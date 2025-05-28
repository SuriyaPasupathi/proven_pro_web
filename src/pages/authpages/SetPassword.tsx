import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from '@/store/store';
import { resetPasswordConfirm } from '@/store/Services/AuthService';
import { toast } from 'sonner';

const SetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  useEffect(() => {
    // Validate the reset link parameters
    if (!uid || !token) {
      setIsValidLink(false);
      toast.error("Invalid or expired reset link");
    }
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidLink) {
      toast.error("Invalid reset link");
      return;
    }

    // Validation
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error("Password must contain at least one special character");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(resetPasswordConfirm({
        uid: uid!,
        token: token!,
        new_password: password
      })).unwrap();

      if (result.message === "Password reset successful.") {
        toast.success("Password reset successful");
        navigate("/reset-success");
      }
    } catch (error: any) {
      if (error.message === "Invalid or expired token.") {
        toast.error("This reset link has expired. Please request a new one.");
        navigate("/forget-password");
      } else {
        toast.error(error.message || "Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-4 sm:p-6 md:p-8 flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-2 sm:p-3 mb-4 sm:mb-6">
            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">Invalid Reset Link</h1>
          <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Button
            className="w-full bg-[#3C5979] hover:bg-[#2f4560] text-sm sm:text-base"
            onClick={() => navigate("/forget-password")}
          >
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="bg-gray-100 rounded-full p-2 sm:p-3 mb-4 sm:mb-6">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">Set new password</h1>
        <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6">
          Your new password must be different to previously used passwords.
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 sm:gap-4">
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="bg-gray-50 text-sm sm:text-base"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-xs sm:text-sm font-medium mb-1">
              Confirm password
            </label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="bg-gray-50 text-sm sm:text-base"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-1 mt-2 mb-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#3C5979]" />
              Must be at least 8 characters
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#3C5979]" />
              Must contain one special character
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#3C5979] hover:bg-[#2f4560] text-sm sm:text-base"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset your password"}
          </Button>
        </form>
        <button
          type="button"
          className="flex items-center text-xs sm:text-sm text-gray-700 hover:underline mt-4 sm:mt-6"
          onClick={() => navigate("/login")}
        >
          <span className="mr-2">&larr;</span> Back to log in
        </button>
      </div>
    </div>
  );
};

export default SetPassword;
