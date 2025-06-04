import { useState, useEffect } from 'react';
import ProfileNav from '../ProfileNav';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { getProfile } from '../../../store/Services/CreateProfileService';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

const MembershipPlans = () => {
  const { profileId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { profileData } = useSelector((state: RootState) => state.createProfile);
  const navigate = useNavigate();

  useEffect(() => {
    if (profileId) {
      dispatch(getProfile(profileId));
    }
  }, [dispatch, profileId]);

  const currentPlan = profileData?.subscription_type || 'free';

  return (
    <div className="min-h-screen bg-background">
      <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-full md:w-11/12 mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-16">
        <h1 className="text-xl md:text-2xl font-semibold mt-6 md:mt-10 mb-4 md:mb-8">Membership</h1>
        <div className="bg-white rounded-md shadow p-4 sm:p-6 md:p-8 border w-full max-w-xl mx-auto">
          <div className="font-semibold text-base md:text-lg mb-3 md:mb-4">Current plan</div>
          <div className="mb-4 md:mb-6 capitalize text-sm md:text-base">{currentPlan}</div>
          <Button 
            variant="outline" 
            className="text-[#5A8DB8] border-[#5A8DB8] w-full sm:w-auto"
            onClick={() => navigate('/plans')}
          >
            Change Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MembershipPlans;
