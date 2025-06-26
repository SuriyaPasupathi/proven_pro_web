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
import SectionLock from '../../components/SectionLock';

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
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </div>
        
        {/* Main content with responsive padding */}
        <div className="pt-16 sm:pt-20 w-11/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8">
            {/* Sidebar - responsive sticky behavior */}
            <div className="lg:col-span-3 order-1">
              <div className="lg:sticky lg:top-20 sm:top-24">
                <ProfileSidebar profileData={profile} />
              </div>
            </div>
            
            {/* Main content - responsive columns */}
            <div className="lg:col-span-9 order-2">
              <div className="">
                <ProfileHeader profileData={profile} />
              </div>

              <div className="space-y-6 sm:space-y-8 md:space-y-12 mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-10">
                {/* <ReviewCarousel reviews={transformedReviews} /> */}
                <SectionLock requiredPlan="standard" title="Standard Features">
                <ServicesSection 
                  categories={profile.categories}
                  services_categories={profile.services_categories}
                  services_description={profile.services_description}
                    rate_range={profile.rate_range}
                    availability={profile.availability}
                  />
                </SectionLock>
                {/* Horizontal divider */}
                <div className="border-t border-black"></div>
                
                <SectionLock requiredPlan="standard" title="Standard Features">
                  <ExperienceSection experiences={profile.work_experiences} />
                </SectionLock>
                
                   {/* Horizontal divider */}
                   <div className="border-t border-black"></div>
                
                <SectionLock requiredPlan="standard" title="Standard Features">
                <SkillsSection 
                  technical_skills={profile.technical_skills}
                  soft_skills={profile.soft_skills}
                  skills_description={profile.skills_description}
                />
                </SectionLock>
                {/* Horizontal divider */}
                <div className="border-t border-black"></div>
                <SectionLock requiredPlan="standard" title="Standard Features">
                <ToolsSection primary_tools={profile.primary_tools} />
                </SectionLock>
                {/* Horizontal divider */}
                <div className="border-t border-black"></div>
                <SectionLock requiredPlan="premium" title="Premium Features">
                  <PortfolioSection 
                    projects={profile.portfolio}
                    portfolio={profile.portfolio}
                  />
                </SectionLock>
                {/* Horizontal divider */}
                <div className="border-t border-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;