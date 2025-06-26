import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { subscribeToPlan } from "../../../store/Services/CreateProfileService";
import Header from "@/components/layout/header";
import Footer from "./Footer";
import { FaRocket, FaCheck, FaLock } from 'react-icons/fa';
import { getAvailableSteps, SubscriptionType } from "../../../utils/subscriptionUtils";
import toast from "react-hot-toast";

interface PlansProps {
  isInLandingPage?: boolean;
}

const plans = [
  {
    name: "Basic",
    price: "Free",
    subscriptionType: "free" as SubscriptionType,
    features: [
      "Profile Name and Image",
      "Review Ratings",
      "Job Title and Job Specialization",
      "Client's Previews Reviews",
      "Copy URL Link",
    ],
    button: "Start Free Plan",
    highlight: false,
    path: "/free-plan",
    color: "green",
    stepRange: "1-2",
  },
  {
    name: "Premium",
    price: "USD 20/semiannually",
    subscriptionType: "premium" as SubscriptionType,
    features: [
      "Profile Name and Image",
      "Review Ratings",
      "Job Title and Job Specialization",
      "Client's Previews Reviews",
      "Copy URL Link",
      "Displays Services, Experiences, Skills and Tools",
      "Displays Education and Certifications",
      "Multiple Languages Support",
      "Custom Categories",
      "Video Introduction",
      "Exhibit Portfolio / Previous Works",
    ],
    button: "Get Premium",
    highlight: true,
    label: "Best Choice",
    path: "/premium-plan",
    color: "yellow",
    stepRange: "1-8",
  },
  {
    name: "Standard",
    price: "USD 10/semiannually",
    subscriptionType: "standard" as SubscriptionType,
    features: [
      "Profile Name and Image",
      "Review Ratings",
      "Job Title and Job Specialization",
      "Client's Previews Reviews",
      "Copy URL Link",
      "Displays Services, Experiences, Skills and Tools",
      "Multiple Languages Support",
      "Custom Categories",
    ],
    button: "Get Standard",
    highlight: false,
    path: "/standard-plan",
    color: "blue",
    stepRange: "1-5",
  },
];

