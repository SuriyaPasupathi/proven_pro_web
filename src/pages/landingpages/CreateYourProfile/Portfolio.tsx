import React, { useRef, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";
import StepAccessControl from "../../../components/StepAccessControl";
import { SubscriptionType, getTotalSteps, getStepProgress, getNextAvailableStep } from "../../../utils/subscriptionUtils";

const CURRENT_STEP = 6;

interface ProjectImage {
  file: File;
  previewUrl: string;
}

const Portfolio: React.FC = () => {
  const [form, setForm] = useState({
    project_title: "",
    project_description: "",
    project_url: "",
    project_images: [] as ProjectImage[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, profileData } = useSelector((state: RootState) => state.createProfile);

  // Get subscription type from Redux store
  const subscriptionType = profileData?.subscription_type || 'free';
  const totalSteps = getTotalSteps(subscriptionType as SubscriptionType);
  const progressPercent = getStepProgress(CURRENT_STEP, subscriptionType as SubscriptionType);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Validate each file
      for (const file of newFiles) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 5MB`);
          return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          return;
        }
      }

      // Create preview URLs for new files
      const newImages = newFiles.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));

      setForm(prev => ({
        ...prev,
        project_images: [...prev.project_images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => {
      const newImages = [...prev.project_images];
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].previewUrl);
      newImages.splice(index, 1);
      return { ...prev, project_images: newImages };
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions while loading
    if (loading) return;
    
    try {
      if (form.project_images.length === 0) {
        toast.error('Please upload at least one project image');
        return;
      }

      const formData = new FormData();
      formData.append('subscription_type', subscriptionType);
      
      // Create portfolio array with single item
      const portfolioItem = {
        project_title: form.project_title,
        project_description: form.project_description,
        project_url: form.project_url,
      };
      
      // Append the portfolio item as a JSON string
      formData.append('portfolio', JSON.stringify([portfolioItem]));
      
      // Append all image files
      form.project_images.forEach((image, index) => {
        formData.append(`project_image_${index}`, image.file);
      });

      const result = await dispatch(createUserProfile(formData)).unwrap();
      
      if (result) {
        // Clean up all preview URLs
        form.project_images.forEach(image => {
          URL.revokeObjectURL(image.previewUrl);
        });
        
        // Reset form state
        setForm({
          project_title: "",
          project_description: "",
          project_url: "",
          project_images: [],
        });
        
        toast.success("Portfolio saved successfully!");
        
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
      console.error('Upload error:', err);
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save portfolio");
    }
  };

  return (
    <StepAccessControl currentStep={CURRENT_STEP}>
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FBFF] px-4 sm:px-6 md:px-8 py-8 flex flex-col">
        {/* Step Progress */}
        <div className="mb-10 w-full max-w-5xl mx-auto">
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
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex flex-col gap-8"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                Portfolio
              </h1>
              <p className="text-sm text-black/70 mt-1">Showcase your best work</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="project_title" className="text-sm font-medium text-black mb-2">
                Project Title
              </label>
              <Input
                id="project_title"
                name="project_title"
                placeholder="Enter project name"
                value={form.project_title}
                onChange={handleChange}
                className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                required
              />
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="project_description" className="text-sm font-medium text-black mb-2">
                Project Description
              </label>
              <Textarea
                id="project_description"
                name="project_description"
                placeholder="Describe your project..."
                value={form.project_description}
                onChange={handleChange}
                className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 min-h-[120px]"
                required
              />
            </div>

            {/* Project URL */}
            <div>
              <label htmlFor="project_url" className="text-sm font-medium text-black mb-2">
                Project URL
              </label>
              <Input
                id="project_url"
                name="project_url"
                placeholder="https://..."
                value={form.project_url}
                onChange={handleChange}
                className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-[#5A8DB8]/30 rounded-xl flex flex-col items-center justify-center py-12 px-4 sm:px-6 md:px-8 text-center bg-white/50 hover:bg-white/80 transition-colors duration-300"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    handleImageChange({ target: { files: e.dataTransfer.files } } as any);
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                  multiple
                />
                <div className="h-16 w-16 rounded-full bg-[#5A8DB8]/10 flex items-center justify-center mb-4">
                  <div className="text-[#5A8DB8] text-2xl font-bold">+</div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mb-3 bg-white border-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 text-black transition-all duration-300 rounded-xl"
                  onClick={handleUploadClick}
                >
                  Upload Project Images
                </Button>
                <p className="text-black/70 text-sm">
                  Drag and drop images here or click to upload (max 5MB each)
                </p>
              </div>

              {/* Image Previews */}
              {form.project_images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {form.project_images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden shadow-md">
                        <img
                          src={image.previewUrl}
                          alt={`Project preview ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-600 shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[#EAF3FA] p-4 rounded-xl border-2 border-[#5A8DB8]/20">
              <p className="text-sm text-black flex items-center gap-2">
                {error.message}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              className="border-2 border-[#5A8DB8]/30 text-black hover:bg-[#5A8DB8]/10 transition flex items-center gap-2 px-6 py-2 rounded-xl"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
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
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </StepAccessControl>
  );
};

export default Portfolio;
