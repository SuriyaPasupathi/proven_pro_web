// components/LevelUpSection.tsx
import { Button } from "@/components/ui/button";
import image from "../../../assets/Levelup.jpg";
import { useNavigate } from "react-router-dom";

export default function LevelUpSection() {
  const navigate = useNavigate();

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235A8DB8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10">
        
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="relative group w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] mx-auto">
            <img
              src={image}
              alt="Woman with laptop"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mb-3 sm:mb-4 md:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
              Ready to Level Up Your Online Career?
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
            Create your profile today and start showcasing your verified client reviews.
            Stand out, build trust, and attract your next opportunity—faster!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
            >
              Get Started Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/example')}
              className="border-2 border-[#5A8DB8] text-[#5A8DB8] hover:bg-[#E6F0FA] hover:text-[#5A8DB8] px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-300"
            >
              See Example
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
