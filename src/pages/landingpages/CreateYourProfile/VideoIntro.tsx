import React, { useRef, useState } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import { AppDispatch, RootState } from "../../../store/store";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Sparkles, Video, Upload, FileText, Loader2 } from "lucide-react";

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
        className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex flex-col gap-8"
      >
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] flex items-center justify-center shadow-lg">
            <Video className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3C5979]">
              Video Introduction
            </h1>
            <p className="text-sm text-[#5A8DB8]/70 mt-1">Add a personal touch to your profile</p>
          </div>
        </div>

        {/* Video Upload */}
        <div 
          className="border-2 border-dashed border-[#5A8DB8]/30 rounded-xl flex flex-col items-center justify-center py-12 px-4 sm:px-8 bg-white/50 hover:bg-white/80 transition-colors duration-300"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) {
              handleVideoChange({ target: { files: e.dataTransfer.files } } as any);
            }
          }}
        >
          <input
            type="file"
            accept="video/mp4,video/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleVideoChange}
          />
          <div className="h-20 w-20 rounded-full bg-[#5A8DB8]/10 flex items-center justify-center mb-6">
            <Upload className="h-10 w-10 text-[#5A8DB8]" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="mb-4 bg-white border-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 text-[#3C5979] transition-all duration-300 rounded-xl px-6 py-2"
            onClick={handleUploadClick}
          >
            Upload Video
          </Button>
          <p className="text-[#5A8DB8]/70 text-sm text-center max-w-md">
            Upload a short video introduction (max 100MB, MP4 preferred)
          </p>
          {form.video_intro && (
            <div className="mt-4 text-sm text-[#3C5979] bg-[#5A8DB8]/10 px-4 py-2 rounded-full break-all max-w-full text-center font-medium">
              {form.video_intro.name}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="video_description" className="text-sm font-medium text-[#3C5979] flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            Video Description
          </label>
          <Textarea
            id="video_description"
            name="video_description"
            placeholder="Add a brief description of your video..."
            value={form.video_description}
            onChange={(e) => setForm({ ...form, video_description: e.target.value })}
            className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 min-h-[120px] resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#EAF3FA] p-4 rounded-xl border-2 border-[#5A8DB8]/20">
            <p className="text-sm text-[#5A8DB8] flex items-center gap-2">
              <Video className="w-4 h-4" />
              {error.message}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mt-8">
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
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              <>
                Complete
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VideoIntro;
