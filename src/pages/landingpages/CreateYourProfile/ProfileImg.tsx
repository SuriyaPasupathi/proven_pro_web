import React, { useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import {  Upload, ArrowLeft, ArrowRight, Sparkles, Image as ImageIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";

const TOTAL_STEPS = 8;
const CURRENT_STEP = 2;

const ProfileImg: React.FC = () => {
  const [form, setForm] = useState({
    profile_pic: null as File | null,
    profile_pic_url: "",
  });
  const [isDragging, setIsDragging] = useState(false);
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
      formData.append('subscription_type', 'premium');
      formData.append('profile_pic', form.profile_pic);

      const result = await dispatch(createUserProfile(formData)).unwrap();
      
      if (result) {
        // Clean up the preview URL
        if (form.profile_pic_url) {
          URL.revokeObjectURL(form.profile_pic_url);
        }

        toast.success("Profile image saved successfully!");
        
        // Navigate to the next step
        navigate("/create-profile/services-offer");
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save profile image");
    }
  };

  const progressPercent = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FBFF] px-4 sm:px-6 md:px-8 py-8 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full max-w-4xl mx-auto mb-10">
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

      {/* Image Upload Section */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] flex items-center justify-center shadow-lg">
            <ImageIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3C5979]">
              Profile Image
            </h1>
            <p className="text-sm text-[#5A8DB8]/70 mt-1">Upload your profile picture</p>
          </div>
        </div>

        <div 
          className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-12 px-4 sm:px-8 transition-all duration-300 ${
            isDragging 
              ? 'border-[#5A8DB8] bg-[#5A8DB8]/5' 
              : 'border-[#5A8DB8]/30 hover:border-[#5A8DB8]/50 hover:bg-[#5A8DB8]/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            {form.profile_pic_url ? (
              <div className="relative group">
                <img
                  src={form.profile_pic_url}
                  alt="Profile Preview"
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover mb-4 shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20"
                    onClick={handleUploadClick}
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-[#5A8DB8]/10 rounded-full w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center mb-4 group hover:bg-[#5A8DB8]/20 transition-colors duration-300">
                <Upload className="w-12 h-12 text-[#5A8DB8]/40 group-hover:text-[#5A8DB8]/60 transition-colors" />
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
              className="mt-2 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleUploadClick}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>

            <p className="text-[#5A8DB8]/70 text-sm mt-4 text-center max-w-sm">
              Recommended: Square image, at least 400x400 pixels for best results.
              <br />
              Drag and drop your image here or click to browse
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#EAF3FA] p-4 rounded-xl border-2 border-[#5A8DB8]/20">
            <p className="text-sm text-[#5A8DB8] flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              {error.message}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            className="border-2 border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition flex items-center gap-2 px-6 py-2 rounded-xl"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl"
            disabled={loading}
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

export default ProfileImg;
