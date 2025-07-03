import React from 'react';
import { useSelector } from 'react-redux';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';

interface SectionLockProps {
  requiredPlan: 'standard' | 'premium';
  title: string;
  children: React.ReactNode;
}

const SectionLock: React.FC<SectionLockProps> = ({ requiredPlan, title, children }) => {
  const { profileData } = useSelector((state: RootState) => state.createProfile);
  const navigate = useNavigate();
  const subscriptionType = profileData?.subscription_type || 'free';
  const locked = (requiredPlan === 'premium' && subscriptionType !== 'premium') ||
                 (requiredPlan === 'standard' && !['standard', 'premium'].includes(subscriptionType));

  const handleUpgradeClick = () => {
    if (requiredPlan === 'premium') {
      navigate('/premium-plan');
    } else if (requiredPlan === 'standard') {
      navigate('/standard-plan');
    }
  };

  return (
    <div className="relative">
      {locked ? (
        <div className="relative">
          <div className="opacity-40 select-none pointer-events-none">
            {children}
          </div>
          <button onClick={handleUpgradeClick}>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-600 mb-4">
              <Lock className="w-5 h-5" />
              {title} <span className="ml-2">🔒</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Plan Required
            </div>
           
          </div>
          </button>
          
        </div>
      ) : (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionLock; 