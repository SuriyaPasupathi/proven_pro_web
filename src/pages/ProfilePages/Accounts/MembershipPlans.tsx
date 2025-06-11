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
    <div className="min-h-screen bg-gradient-to-b from-[#5A8DB8]/10 to-white">
      <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#5A8DB8] font-bold mb-2 sm:mb-3 md:mb-4">Membership Plans</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2 sm:px-4 md:px-6 font-semibold">Choose the perfect plan that suits your needs and unlock more opportunities</p>
        </div>
        <div className="bg-gary-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 md:p-8 border border-[#5A8DB8]/10 w-full max-w-xl mx-auto">
          <div className="font-semibold text-base md:text-lg mb-3 md:mb-4 text-[#5A8DB8]">Current plan</div>
          <div className="mb-4 md:mb-6 capitalize text-sm md:text-base">{currentPlan}</div>
          <Button 
            variant="outline" 
            className="text-[#5A8DB8] border-[#5A8DB8] hover:bg-[#5A8DB8] hover:text-white transition-colors duration-300 w-full sm:w-auto"
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
