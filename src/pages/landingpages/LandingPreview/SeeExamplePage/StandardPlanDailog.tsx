import React from 'react';
import profileImg from '../../../../assets/client.jpg';
import provenLogo from '../../../../assets/provenlogo.png';

interface StandardPlanDialogProps {
  open: boolean;
  onClose: () => void;
}

const StandardPlanDailog: React.FC<StandardPlanDialogProps> = ({ open, onClose }) => {
  const profileUrl = "https://www.mytutsworld.com/john-d-aj11137p";
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 px-2 sm:px-4 lg:px-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl p-3 sm:p-4 md:p-6 lg:p-8 relative mx-auto overflow-y-auto max-h-[95vh] lg:max-h-[90vh] border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">Standard Plan</h2>
          <button
            className="text-gray-400 hover:text-[#5A8DB8] text-xl sm:text-2xl lg:text-3xl font-bold absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 transition-colors duration-200"
            aria-label="Close dialog"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2 mb-3 sm:mb-4 gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <img src={provenLogo} alt="ProvenPro Logo" className="h-6 sm:h-7 md:h-8 w-auto" />
            <input type="text" className="border rounded px-2 py-1 text-xs w-32 sm:w-40 md:w-48" placeholder="Search" readOnly />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs">
            <span className="cursor-default">Write a Review</span>
            <span className="cursor-default">Pricing</span>
            <span className="cursor-default">Contact Us</span>
            <span className="cursor-default">Account</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Left Side: Profile Image and Card */}
          <div className="flex flex-col items-center lg:w-1/3 w-full">
            <div className="w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-56 lg:w-56 lg:h-64 rounded-lg overflow-hidden mb-3 sm:mb-4 border border-gray-200 shadow-md">
              <img src={profileImg} alt="Profile" className="object-cover w-full h-full" />
            </div>
            <div className="bg-gray-100 rounded-lg p-2 sm:p-3 md:p-4 text-center text-xs sm:text-sm mb-3 sm:mb-4 shadow-sm">
              "With extensive experience in UX/UI design, I specialize in user research, wireframing, prototyping, and visual design to create intuitive, engaging digital experiences."
            </div>
            <div className="bg-white border rounded-lg p-2 sm:p-3 md:p-4 text-center w-full shadow-sm">
              <div className="font-semibold text-xs sm:text-sm md:text-base">John D.</div>
              <div className="text-xs sm:text-sm">UX / UI Designer</div>
              <div className="text-gray-500 text-xs sm:text-sm">Front End Developer / No Code Builder</div>
            </div>
            <div className="bg-white border rounded-lg p-2 sm:p-3 md:p-4 text-left w-full mt-3 sm:mt-4 shadow-sm">
              <div className="font-semibold text-xs sm:text-sm mb-1">Languages</div>
              <div className="text-xs sm:text-sm text-gray-700 mb-2">English</div>
              <div className="font-semibold text-xs sm:text-sm mb-1">Categories</div>
              <div className="text-xs sm:text-sm text-gray-700">Art Director<br/>Graphic Designer<br/>UI Designer<br/>UX Designer<br/>Website Designer</div>
            </div>
          </div>
          
          {/* Right Side: Details */}
          <div className="flex-1 flex flex-col gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">John D.</div>
                <div className="text-sm sm:text-base md:text-lg">UX / UI Designer</div>
                <div className="text-gray-500 text-xs sm:text-sm">Front End Developer / No Code Builder</div>
                <div className="mt-1 sm:mt-2 text-green-600 font-semibold text-xs sm:text-sm md:text-base">Profile Verified 100%</div>
              </div>
              <div className="bg-white border rounded-lg p-2 sm:p-3 md:p-4 flex flex-col items-center w-full lg:w-56 mt-2 lg:mt-0 shadow-sm">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-500">5.0</div>
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
              <div className="font-semibold text-xs sm:text-sm md:text-base">Public profile & URL</div>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="border rounded-l px-2 py-1 w-full text-xs sm:text-sm bg-gray-50"
                />
                <button
                  className="bg-gray-300 px-2 sm:px-3 py-1 rounded-r text-xs sm:text-sm ml-1 text-gray-600 font-semibold cursor-default"
                  type="button"
                  disabled
                >
                  copy
                </button>
              </div>
            </div>
            
            {/* Reviews */}
            <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
              <div className="bg-white border rounded-lg p-2 flex-1 min-w-[160px] sm:min-w-[180px]">
                <div className="font-semibold text-xs">Ana Wright</div>
                <div className="text-xs text-gray-500 mb-1">CEO @ Startup</div>
                <div className="text-xs">Lorem ipsum dolor sit amet. Et unde quisquam et facilis nisi sed explicabo nemo est eaque incidunt exed deserunt harum velit sunt velit ipsum in ducimus cupiditate.</div>
              </div>
              <div className="bg-white border rounded-lg p-2 flex-1 min-w-[160px] sm:min-w-[180px]">
                <div className="font-semibold text-xs">Byron Robertson</div>
                <div className="text-xs text-gray-500 mb-1">COO @ Startup Inc.</div>
                <div className="text-xs">Lorem ipsum dolor sit amet. Et unde quisquam et facilis nisi sed explicabo nemo est eaque incidunt exed deserunt harum velit sunt velit ipsum in ducimus cupiditate.</div>
              </div>
              <div className="bg-white border rounded-lg p-2 flex-1 min-w-[160px] sm:min-w-[180px]">
                <div className="font-semibold text-xs">April Thomson</div>
                <div className="text-xs text-gray-500 mb-1">Consultant | Digital Studio</div>
                <div className="text-xs">Lorem ipsum dolor sit amet. Et unde quisquam et facilis nisi sed explicabo nemo est eaque incidunt exed deserunt harum velit sunt velit ipsum in ducimus cupiditate.</div>
              </div>
            </div>
            
            {/* Services */}
            <div>
              <div className="font-semibold text-xs sm:text-sm md:text-base">Services:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                3D Design • Animation • Ad Design • Brand Design • Graphic Design • Illustration • Logo Design • UX Research • User Experience Design (UED) • Web Design
              </div>
              <div className="text-xs text-gray-500 mt-1">Show all services →</div>
            </div>
            
            {/* Experience */}
            <div>
              <div className="font-semibold text-xs sm:text-sm md:text-base">Experience:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                <div>July 2022 - Present &nbsp; <b>WEBA PTY LTD</b> - QUEENSLAND, AUSTRALIA<br/>UX / UI Designer . Senior Graphic Designer<br/>Freelancer</div>
                <div className="mt-1">July 2022 - Present &nbsp; <b>WEBA PTY LTD</b> - QUEENSLAND, AUSTRALIA<br/>UX / UI Designer . Senior Graphic Designer<br/>Freelancer</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Show all experiences →</div>
            </div>
            
            {/* Skills */}
            <div>
              <div className="font-semibold text-xs sm:text-sm md:text-base">Skills:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Prototyping • Wireframing • Desktop App Design • Mobile App Design • HTML / CSS • Illustration • Logo Design • UX Research • User Experience Design (UED) • Web Design
              </div>
              <div className="text-xs text-gray-500 mt-1">Show all skills →</div>
            </div>
            
            {/* Tools */}
            <div>
              <div className="font-semibold text-xs sm:text-sm md:text-base">Tools:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Figma • Animation • Adobe Photoshop • Adobe Illustrator • After Effects • InDesign • Blender
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Button */}
        {/* <div className="flex justify-center mt-6 sm:mt-8">
          <button className="bg-[#3C5979] text-white px-6 sm:px-8 py-2 sm:py-3 rounded font-semibold text-base sm:text-lg shadow hover:bg-[#5A8DB8] transition-all duration-200 cursor-default" disabled>
            Select Standard
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default StandardPlanDailog;
