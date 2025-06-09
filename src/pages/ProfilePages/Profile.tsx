import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getProfile, getProfileReviews } from '../../store/Services/CreateProfileService';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { ProfileData } from '../../types/profile';
import { useEditMode } from '../../context/EditModeContext';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEditMode();
  const dispatch = useDispatch<AppDispatch>();
  const { profileId } = useParams();
  console.log(profileId);
  const { profileData, loading, error } = useSelector((state: RootState) => state.createProfile);
  const { reviews } = useSelector((state: RootState) => state.createProfile);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    id: '',
    subscription_type: 'premium',
    first_name: '',
    last_name: '',
    bio: '',
    profile_mail: '',
    profile_url: '',
    rating: 0,
    reviews: [],
    verification_details: {
      government_id: {
        uploaded: false,
        verified: false,
        percentage: 0
      },
      address_proof: {
        uploaded: false,
        verified: false,
        percentage: 0
      },
      mobile: {
        provided: false,
        verified: false,
        percentage: 0
      }
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!profileId) return;
        await dispatch(getProfile(profileId));
        await dispatch(getProfileReviews(profileId));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Redirect to login page if unauthorized
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [dispatch, profileId, navigate]);

  useEffect(() => {
    if (profileData) {
      setProfile({
        ...profileData,
        reviews: reviews || [] // Use reviews from Redux store
      });
    }
  }, [profileData, reviews]);

  // Transform reviews to match ReviewCarousel interface
  const transformedReviews = reviews.map(review => ({
    id: review.id,
    name: review.reviewer_name,
    company: review.company || 'Anonymous',
    rating: review.rating,
    content: review.comment
  }));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600">{error.message}</p>
          {error.status === 401 && (
            <Button 
              className="mt-4 bg-[#70a4d8] hover:bg-[#3C5979] text-white"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background">
        <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <div className="w-11/12 mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mt-6 md:mt-8">
            {/* Sidebar - takes 3 columns on large screens, full width on mobile */}
            <div className="lg:col-span-3 order-1">
              <ProfileSidebar profileData={profile} />
            </div>
            
            {/* Main content - takes 9 columns on large screens */}
            <div className="lg:col-span-9 order-2">
              <ProfileHeader profileData={profile} />
              
              <div className="space-y-8 md:space-y-12 mt-6 md:mt-8">
                <ReviewCarousel reviews={transformedReviews} />
                <ServicesSection 
                  categories={profile.categories}
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
                <PortfolioSection 
                  projects={profile.projects}
                  portfolio={profile.portfolio}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;