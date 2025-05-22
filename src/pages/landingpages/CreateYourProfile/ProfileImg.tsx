import React, { useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";

const TOTAL_STEPS = 8;
const CURRENT_STEP = 2;

// Get the base URL from environment variable
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ProfileImg: React.FC = () => {
  const [form, setForm] = useState({
    profile_pic: null as File | null,
    profile_pic_url: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState & { createProfile: { loading: boolean; error: any } }) => state.createProfile);

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
      formData.append('subscription_type', 'premium');
      formData.append('profile_pic', form.profile_pic);

      // Debug logging
      console.log('Uploading image:', {
        file: form.profile_pic,
        previewUrl: form.profile_pic_url
      });

      const result = await dispatch(createUserProfile(formData)).unwrap();
      
      // Debug logging
      console.log('Upload result:', result);
      
      if (result) {
        // Clean up the preview URL
        if (form.profile_pic_url) {
          URL.revokeObjectURL(form.profile_pic_url);
        }

        // Store the raw URL from the server
        if (result.profile_pic_url) {
          result.profile_pic_url = result.profile_pic_url;
        }

        toast.success("Profile image saved successfully!");
        navigate("/create-profile/services-offer");
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save profile image");
    }
  };

  const progressPercent = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  // Add debug logging for the form state
  console.log('Current form state:', {
    hasFile: !!form.profile_pic,
    previewUrl: form.profile_pic_url
  });

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-6 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl mx-auto mb-8">
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

      {/* Image Upload Section */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Profile Image</h1>

        <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-12 px-4 sm:px-8">
          <div className="flex flex-col items-center">
            {form.profile_pic_url ? (
              <img
                src={form.profile_pic_url}
                alt="Profile Preview"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="bg-gray-100 rounded-full w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center mb-4">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile_pic"
            />

            <Button
              type="button"
              className="mt-2 bg-[#5A8DB8] text-white hover:bg-[#3C5979]"
              onClick={handleUploadClick}
            >
              Upload Image
            </Button>

            <p className="text-gray-500 text-sm mt-4 text-center max-w-sm">
              Recommended: Square image, at least 400x400 pixels for best results.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto hover:bg-[#5A8DB8] hover:text-white"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileImg;
