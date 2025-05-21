// components/HowItWorks.tsx
import image from "../../../assets/Works.jpg";

const steps = [
  {
    title: "Set Up Your Profile",
    description:
      "Setting up your profile and account is the first step to getting started with our platform. This process ensures that you have personalized access to all the features and services available.",
    icon: "/icons/setup.svg",
  },
  {
    title: "Create Standout Profile",
    description:
      "Build a profile that highlights your unique skills, experiences, and achievements. Make a lasting impression with a polished, professional showcase that sets you apart from the competition.",
    icon: "/icons/profile.svg",
  },
  {
    title: "Stand Out to Employers",
    description:
      "With a standout profile and real reviews, attract more job opportunities and impress potential clients.",
    icon: "/icons/employers.svg",
  },
  {
    title: "Apply & Get Hired Faster",
    description:
      "Boost your visibility and increase your chances of landing your next job by showing off your proven track record.",
    icon: "/icons/hired.svg",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 to-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        
        {/* Left: Image */}
        <div className="w-full lg:w-1/2">
          <img
            src={image}
            alt="Profile Illustration"
            width={600}
            height={600}
            className="rounded-md w-full h-auto object-cover shadow-xl"
          />
        </div>

        {/* Right: Steps */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center lg:text-left text-gray-900">
            How It Works
          </h2>

          <div className="space-y-8 sm:space-y-10">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                
                {/* Vertical Indicator */}
                <div className="flex flex-col items-center">
                  <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[#3C5979] text-white flex items-center justify-center text-xs sm:text-sm font-semibold">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-1 h-10 sm:h-16 bg-[#3C5979] mt-1" />
                  )}
                </div>

                {/* Step Text */}
                <div className="text-left">
                  <h4 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    Step {index + 1}: {step.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
