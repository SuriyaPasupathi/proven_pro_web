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
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] drop-shadow">
            Confirm Basic Plan Selection
          </h1>
          <p className="text-gray-600 text-center max-w-xl mx-auto">
            Get started with our basic plan and create your professional profile
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border-2 border-transparent p-6 sm:p-8 w-full max-w-xl mb-8 transform hover:scale-[1.02] transition-all duration-300"
          style={{
            background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #5A8DB8, #3C5979) border-box',
          }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#5A8DB8]">Basic Plan</h2>
              <div className="text-3xl font-extrabold text-[#222] mt-1">Free</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-[#E6F0FA] px-4 py-2 rounded-full shadow-sm">
              <span className="text-[#5A8DB8] font-semibold">Most Popular</span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-[#5A8DB8] mb-4">Basic Features:</h3>
            <ul className="space-y-4 text-gray-700 text-base mb-8">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 hover:translate-x-1 transition-transform group">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="group-hover:text-[#5A8DB8] transition-colors">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="w-full bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-lg font-semibold py-3 px-4 text-sm sm:text-base"
            onClick={() => navigate('/create-profile/personal-info')}
          >
            Confirm Basic Plan & Create Profile
          </button>
        </div>
        <button
          className="mt-4 border-2 border-[#5A8DB8] text-[#5A8DB8] px-6 py-2.5 rounded-lg hover:bg-[#E6F0FA] hover:text-[#5A8DB8] transition-all duration-300 font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5"
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
