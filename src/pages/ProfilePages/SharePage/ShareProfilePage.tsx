import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { getProfile, getProfileReviews, getProfileReviewsPublic, verifyShareToken } from '../../../store/Services/CreateProfileService';
import { resetReviewsState } from '../../../store/Slice/CreateProfileSlice';
import ProfileHeader from '../ProfileHeader';
import ExperienceSection from '../ExperienceSection';
import PortfolioSection from '../PortfolioSection';
import ProfileSidebar from '../ProfileSidebar';
import ServicesSection from '../ServicesSection';
import SkillsSection from '../SkillsSection';
import ToolsSection from '../ToolsSection';
import { ThemeProvider } from '../ThemeProvider';
import ShareNavbar from './ShareNavbar';
import { ProfileData } from '../../../types/profile';
import SectionLock from '../../../components/SectionLock';

const ShareProfilePage = () => {
  const { profileId, shareToken } = useParams();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    profileData, 
    loading, 
    error: profileError,
    reviews,
  } = useAppSelector((state) => state.createProfile);
  const [error, setError] = useState<string | null>(null);
  const [verifiedProfileId, setVerifiedProfileId] = useState<string | null>(null);
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
        if (shareToken) {
          if (profileId) {
            // If both profileId and shareToken are available, use the existing approach
            await dispatch(getProfile(profileId)).unwrap();
            await dispatch(getProfileReviews(profileId)).unwrap();
            setVerifiedProfileId(profileId);
          } else {
            // If only shareToken is available, verify it first
            const result = await dispatch(verifyShareToken(shareToken)).unwrap();
            setVerifiedProfileId(result.profile.id);
            // Fetch reviews after profile is loaded using public endpoint
            if (result.profile.id) {
              await dispatch(getProfileReviewsPublic(result.profile.id)).unwrap();
            }
          }
        }
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();

    // Cleanup function
    return () => {
      dispatch(resetReviewsState());
    };
  }, [dispatch, profileId, shareToken]);

  useEffect(() => {
    if (profileData) {
      setProfile({
        ...profileData,
        reviews: reviews || [] // Use reviews from Redux store
      });
    }
  }, [profileData, reviews]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-6 sm:p-8 max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-3 sm:mb-4">Error Loading Profile</h2>
          <p className="text-sm sm:text-base text-gray-600">{error || profileError?.message}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-6 sm:p-8 max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">Profile Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600">The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

  const targetProfileId = verifiedProfileId || profileId;

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-gray-50">
        <ShareNavbar 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          shareToken={shareToken}
          profileId={targetProfileId}
        />
        <div className="pt-16 sm:pt-20 w-11/12 mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 md:gap-8 mt-4 sm:mt-6 md:mt-8">
            <div className="xl:col-span-3 order-2 xl:order-1">
              <div className="xl:sticky xl:top-8">
                <ProfileSidebar profileData={{ ...profile, id: targetProfileId || '' }} />
              </div>
            </div>
            
            <div className="xl:col-span-9 order-1 xl:order-2">
              <div className="mb-6 sm:mb-8">
                <ProfileHeader 
                  profileData={{ ...profile, id: targetProfileId || '' }} 
                  isPublicView={true}
                  shareToken={shareToken}
                  profileId={targetProfileId}
                />
              </div>
              
              <div className="space-y-6 sm:space-y-8 md:space-y-12 mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-10">
                {profile.categories && profile.categories.length > 0 && (
                  <>
                    <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                      <ServicesSection 
                        categories={profile.categories}
                        services_categories={profile.services_categories}
                        services_description={profile.services_description}
                        rate_range={profile.rate_range}
                        availability={profile.availability}
                      />
                    </SectionLock>
                    <div className="border-t border-gray-200"></div>
                  </>
                )}

                {profile.work_experiences && profile.work_experiences.length > 0 && (
                  <>
                    <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                      <ExperienceSection experiences={profile.work_experiences} />
                    </SectionLock>
                    <div className="border-t border-gray-200"></div>
                  </>
                )}

                {((profile.technical_skills && profile.technical_skills.length > 0) || 
                  (profile.soft_skills && profile.soft_skills.length > 0)) && (
                  <>
                    <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                      <SkillsSection 
                        technical_skills={profile.technical_skills}
                        soft_skills={profile.soft_skills}
                        skills_description={profile.skills_description}
                      />
                    </SectionLock>
                    <div className="border-t border-gray-200"></div>
                  </>
                )}

                {profile.primary_tools && profile.primary_tools.length > 0 && (
                  <>
                    <SectionLock requiredPlan="standard" title="Standard Features" profileData={profile}>
                      <ToolsSection primary_tools={profile.primary_tools} />
                    </SectionLock>
                    <div className="border-t border-gray-200"></div>
                  </>
                )}

                {profile.portfolio && profile.portfolio.length > 0 && (
                  <SectionLock requiredPlan="premium" title="Premium Features" profileData={profile}>
                    <PortfolioSection 
                      projects={profile.portfolio}
                      portfolio={profile.portfolio}
                    />
                  </SectionLock>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ShareProfilePage;
