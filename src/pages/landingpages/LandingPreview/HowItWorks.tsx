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
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235A8DB8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-14 relative z-10">
        
        {/* Left: Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative group w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative shadow-xl rounded-lg overflow-hidden transform group-hover:scale-[1.02] transition-all duration-300">
              <img
                src={image}
                alt="Profile Illustration"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Right: Steps */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center lg:text-left">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
              How It Works
            </span>
          </h2>

          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4 group">
                
                {/* Vertical Indicator */}
                <div className="flex flex-col items-center">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 rounded-full bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white flex items-center justify-center text-xs sm:text-sm font-semibold shadow-md group-hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 sm:w-1 h-8 sm:h-10 md:h-16 bg-gradient-to-b from-[#5A8DB8] to-[#3C5979] mt-1 group-hover:opacity-80 transition-opacity duration-300" />
                  )}
                </div>

                {/* Step Text */}
                <div className="text-left transform group-hover:translate-x-1 transition-transform duration-300">
                  <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#5A8DB8] group-hover:text-[#3C5979] transition-colors duration-300">
                    Step {index + 1}: {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">
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
