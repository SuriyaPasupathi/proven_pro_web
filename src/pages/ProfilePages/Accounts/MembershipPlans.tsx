import { useState, useEffect } from 'react';
import ProfileNav from '../ProfileNav';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { getProfile } from '../../../store/Services/CreateProfileService';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Crown, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

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

  const getPlanIcon = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'premium':
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 'pro':
        return <Sparkles className="h-6 w-6 text-purple-500" />;
      default:
        return <CheckCircle2 className="h-6 w-6 text-[#5A8DB8]" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5A8DB8]/5 to-white">
      <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5">
            <span className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent">
              Membership Plans
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#5A8DB8]/80 font-medium">
            Choose the perfect plan that suits your needs and unlock more opportunities
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Current Plan Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#5A8DB8]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#5A8DB8]/10 to-[#5A8DB8]/5 flex items-center justify-center">
                {getPlanIcon(currentPlan)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#3C5979]">Current Plan</h2>
                <p className="text-sm text-[#5A8DB8]/70">Your active subscription</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#5A8DB8]/10 to-[#5A8DB8]/5">
                <span className="text-lg font-semibold capitalize text-[#3C5979]">{currentPlan}</span>
                <div className="h-1 w-1 rounded-full bg-[#5A8DB8]/40"></div>
                <span className="text-sm text-[#5A8DB8]/70">Active</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full sm:w-auto border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300 flex items-center gap-2"
              onClick={() => navigate('/plans')}
            >
              <ArrowRight className="h-4 w-4" />
              Change Plan
            </Button>
          </div>

          {/* Plan Features */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#5A8DB8]/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#5A8DB8]/10 to-[#5A8DB8]/5 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-[#5A8DB8]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#3C5979]">Plan Features</h2>
                <p className="text-sm text-[#5A8DB8]/70">What's included in your plan</p>
              </div>
            </div>

            <div className="space-y-4">
              {currentPlan.toLowerCase() === 'free' && (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5A8DB8]/5">
                    <CheckCircle2 className="h-5 w-5 text-[#5A8DB8]" />
                    <span className="text-[#3C5979]">Basic profile visibility</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5A8DB8]/5">
                    <CheckCircle2 className="h-5 w-5 text-[#5A8DB8]" />
                    <span className="text-[#3C5979]">Limited project applications</span>
                  </div>
                </>
              )}
              {currentPlan.toLowerCase() === 'pro' && (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5A8DB8]/5">
                    <CheckCircle2 className="h-5 w-5 text-[#5A8DB8]" />
                    <span className="text-[#3C5979]">Enhanced profile visibility</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5A8DB8]/5">
                    <CheckCircle2 className="h-5 w-5 text-[#5A8DB8]" />
                    <span className="text-[#3C5979]">Unlimited project applications</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5A8DB8]/5">
                    <CheckCircle2 className="h-5 w-5 text-[#5A8DB8]" />
                    <span className="text-[#3C5979]">Priority support</span>
                  </div>
                </>
              )}
              {currentPlan.toLowerCase() === 'premium' && (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5A8DB8]/5">
                    <CheckCircle2 className="h-5 w-5 text-[#5A8DB8]" />
                    <span className="text-[#3C5979]">Premium profile visibility</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5A8DB8]/5">
                    <CheckCircle2 className="h-5 w-5 text-[#5A8DB8]" />
                    <span className="text-[#3C5979]">Unlimited project applications</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5A8DB8]/5">
                    <CheckCircle2 className="h-5 w-5 text-[#5A8DB8]" />
                    <span className="text-[#3C5979]">24/7 priority support</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5A8DB8]/5">
                    <CheckCircle2 className="h-5 w-5 text-[#5A8DB8]" />
                    <span className="text-[#3C5979]">Advanced analytics</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembershipPlans;
