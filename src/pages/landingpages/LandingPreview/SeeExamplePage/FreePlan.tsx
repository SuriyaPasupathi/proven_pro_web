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
      <main className="flex-grow flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#5A8DB8] drop-shadow">
          Confirm Basic Plan Selection
        </h1>
        <div className="bg-white rounded-2xl shadow-lg border p-8 w-full max-w-xl mb-8">
          <h2 className="text-2xl font-bold mb-2 text-[#5A8DB8]">Basic Plan</h2>
          <div className="text-3xl font-extrabold text-[#222] mb-4">Free</div>
          <h3 className="font-semibold mb-2">Includes:</h3>
          <ul className="space-y-3 text-gray-700 text-base mb-8">
            {planFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            className="w-full bg-[#5A8DB8] text-white font-semibold py-3 rounded-lg transition hover:bg-[#3C5979] shadow"
            onClick={() => navigate('/create-profile/personal-info')}
          >
            Confirm Basic Plan & Create Profile
          </button>
        </div>
        <button
          className="border border-[#5A8DB8] text-[#5A8DB8] px-6 py-2 rounded-lg hover:bg-[#5A8DB8] hover:text-white transition font-semibold shadow"
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
