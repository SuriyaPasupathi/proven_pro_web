import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { resetState } from "@/store/Slice/RegisterSlice";

const VerifiedEmail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.register);

  useEffect(() => {
    // Reset the registration state when component mounts
    dispatch(resetState());
  }, [dispatch]);

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 flex flex-col items-center">
        <div className="bg-gray-100 rounded-full p-3 mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#3C5979]" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Email verified</h1>
        <p className="text-gray-700 text-center mb-6">
          Your email has been successfully verified.<br />
          You can now log in to your account.
        </p>
        <Button
          className="w-full bg-[#3C5979] hover:bg-[#2f4560] mb-4"
          onClick={handleContinue}
          disabled={loading}
        >
          Continue to login
        </Button>
      </div>
    </div>
  );
};

export default VerifiedEmail;
