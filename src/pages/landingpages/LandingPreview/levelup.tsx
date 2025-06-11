// components/LevelUpSection.tsx
import { Button } from "@/components/ui/button";
import image from "../../../assets/Levelup.jpg";
import { useNavigate } from "react-router-dom";

export default function LevelUpSection() {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12">
        
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="shadow-xl rounded-md overflow-hidden">
            <img
              src={image}
              alt="Woman with laptop"
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-snug mb-4">
            Ready to Level Up Your Online Career?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 max-w-xl mx-auto lg:mx-0">
            Create your profile today and start showcasing your verified client reviews.
            Stand out, build trust, and attract your next opportunity—faster!
          </p>
          <Button 
            onClick={() => navigate('/signup')}
            className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white px-6 py-3 text-sm sm:text-base"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}
