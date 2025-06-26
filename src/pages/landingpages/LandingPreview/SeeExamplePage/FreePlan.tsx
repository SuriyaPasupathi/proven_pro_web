import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from '../../../../components/layout/header';
import Footer from '../Footer';
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { subscribeToPlan } from "../../../../store/Services/CreateProfileService";
import { toast } from "sonner";

const planFeatures = [
  "Profile Name and Image",
  "Review Ratings",
  "Job Title and Job Specialization",
  "Client's Previews Reviews",
  "Copy URL Link",
];

const FreePlan: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptionLoading } = useSelector((state: RootState) => state.createProfile);

  const handleSubscribe = async () => {
    try {
      const result = await dispatch(subscribeToPlan('free')).unwrap();
      toast.success("Successfully subscribed to Free Plan!");
      navigate("/create-profile/personal-info");
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe to plan");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] drop-shadow">
            Confirm Basic Plan Selection
          </h1>
          <p className="text-gray-600 text-center max-w-xl mx-auto">
            Get started with our basic plan and create your professional profile
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#5A8DB8]/20 p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#5A8DB8] mb-2">Basic Plan</h2>
              <div className="text-4xl font-extrabold text-[#222] mb-2">
                <span className="text-2xl align-top">USD</span> 0
                <span className="text-base font-semibold text-gray-600">/semiannually</span>
              </div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 font-semibold text-lg text-[#5A8DB8]">Basic Features:</h3>
              <ul className="space-y-3 text-gray-700 text-base">
                {planFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 hover:translate-x-1 transition-transform group">
                    <FaCheckCircle className="text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-[#5A8DB8] transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleSubscribe}
                disabled={subscriptionLoading}
                className="w-full bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-lg font-semibold py-3 px-4 text-sm sm:text-base"
              >
                {subscriptionLoading ? "Processing..." : "Start Creating Profile"}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/plans')}
                className="w-full border-[#5A8DB8] text-[#5A8DB8] hover:bg-[#E6F0FA] hover:text-[#5A8DB8] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Go Back to Pricing
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreePlan;
