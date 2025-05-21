import React from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/store";

const EmailVerify: React.FC = () => {
  const navigate = useNavigate();
  const { email, loading } = useAppSelector((state) => state.register);

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
        <Button
          className="w-full bg-[#3C5979] hover:bg-[#2f4560] mb-4"
          onClick={() => navigate("/check-email-code")}
          disabled={loading}
        >
          Enter code manually
        </Button>
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

export default EmailVerify;
