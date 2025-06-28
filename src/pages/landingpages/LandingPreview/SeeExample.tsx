import React, { useState } from 'react';
import Header from '../../../components/layout/header';
import Footer from './Footer';
import { FaStar, FaGem, FaRocket } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
import FreePlanDailog from './SeeExamplePage/FreePlanDailog';
import StandardPlanDailog from './SeeExamplePage/StandardPlanDailog';
import PremiumPlanDailog from './SeeExamplePage/PremiumPlanDailog';

interface ProfileCardProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  planLabel: string;
  selectLabel: string;
  badge: React.ReactNode;
  highlight?: boolean;
  onSelect?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  image,
  title,
  subtitle,
  description,
  planLabel,
  selectLabel,
  badge,
  highlight,
  onSelect,
}) => {
  let borderClass = 'border-gray-200';
  let cardStyle = {};
  
  if (highlight) {
    borderClass = 'border-transparent';
    cardStyle = {
      background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #FFD700, #FFA500) border-box',
      border: '2px solid transparent',
    };
  } else if (title === 'Standard Example') {
    borderClass = 'border-[#5A8DB8]';
  }

  return (
    <div
      className={`relative flex flex-col items-center bg-white rounded-xl shadow-md border transition-all duration-300 ${borderClass} hover:shadow-xl hover:-translate-y-2 w-full max-w-sm mx-auto`}
      style={cardStyle}
    >
      {/* Badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 transform hover:scale-105 transition-transform duration-200">{badge}</div>
      <div className="w-full flex flex-col items-center pt-8 pb-4 px-4">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-3 group">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-md group-hover:shadow-lg transition-all duration-300"
          />
          {highlight && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
          <div
            className="absolute bottom-0 left-0 w-full h-8 bg-[#5A8DB8] rounded-b-full transition-opacity duration-300 group-hover:opacity-90"
            style={{
              clipPath: 'polygon(0 60%, 100% 0, 100% 100%, 0% 100%)',
              opacity: 0.7,
            }}
          ></div>
        </div>
        <h3 className={`font-bold text-lg mb-1 transition-colors duration-200 ${highlight ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-900 hover:text-[#5A8DB8]'}`}>{title}</h3>
        <p className={`text-sm font-medium mb-1 ${highlight ? 'text-yellow-600' : 'text-[#5A8DB8]'}`}>{subtitle}</p>
        <p className="text-gray-500 text-sm mb-4 text-center">{description}</p>
        <div className="flex w-full gap-2 mt-auto">
          <button
            className={`flex-1 px-3 py-2 rounded-lg font-medium cursor-default shadow-sm whitespace-nowrap text-xs sm:text-sm transition-all duration-200 ${
              highlight 
                ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' 
                : 'bg-[#E6F0FA] text-[#5A8DB8] border border-[#5A8DB8]'
            }`}
            disabled
          >
            {planLabel}
          </button>
          <button
            className={`flex-1 text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-lg font-semibold whitespace-nowrap text-xs sm:text-sm ${
              highlight
                ? 'bg-yellow-400 hover:bg-yellow-500'
                : 'bg-[#5A8DB8] hover:bg-[#3C5979]'
            }`}
            style={{ border: highlight ? '1px solid #FFD700' : '1px solid #5A8DB8' }}
            onClick={onSelect}
          >
            {selectLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const SeeExample: React.FC = () => {
  const [showFreeDialog, setShowFreeDialog] = useState(false);
  const [showStandardDialog, setShowStandardDialog] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const profiles = [
    {
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      title: 'Basic Example',
      subtitle: 'UI/UX Designer',
      description: 'A basic profile showcasing essential information and reviews.',
      planLabel: 'Basic Plan',
      selectLabel: 'Select Basic',
      badge: (
        <span className="flex items-center gap-1 bg-blue-100 text-[#5A8DB8] px-3 py-1 rounded-full text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200">
          <FaStar className="text-yellow-400" /> Basic
        </span>
      ),
      highlight: false,
      onSelect: () => setShowFreeDialog(true),
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Standard Example',
      subtitle: 'Front End Developer',
      description:
        'A standard profile with additional features like languages and categories.',
      planLabel: 'Standard Plan',
      selectLabel: 'Select Standard',
      badge: (
        <span className="flex items-center gap-1 bg-blue-100 text-[#5A8DB8] px-3 py-1 rounded-full text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200">
          <FaGem className="text-blue-500" /> Standard
        </span>
      ),
      highlight: false,
      onSelect: () => setShowStandardDialog(true),
    },
    {
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      title: 'Premium Example',
      subtitle: 'Senior Designer',
      description:
        'A complete profile with all premium features including portfolio and video.',
      planLabel: 'Premium Plan',
      selectLabel: 'Select Premium',
      badge: (
        <span className="flex items-center gap-1 bg-yellow-200 hover:bg-yellow-500 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200">
          <FaRocket className="text-yellow-500" /> Premium
        </span>
      ),
      highlight: true,
      onSelect: () => setShowPremiumDialog(true),
    },
  ];

  return (
        <>
      <Header />
      <main className="flex-grow">
        <div className="relative py-8 px-2 sm:py-12 sm:px-4 md:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235A8DB8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          {/* Content Container */}
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A8DB8] drop-shadow">
                Example Profiles
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Choose from our professionally designed profile templates to showcase your expertise
              </p>
            </div>
            <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {profiles.map((profile, idx) => (
                <ProfileCard key={idx} {...profile} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FreePlanDailog open={showFreeDialog} onClose={() => setShowFreeDialog(false)} />
      <StandardPlanDailog open={showStandardDialog} onClose={() => setShowStandardDialog(false)} />
      <PremiumPlanDailog open={showPremiumDialog} onClose={() => setShowPremiumDialog(false)} />
    </>
  );
};

export default SeeExample;
