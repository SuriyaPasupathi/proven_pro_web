// components/HeroSection.tsx
import { Button } from "@/components/ui/button";
import image from "../../../assets/herosection.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center justify-between gap-10 lg:gap-20">
        
        {/* Left: Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-snug sm:leading-tight text-gray-900">
            Boost Your Online Career <br />
            <span className="text-black font-normal">w/</span>{" "}
            <span className="font-extrabold text-black">Verified Client Reviews</span> <br />
            & <span className="font-extrabold text-black">Standout Profiles</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0">
            Showcase your expertise, gain trust, and land your next opportunity faster with a platform built to highlight your skills and past successes.
          </p>
          <div className="mt-6 sm:mt-8">
            <Button
              className="bg-[#5A8DB8] hover:bg-[#3C5979] px-6 py-3 text-sm sm:text-base"
              onClick={() => navigate("/signup")}
            >
              Create Your Profile
            </Button>
          </div>
        </div>

        {/* Right: Image mockup */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src={image}
            alt="Profile Cards"
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl object-contain h-auto"
          />
        </div>
      </div>
    </section>
  );
}
