import React, { useState } from 'react';
import provenLogo from '../../../../assets/logo.png';

const portfolioImages = [
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop',
];

interface PremiumPlanDialogProps {
  open: boolean;
  onClose: () => void;
}

const PremiumPlanDailog: React.FC<PremiumPlanDialogProps> = ({ open, onClose }) => {
  const [copied, setCopied] = useState(false);
  const profileUrl = "https://provenpro.net/emily-p-qe111485/";
  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30 px-1 sm:px-2">
     
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl p-0 sm:p-0 md:p-0 relative mx-auto overflow-y-auto max-h-[98vh] border border-gray-300">
        {/* Navbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 py-2 sm:py-3 border-b border-gray-200 bg-[#F7F9FB] rounded-t-lg gap-2 sm:gap-0">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <img src={provenLogo} alt="ProvenPro Logo" className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="font-bold text-base sm:text-lg text-[#5A8DB8]">ProvenPro</span>
          </div>
          <div className="w-full sm:w-auto flex justify-center my-2 sm:my-0">
            <input type="text" placeholder="Search" className="border border-gray-300 rounded px-2 sm:px-3 py-1 w-full max-w-xs sm:w-64 text-xs sm:text-sm focus:ring-2 focus:ring-[#5A8DB8]" readOnly />
          </div>
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-end">
            <a href="#" className="hover:text-[#5A8DB8] font-medium cursor-pointer">Write a Review</a>
            <a href="#" className="hover:text-[#5A8DB8] font-medium cursor-pointer">Pricing</a>
            <a href="#" className="hover:text-[#5A8DB8] font-medium cursor-pointer">Contact Us</a>
            <a href="#" className="hover:text-[#5A8DB8] font-medium flex items-center gap-1 cursor-pointer"><span className="material-icons"></span>Account</a>
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
          <h2 className="text-base sm:text-lg md:text-2xl font-semibold text-gray-700">Premium Plan</h2>
        </div>
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-6 md:gap-8 px-2 sm:px-6 pb-4 sm:pb-6">
          {/* Left Side: Profile Image and Card */}
          <div className="flex flex-col items-center md:w-1/3 w-full">
            <div className="w-28 h-36 sm:w-40 sm:h-48 md:w-48 md:h-56 rounded-lg overflow-hidden mb-3 sm:mb-4 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" alt="Profile" className="object-cover w-full h-full" />
            </div>
            <div className="bg-gray-100 rounded-lg p-2 sm:p-3 md:p-4 text-center text-xs sm:text-sm mb-3 sm:mb-4 shadow-sm hover:shadow-md transition-all duration-300">
              Creative visual designer with 7+ years of experience helping startups and brands build standout visual identities and marketing assets. I handle projects from concept to delivery, combining strong design skill with strategic thinking to ensure brand impact and consistency.
            </div>
            <div className="bg-white border rounded-lg p-2 sm:p-3 md:p-4 text-center w-full shadow-sm hover:shadow-md transition-all duration-300">
              <div className="font-semibold text-xs sm:text-sm md:text-base text-[#5A8DB8]">Emily Parker</div>
              <div className="text-[#5A8DB8] text-xs sm:text-sm">Senior Graphic Designer & Brand Specialist</div>
            </div>
            {/* Premium Left Details */}
            <div className="bg-white border rounded-lg p-2 sm:p-3 md:p-4 text-left w-full mt-3 sm:mt-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 sm:gap-4">
              <div>
                <div className="font-semibold text-xs sm:text-sm mb-1">Video Introduction <span className="text-gray-400">(Optional)</span></div>
                <div className="w-full aspect-video bg-gray-200 rounded flex items-center justify-center mb-2">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12">
                    <circle cx="12" cy="12" r="12" fill="#e5e7eb"/>
                    <polygon points="10,8 16,12 10,16" fill="#9ca3af"/>
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm mb-1">Education</div>
                <div className="text-xs sm:text-sm text-gray-700 mb-2">B.A. In Graphic Design<br/>Savannah College Of Art And Design (SCAD)<br/>2012 – 2016</div>
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm mb-1">Licenses / Certifications</div>
                <div className="text-xs sm:text-sm text-gray-700 mb-2">
                  <b>Adobe Certified Professional</b> – Visual Design Using Adobe Photoshop<br/>
                  Adobe | Issued May 2023<br/><br/>
                  <b>Brand Strategy Fundamentals</b><br/>
                  The Future Academy | Issued October 2022
                </div>
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm mb-1">Languages</div>
                <div className="text-xs sm:text-sm text-gray-700 mb-2">English</div>
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm mb-1">Categories</div>
                <div className="text-xs sm:text-sm text-gray-700">Art Director<br/>Graphic Designer</div>
              </div>
            </div>
          </div>
          {/* Right Side: Details */}
          <div className="flex-1 flex flex-col gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="text-lg sm:text-xl md:text-3xl font-bold text-gray-800">Emily Parker</div>
                <div className="text-gray-700 text-sm sm:text-base md:text-lg">Senior Graphic Designer & Brand Specialist</div>
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
            {/* Reviews */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mt-2">
              <div className="bg-white border rounded-lg p-2 flex-1 min-w-[160px] sm:min-w-[180px]">
                <div className="font-semibold text-xs">Sarah T.</div>
                <div className="text-xs text-gray-500 mb-1">CEO, Sun & Sea Co.</div>
                <div className="text-xs">"Emily brought our brand to life with stunning, cohesive visuals. She nailed every detail and delivered on time—highly recommend!"</div>
              </div>
              <div className="bg-white border rounded-lg p-2 flex-1 min-w-[160px] sm:min-w-[180px]">
                <div className="font-semibold text-xs">David M.</div>
                <div className="text-xs text-gray-500 mb-1">CFO, NextTech</div>
                <div className="text-xs">"Emily's designs were clean, on-brand, and impactful. Fast, reliable, and a total pro. Will definitely work with her again."</div>
              </div>
              <div className="bg-white border rounded-lg p-2 flex-1 min-w-[160px] sm:min-w-[180px]">
                <div className="font-semibold text-xs">Jess R.</div>
                <div className="text-xs text-gray-500 mb-1">Manager, Bloom Market</div>
                <div className="text-xs">"Emily revamped our logo and brand visuals perfectly. Easy to work with and delivered top-quality work every time."</div>
              </div>
            </div>
            {/* Services */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-gray-700">Services:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Graphic Design · Logo Design · Ad Design · Brand Identity Design
              </div>
              <div className="text-xs text-[#5A8DB8] mt-1 cursor-pointer hover:text-[#3C5979] transition-colors duration-200">Show all services →</div>
            </div>
            {/* Experience */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-gray-700">Experience:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                <div>Jun 2021 – June 2024 &nbsp; <b>BRIGHTNEST CREATIVE AGENCY</b> – HEMPSTEAD, TEXAS<br/>Senior Graphic Designer</div>
                <div className="mt-1">July 2022 – Present &nbsp; <b>BRIGHT SKY MARKETING</b> – MELBOURNE, AUSTRALIA<br/>Graphic Designer & Visual Brand Consultant<br/>Freelancer</div>
              </div>
              <div className="text-xs text-[#5A8DB8] mt-1 cursor-pointer hover:text-[#3C5979] transition-colors duration-200">Show all experiences →</div>
            </div>
            {/* Skills */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-gray-700">Skills:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Adobe Photoshop · Adobe Illustrator · Adobe InDesign · Figma
              </div>
              <div className="text-xs text-[#5A8DB8] mt-1 cursor-pointer hover:text-[#3C5979] transition-colors duration-200">Show all skills →</div>
            </div>
            {/* Tools */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-gray-700">Tools:</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1">
                Adobe Photoshop · Adobe Illustrator · After Effects · InDesign · Canva · Figma
              </div>
            </div>
            {/* Portfolio */}
            <div>
              <div className="font-semibold text-xs sm:text-base text-gray-700 mt-3 sm:mt-4">Portfolio:</div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                {portfolioImages.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Portfolio ${idx+1}`} 
                    className="w-full sm:w-24 md:w-28 lg:w-32 h-20 sm:h-18 md:h-20 lg:h-24 object-cover rounded border" 
                  />
                ))}
              </div>
            </div>
          
          </div>
        </div>
          {/* Footer Button */}
          <div className="flex justify-center mt-6 sm:mt-8 mb-6">
              <button className="px-6 sm:px-8 py-2 rounded bg-[#5A8DB8] hover:bg-[#3C5979] text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md w-full max-w-xs">
                Select Premium
              </button>
            </div>
      </div>
    </div>
  );
};

export default PremiumPlanDailog;
