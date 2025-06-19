import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getProfile, getProfileReviews } from '../../store/Services/CreateProfileService';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileNav from './ProfileNav'
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
// import ReviewCarousel from './ReviewCarousel';
import ServicesSection from './ServicesSection';
import ExperienceSection from './ExperienceSection';
import SkillsSection from './SkillsSection';
import ToolsSection from './ToolsSection';
import PortfolioSection from './PortfolioSection';
import { ThemeProvider } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import ProfileSkeleton from '@/components/ui/profile-skeleton';
import FullPageLoader from '@/components/ui/full-page-loader';
import axios from 'axios';
import { ProfileData } from '../../types/profile';
import { useEditMode } from '../../context/EditModeContext';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  useEditMode();
  const dispatch = useDispatch<AppDispatch>();
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { profileData, loading, error } = useSelector((state: RootState) => state.createProfile);
  const { reviews } = useSelector((state: RootState) => state.createProfile);
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
        if (!profileId) {
          const storedProfileId = localStorage.getItem('userProfileId');
          if (storedProfileId) {
            navigate(`/profile/${storedProfileId}`);
            return;
          }
          navigate('/create-profile/personal-info');
          return;
        }
        await dispatch(getProfile(profileId));
        await dispatch(getProfileReviews(profileId));
        setIsInitialLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/login');
        }
        setIsInitialLoading(false);
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

  // Show initial loading spinner for first 1.5 seconds
  if (isInitialLoading) {
    return (
      <FullPageLoader 
        message="Loading your profile..." 
        showSkeleton={false}
        delay={1500}
      />
    );
  }

  // Show skeleton loading after initial load
  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600">{error.message}</p>
          {error.status === 401 && (
            <Button 
              className="mt-4 bg-[#70a4d8] hover:bg-[#3C5979] text-white transition-all duration-300"
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
      <div className="min-h-screen bg-gray-50">
        <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <div className="w-11/12 mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mt-6 md:mt-8">
            {/* Sidebar - takes 3 columns on large screens, full width on mobile */}
            <div className="lg:col-span-3 order-1">
              <div className="sticky top-8">
                <ProfileSidebar profileData={profile} />
              </div>
            </div>
            
            {/* Main content - takes 9 columns on large screens */}
            <div className="lg:col-span-9 order-2">
              <div className="mb-8">
                <ProfileHeader profileData={profile} />
              </div>

              <div className="border-t border-gray-200"></div>

              <div className="space-y-8 md:space-y-12 mt-6 md:mt-8">
                {/* <ReviewCarousel reviews={transformedReviews} /> */}
                
                <ServicesSection 
                  categories={profile.categories}
                  services_categories={profile.services_categories}
                  services_description={profile.services_description}
                  rate_range={profile.rate_range}
                  availability={profile.availability}
                />
                {/* Horizontal divider */}
                <div className="border-t border-gray-200"></div>
                
                <ExperienceSection experiences={profile.work_experiences} />
                
                <SkillsSection 
                  technical_skills={profile.technical_skills}
                  soft_skills={profile.soft_skills}
                  skills_description={profile.skills_description}
                />
                
                {/* Horizontal divider */}
                <div className="border-t border-gray-200"></div>
                
                <ToolsSection primary_tools={profile.primary_tools} />
                
                {/* Horizontal divider */}
                <div className="border-t border-gray-200"></div>
                
                <PortfolioSection 
                  projects={profile.portfolio}
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