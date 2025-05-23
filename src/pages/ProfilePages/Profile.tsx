import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getProfile } from '../../store/Services/CreateProfileService';
import ProfileNav from './ProfileNav'
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import ReviewCarousel from './ReviewCarousel';
import ServicesSection from './ServicesSection';
import ExperienceSection from './ExperienceSection';
import SkillsSection from './SkillsSection';
import ToolsSection from './ToolsSection';
import PortfolioSection from './PortfolioSection';
import { ThemeProvider } from './ThemeProvider';

export interface ProfileData {
  subscription_type: 'free' | 'standard' | 'premium';
  // Profile Fields
  first_name?: string;
  last_name?: string;
  bio?: string;
  rating?: number;
  profile_url?: string;
  profile_mail?: string;
  mobile?: string;

  // Profile Image
  profile_pic?: string;
  profile_pic_url?: string;

  // Services
  services_categories?: string[];
  services_description?: string;
  rate_range?: string;
  availability?: string;

  // Work Experience
  experiences?: {
    company_name: string;
    position: string;
    key_responsibilities: string;
    experience_start_date: string;
    experience_end_date: string;
  }[];

  // Tools & Skills
  primary_tools?: string[];
  technical_skills?: string[];
  soft_skills?: string[];
  skills_description?: string;

  // Portfolio
  portfolio?: {
    project_title: string;
    project_description: string;
    project_url: string;
    project_image: string;
    project_image_url: string;
  }[];

  // Certifications
  certifications?: {
    certifications_name: string;
    certifications_issuer: string;
    certifications_issued_date: string;
    certifications_expiration_date: string;
    certifications_id: string;
    certifications_image: string;
    certifications_image_url: string;
  }[];

  // Video
  video_intro?: string;
  video_intro_url?: string;
  video_description?: string;

  // Reviews
  reviews?: {
    id: number;
    name: string;
    company: string;
    rating: number;
    content: string;
  }[];
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { profileData, loading, error } = useSelector((state: RootState) => state.createProfile);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error.message}</div>;
  }

  const profile = profileData as ProfileData;

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background">
        <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mt-6 md:mt-8">
            {/* Sidebar - takes 3 columns on large screens, full width on mobile */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <ProfileSidebar profileData={profile} />
            </div>
            
            {/* Main content - takes 9 columns on large screens */}
            <div className="lg:col-span-9 order-1 lg:order-2">
              <ProfileHeader profileData={profile} />
              
              <div className="space-y-8 md:space-y-12 mt-6 md:mt-8">
                <ReviewCarousel reviews={profile.reviews} />
                <ServicesSection 
                  services_categories={profile.services_categories}
                  services_description={profile.services_description}
                  rate_range={profile.rate_range}
                  availability={profile.availability}
                />
                <ExperienceSection experiences={profile.experiences} />
                <SkillsSection 
                  technical_skills={profile.technical_skills}
                  soft_skills={profile.soft_skills}
                  skills_description={profile.skills_description}
                />
                <ToolsSection primary_tools={profile.primary_tools} />
                <PortfolioSection portfolio={profile.portfolio} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;