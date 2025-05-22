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

const TOTAL_STEPS = 8;
const CURRENT_STEP = 1;

interface PersonalInfoForm {
  first_name: string;
  last_name: string;
  profile_mail: string;
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
    profile_mail: "",
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
    if (savedData) {
      setForm(JSON.parse(savedData));
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
    if (!form.profile_mail.trim()) {
      toast.error('Email is required');
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
        profile_mail: form.profile_mail ? form.profile_mail.trim().toLowerCase() : '',
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
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-6 flex flex-col">
      {/* Step Progress */}
      <div className="mb-8 w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Step {CURRENT_STEP} of {TOTAL_STEPS}
          </h2>
          <span className="text-gray-500 text-sm">{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-[#3C5979] rounded transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm flex flex-col gap-6"
        noValidate
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Personal Information</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="first_name" className="block font-medium mb-1 text-sm">
              First Name
            </label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="Enter your first name"
              value={form.first_name}
              onChange={handleChange}
              className="bg-gray-50"
              required
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block font-medium mb-1 text-sm">
              Last Name
            </label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Enter your last name"
              value={form.last_name}
              onChange={handleChange}
              className="bg-gray-50"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="profile_mail" className="block font-medium mb-1 text-sm">
            Email
          </label>
          <Input
            id="profile_mail"
            name="profile_mail"
            type="email"
            placeholder="Enter your email"
            value={form.profile_mail}
            onChange={handleChange}
            className="bg-gray-50"
            required
          />
        </div>

        <div>
          <label htmlFor="mobile" className="block font-medium mb-1 text-sm">
            Phone Number
          </label>
          <PhoneInput
            country={'us'}
            value={form.mobile}
            onChange={handlePhoneChange}
            inputClass="w-full h-9 rounded-md border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            buttonClass="border-input bg-gray-50"
            containerClass="w-full"
            inputProps={{
              name: 'mobile',
              required: true,
              id: 'mobile'
            }}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block font-medium mb-1 text-sm">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself..."
            value={form.bio}
            onChange={handleChange}
            className="bg-gray-50 min-h-[120px]"
          />
        </div>

        {/* <div>
          <label htmlFor="rating" className="block font-medium mb-1 text-sm">
            Rating
          </label>
          <Input
            id="rating"
            name="rating"
            placeholder="Enter your rating"
            value={form.rating}
            onChange={handleChange}
            className="bg-gray-50"
          />
        </div> */}

        {/* <div>
          <label htmlFor="profile_url" className="block font-medium mb-1 text-sm">
            Profile URL
          </label>
          <Input
            id="profile_url"
            name="profile_url"
            placeholder="Enter your profile URL"
            value={form.profile_url}
            onChange={handleChange}
            className="bg-gray-50"
          />
        </div> */}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message}
          </div>
        )}

        {/* Button Group */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto hover:bg-[#5A8DB8] text-black"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            {loading ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
