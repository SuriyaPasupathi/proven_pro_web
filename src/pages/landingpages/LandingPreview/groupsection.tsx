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
    icon: <UserIcon className="h-8 w-8 mx-auto mb-2 text-white" />,
    title: "Standout Profiles",
    description: "Create a professional profile that highlights your skills, experience, and achievements to make you stand out from the competition.",
  },
  {
    icon: <BadgeCheckIcon className="h-8 w-8 mx-auto mb-2 text-white" />,
    title: "Verified Client Reviews",
    description: "Showcase authentic feedback from past clients to build trust and credibility with potential employers.",
  },
  {
    icon: <BriefcaseIcon className="h-8 w-8 mx-auto mb-2 text-white" />,
    title: "Faster Job Opportunities",
    description: "With a powerful profile and real reviews, attract more clients and land job offers quicker.",
  },
  {
    icon: <UsersIcon className="h-8 w-8 mx-auto mb-2 text-white" />,
    title: "Increase Your Visibility",
    description: "Gain more exposure and get noticed by top companies looking for proven talent.",
  },
  {
    icon: <IdCardIcon className="h-8 w-8 mx-auto mb-2 text-white" />,
    title: "Build a Strong Reputation",
    description: "Consistently positive reviews and a polished profile help you establish yourself as a trusted expert in your field.",
  },
  {
    icon: <RocketIcon className="h-8 w-8 mx-auto mb-2 text-white" />,
    title: "Accelerate Your Career",
    description: "Access high-quality projects, grow your network, and take your career to the next level with continuous opportunities.",
  }
  
];

export default function GroupSection() {
  const navigate = useNavigate();
  return (
    <section className="py-10 sm:py-14 md:py-16 text-center px-2 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Why Choose Us?</h2>
      <p className="mb-8 sm:mb-12 text-base sm:text-lg">
        Simple steps to build a standout profile and attract your next opportunity.
      </p>

      <div className="grid gap-4 sm:gap-6 px-0 sm:px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="bg-[#3C5979] ">
            <CardContent className="p-4 sm:p-6">
              {feature.icon}
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-white">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="mt-8 sm:mt-12 bg-[#5A8DB8] hover:bg-[#3C5979] text-white hover:text-white px-6 py-2 text-sm sm:text-base"
      onClick={() => navigate('/signup')}
      >
        Sign Up Now
      </Button>
    </section>
  );
}
