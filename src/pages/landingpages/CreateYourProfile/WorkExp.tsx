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
const CURRENT_STEP = 4;

const WorkExp: React.FC = () => {
  const [form, setForm] = useState({
    company_name: "",
    position: "",
    experience_start_date: "",
    experience_end_date: "",
    key_responsibilities: "",
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
      const profileData = {
        subscription_type: "premium" as const,
        company_name: form.company_name,
        position: form.position,
        experience_start_date: form.experience_start_date,
        experience_end_date: form.experience_end_date,
        key_responsibilities: form.key_responsibilities,
      };

      const result = await dispatch(createUserProfile(profileData)).unwrap();
      
      if (result) {
        toast.success("Work experience saved successfully!");
        navigate("/create-profile/tool-skills");
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save work experience");
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
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          Work Experience
        </h1>

        {/* Company Name */}
        <div>
          <label htmlFor="company_name" className="block font-medium mb-1 text-sm">
            Company Name
          </label>
          <Input
            id="company_name"
            name="company_name"
            placeholder="Enter company name"
            value={form.company_name}
            onChange={handleChange}
            className="bg-gray-50"
            required
          />
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className="block font-medium mb-1 text-sm">
            Position
          </label>
          <Input
            id="position"
            name="position"
            placeholder="Enter your job title"
            value={form.position}
            onChange={handleChange}
            className="bg-gray-50"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="experience_start_date" className="block font-medium mb-1 text-sm">
              Start Date
            </label>
            <Input
              id="experience_start_date"
              name="experience_start_date"
              type="date"
              value={form.experience_start_date}
              onChange={handleChange}
              className="bg-gray-50"
              required
            />
          </div>
          <div>
            <label htmlFor="experience_end_date" className="block font-medium mb-1 text-sm">
              End Date
            </label>
            <Input
              id="experience_end_date"
              name="experience_end_date"
              type="date"
              value={form.experience_end_date}
              onChange={handleChange}
              className="bg-gray-50"
              required
            />
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <label htmlFor="key_responsibilities" className="block font-medium mb-1 text-sm">
            Key Responsibilities
          </label>
          <Textarea
            id="key_responsibilities"
            name="key_responsibilities"
            placeholder="Describe your key responsibilities and achievements..."
            value={form.key_responsibilities}
            onChange={handleChange}
            className="bg-gray-50 min-h-[120px]"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message}
          </div>
        )}

        {/* Buttons */}
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

export default WorkExp;
