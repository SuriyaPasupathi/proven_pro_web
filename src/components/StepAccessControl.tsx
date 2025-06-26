import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Lock, Crown, Star } from 'lucide-react';
import { isStepAvailable, SubscriptionType } from '../utils/subscriptionUtils';

interface StepAccessControlProps {
  currentStep: number;
  children: React.ReactNode;
}

const StepAccessControl: React.FC<StepAccessControlProps> = ({ currentStep, children }) => {
  const navigate = useNavigate();
  const { profileData } = useSelector((state: RootState) => state.createProfile);
  const subscriptionType = profileData?.subscription_type || 'free';

  // // Debug logging
  // console.log('StepAccessControl Debug:', {
  //   currentStep,
  //   subscriptionType,
  //   profileData,
  //   isStepAvailable: isStepAvailable(currentStep, subscriptionType as SubscriptionType)
  // });

  // Check if the current step is available for the user's subscription
  if (!isStepAvailable(currentStep, subscriptionType as SubscriptionType)) {
    const getStepInfo = (step: number) => {
      switch (step) {
        case 3:
          return {
            title: 'Services & Categories',
            description: 'Add your services and custom categories to showcase your expertise',
            requiredPlan: 'standard' as SubscriptionType,
            features: ['Custom service categories', 'Service descriptions', 'Rate ranges', 'Availability settings']
          };
        case 4:
          return {
            title: 'Work Experience',
            description: 'Showcase your professional experience and achievements',
            requiredPlan: 'standard' as SubscriptionType,
            features: ['Work history', 'Job titles', 'Company details', 'Achievements']
          };
        case 5:
          return {
            title: 'Tools & Skills',
            description: 'Display your technical skills and tools proficiency',
            requiredPlan: 'standard' as SubscriptionType,
            features: ['Technical skills', 'Tool proficiency', 'Skill ratings', 'Certifications']
          };
        case 6:
          return {
            title: 'Portfolio',
            description: 'Showcase your best work and projects',
            requiredPlan: 'premium' as SubscriptionType,
            features: ['Project showcase', 'Portfolio images', 'Project descriptions', 'Live demos']
          };
        case 7:
          return {
            title: 'Licenses & Certifications',
            description: 'Display your professional licenses and certifications',
            requiredPlan: 'premium' as SubscriptionType,
            features: ['Professional licenses', 'Certifications', 'Accreditations', 'Verification badges']
          };
        case 8:
          return {
            title: 'Video Introduction',
            description: 'Add a personal video introduction to your profile',
            requiredPlan: 'premium' as SubscriptionType,
            features: ['Video upload', 'Personal introduction', 'Professional presentation', 'Enhanced engagement']
          };
        default:
          return {
            title: 'Premium Feature',
            description: 'This feature requires a higher subscription plan',
            requiredPlan: 'premium' as SubscriptionType,
            features: ['Premium features', 'Advanced options', 'Enhanced capabilities']
          };
      }
    };

    const stepInfo = getStepInfo(currentStep);
    const isPremiumRequired = stepInfo.requiredPlan === 'premium';
    const isStandardRequired = stepInfo.requiredPlan === 'standard';

    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FBFF] px-4 sm:px-6 md:px-8 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
          <Card className="border-2 border-transparent transform hover:scale-[1.02] transition-all duration-300 shadow-xl overflow-hidden"
            style={{
              background: isPremiumRequired 
                ? 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #FFD700, #FFA500) border-box'
                : isStandardRequired
                ? 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #5A8DB8, #3C5979) border-box'
                : 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #5A8DB8, #3C5979) border-box'
            }}>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full ${isPremiumRequired ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                  <Lock className={`h-8 w-8 ${isPremiumRequired ? 'text-yellow-600' : 'text-blue-600'}`} />
                </div>
              </div>
              <CardTitle className={`text-2xl font-bold ${isPremiumRequired ? 'text-yellow-600' : 'text-blue-600'}`}>
                {stepInfo.title}
              </CardTitle>
              <p className="text-gray-600 mt-2">{stepInfo.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  isPremiumRequired 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {isPremiumRequired ? <Crown className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  {isPremiumRequired ? 'Premium Plan Required' : 'Standard Plan Required'}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Features included:</h3>
                <ul className="space-y-2">
                  {stepInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${isPremiumRequired ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate(isPremiumRequired ? '/premium-plan' : '/standard-plan')}
                  className={`w-full ${
                    isPremiumRequired
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-800 hover:text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5`}
                >
                  {isPremiumRequired ? 'Upgrade to Premium' : 'Upgrade to Standard'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/plans')}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  View All Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default StepAccessControl; 