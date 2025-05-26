import React, { useRef, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const TOTAL_STEPS = 8;
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
  const { loading, error } = useSelector((state: RootState) => state.createProfile);

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
    
    try {
      if (form.project_images.length === 0) {
        toast.error('Please upload at least one project image');
        return;
      }

      const formData = new FormData();
      formData.append('subscription_type', 'premium');
      
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

      // Debug logging
      console.log('Uploading portfolio:', portfolioItem);
      console.log('FormData contents:', {
        subscription_type: formData.get('subscription_type'),
        portfolio: formData.get('portfolio'),
        images: form.project_images.map(img => img.file.name)
      });

      const result = await dispatch(createUserProfile(formData)).unwrap();
      
      // Debug logging
      console.log('Upload result:', result);
      
      if (result) {
        // Clean up all preview URLs
        form.project_images.forEach(image => {
          URL.revokeObjectURL(image.previewUrl);
        });
        toast.success("Portfolio saved successfully!");
        navigate("/create-profile/licenses");
      }
    } catch (err) {
      console.error('Upload error:', err);
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save portfolio");
    }
  };

  const progressPercent = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-6 flex flex-col">
      {/* Step Progress */}
      <div className="mb-8 w-full max-w-5xl mx-auto">
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
        className="w-full max-w-5xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col gap-6"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
          Portfolio
        </h1>

        {/* Project Title */}
        <div>
          <label htmlFor="project_title" className="block font-medium mb-1 text-sm">
            Project Title
          </label>
          <Input
            id="project_title"
            name="project_title"
            placeholder="Enter project name"
            value={form.project_title}
            onChange={handleChange}
            className="bg-gray-50"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label htmlFor="project_description" className="block font-medium mb-1 text-sm">
            Project Description
          </label>
          <Textarea
            id="project_description"
            name="project_description"
            placeholder="Describe your project..."
            value={form.project_description}
            onChange={handleChange}
            className="bg-gray-50 min-h-[120px]"
            required
          />
        </div>

        {/* Project URL */}
        <div>
          <label htmlFor="project_url" className="block font-medium mb-1 text-sm">
            Project URL
          </label>
          <Input
            id="project_url"
            name="project_url"
            placeholder="https://..."
            value={form.project_url}
            onChange={handleChange}
            className="bg-gray-50"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8 text-center">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              multiple
            />
            <Button
              type="button"
              variant="outline"
              className="mb-2"
              onClick={handleUploadClick}
            >
              Upload Project Images
            </Button>
            <p className="text-gray-500 text-sm">
              Upload project images (max 5MB each)
            </p>
          </div>

          {/* Image Previews */}
          {form.project_images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {form.project_images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.previewUrl}
                    alt={`Project preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-6 gap-3">
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
            {loading ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Portfolio;
