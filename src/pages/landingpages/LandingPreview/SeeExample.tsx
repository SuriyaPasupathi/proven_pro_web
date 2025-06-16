import React, { useState } from 'react';
import Header from '../../../components/layout/header';
import Footer from './Footer';
import { FaStar, FaGem, FaRocket } from 'react-icons/fa';
import profileImg from '../../../assets/profilepage.jpg';
import { useNavigate } from 'react-router-dom';
import FreePlanDailog from './SeeExamplePage/FreePlanDailog';

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
  if (highlight) {
    borderClass = 'border-yellow-400 ring-2 ring-yellow-100';
  } else if (title === 'Standard Example') {
    borderClass = 'border-[#5A8DB8]';
  }

  return (
    <div
      className={`relative flex flex-col items-center bg-white rounded-xl shadow-md border transition-all duration-200 ${borderClass} hover:shadow-lg hover:-translate-y-1 w-full max-w-sm mx-auto`}
    >
      {/* Badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">{badge}</div>
      <div className="w-full flex flex-col items-center pt-8 pb-4 px-4">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-3">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-full border-4 border-white shadow"
          />
          <div
            className="absolute bottom-0 left-0 w-full h-8 bg-[#5A8DB8] rounded-b-full"
            style={{
              clipPath: 'polygon(0 60%, 100% 0, 100% 100%, 0% 100%)',
              opacity: 0.7,
            }}
          ></div>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
        <p className="text-[#5A8DB8] text-sm font-medium mb-1">{subtitle}</p>
        <p className="text-gray-500 text-sm mb-4 text-center">{description}</p>
        <div className="flex w-full gap-2 mt-auto">
          <button
            className="flex-1 bg-[#E6F0FA] text-[#5A8DB8] px-3 py-2 rounded font-medium cursor-default shadow-sm border border-[#5A8DB8] whitespace-nowrap text-xs sm:text-sm"
            disabled
          >
            {planLabel}
          </button>
          <button
            className="flex-1 bg-[#5A8DB8] text-white px-3 py-2 rounded font-semibold shadow hover:bg-[#3C5979] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#5A8DB8] whitespace-nowrap text-xs sm:text-sm"
            style={{ border: '1px solid #5A8DB8' }}
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
  const navigate = useNavigate();
  const [showFreeDialog, setShowFreeDialog] = useState(false);

  const profiles = [
    {
      image: profileImg,
      title: 'Basic Example',
      subtitle: 'UI/UX Designer',
      description: 'A basic profile showcasing essential information and reviews.',
      planLabel: 'Basic Plan',
      selectLabel: 'Select Basic',
      badge: (
        <span className="flex items-center gap-1 bg-blue-100 text-[#5A8DB8] px-3 py-1 rounded-full text-xs font-semibold shadow">
          <FaStar className="text-yellow-400" /> Basic
        </span>
      ),
      highlight: false,
      onSelect: () => setShowFreeDialog(true),
    },
    {
      image: profileImg,
      title: 'Standard Example',
      subtitle: 'Front End Developer',
      description:
        'A standard profile with additional features like languages and categories.',
      planLabel: 'Standard Plan',
      selectLabel: 'Select Standard',
      badge: (
        <span className="flex items-center gap-1 bg-blue-100 text-[#5A8DB8] px-3 py-1 rounded-full text-xs font-semibold shadow">
          <FaGem className="text-blue-500" /> Standard
        </span>
      ),
      highlight: false,
      onSelect: () => navigate('/standard-plan'),
    },
    {
      image: profileImg,
      title: 'Premium Example',
      subtitle: 'Senior Designer',
      description:
        'A complete profile with all premium features including portfolio and video.',
      planLabel: 'Premium Plan',
      selectLabel: 'Select Premium',
      badge: (
        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
          <FaRocket className="text-yellow-500" /> Premium
        </span>
      ),
      highlight: true,
      onSelect: () => navigate('/premium-plan'),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="py-8 px-2 sm:py-12 sm:px-4 md:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
          <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-[#5A8DB8] drop-shadow">
              Example Profiles
            </h2>
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
    </div>
  );
};

export default SeeExample;
