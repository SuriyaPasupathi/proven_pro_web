import React, { useRef, useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile, checkProfileStatus } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";
import StepAccessControl from "../../../components/StepAccessControl";
import { getTotalSteps, getStepProgress, getNextAvailableStep, SubscriptionType } from "../../../utils/subscriptionUtils";

const CURRENT_STEP = 2;

interface ProfileImgForm {
  profile_pic: File | null;
  profile_pic_url: string;
}

const ProfileImg: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { profileData, loading } = useSelector((state: RootState) => state.createProfile);
  
  const subscriptionType = profileData?.subscription_type || 'free';
  const totalSteps = getTotalSteps(subscriptionType as SubscriptionType);
  const progressPercent = getStepProgress(CURRENT_STEP, subscriptionType as SubscriptionType);

  // Debug logging
  console.log('ProfileImg Debug:', {
    subscriptionType,
    totalSteps,
    progressPercent,
    profileData
  });

  const [form, setForm] = useState<ProfileImgForm>({
    profile_pic: null,
    profile_pic_url: "",
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Pre-fill form with existing data if available
    if (profileData?.profile_pic_url) {
      setForm(prev => ({
        ...prev,
        profile_pic_url: profileData.profile_pic_url || ""
      }));
    }
  }, [profileData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setForm({
        profile_pic: file,
        profile_pic_url: previewUrl
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setForm({
        profile_pic: file,
        profile_pic_url: previewUrl
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!form.profile_pic) {
        toast.error('Please upload a profile image');
        return;
      }

      const formData = new FormData();
      formData.append('subscription_type', subscriptionType);
      formData.append('profile_pic', form.profile_pic);

      const result = await dispatch(createUserProfile(formData)).unwrap();
      
      if (result) {
        // Clean up the preview URL
        if (form.profile_pic_url) {
          URL.revokeObjectURL(form.profile_pic_url);
        }

        toast.success("Profile image saved successfully!");
        
        // Navigate to the next available step
        const nextStep = getNextAvailableStep(CURRENT_STEP, subscriptionType as SubscriptionType);
        
        console.log('ProfileImg Navigation Debug:', {
          currentStep: CURRENT_STEP,
          subscriptionType,
          nextStep,
          nextStepPath: nextStep?.path
        });
        
        if (nextStep) {
          navigate(nextStep.path);
        } else {
          // If no next step, navigate to profile page
          const profileId = result.data?.id || localStorage.getItem('userProfileId');
          console.log('No next step available, navigating to profile:', profileId);
          if (profileId) {
            navigate(`/profile/${profileId}`);
          }
        }
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save profile image");
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
                  Profile Image
                </h1>
                <p className="text-gray-600">
                  Upload a professional photo to make your profile stand out
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                      isDragging
                        ? 'border-[#5A8DB8] bg-[#5A8DB8]/5'
                        : 'border-gray-300 hover:border-[#5A8DB8] hover:bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {form.profile_pic_url ? (
                      <div className="space-y-4">
                        <img
                          src={form.profile_pic_url}
                          alt="Profile preview"
                          className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-[#5A8DB8]/20"
                        />
                        <p className="text-sm text-gray-600">
                          Image uploaded successfully
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleUploadClick}
                          className="text-[#5A8DB8] border-[#5A8DB8] hover:bg-[#5A8DB8] hover:text-white"
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-700 mb-2">
                            Upload Profile Image
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            Drag and drop an image here, or click to select
                          </p>
                          <Button
                            type="button"
                            onClick={handleUploadClick}
                            className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                          >
                            Choose File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div className="text-xs text-gray-500 text-center">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !form.profile_pic}
                  className="w-full bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-lg font-semibold py-3 px-4 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ProfileImg;
