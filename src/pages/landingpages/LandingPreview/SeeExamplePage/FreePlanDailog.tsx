import React, { useState } from 'react';
import logo from '../../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

interface FreePlanDialogProps {
  open: boolean;
  onClose: () => void;
}

const FreePlanDailog: React.FC<FreePlanDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
  const profileUrl = "https://provenpro.net/sophie-l-qa11137ru/";
  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30 px-1 sm:px-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-0 sm:p-0 md:p-0 relative mx-auto overflow-y-auto max-h-[98vh] transform hover:scale-[1.01] transition-all duration-300">
        {/* Navbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-2 sm:py-3 border-b border-gray-200 bg-[#F7F9FB] rounded-t-lg gap-2 sm:gap-0">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <img src={logo} alt="ProvenPro Logo" className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="font-bold text-base sm:text-lg text-[#5A8DB8]">ProvenPro</span>
          </div>
          <div className="w-full sm:w-auto flex justify-center my-2 sm:my-0">
            <input type="text" placeholder="Search" className="border border-gray-300 rounded px-2 sm:px-3 py-1 w-full max-w-xs sm:w-64 text-xs sm:text-sm focus:ring-2 focus:ring-[#5A8DB8]" />
          </div>
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-end">
            <a href="#" className="hover:text-[#5A8DB8] font-medium">Write a Review</a>
            <a href="#" className="hover:text-[#5A8DB8] font-medium">Pricing</a>
            <a href="#" className="hover:text-[#5A8DB8] font-medium">Contact Us</a>
            <a href="#" className="hover:text-[#5A8DB8] font-medium flex items-center gap-1"><span className="material-icons"></span>Account</a>
          </div>
          <button
            className="text-gray-400 hover:text-[#5A8DB8] text-2xl font-bold ml-0 sm:ml-4 transition-colors duration-200 absolute top-2 right-2 sm:static"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        {/* Header */}
        <div className="px-2 sm:px-6 pt-3 pb-2">
          <h2 className="text-base sm:text-lg md:text-2xl font-semibold text-gray-700">Basic Plan</h2>
        </div>
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-6 md:gap-8 px-2 sm:px-6 pb-4 sm:pb-6">
          {/* Left Side: Profile Image and Card */}
          <div className="flex flex-col items-center md:w-1/3 w-full">
            <div className="w-28 h-36 sm:w-40 sm:h-48 md:w-48 md:h-56 rounded-lg overflow-hidden mb-3 sm:mb-4 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" alt="Profile" className="object-cover w-full h-full" />
            </div>
            <div className="bg-gray-100 rounded-lg p-2 sm:p-3 md:p-4 text-center text-xs sm:text-sm mb-3 sm:mb-4 shadow-sm hover:shadow-md transition-all duration-300">
              With over 7 years of experience supporting executives and fast-moving teams, I help streamline operations so you can focus on what matters most. I bring a blend of professionalism, discretion, and efficiency to every task—always with an eye for detail. Whether you're scaling a business or optimizing a team, I provide reliable, tailored support to keep things running smoothly.
            </div>
            <div className="bg-white border rounded-lg p-2 sm:p-3 md:p-4 text-center w-full shadow-sm hover:shadow-md transition-all duration-300">
              <div className="font-semibold text-xs sm:text-sm md:text-base text-[#5A8DB8]">Sophie Lane</div>
              <div className="text-[#5A8DB8] text-xs sm:text-sm">Virtual Executive Assistant & Remote Productivity Specialist</div>
            </div>
          </div>
          {/* Right Side: Details */}
          <div className="flex-1 flex flex-col gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="text-lg sm:text-xl md:text-3xl font-bold text-gray-800">Sophie Lane</div>
                <div className="text-gray-700 text-sm sm:text-base md:text-lg">Virtual Executive Assistant & Remote Productivity Specialist</div>
                <div className="mt-1 sm:mt-2 text-green-600 font-semibold text-xs sm:text-base">Profile Verified 100%</div>
              </div>
              <div className="bg-[#F7F9FB] border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 flex flex-col items-center w-full sm:w-48 mt-2 sm:mt-0 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-lg sm:text-xl md:text-3xl font-bold text-yellow-500">5.0</div>
                <div className="text-xs text-gray-700 mb-1 sm:mb-2">Exceptional</div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between text-xs"><span>5-star</span><span className="w-2/3 bg-yellow-400 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>4-star</span><span className="w-1/3 bg-gray-300 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>3-star</span><span className="w-1/6 bg-gray-200 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>2-star</span><span className="w-1/12 bg-gray-100 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>1-star</span><span className="w-1/12 bg-gray-100 h-1 rounded ml-2"></span></div>
                </div>
                <div className="text-xs text-gray-700 mt-1 sm:mt-2">50 reviews</div>
              </div>
            </div>
            {/* Public Profile URL */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-gray-700">Public profile & URL</div>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="border border-gray-300 rounded-l px-2 py-1 w-full text-xs sm:text-sm bg-gray-50 focus:ring-2 focus:ring-[#5A8DB8] transition-all duration-200"
                />
                <button
                  className={`bg-[#5A8DB8] px-2 sm:px-3 py-1 rounded-r text-xs sm:text-sm hover:bg-[#3C5979] ml-1 text-white font-semibold transition-all duration-200 ${copied ? 'bg-green-600' : ''}`}
                  onClick={handleCopy}
                  type="button"
                >
                  {copied ? 'Copied!' : 'copy'}
                </button>
              </div>
            </div>
            {/* Services */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-gray-700">Services:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Administrative Support · Calendar Management · Scheduling · Travel Planning & Booking · Client/Customer Support
              </div>
              <div className="text-xs text-[#5A8DB8] mt-1 cursor-pointer hover:text-[#3C5979] transition-colors duration-200">Show all services →</div>
            </div>
            {/* Skills */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-gray-700">Skills:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Email Management · Virtual Assistance · Calendar Management · Scheduling · Data Entry · Administrative Support · Customer Service & Support
              </div>
              <div className="text-xs text-[#5A8DB8] mt-1 cursor-pointer hover:text-[#3C5979] transition-colors duration-200">Show all skills →</div>
            </div>
            {/* Tools */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-gray-700">Tools:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Google Workspace · Microsoft Office · HubSpot · Salesforce · Canva
              </div>
            </div>
            
            
          </div>
        </div>
        {/* Footer Button */}
        <div className="flex justify-center mt-6 sm:mt-8 mb-6">
              <button
               className="px-6 sm:px-8 py-2 rounded bg-[#5A8DB8] hover:bg-[#3C5979] text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md w-full max-w-xs"
               onClick={() => navigate('/login')}
               >
                Select Basic
              </button>
            </div>
      </div>
    </div>
  );
};

export default FreePlanDailog;
