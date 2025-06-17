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
import { User, Phone, ArrowLeft, ArrowRight, UserCircle, MessageSquare, Sparkles } from 'lucide-react';

const TOTAL_STEPS = 8;
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
  const [form, setForm] = useState<PersonalInfoForm>({
    first_name: "",
    last_name: "",
    mobile: "",
    countryCode: "",
    bio: "",
    rating: "",
    profile_url: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState & { createProfile: { loading: boolean; error: any } }) => state.createProfile);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('personalInfo');
    const isFromPreviousStep = sessionStorage.getItem('fromPreviousStep');
    
    if (savedData && isFromPreviousStep) {
      setForm(JSON.parse(savedData));
      // Clear the flag after loading
      sessionStorage.removeItem('fromPreviousStep');
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    // Save to localStorage whenever form changes
    localStorage.setItem('personalInfo', JSON.stringify(newForm));
  };

  const handlePhoneChange = (value: string, data: any) => {
    const newForm = { 
      ...form, 
      mobile: value,
      countryCode: data.countryCode
    };
    setForm(newForm);
    localStorage.setItem('personalInfo', JSON.stringify(newForm));
  };

  const validateForm = () => {
    if (!form.first_name.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!form.last_name.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!form.mobile.trim()) {
      toast.error('Phone number is required');
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
        subscription_type: "premium" as const,
        first_name: form.first_name ? form.first_name.trim() : '',
        last_name: form.last_name ? form.last_name.trim() : '',
        mobile: formattedPhone,
        countryCode: form.countryCode,
        bio: form.bio ? form.bio.trim() : undefined,
        rating: form.rating ? form.rating.trim() : undefined,
        profile_url: form.profile_url ? form.profile_url.trim() : undefined
      };

      console.log('Submitting profile data:', profileData);

      // Ensure we're using the correct action creator
      const action = createUserProfile(profileData);
      const result = await dispatch(action).unwrap();
      
      if (result) {
        toast.success("Personal information saved successfully!");
        navigate("/create-profile/profile-img");
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

  const progressPercent = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FBFF] px-4 sm:px-6 md:px-8 py-8 flex flex-col">
      {/* Step Progress */}
      <div className="mb-10 w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#3C5979] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#5A8DB8]" />
            Step {CURRENT_STEP} of {TOTAL_STEPS}
          </h2>
          <span className="text-[#5A8DB8]/80 text-sm font-medium bg-[#5A8DB8]/5 px-3 py-1 rounded-full">
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
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto flex flex-col gap-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
        noValidate
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] flex items-center justify-center shadow-lg">
              <UserCircle className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#3C5979]">
                Personal Information
              </h1>
              <p className="text-sm text-[#5A8DB8]/70 mt-1">Tell us about yourself</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative group">
              <label htmlFor="first_name" className="text-sm font-medium text-[#3C5979] flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                First Name
              </label>
              <div className="relative">
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 group-hover:border-[#5A8DB8]/40"
                  required
                />
                <User className="w-5 h-5 text-[#5A8DB8]/40 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-[#5A8DB8]/60 transition-colors" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="relative group">
              <label htmlFor="last_name" className="text-sm font-medium text-[#3C5979] flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                Last Name
              </label>
              <div className="relative">
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Enter your last name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-3 bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 group-hover:border-[#5A8DB8]/40"
                  required
                />
                <User className="w-5 h-5 text-[#5A8DB8]/40 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-[#5A8DB8]/60 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <label htmlFor="mobile" className="text-sm font-medium text-[#3C5979] flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <div className="relative">
              <PhoneInput
                country={'us'}
                value={form.mobile}
                onChange={handlePhoneChange}
                inputClass="pl-10 pr-4 py-3 bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 group-hover:border-[#5A8DB8]/40 w-full"
                buttonClass="border-2 border-[#5A8DB8]/20 bg-white rounded-l-xl group-hover:border-[#5A8DB8]/40"
                containerClass="w-full"
                inputProps={{
                  name: 'mobile',
                  required: true,
                  id: 'mobile'
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <label htmlFor="bio" className="text-sm font-medium text-[#3C5979] flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4" />
              Bio
            </label>
            <div className="relative">
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                value={form.bio}
                onChange={handleChange}
                className="pl-10 pr-4 py-3 bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 min-h-[120px] group-hover:border-[#5A8DB8]/40"
              />
              <MessageSquare className="w-5 h-5 text-[#5A8DB8]/40 absolute left-3 top-3 group-hover:text-[#5A8DB8]/60 transition-colors" />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-[#EAF3FA] p-4 rounded-xl border-2 border-[#5A8DB8]/20">
            <p className="text-sm text-[#5A8DB8] flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {error.message}
            </p>
          </div>
        )}

        {/* Button Group */}
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            className="border-2 border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition flex items-center gap-2 px-6 py-2 rounded-xl"
            onClick={() => {
              sessionStorage.setItem('fromPreviousStep', 'true');
              navigate(-1);
            }}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save and Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
