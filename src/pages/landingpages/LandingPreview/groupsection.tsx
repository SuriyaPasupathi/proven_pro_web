import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  UsersIcon,
  IdCardIcon,
  RocketIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <UserIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-2 text-white" />,
    title: "Standout Profiles",
    description: "Create a professional profile that highlights your skills, experience, and achievements to make you stand out from the competition.",
  },
  {
    icon: <BadgeCheckIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-2 text-white" />,
    title: "Verified Client Reviews",
    description: "Showcase authentic feedback from past clients to build trust and credibility with potential employers.",
  },
  {
    icon: <BriefcaseIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-2 text-white" />,
    title: "Faster Job Opportunities",
    description: "With a powerful profile and real reviews, attract more clients and land job offers quicker.",
  },
  {
    icon: <UsersIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-2 text-white" />,
    title: "Increase Your Visibility",
    description: "Gain more exposure and get noticed by top companies looking for proven talent.",
  },
  {
    icon: <IdCardIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-2 text-white" />,
    title: "Build a Strong Reputation",
    description: "Consistently positive reviews and a polished profile help you establish yourself as a trusted expert in your field.",
  },
  {
    icon: <RocketIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mx-auto mb-2 text-white" />,
    title: "Accelerate Your Career",
    description: "Access high-quality projects, grow your network, and take your career to the next level with continuous opportunities.",
  }
];

export default function GroupSection() {
  const navigate = useNavigate();
  return (
    <section className="py-8 sm:py-12 md:py-16 text-center px-4 sm:px-6 md:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235A8DB8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
          Why Choose Us?
        </h2>
        <p className="mb-6 sm:mb-8 md:mb-12 text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
          Simple steps to build a standout profile and attract your next opportunity.
        </p>

        <div className="grid gap-4 sm:gap-6 md:gap-8 px-0 sm:px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-4 sm:p-5 md:p-6 relative z-10">
                <div className="bg-white/10 rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 text-white group-hover:text-white/90 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-white/90 group-hover:text-white transition-colors duration-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="mt-6 sm:mt-8 md:mt-12 bg-[#5A8DB8] hover:bg-[#3C5979] text-white hover:text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-300"
          onClick={() => navigate('/signup')}
        >
          Sign Up Now
        </Button>
      </div>
    </section>
  );
}