export default function Plans({ isInLandingPage = false }: PlansProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const getStepColor = (planColor: string) => {
    switch (planColor) {
      case "yellow":
        return "bg-yellow-100 text-yellow-600";
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "green":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStepIcon = (stepNumber: number, availableSteps: any[], planColor: string) => {
    const isAvailable = availableSteps.some(step => step.step === stepNumber);
    if (isAvailable) {
      return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${getStepColor(planColor)}`}>
          {stepNumber}
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-gray-100 text-gray-400">
          <FaLock className="w-3 h-3" />
        </div>
      );
    }
  };

  return (
    <>
      {!isInLandingPage && <Header />}
      <section id="plans-section" className="bg-gradient-to-b from-white via-blue-50/50 to-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 w-full relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[#5A8DB8]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[#3C5979]/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-6 sm:mb-8 md:mb-12 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
            <span className="relative inline-block">
              Ready to START?
              <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Choose your plan and see exactly what steps you'll complete to create your professional profile
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto relative z-10">
          {plans.map((plan) => {
            const availableSteps = getAvailableSteps(plan.subscriptionType);
            // const totalSteps = availableSteps.length;
            
            return (
              <div
                key={plan.name}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col border transition-all duration-300 hover:scale-[1.02] ${
                  plan.highlight
                    ? "border-transparent scale-[1.02] z-10 shadow-xl"
                    : "border-gray-200/50 hover:border-[#5A8DB8] shadow-lg"
                }`}
                style={plan.highlight ? {
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #FFD700, #FFA500) border-box',
                  border: '2px solid transparent',
                } : {}}
              >
                {/* Label */}
                {plan.label && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 sm:px-6 py-1 sm:py-1.5 rounded-full font-semibold text-xs sm:text-sm shadow-lg flex items-center gap-1">
                    <FaRocket className="text-yellow-200" /> {plan.label}
                  </div>
                )}

                {/* Plan Info */}
                <div className="mb-4 sm:mb-6 text-center">
                  <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 transition-colors duration-300 ${
                    plan.highlight ? 'text-yellow-600 group-hover:text-yellow-700' : 'text-gray-800 group-hover:text-[#5A8DB8]'
                  }`}>
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                    {plan.price.includes("USD") ? (
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs sm:text-sm font-normal text-gray-600">USD</span>
                        <span className={plan.highlight ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500" : "text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]"}>
                          {plan.price.match(/\d+/)}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-gray-600">
                          {plan.price.replace(/.*?\d+/, "")}
                        </span>
                      </div>
                    ) : (
                      <span className={plan.highlight ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500" : "text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]"}>
                        {plan.price}
                      </span>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-gray-500 mb-4">
                    {plan.price === "Free" ? "" : "per year"}
                  </div>

                  {/* Steps Info */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    plan.highlight 
                      ? "bg-yellow-100 text-yellow-700" 
                      : plan.color === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                  }`}>
                    <span>{plan.stepRange} Profile Steps</span>
                    <FaCheck className="w-3 h-3" />
                  </div>
                </div>

                {/* Profile Creation Steps */}
                <div className="mb-4 sm:mb-6">
                  <div className="font-semibold text-xs sm:text-sm mb-3 text-gray-700">Profile Creation Steps:</div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((stepNumber) => {
                      const stepInfo = availableSteps.find(step => step.step === stepNumber);
                      const isAvailable = !!stepInfo;
                      
                      return (
                        <div key={stepNumber} className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                          isAvailable 
                            ? "bg-gray-50 hover:bg-gray-100" 
                            : "bg-gray-50/50 opacity-60"
                        }`}>
                          {getStepIcon(stepNumber, availableSteps, plan.color)}
                          <span className={`text-xs sm:text-sm ${
                            isAvailable ? "text-gray-700" : "text-gray-500"
                          }`}>
                            {stepNumber === 1 && "Personal Information"}
                            {stepNumber === 2 && "Profile Image"}
                            {stepNumber === 3 && "Services & Categories"}
                            {stepNumber === 4 && "Work Experience"}
                            {stepNumber === 5 && "Tools & Skills"}
                            {stepNumber === 6 && "Portfolio"}
                            {stepNumber === 7 && "Licenses & Certifications"}
                            {stepNumber === 8 && "Video Introduction"}
                          </span>
                          {!isAvailable && (
                            <span className="text-xs text-gray-400 ml-auto">
                              {plan.subscriptionType === "free" && stepNumber > 2 && "Standard+"}
                              {plan.subscriptionType === "standard" && stepNumber > 5 && "Premium+"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-4 sm:mb-6">
                  <div className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-gray-700">Plan Features:</div>
                  <ul className="text-xs sm:text-sm md:text-base space-y-2 sm:space-y-3 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 sm:gap-3 group/item">
                        <span className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs transform group-hover/item:scale-110 transition-transform duration-300 ${
                          plan.highlight 
                            ? "bg-yellow-100 text-yellow-600" 
                            : plan.color === "blue"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                        }`}>✓</span>
                        <span className="text-gray-600 group-hover/item:text-gray-800 transition-colors duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  className={`mt-auto w-full text-xs sm:text-sm md:text-base transition-all duration-300 ${
                    plan.highlight
                      ? "bg-yellow-200 hover:bg-yellow-500 text-gray-800 hover:text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                      : plan.color === "blue"
                        ? "bg-[#5A8DB8] hover:bg-[#3C5979] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transform"
                        : "bg-white border-2 border-gray-200 text-gray-800 hover:bg-[#5A8DB8] hover:text-white hover:border-[#5A8DB8] hover:-translate-y-0.5 transform transition-all duration-300"
                  }`}
                  style={plan.highlight ? { border: '1px solid #FFD700' } : {}}
                  onClick={async () => {
                    try {
                      console.log('Plan selection debug:', {
                        planName: plan.name,
                        subscriptionType: plan.subscriptionType
                      });
                      
                      // Subscribe to the plan first
                      const result = await dispatch(subscribeToPlan(plan.subscriptionType)).unwrap();
                      
                      console.log('Subscription result:', result);
                      
                      toast.success(`Successfully subscribed to ${plan.name} plan!`);
                      
                      // Navigate to create profile
                      navigate("/create-profile/personal-info");
                    } catch (error: any) {
                      console.error('Subscription error:', error);
                      toast.error(error.message || `Failed to subscribe to ${plan.name} plan`);
                    }
                  }}
                >
                  {plan.button}
                </Button>
              </div>
            );
          })}
        </div>
      </section>
      {!isInLandingPage && <Footer />}
    </>
  );
}
