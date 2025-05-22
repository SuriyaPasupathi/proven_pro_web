import { useState, useEffect } from 'react';
import ProfileNav from '../ProfileNav';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { getProfile } from '../../../store/Services/CreateProfileService';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MembershipPlans = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { profileData } = useSelector((state: RootState) => state.createProfile);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const currentPlan = profileData?.subscription_type || 'free';

  return (
    <div className="min-h-screen bg-background">
      <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-2xl font-semibold mt-10 mb-8">Membership</h1>
        <div className="bg-white rounded-md shadow p-8 border max-w-xl mx-auto">
          <div className="font-semibold text-lg mb-4">Current plan</div>
          <div className="mb-6 capitalize">{currentPlan}</div>
          <Button variant="outline" className="text-[#5A8DB8] border-[#5A8DB8]" onClick={() => navigate('/plans')}>
            Change Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MembershipPlans;
