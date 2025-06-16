import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from '../../../../components/layout/header';
import Footer from '../Footer';

const planFeatures = [
  "Profile Name and Image",
  "Review Ratings",
  "Job Title and Job Specialization",
  "Client's Previews Reviews",
  "Copy URL Link",
];

const FreePlan: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-[#5A8DB8] drop-shadow">
          Confirm Basic Plan Selection
        </h1>
        <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
          Get started with our basic plan and create your professional profile
        </p>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 w-full max-w-xl mb-8 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#5A8DB8]">Basic Plan</h2>
              <div className="text-3xl font-extrabold text-[#222] mt-1">Free</div>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-full">
              <span className="text-[#5A8DB8] font-semibold">Most Popular</span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Includes:</h3>
            <ul className="space-y-4 text-gray-700 text-base mb-8">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 hover:translate-x-1 transition-transform">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="w-full bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-lg font-semibold py-3 px-4 text-sm sm:text-base"
            onClick={() => navigate('/create-profile/personal-info')}
          >
            Confirm Basic Plan & Create Profile
          </button>
        </div>
        <button
          className="mt-4 border border-[#5A8DB8] text-[#5A8DB8] px-6 py-2.5 rounded-lg hover:bg-[#5A8DB8] hover:text-white transition-all duration-300 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
          onClick={() => navigate('/plans')}
        >
          Go Back to Pricing
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default FreePlan;
