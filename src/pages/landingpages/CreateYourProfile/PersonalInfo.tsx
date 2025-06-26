import React, { useState, useEffect } from "react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import StepAccessControl from "../../../components/StepAccessControl";
import { getTotalSteps, getStepProgress, getNextAvailableStep, SubscriptionType } from "../../../utils/subscriptionUtils";

const CURRENT_STEP = 1;

interface PersonalInfoForm {
  first_name: string;
  last_name: string;
  mobile: string;
  countryCode: string;
  bio: string;
  rating: string;
  profile_url: string;
}

const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { profileData, loading } = useSelector((state: RootState) => state.createProfile);
  
  const subscriptionType = profileData?.subscription_type || 'free';
  const totalSteps = getTotalSteps(subscriptionType as SubscriptionType);
  const progressPercent = getStepProgress(CURRENT_STEP, subscriptionType as SubscriptionType);

  // Debug logging
  console.log('PersonalInfo Debug:', {
    subscriptionType,
    totalSteps,
    progressPercent,
    profileData
  });

  const [form, setForm] = useState<PersonalInfoForm>({
    first_name: "",
    last_name: "",
    mobile: "",
    countryCode: "",
    bio: "",
    rating: "",
    profile_url: "",
  });

  useEffect(() => {
    // Pre-fill form with existing data if available
    if (profileData) {
      setForm({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        mobile: profileData.mobile || "",
        countryCode: (profileData as any).countryCode || "",
        bio: profileData.bio || "",
        rating: profileData.rating ? String(profileData.rating) : "",
        profile_url: profileData.profile_url || "",
      });
    }
  }, [profileData]);

  const validateForm = () => {
    if (!form.first_name.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!form.last_name.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!form.mobile.trim()) {
      toast.error("Mobile number is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to continue');
        navigate('/login');
        return;
      }

      // Format phone number (remove any non-digit characters)
      const formattedPhone = form.mobile ? form.mobile.replace(/\D/g, '') : '';

      const profileData = {
        subscription_type: subscriptionType as SubscriptionType,
        first_name: form.first_name ? form.first_name.trim() : '',
        last_name: form.last_name ? form.last_name.trim() : '',
        mobile: formattedPhone,
        countryCode: form.countryCode,
        bio: form.bio ? form.bio.trim() : undefined,
       
      };

      console.log('Submitting profile data:', profileData);

      // Ensure we're using the correct action creator
      const action = createUserProfile(profileData);
      const result = await dispatch(action).unwrap();
      
      if (result) {
        toast.success("Personal information saved successfully!");
        
        // Navigate to the next available step
        const nextStep = getNextAvailableStep(CURRENT_STEP, subscriptionType as SubscriptionType);
        if (nextStep) {
          navigate(nextStep.path);
        } else {
          // If no next step, navigate to profile page
          const profileId = result.data?.id || localStorage.getItem('userProfileId');
          if (profileId) {
            navigate(`/profile/${profileId}`);
          }
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      const error = err as { message: string; code?: string };
      
      if (error.code === 'UNAUTHORIZED') {
        toast.error('Please log in to continue');
        navigate('/login');
      } else {
        toast.error(error.message || "Failed to save personal information");
      }
    }
  };

  return (
    <StepAccessControl currentStep={CURRENT_STEP}>
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FBFF] px-4 sm:px-6 md:px-8 py-8 flex flex-col">
        {/* Step Progress */}
        <div className="mb-10 w-full max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-black flex items-center gap-2">
              Step {CURRENT_STEP} of {totalSteps}
            </h2>
            <span className="text-black/80 text-sm font-medium bg-[#5A8DB8]/5 px-3 py-1 rounded-full">
              {progressPercent}% Complete
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-[#5A8DB8]/20 p-6 sm:p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#5A8DB8] mb-2">
                  Personal Information
                </h1>
                <p className="text-gray-600">
                  Let's start by getting to know you better
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <Input
                      id="first_name"
                      type="text"
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      placeholder="Enter your first name"
                      className="border-gray-200 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <Input
                      id="last_name"
                      type="text"
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      placeholder="Enter your last name"
                      className="border-gray-200 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                    Mobile Number *
                  </label>
                  <PhoneInput
                    country={'us'}
                    value={form.mobile}
                    onChange={(phone, country: any) => {
                      setForm({ 
                        ...form, 
                        mobile: phone,
                        countryCode: String(country.dialCode || "")
                      });
                    }}
                    inputClass="w-full h-10 px-3 py-2 border border-gray-200 rounded-md focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                    containerClass="w-full"
                    inputProps={{
                      required: true
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="border-gray-200 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 min-h-[100px]"
                    rows={4}
                  />
                </div>

              

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-lg font-semibold py-3 px-4 text-sm sm:text-base"
                >
                  {loading ? "Saving..." : "Save & Continue"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </StepAccessControl>
  );
};

export default PersonalInfo;
