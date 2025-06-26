export type SubscriptionType = 'free' | 'standard' | 'premium';

export interface StepConfig {
  step: number;
  path: string;
  title: string;
  availableFor: SubscriptionType[];
}

export const PROFILE_STEPS: StepConfig[] = [
  {
    step: 1,
    path: '/create-profile/personal-info',
    title: 'Personal Information',
    availableFor: ['free', 'standard', 'premium']
  },
  {
    step: 2,
    path: '/create-profile/profile-img',
    title: 'Profile Image',
    availableFor: ['free', 'standard', 'premium']
  },
  {
    step: 3,
    path: '/create-profile/services-offer',
    title: 'Services & Categories',
    availableFor: ['standard', 'premium']
  },
  {
    step: 4,
    path: '/create-profile/work-exp',
    title: 'Work Experience',
    availableFor: ['standard', 'premium']
  },
  {
    step: 5,
    path: '/create-profile/tool-skills',
    title: 'Tools & Skills',
    availableFor: ['standard', 'premium']
  },
  {
    step: 6,
    path: '/create-profile/portfolio',
    title: 'Portfolio',
    availableFor: ['premium']
  },
  {
    step: 7,
    path: '/create-profile/licenses',
    title: 'Licenses & Certifications',
    availableFor: ['premium']
  },
  {
    step: 8,
    path: '/create-profile/video-intro',
    title: 'Video Introduction',
    availableFor: ['premium']
  }
];

export const getAvailableSteps = (subscriptionType: SubscriptionType): StepConfig[] => {
  return PROFILE_STEPS.filter(step => step.availableFor.includes(subscriptionType));
};

export const getTotalSteps = (subscriptionType: SubscriptionType): number => {
  return getAvailableSteps(subscriptionType).length;
};

export const isStepAvailable = (stepNumber: number, subscriptionType: SubscriptionType): boolean => {
  const step = PROFILE_STEPS.find(s => s.step === stepNumber);
  return step ? step.availableFor.includes(subscriptionType) : false;
};

export const getNextAvailableStep = (currentStep: number, subscriptionType: SubscriptionType): StepConfig | null => {
  const availableSteps = getAvailableSteps(subscriptionType);
  const currentStepIndex = availableSteps.findIndex(step => step.step === currentStep);
  
  if (currentStepIndex === -1 || currentStepIndex === availableSteps.length - 1) {
    return null;
  }
  
  return availableSteps[currentStepIndex + 1];
};

export const getPreviousAvailableStep = (currentStep: number, subscriptionType: SubscriptionType): StepConfig | null => {
  const availableSteps = getAvailableSteps(subscriptionType);
  const currentStepIndex = availableSteps.findIndex(step => step.step === currentStep);
  
  if (currentStepIndex <= 0) {
    return null;
  }
  
  return availableSteps[currentStepIndex - 1];
};

export const getStepProgress = (currentStep: number, subscriptionType: SubscriptionType): number => {
  const availableSteps = getAvailableSteps(subscriptionType);
  const currentStepIndex = availableSteps.findIndex(step => step.step === currentStep);
  
  if (currentStepIndex === -1) {
    return 0;
  }
  
  return Math.round(((currentStepIndex + 1) / availableSteps.length) * 100);
}; 