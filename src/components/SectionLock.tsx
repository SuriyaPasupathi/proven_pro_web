import React from 'react';
import { useSelector } from 'react-redux';
import { Lock } from 'lucide-react';
import { RootState } from '../store/store';

interface SectionLockProps {
  requiredPlan: 'standard' | 'premium';
  title: string;
  children: React.ReactNode;
}

const SectionLock: React.FC<SectionLockProps> = ({ requiredPlan, title, children }) => {
  const { profileData } = useSelector((state: RootState) => state.createProfile);
  const subscriptionType = profileData?.subscription_type || 'free';
  const locked = (requiredPlan === 'premium' && subscriptionType !== 'premium') ||
                 (requiredPlan === 'standard' && !['standard', 'premium'].includes(subscriptionType));

  return (
    <div className="relative">
      {locked ? (
        <div className="relative">
          <div className="opacity-40 select-none pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-600 mb-4">
              <Lock className="w-5 h-5" />
              {title} <span className="ml-2">🔒</span>
            </div>
            <div className="text-sm text-gray-500">
              {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Plan Required
            </div>
          </div>
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