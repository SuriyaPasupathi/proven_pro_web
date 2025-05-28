import React, { useState, useEffect } from "react";
// import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile, updateProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";
import Select, { MultiValue } from "react-select";
import { serviceCategoryOptions, rateRangeOptions, availabilityOptions } from "../../../components/common";

interface Option {
  value: string;
  label: string;
}

const TOTAL_STEPS = 8;
const CURRENT_STEP = 3;

const ServicesOffer: React.FC = () => {
  const [form, setForm] = useState({
    services_categories: [] as Option[],
    services_description: "",
    rate_range: null as Option | null,
    availability: null as Option | null,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, profileData } = useSelector((state: RootState) => state.createProfile);

  // Initialize form with existing data if available
  useEffect(() => {
    if (profileData?.categories && profileData.categories.length > 0) {
      const category = profileData.categories[0];
      setForm({
        services_categories: category.services_categories
          ? category.services_categories.split(',').map(cat => ({
              value: cat.trim(),
              label: cat.trim()
            }))
          : [],
        services_description: category.services_description || "",
        rate_range: category.rate_range
          ? rateRangeOptions.find(opt => opt.value === category.rate_range) || null
          : null,
        availability: category.availability
          ? availabilityOptions.find(opt => opt.value === category.availability) || null
          : null,
      });
    }
  }, [profileData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (field: string) => (selectedOptions: MultiValue<Option>) => {
    setForm({ ...form, [field]: selectedOptions as Option[] });
  };

  const handleSingleSelectChange = (field: string) => (selectedOption: Option | null) => {
    setForm({ ...form, [field]: selectedOption });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const profileData = {
        subscription_type: "premium" as const,
        categories: [{
          services_categories: form.services_categories.map(cat => cat.value).join(', '),
          services_description: form.services_description,
          rate_range: form.rate_range?.value || "",
          availability: form.availability?.value || "",
        }],
      };

      // If we have existing profile data, use updateProfile instead of createUserProfile
      const action = profileData ? updateProfile : createUserProfile;
      const result = await dispatch(action(profileData)).unwrap();
      
      if (result) {
        toast.success("Services information saved successfully!");
        if (!profileData) {
          navigate("/create-profile/work-exp");
        }
      }
    } catch (err) {
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Services Offered
        </h1>

        <div>
          <label htmlFor="services_categories" className="block text-sm font-medium text-gray-700 mb-1">
            Main Service Category
          </label>
          <Select
            id="services_categories"
            name="services_categories"
            options={serviceCategoryOptions}
            isMulti
            placeholder="Select your service categories..."
            value={form.services_categories}
            onChange={handleMultiSelectChange('services_categories')}
            className="bg-gray-50"
            required
          />
        </div>

        <div>
          <label htmlFor="services_description" className="block text-sm font-medium text-gray-700 mb-1">
            Service Description
          </label>
          <Textarea
            id="services_description"
            name="services_description"
            placeholder="Describe your main services and expertise..."
            value={form.services_description}
            onChange={handleChange}
            className="bg-gray-50 min-h-[120px]"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rate_range" className="block text-sm font-medium text-gray-700 mb-1">
              Rate Range
            </label>
            <Select
              id="rate_range"
              name="rate_range"
              options={rateRangeOptions}
              placeholder="Select your rate range..."
              value={form.rate_range}
              onChange={handleSingleSelectChange('rate_range')}
              className="bg-gray-50"
              required
            />
          </div>

          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <Select
              id="availability"
              name="availability"
              options={availabilityOptions}
              placeholder="Select your availability..."
              value={form.availability}
              onChange={handleSingleSelectChange('availability')}
              className="bg-gray-50"
              required
            />
          </div>
        </div>

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
