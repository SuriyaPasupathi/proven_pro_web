import React, { useState, useEffect } from "react";
// import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";

interface ServiceForm {
  services_categories: string;
  services_description: string;
  rate_range: string;
  availability: string;
}

const TOTAL_STEPS = 8;
const CURRENT_STEP = 3;

const ServicesOffer: React.FC = () => {
  const [serviceForms, setServiceForms] = useState<ServiceForm[]>([{
    services_categories: "",
    services_description: "",
    rate_range: "",
    availability: "",
  }]);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, profileData } = useSelector((state: RootState) => state.createProfile);

  // Initialize form with existing data if available
  useEffect(() => {
    if (profileData?.categories && profileData.categories.length > 0) {
      const formattedCategories = profileData.categories.map(category => ({
        services_categories: category.services_categories || '',
        services_description: category.services_description || '',
        rate_range: category.rate_range || '',
        availability: category.availability || ''
      }));
      setServiceForms(formattedCategories);
    }
  }, [profileData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newForms = [...serviceForms];
    newForms[index] = {
      ...newForms[index],
      [e.target.name]: e.target.value
    };
    setServiceForms(newForms);
  };

  const addNewService = () => {
    setServiceForms([
      ...serviceForms,
      {
        services_categories: "",
        services_description: "",
        rate_range: "",
        availability: "",
      }
    ]);
  };

  const removeService = (index: number) => {
    if (serviceForms.length > 1) {
      const newForms = serviceForms.filter((_, i) => i !== index);
      setServiceForms(newForms);
    } else {
      toast.error("You must have at least one service category");
    }
  };

  const validateForm = () => {
    for (const form of serviceForms) {
      if (!form.services_categories || form.services_categories.trim() === '') {
        toast.error("Please enter service categories");
        return false;
      }
      if (!form.services_description || form.services_description.trim() === '') {
        toast.error("Please provide a service description");
        return false;
      }
      if (!form.rate_range || form.rate_range.trim() === '') {
        toast.error("Please enter a rate range");
        return false;
      }
      if (!form.availability || form.availability.trim() === '') {
        toast.error("Please enter availability");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const formattedCategories = serviceForms.map(form => ({
        services_categories: form.services_categories,
        services_description: form.services_description,
        rate_range: form.rate_range,
        availability: form.availability
      }));

      const profileData = {
        subscription_type: "premium" as const,
        categories: formattedCategories
      };

      console.log('Submitting profile data:', profileData);

      const result = await dispatch(createUserProfile(profileData)).unwrap();
      
      if (result) {
        console.log('Profile creation response:', result);
        toast.success("Services information saved successfully!");
        navigate("/create-profile/work-exp");
      }
    } catch (err) {
      console.error('Profile creation error:', err);
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save services information");
    }
  };

  const progressPercent = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-6 flex flex-col">
      {/* Progress Section */}
      <div className="mb-8 w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Step {CURRENT_STEP} of {TOTAL_STEPS}
          </h2>
          <span className="text-sm text-gray-500">{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-2 bg-[#3C5979] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Services Offered
          </h1>
          <Button
            type="button"
            onClick={addNewService}
            className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>

        {serviceForms.map((form, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-6 relative">
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                onClick={() => removeService(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <h3 className="text-lg font-semibold text-gray-800">
              Service Category {index + 1}
            </h3>

            <div>
              <label htmlFor={`services_categories_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Main Service Category
              </label>
              <input
                type="text"
                id={`services_categories_${index}`}
                name="services_categories"
                value={form.services_categories}
                onChange={(e) => handleChange(e, index)}
                className="w-full p-2 border rounded-md bg-gray-50"
                placeholder="Enter your service categories..."
                required
              />
            </div>

            <div>
              <label htmlFor={`services_description_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Service Description
              </label>
              <Textarea
                id={`services_description_${index}`}
                name="services_description"
                placeholder="Describe your main services and expertise..."
                value={form.services_description}
                onChange={(e) => handleChange(e, index)}
                className="bg-gray-50 min-h-[120px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`rate_range_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Rate Range
                </label>
                <input
                  type="text"
                  id={`rate_range_${index}`}
                  name="rate_range"
                  value={form.rate_range}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full p-2 border rounded-md bg-gray-50"
                  placeholder="Enter your rate range..."
                  required
                />
              </div>

              <div>
                <label htmlFor={`availability_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <input
                  type="text"
                  id={`availability_${index}`}
                  name="availability"
                  value={form.availability}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full p-2 border rounded-md bg-gray-50"
                  placeholder="Enter your availability..."
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message}
          </div>
        )}

        {/* Button Group */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto hover:bg-[#5A8DB8] hover:text-white transition"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServicesOffer;
