// components/HeroSection.tsx
import { Button } from "@/components/ui/button";
import image from "../../../assets/herosection.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235A8DB8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-20 relative z-10">
        
        {/* Left: Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug sm:leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
              Boost Your Online Career
            </span>
            <br />
            <span className="text-black font-normal">w/</span>{" "}
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
              Verified Client Reviews
            </span>{" "}
            <br />
            &{" "}
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
              Standout Profiles
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-xl mx-auto md:mx-0">
            Showcase your expertise, gain trust, and land your next opportunity faster with a platform built to highlight your skills and past successes.
          </p>
          <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <Button
              className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
              onClick={() => navigate("/signup")}
            >
              Create Your Profile
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[#5A8DB8] text-[#5A8DB8] hover:bg-[#E6F0FA] hover:text-[#5A8DB8] px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transform"
              onClick={() => navigate("/example")}
            >
              See Example
            </Button>
          </div>
        </div>

        {/* Right: Image mockup */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative group w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <img
              src={image}
              alt="Profile Cards"
              className="relative w-full h-auto object-contain transform group-hover:scale-[1.02] transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
