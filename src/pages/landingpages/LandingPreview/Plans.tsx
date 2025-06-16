import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/header";
import Footer from "./Footer";
import { FaRocket } from 'react-icons/fa';

interface PlansProps {
  isInLandingPage?: boolean;
}

const plans = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "Profile Name and Image",
      "Review Ratings",
      "Job Title and Job Specialization",
      "Client's Previews Reviews",
      "Copy URL Link",
    ],
    button: "Sign Up Now",
    highlight: false,
  },
  {
    name: "Premium",
    price: "USD 20/semiannually",
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
    button: "Sign Up Now",
    highlight: true,
    label: "Best Choice",
  },
  {
    name: "Standard",
    price: "USD 10/semiannually",
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
    button: "Sign Up Now",
    highlight: false,
  },
];

export default function Plans({ isInLandingPage = false }: PlansProps) {
  const navigate = useNavigate();

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
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto relative z-10">
          {plans.map((plan) => (
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
                        {plan.price.replace(/USD|\d+/, "")}
                      </span>
                    </div>
                  ) : (
                    <span className={plan.highlight ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500" : "text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]"}>
                      {plan.price}
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-gray-500">
                  {plan.price === "Free" ? "" : "per year"}
                </div>
              </div>

              {/* Features List */}
              <div className="mb-4 sm:mb-6">
                <div className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-gray-700">Includes:</div>
                <ul className="text-xs sm:text-sm md:text-base space-y-2 sm:space-y-3 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 sm:gap-3 group/item">
                      <span className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs transform group-hover/item:scale-110 transition-transform duration-300 ${
                        plan.highlight 
                          ? "bg-yellow-100 text-yellow-600" 
                          : plan.name === "Standard"
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
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                    : plan.name === "Standard"
                      ? "bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transform"
                      : "bg-white border-2 border-gray-200 text-gray-800 hover:bg-[#5A8DB8] hover:text-white hover:border-[#5A8DB8] hover:-translate-y-0.5 transform transition-all duration-300"
                }`}
                style={plan.highlight ? { border: '1px solid #FFD700' } : {}}
                onClick={() => {
                  if (plan.name === "Basic") {
                    navigate("/create-profile/personal-info");
                  } else if (plan.name === "Premium") {
                    navigate("/premium-plan");
                  } else if (plan.name === "Standard") {
                    navigate("/standard-plan");
                  }
                }}
              >
                {plan.button}
              </Button>
            </div>
          ))}
        </div>
      </section>
      {!isInLandingPage && <Footer />}
    </>
  );
}
