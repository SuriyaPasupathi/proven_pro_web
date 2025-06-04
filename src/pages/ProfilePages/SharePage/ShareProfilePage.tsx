import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { getProfile, submitProfileReview, getProfileReviews } from '../../../store/Services/CreateProfileService';
import { resetReviewState, resetReviewsState } from '../../../store/Slice/CreateProfileSlice';
import ProfileHeader from '../ProfileHeader';
import ExperienceSection from '../ExperienceSection';
import PortfolioSection from '../PortfolioSection';
import ProfileSidebar from '../ProfileSidebar';
import ReviewCarousel from '../ReviewCarousel';
import ServicesSection from '../ServicesSection';
import SkillsSection from '../SkillsSection';
import ToolsSection from '../ToolsSection';
import { ThemeProvider } from '../ThemeProvider';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ShareNavbar from './ShareNavbar';

const ShareProfilePage = () => {
  const { profileId, shareToken } = useParams();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    profileData, 
    loading, 
    reviewSubmissionSuccess, 
    error: profileError,
    reviews,
    reviewsLoading 
  } = useAppSelector((state) => state.createProfile);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (profileId && shareToken) {
          await dispatch(getProfile(profileId)).unwrap();
          // Fetch reviews after profile is loaded
          await dispatch(getProfileReviews(profileId)).unwrap();
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
    if (reviewSubmissionSuccess) {
      toast.success('Review submitted successfully!');
      dispatch(resetReviewState());
      // Refresh reviews after successful submission
      if (profileId) {
        dispatch(getProfileReviews(profileId));
      }
    }
  }, [reviewSubmissionSuccess, dispatch, profileId]);

  const handleReviewSubmit = async (review: { rating: number; content: string; name: string }) => {
    if (!shareToken) return;

    try {
      await dispatch(submitProfileReview({
        share_token: shareToken,
        reviewer_name: review.name,
        rating: review.rating,
        comment: review.content,
        id: profileId || ''
      })).unwrap();
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#70a4d8]" />
      </div>
    );
  }

  if (error || profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error || profileError?.message}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">The requested profile could not be found.</p>
        </div>
      </div>
    );
  }

  // Transform reviews to match ReviewCarousel interface
  const transformedReviews = reviews.map(review => ({
    id: review.id,
    name: review.reviewer_name,
    company: review.company || 'Anonymous',
    rating: review.rating,
    content: review.comment
  }));

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-gray-50">
        <ShareNavbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar profileData={{ ...profileData, id: profileId || '' }} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <ProfileHeader profileData={{ ...profileData, id: profileId || '' }} />
              
              {profileData.experiences && profileData.experiences.length > 0 && (
                <ExperienceSection experiences={profileData.experiences} />
              )}

              {profileData.projects && profileData.projects.length > 0 && (
                <PortfolioSection projects={profileData.projects} />
              )}

              {profileData.categories && profileData.categories.length > 0 && (
                <ServicesSection categories={profileData.categories} />
              )}

              {((profileData.technical_skills && profileData.technical_skills.length > 0) || 
                (profileData.soft_skills && profileData.soft_skills.length > 0)) && (
                <SkillsSection 
                  technical_skills={profileData.technical_skills}
                  soft_skills={profileData.soft_skills}
                  skills_description={profileData.skills_description}
                />
              )}

              {profileData.primary_tools && profileData.primary_tools.length > 0 && (
                <ToolsSection primary_tools={profileData.primary_tools} />
              )}

              {/* Reviews Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                {reviewsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#70a4d8]" />
                  </div>
                ) : (
                  <ReviewCarousel 
                    reviews={transformedReviews}
                    onSubmit={handleReviewSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ShareProfilePage;
