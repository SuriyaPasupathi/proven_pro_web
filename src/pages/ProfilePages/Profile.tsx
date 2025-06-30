import { useState, useEffect, useCallback, useRef } from 'react';
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
  const navigateRef = useRef(navigate);
  const hasFetchedRef = useRef(false);
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
  const lastFetchedId = useRef<string | null>(null);

  // Update navigate ref when navigate changes
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const fetchProfile = useCallback(async () => {
    // Prevent duplicate requests for the same profileId
    if (lastFetchedId.current === profileId) {
      console.log('Already fetched for this profileId:', profileId);
      return;
    }
    lastFetchedId.current = profileId ?? null;

    try {
      if (!profileId) {
        const storedProfileId = localStorage.getItem('userProfileId');
        if (storedProfileId) {
          navigateRef.current(`/profile/${storedProfileId}`);
          return;
        }
        navigateRef.current('/create-profile/personal-info');
        return;
      }
      await dispatch(getProfile(profileId));
      await dispatch(getProfileReviews(profileId));
      setIsInitialLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigateRef.current('/login');
      }
      setIsInitialLoading(false);
    }
  }, [profileId, dispatch]);

  useEffect(() => {
    // Reset fetch flag when profileId changes
    hasFetchedRef.current = false;
    fetchProfile();
  }, [fetchProfile]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-6 sm:p-8 max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-4">Error Loading Profile</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{error.message}</p>
          {error.status === 401 && (
            <Button 
              className="mt-4 bg-[#70a4d8] hover:bg-[#3C5979] text-white transition-all duration-300 w-full sm:w-auto"
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
        
        {/* Main content with improved responsive padding */}
        <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8 lg:px-0 lg:w-11/12 lg:mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 mt-2 sm:mt-4 md:mt-6 lg:mt-8">
            {/* Sidebar - improved mobile layout */}
            <div className="lg:col-span-3 order-1">
              <div className="lg:sticky lg:top-20 sm:top-24">
                <ProfileSidebar profileData={profile} />
              </div>
            </div>
            
            {/* Main content - improved mobile spacing */}
            <div className="lg:col-span-9 order-2">
              <div className="mb-4 sm:mb-6 md:mb-8">
                <ProfileHeader profileData={profile} />
              </div>

              <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-12 mb-6 sm:mb-8 md:mb-10">
                {/* <ReviewCarousel reviews={transformedReviews} /> */}
                <SectionLock requiredPlan="standard" title="Standard Features">
                  <div className="px-0 sm:px-2">
                    <ServicesSection 
                      categories={profile.categories}
                      services_categories={profile.services_categories}
                      services_description={profile.services_description}
                      rate_range={profile.rate_range}
                      availability={profile.availability}
                    />
                  </div>
                </SectionLock>
                
                {/* Horizontal divider with responsive margins */}
                <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>
                
                <SectionLock requiredPlan="standard" title="Standard Features">
                  <div className="px-0 sm:px-2">
                    <ExperienceSection experiences={profile.work_experiences} />
                  </div>
                </SectionLock>
                
                {/* Horizontal divider with responsive margins */}
                <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>
                
                <SectionLock requiredPlan="standard" title="Standard Features">
                  <div className="px-0 sm:px-2">
                    <SkillsSection 
                      technical_skills={profile.technical_skills}
                      soft_skills={profile.soft_skills}
                      skills_description={profile.skills_description}
                    />
                  </div>
                </SectionLock>
                
                {/* Horizontal divider with responsive margins */}
                <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>
                
                <SectionLock requiredPlan="standard" title="Standard Features">
                  <div className="px-0 sm:px-2">
                    <ToolsSection primary_tools={profile.primary_tools} />
                  </div>
                </SectionLock>
                
                {/* Horizontal divider with responsive margins */}
                <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>
                
                <SectionLock requiredPlan="premium" title="Premium Features">
                  <div className="px-0 sm:px-2">
                    <PortfolioSection 
                      projects={profile.portfolio}
                      portfolio={profile.portfolio}
                    />
                  </div>
                </SectionLock>
                
                {/* Bottom spacing for mobile */}
                <div className="h-4 sm:h-6 md:h-8 lg:h-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;