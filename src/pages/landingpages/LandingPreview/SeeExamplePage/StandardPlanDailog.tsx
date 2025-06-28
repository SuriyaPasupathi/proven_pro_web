import React from 'react';
import profileImg from '../../../../assets/profilepage.jpg';
import provenLogo from '../../../../assets/provenlogo.png';

interface StandardPlanDialogProps {
  open: boolean;
  onClose: () => void;
}

const StandardPlanDailog: React.FC<StandardPlanDialogProps> = ({ open, onClose }) => {
  const profileUrl = "https://www.mytutsworld.com/john-d-aj11137p";
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 px-2 sm:px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-4 sm:p-6 md:p-8 relative mx-auto overflow-y-auto max-h-[98vh] border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-semibold">Standard Plan</h2>
          <button
            className="text-gray-400 hover:text-[#5A8DB8] text-2xl font-bold absolute top-4 right-4 sm:top-6 sm:right-8 transition-colors duration-200"
            aria-label="Close dialog"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <div className="flex items-center gap-2">
            <img src={provenLogo} alt="ProvenPro Logo" className="h-8 w-auto" />
            <input type="text" className="border rounded px-2 py-1 text-xs w-48" placeholder="Search" readOnly />
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="cursor-default">Write a Review</span>
            <span className="cursor-default">Pricing</span>
            <span className="cursor-default">Contact Us</span>
            <span className="cursor-default">Account</span>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
          {/* Left Side: Profile Image and Card */}
          <div className="flex flex-col items-center md:w-1/3 w-full">
            <div className="w-40 h-48 sm:w-56 sm:h-64 rounded-lg overflow-hidden mb-4 border border-gray-200 shadow-md">
              <img src={profileImg} alt="Profile" className="object-cover w-full h-full" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3 sm:p-4 text-center text-xs sm:text-sm mb-4 shadow-sm">
              "With extensive experience in UX/UI design, I specialize in user research, wireframing, prototyping, and visual design to create intuitive, engaging digital experiences."
            </div>
            <div className="bg-white border rounded-lg p-3 sm:p-4 text-center w-full shadow-sm">
              <div className="font-semibold text-sm sm:text-base">John D.</div>
              <div className="text-xs sm:text-sm">UX / UI Designer</div>
              <div className="text-gray-500 text-xs sm:text-sm">Front End Developer / No Code Builder</div>
            </div>
            <div className="bg-white border rounded-lg p-3 sm:p-4 text-left w-full mt-4 shadow-sm">
              <div className="font-semibold text-xs sm:text-sm mb-1">Languages</div>
              <div className="text-xs sm:text-sm text-gray-700 mb-2">English</div>
              <div className="font-semibold text-xs sm:text-sm mb-1">Categories</div>
              <div className="text-xs sm:text-sm text-gray-700">Art Director<br/>Graphic Designer<br/>UI Designer<br/>UX Designer<br/>Website Designer</div>
            </div>
          </div>
          {/* Right Side: Details */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="text-2xl sm:text-3xl font-bold">John D.</div>
                <div className="text-base sm:text-lg">UX / UI Designer</div>
                <div className="text-gray-500 text-xs sm:text-sm">Front End Developer / No Code Builder</div>
                <div className="mt-1 sm:mt-2 text-green-600 font-semibold text-xs sm:text-base">Profile Verified 100%</div>
              </div>
              <div className="bg-white border rounded-lg p-3 sm:p-4 flex flex-col items-center w-full sm:w-56 mt-2 sm:mt-0 shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-500">5.0</div>
                <div className="text-xs mb-1 sm:mb-2">Exceptional</div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between text-xs"><span>5-star</span><span className="w-2/3 bg-yellow-400 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>4-star</span><span className="w-1/3 bg-gray-300 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>3-star</span><span className="w-1/6 bg-gray-200 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>2-star</span><span className="w-1/12 bg-gray-100 h-1 rounded ml-2"></span></div>
                  <div className="flex items-center justify-between text-xs"><span>1-star</span><span className="w-1/12 bg-gray-100 h-1 rounded ml-2"></span></div>
                </div>
                <div className="text-xs mt-1 sm:mt-2">50 reviews</div>
              </div>
            </div>
            {/* Public Profile URL */}
            <div>
              <div className="font-semibold text-xs sm:text-base">Public profile & URL</div>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="border rounded-l px-2 py-1 w-full text-xs sm:text-sm bg-gray-50"
                />
                <button
                  className="bg-gray-300 px-3 py-1 rounded-r text-xs sm:text-sm ml-1 text-gray-600 font-semibold cursor-default"
                  type="button"
                  disabled
                >
                  copy
                </button>
              </div>
            </div>
            {/* Reviews */}
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
              <div className="bg-white border rounded-lg p-2 flex-1 min-w-[180px]">
                <div className="font-semibold text-xs">Ana Wright</div>
                <div className="text-xs text-gray-500 mb-1">CEO @ Startup</div>
                <div className="text-xs">Lorem ipsum dolor sit amet. Et unde quisquam et facilis nisi sed explicabo nemo est eaque incidunt exed deserunt harum velit sunt velit ipsum in ducimus cupiditate.</div>
              </div>
              <div className="bg-white border rounded-lg p-2 flex-1 min-w-[180px]">
                <div className="font-semibold text-xs">Byron Robertson</div>
                <div className="text-xs text-gray-500 mb-1">COO @ Startup Inc.</div>
                <div className="text-xs">Lorem ipsum dolor sit amet. Et unde quisquam et facilis nisi sed explicabo nemo est eaque incidunt exed deserunt harum velit sunt velit ipsum in ducimus cupiditate.</div>
              </div>
              <div className="bg-white border rounded-lg p-2 flex-1 min-w-[180px]">
                <div className="font-semibold text-xs">April Thomson</div>
                <div className="text-xs text-gray-500 mb-1">Consultant | Digital Studio</div>
                <div className="text-xs">Lorem ipsum dolor sit amet. Et unde quisquam et facilis nisi sed explicabo nemo est eaque incidunt exed deserunt harum velit sunt velit ipsum in ducimus cupiditate.</div>
              </div>
            </div>
            {/* Services */}
            <div>
              <div className="font-semibold text-xs sm:text-base">Services:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                3D Design • Animation • Ad Design • Brand Design • Graphic Design • Illustration • Logo Design • UX Research • User Experience Design (UED) • Web Design
              </div>
              <div className="text-xs text-gray-500 mt-1">Show all services →</div>
            </div>
            {/* Experience */}
            <div>
              <div className="font-semibold text-xs sm:text-base">Experience:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                <div>July 2022 - Present &nbsp; <b>WEBA PTY LTD</b> - QUEENSLAND, AUSTRALIA<br/>UX / UI Designer . Senior Graphic Designer<br/>Freelancer</div>
                <div className="mt-1">July 2022 - Present &nbsp; <b>WEBA PTY LTD</b> - QUEENSLAND, AUSTRALIA<br/>UX / UI Designer . Senior Graphic Designer<br/>Freelancer</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Show all experiences →</div>
            </div>
            {/* Skills */}
            <div>
              <div className="font-semibold text-xs sm:text-base">Skills:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Prototyping • Wireframing • Desktop App Design • Mobile App Design • HTML / CSS • Illustration • Logo Design • UX Research • User Experience Design (UED) • Web Design
              </div>
              <div className="text-xs text-gray-500 mt-1">Show all skills →</div>
            </div>
            {/* Tools */}
            <div>
              <div className="font-semibold text-xs sm:text-base">Tools:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Figma • Animation • Adobe Photoshop • Adobe Illustrator • After Effects • InDesign • Blender
              </div>
            </div>
          </div>
        </div>
        {/* Footer Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-[#3C5979] text-white px-8 py-2 rounded font-semibold text-lg shadow hover:bg-[#5A8DB8] transition-all duration-200 cursor-default" disabled>
            Select Standard
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandardPlanDailog;
