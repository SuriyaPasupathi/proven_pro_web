import React, { useRef, useState } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import { AppDispatch, RootState } from "../../../store/store";
import toast from "react-hot-toast";

const TOTAL_STEPS = 8;
const CURRENT_STEP = 8;

interface ProfileError {
  message: string;
  status?: number;
  code?: string;
}

interface CreateProfileState {
  loading: boolean;
  error: ProfileError | null;
  success: boolean;
  profileData: any | null;
}

const VideoIntro: React.FC = () => {
  const [form, setForm] = useState({
    video_intro: null as File | null,
    video_intro_url: "",
    video_description: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState & { createProfile: CreateProfileState }) => state.createProfile);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file size (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast.error("Video file size should be less than 100MB");
        return;
      }
      // Check file type
      if (!selectedFile.type.startsWith("video/")) {
        toast.error("Please upload a valid video file");
        return;
      }
      
      // Create a URL for preview
      const videoUrl = URL.createObjectURL(selectedFile);
      
      setForm({
        ...form,
        video_intro: selectedFile,
        video_intro_url: videoUrl
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('subscription_type', 'premium');
      if (form.video_intro) {
        formData.append('video_intro', form.video_intro);
      }
      formData.append('video_intro_url', form.video_intro_url);
      formData.append('video_description', form.video_description);

      const result = await dispatch(createUserProfile(formData)).unwrap();
      console.log(result);
      if (result) {
        // Store the profile ID in localStorage
        localStorage.setItem('userProfileId', result.data.id);
        toast.success("Profile created successfully!");
        navigate(`/profile/${result.data.id}`);
      }
    } catch (err) {
      const error = err as ProfileError;
      toast.error(error.message || "Failed to create profile");
    }
  };

  const progressPercent = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-6 flex flex-col">
      {/* Step Progress */}
      <div className="mb-8 w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
            Step {CURRENT_STEP} of {TOTAL_STEPS}
          </h2>
          <span className="text-gray-500 text-sm md:text-base">
            {progressPercent}% Complete
          </span>
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
        className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col gap-6"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
          Video Introduction (Optional)
        </h1>

        {/* Video Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8 text-center">
          <input
            type="file"
            accept="video/mp4,video/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleVideoChange}
          />
          <Button
            type="button"
            variant="outline"
            className="mb-2"
            onClick={handleUploadClick}
          >
            Upload Video
          </Button>
          <p className="text-gray-500 text-sm">
            Upload a short video introduction (max 100MB, MP4 preferred)
          </p>
          {form.video_intro && (
            <div className="mt-3 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded max-w-[220px] truncate">
              {form.video_intro.name}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="video_description" className="block font-medium mb-1 text-sm">
            Video Description
          </label>
          <Textarea
            id="video_description"
            name="video_description"
            placeholder="Add a brief description of your video..."
            value={form.video_description}
            onChange={(e) => setForm({ ...form, video_description: e.target.value })}
            className="bg-gray-50 min-h-[100px]"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6">
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
          >
            {loading ? "Creating Profile..." : "Complete"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VideoIntro;
