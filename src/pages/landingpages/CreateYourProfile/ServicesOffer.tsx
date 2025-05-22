import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";

const TOTAL_STEPS = 8;
const CURRENT_STEP = 3;

const ServicesOffer: React.FC = () => {
  const [form, setForm] = useState({
    services_categories: "",
    services_description: "",
    rate_range: "",
    availability: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.createProfile);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert services_categories string to array
      const servicesCategories = form.services_categories
        .split(',')
        .map(category => category.trim())
        .filter(category => category.length > 0);

      const profileData = {
        subscription_type: "premium" as const,
        services_categories: servicesCategories,
        services_description: form.services_description,
        rate_range: form.rate_range,
        availability: form.availability,
      };

      // Debug logging
      console.log('Submitting services data:', profileData);

      const result = await dispatch(createUserProfile(profileData)).unwrap();
      
      // Debug logging
      console.log('Services submission result:', result);
      
      if (result) {
        toast.success("Services information saved successfully!");
        navigate("/create-profile/work-exp");
      }
    } catch (err) {
      console.error('Services submission error:', err);
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
          <Input
            id="services_categories"
            name="services_categories"
            placeholder="e.g., Web Development, Design, Marketing"
            value={form.services_categories}
            onChange={handleChange}
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
            <Input
              id="rate_range"
              name="rate_range"
              placeholder="e.g., $50-100/hour"
              value={form.rate_range}
              onChange={handleChange}
              className="bg-gray-50"
              required
            />
          </div>

          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <Input
              id="availability"
              name="availability"
              placeholder="e.g., Full-time, Part-time, Weekends only"
              value={form.availability}
              onChange={handleChange}
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
