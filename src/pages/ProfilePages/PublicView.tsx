import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getPublicProfile, getProfileReviewsPublic } from '../../store/Services/CreateProfileService';
import { resetReviewsState } from '../../store/Slice/CreateProfileSlice';
import ProfileHeader from './ProfileHeader';
import ExperienceSection from './ExperienceSection';
import PortfolioSection from './PortfolioSection';
import ProfileSidebar from './ProfileSidebar';
import ServicesSection from './ServicesSection';
import SkillsSection from './SkillsSection';
import ToolsSection from './ToolsSection';
import { ThemeProvider } from './ThemeProvider';
import { ProfileData } from '../../types/profile';
import SectionLock from '../../components/SectionLock';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PublicView = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Debug logging
  console.log('PublicView - Component mounted');
  console.log('PublicView - Current URL:', window.location.href);
  console.log('PublicView - profileId from useParams:', profileId);
  console.log('PublicView - profileId type:', typeof profileId);
  console.log('PublicView - profileId length:', profileId?.length);
  console.log('PublicView - All URL params:', useParams());
  
  const { 
    profileData, 
    publicProfileLoading, 
    publicProfileError,
    reviews,
    reviewsLoading,
  } = useAppSelector((state) => state.createProfile);
  const [error, setError] = useState<string | null>(null);
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
    const fetchPublicProfile = async () => {
      try {
        console.log('PublicView - profileId from params:', profileId);
        if (profileId) {
          // Fetch public profile data using view_mode action
          console.log('PublicView - calling getPublicProfile with userId:', profileId);
          await dispatch(getPublicProfile(profileId)).unwrap();
          
          // Fetch reviews using public endpoint
          console.log('PublicView - calling getProfileReviewsPublic with userId:', profileId);
          await dispatch(getProfileReviewsPublic(profileId)).unwrap();
        } else {
          console.error('PublicView - No profileId found in URL params');
          setError('Profile ID is missing from URL');
        }
      } catch (err) {
        console.error('PublicView - Error fetching public profile:', err);
        setError('Failed to load profile. Please try again later.');
      }
    };

    fetchPublicProfile();

    // Cleanup function
    return () => {
      dispatch(resetReviewsState());
    };
  }, [dispatch, profileId]);

  useEffect(() => {
    if (profileData) {
      setProfile({
        ...profileData,
        reviews: reviews || [] // Use reviews from Redux store
      });
    }
  }, [profileData, reviews]);

  if (publicProfileLoading || reviewsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 w-32 sm:h-5 sm:w-40 md:h-6 md:w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || publicProfileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8">
        <div className="text-center p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-red-500 mb-2 sm:mb-3 md:mb-4">Error Loading Profile</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">{error || publicProfileError?.message}</p>
          <Button 
            onClick={() => navigate(-1)}
            className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 md:py-3 min-h-[44px] sm:min-h-[48px]"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8">
        <div className="text-center p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md md:max-w-lg w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">Profile Not Found</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">The requested profile could not be found.</p>
          <Button 
            onClick={() => navigate(-1)}
            className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 md:py-3 min-h-[44px] sm:min-h-[48px]"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-gray-50">
        

        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 lg:w-11/12 lg:mx-auto">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="space-y-4 sm:space-y-6 md:space-y-8 mt-4 sm:mt-6 md:mt-8">
              {/* Profile Header - Mobile */}
              <div className="mb-4 sm:mb-6 md:mb-8">
                <ProfileHeader 
                  profileData={{ ...profile, id: profileId || '' }} 
                  isPublicView={true}
                  profileId={profileId}
                />
              </div>
              
              {/* Profile Sidebar - Mobile */}
              <div className="mb-4 sm:mb-6 md:mb-8">
                <ProfileSidebar profileData={{ ...profile, id: profileId || '' }} />
              </div>
              
              {/* Content Sections - Mobile */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {profile.categories && profile.categories.length > 0 && (
                  <>
                    <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
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
                    <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>
                  </>
                )}

                {profile.work_experiences && profile.work_experiences.length > 0 && (
                  <>
                    <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                      <div className="px-0 sm:px-2">
                        <ExperienceSection experiences={profile.work_experiences} />
                      </div>
                    </SectionLock>
                    <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>
                  </>
                )}

                {((profile.technical_skills && profile.technical_skills.length > 0) || 
                  (profile.soft_skills && profile.soft_skills.length > 0)) && (
                  <>
                    <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                      <div className="px-0 sm:px-2">
                        <SkillsSection 
                          technical_skills={profile.technical_skills}
                          soft_skills={profile.soft_skills}
                          skills_description={profile.skills_description}
                        />
                      </div>
                    </SectionLock>
                    <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>
                  </>
                )}

                {profile.primary_tools && profile.primary_tools.length > 0 && (
                  <>
                    <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                      <div className="px-0 sm:px-2">
                        <ToolsSection primary_tools={profile.primary_tools} />
                      </div>
                    </SectionLock>
                    <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>
                  </>
                )}

                {profile.portfolio && profile.portfolio.length > 0 && (
                  <>
                    <SectionLock requiredPlan="premium" title="Premium Features" profileData={profile}>
                      <div className="px-0 sm:px-2">
                        <PortfolioSection portfolio={profile.portfolio} />
                      </div>
                    </SectionLock>
                    <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>
                  </>
                )}

                
                {/* Bottom spacing for mobile */}
                <div className="h-4 sm:h-6 md:h-8 lg:h-12"></div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 mt-6 lg:mt-8 xl:mt-10">
              {/* Sidebar */}
              <div className="xl:col-span-3 order-2 xl:order-1">
                <div className="xl:sticky xl:top-8">
                  <ProfileSidebar profileData={{ ...profile, id: profileId || '' }} />
                </div>
              </div>
              
              {/* Main Content */}
              <div className="xl:col-span-9 order-1 xl:order-2">
                <div className="mb-6 lg:mb-8 xl:mb-10">
                  <ProfileHeader 
                    profileData={{ ...profile, id: profileId || '' }} 
                    isPublicView={true}
                    profileId={profileId}
                  />
                </div>
                
                <div className="space-y-6 lg:space-y-8 xl:space-y-12 mt-6 lg:mt-8 xl:mt-10 mb-8 lg:mb-10 xl:mb-12">
                  {profile.categories && profile.categories.length > 0 && (
                    <>
                      <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
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
                      <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8 lg:my-10"></div>
                    </>
                  )}

                  {profile.work_experiences && profile.work_experiences.length > 0 && (
                    <>
                      <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                        <div className="px-0 sm:px-2">
                          <ExperienceSection experiences={profile.work_experiences} />
                        </div>
                      </SectionLock>
                      <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8 lg:my-10"></div>
                    </>
                  )}

                  {((profile.technical_skills && profile.technical_skills.length > 0) || 
                    (profile.soft_skills && profile.soft_skills.length > 0)) && (
                    <>
                      <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                        <div className="px-0 sm:px-2">
                          <SkillsSection 
                            technical_skills={profile.technical_skills}
                            soft_skills={profile.soft_skills}
                            skills_description={profile.skills_description}
                          />
                        </div>
                      </SectionLock>
                      <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8 lg:my-10"></div>
                    </>
                  )}

                  {profile.primary_tools && profile.primary_tools.length > 0 && (
                    <>
                      <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                        <div className="px-0 sm:px-2">
                          <ToolsSection primary_tools={profile.primary_tools} />
                        </div>
                      </SectionLock>
                      <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8 lg:my-10"></div>
                    </>
                  )}

                  {profile.portfolio && profile.portfolio.length > 0 && (
                    <>
                      <SectionLock requiredPlan="premium" title="Premium Features" profileData={profile}>
                        <div className="px-0 sm:px-2">
                          <PortfolioSection portfolio={profile.portfolio} />
                        </div>
                      </SectionLock>
                      <div className="border-t border-gray-200 my-4 sm:my-6 md:my-8 lg:my-10"></div>
                    </>
                  )}

                  
                  {/* Bottom spacing for desktop */}
                  <div className="h-4 sm:h-6 md:h-8 lg:h-12 xl:h-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default PublicView;