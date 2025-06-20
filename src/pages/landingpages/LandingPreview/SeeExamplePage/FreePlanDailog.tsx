import React, { useState } from 'react';
import profileImg from '../../../../assets/profilepage.jpg';

interface FreePlanDialogProps {
  open: boolean;
  onClose: () => void;
}

const FreePlanDailog: React.FC<FreePlanDialogProps> = ({ open, onClose }) => {
  const [copied, setCopied] = useState(false);
  const profileUrl = "http://www.mytutsworld.com/john-d-aj11137p";
  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30 px-2 sm:px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-4 sm:p-6 md:p-8 relative mx-auto overflow-y-auto max-h-[95vh] transform hover:scale-[1.01] transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold text-[#5A8DB8]">Basic Profile Preview</h2>
          <button
            className="text-gray-400 hover:text-[#5A8DB8] text-2xl font-bold absolute top-4 right-4 sm:top-6 sm:right-8 transition-colors duration-200"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
          {/* Left Side: Profile Image and Card */}
          <div className="flex flex-col items-center md:w-1/3 w-full">
            <div className="w-32 h-40 sm:w-48 sm:h-56 rounded-lg overflow-hidden mb-4 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
              <img src={profileImg} alt="Profile" className="object-cover w-full h-full" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3 sm:p-4 text-center text-xs sm:text-sm mb-4 shadow-sm hover:shadow-md transition-all duration-300">
              "With extensive experience in UX/UI design, I specialize in user research, wireframing, prototyping, and visual design to create intuitive, engaging digital experiences."
            </div>
            <div className="bg-white border rounded-lg p-3 sm:p-4 text-center w-full shadow-sm hover:shadow-md transition-all duration-300">
              <div className="font-semibold text-sm sm:text-base text-[#5A8DB8]">John D.</div>
              <div className="text-[#5A8DB8] text-xs sm:text-sm">UX / UI Designer</div>
              <div className="text-gray-500 text-xs sm:text-sm">Front End Developer / No Code Builder</div>
            </div>
          </div>
          {/* Right Side: Details */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="text-xl sm:text-3xl font-bold text-[#5A8DB8]">John D.</div>
                <div className="text-[#5A8DB8] text-base sm:text-lg">UX / UI Designer</div>
                <div className="text-gray-500 text-xs sm:text-sm">Front End Developer / No Code Builder</div>
                <div className="mt-1 sm:mt-2 text-green-600 font-semibold text-xs sm:text-base">Profile Verified 100%</div>
              </div>
              <div className="bg-[#E6F0FA] border border-[#5A8DB8] rounded-lg p-3 sm:p-4 flex flex-col items-center w-full sm:w-48 mt-2 sm:mt-0 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-xl sm:text-3xl font-bold text-yellow-500">5.0</div>
                <div className="text-xs text-[#5A8DB8] mb-1 sm:mb-2">Exceptional</div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between text-xs"><span>5-star</span><span className="w-2/3 bg-yellow-400 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>4-star</span><span className="w-1/3 bg-gray-300 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>3-star</span><span className="w-1/6 bg-gray-200 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>2-star</span><span className="w-1/12 bg-gray-100 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>1-star</span><span className="w-1/12 bg-gray-100 h-1 rounded ml-2"></span></div>
                </div>
                <div className="text-xs text-[#5A8DB8] mt-1 sm:mt-2">50 reviews</div>
              </div>
            </div>
            {/* Public Profile URL */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-[#5A8DB8]">Public profile & URL</div>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="border border-[#5A8DB8] rounded-l px-2 py-1 w-full text-xs sm:text-sm bg-gray-50 focus:ring-2 focus:ring-[#5A8DB8] transition-all duration-200"
                />
                <button
                  className={`bg-[#5A8DB8] px-3 py-1 rounded-r text-xs sm:text-sm hover:bg-[#3C5979] ml-1 text-white font-semibold transition-all duration-200 ${copied ? 'bg-green-600' : ''}`}
                  onClick={handleCopy}
                  type="button"
                >
                  {copied ? 'Copied!' : 'copy'}
                </button>
              </div>
            </div>
            {/* Services */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-[#5A8DB8]">Services:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                3D Design • Animation • Ad Design • Brand Design • Graphic Design • Illustration • Logo Design • UX Research • User Experience Design (UED) • Web Design
              </div>
              <div className="text-xs text-[#5A8DB8] mt-1 cursor-pointer hover:text-[#3C5979] transition-colors duration-200">Show all services →</div>
            </div>
            {/* Skills */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-[#5A8DB8]">Skills:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Prototyping • Wireframing • Desktop App Design • Mobile App Design • HTML / CSS • Illustration • Logo Design • UX Research • User Experience Design (UED) • Web Design
              </div>
              <div className="text-xs text-[#5A8DB8] mt-1 cursor-pointer hover:text-[#3C5979] transition-colors duration-200">Show all skills →</div>
            </div>
            {/* Tools */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-[#5A8DB8]">Tools:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Figma • Animation • Adobe Photoshop • Adobe Illustrator • After Effects • InDesign • Blender
              </div>
            </div>
            {/* Footer Buttons */}
            {/* <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4 sm:mt-6">
              <button
                className="px-4 sm:px-6 py-2 rounded border border-[#5A8DB8] bg-white text-[#5A8DB8] hover:bg-[#E6F0FA] text-xs sm:text-base font-semibold transition-all duration-200 hover:-translate-y-0.5"
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button 
                className="px-4 sm:px-6 py-2 rounded bg-[#5A8DB8] hover:bg-[#3C5979] text-white font-semibold text-xs sm:text-base transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md" 
                onClick={() => navigate('/free-plan')}
              >
                Continue to Checkout
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreePlanDailog;
