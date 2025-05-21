import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    price: "USD 20/annually",
    features: [
      "Profile Name and Image",
      "Review Ratings",
      "Job Title and Job Specialization",
      "Client's Previews Reviews",
      "Copy URL Link",
      "Displays Services, Experiences, Skills and Tools",
      "Displays Education and Certifications",
      "Languages",
      "Categories",
      "Video Introduction",
      "Exhibit Portfolio / Previous Works",
    ],
    button: "Sign Up Now",
    highlight: true,
    label: "Best Choice",
  },
  {
    name: "Standard",
    price: "USD 10/annually",
    features: [
      "Profile Name and Image",
      "Review Ratings",
      "Job Title and Job Specialization",
      "Client's Previews Reviews",
      "Copy URL Link",
      "Displays Services, Experiences, Skills and Tools",
      "Languages",
      "Categories",
    ],
    button: "Sign Up Now",
    highlight: false,
  },
];

export default function Plans() {
  const navigate = useNavigate();

  return (
    <section id="plans-section" className="bg-gray-100 py-10 sm:py-14 px-4 sm:px-6 md:px-8 w-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">Ready to START?</h2>
        <p className="text-red-500 flex items-center justify-center gap-2 text-sm sm:text-base">
          <span>📌</span>
          Sed eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-lg shadow-md p-5 sm:p-6 flex flex-col border relative transition-transform duration-200 ${
              plan.highlight
                ? "border-[#3C5979] scale-[1.02] z-10"
                : "border-gray-200"
            }`}
          >
            {/* Label */}
            {plan.label && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3C5979] text-white px-4 py-1 rounded-t-md font-semibold text-xs sm:text-sm">
                {plan.label}
              </div>
            )}

            {/* Plan Info */}
            <div className="mb-4 text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">{plan.name}</h3>

              {/* Price */}
              <div className="text-2xl sm:text-3xl font-bold mb-1">
                {plan.price.includes("USD") ? (
                  <>
                    <span className="text-xs sm:text-sm font-normal">USD</span>{" "}
                    <span className="text-2xl sm:text-3xl font-bold">
                      {plan.price.match(/\d+/)}
                    </span>
                    <span className="text-xs sm:text-sm font-normal">
                      {plan.price.replace(/USD|\d+/, "")}
                    </span>
                  </>
                ) : (
                  <span className="text-xl sm:text-2xl font-bold">{plan.price}</span>
                )}
              </div>

              <div className="text-xs sm:text-sm text-gray-500">
                {plan.price === "Free" ? "" : "per year"}
              </div>
            </div>

            {/* Features List */}
            <div className="mb-4">
              <div className="font-semibold text-xs sm:text-sm mb-2">Includes:</div>
              <ul className="text-sm sm:text-base space-y-2 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-green-600 text-base">✅</span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <Button
              className={`mt-auto w-full text-sm sm:text-base ${
                plan.highlight
                  ? "bg-[#3C5979] hover:bg-[#3C5979]/90 text-white"
                  : "bg-white border border-gray-300 text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => {
                if (plan.name === "Basic") {
                  navigate("/create-profile/personal-info");
                }
              }}
            >
              {plan.button}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
