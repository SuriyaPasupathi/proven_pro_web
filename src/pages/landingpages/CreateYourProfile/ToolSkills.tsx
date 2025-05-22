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
const CURRENT_STEP = 5;

const ToolSkills: React.FC = () => {
  const [form, setForm] = useState({
    primary_tools: "",
    technical_skills: "",
    soft_skills: "",
    skills_description: "",
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
        primary_tools: form.primary_tools,
        technical_skills: form.technical_skills,
        soft_skills: form.soft_skills,
        skills_description: form.skills_description,
      };

      const result = await dispatch(createUserProfile(profileData)).unwrap();
      
      if (result) {
        toast.success("Tools and skills saved successfully!");
        navigate("/create-profile/portfolio");
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save tools and skills");
    }
  };

  const progressPercent = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-6 flex flex-col">
      {/* Step Progress */}
      <div className="mb-8 w-full max-w-4xl mx-auto">
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm flex flex-col gap-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tools & Skills</h1>

        <div>
          <label htmlFor="primary_tools" className="block font-medium mb-1 text-sm">
            Primary Tools
          </label>
          <Input
            id="primary_tools"
            name="primary_tools"
            placeholder="e.g., Adobe Suite, Figma, VS Code"
            value={form.primary_tools}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#5A8DB8]"
            required
          />
        </div>

        <div>
          <label htmlFor="technical_skills" className="block font-medium mb-1 text-sm">
            Technical Skills
          </label>
          <Input
            id="technical_skills"
            name="technical_skills"
            placeholder="e.g., React, Node.js, Python"
            value={form.technical_skills}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#5A8DB8]"
            required
          />
        </div>

        <div>
          <label htmlFor="soft_skills" className="block font-medium mb-1 text-sm">
            Soft Skills
          </label>
          <Input
            id="soft_skills"
            name="soft_skills"
            placeholder="e.g., Project Management, Team Leadership"
            value={form.soft_skills}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#5A8DB8]"
            required
          />
        </div>

        <div>
          <label htmlFor="skills_description" className="block font-medium mb-1 text-sm">
            Skills Description
          </label>
          <Textarea
            id="skills_description"
            name="skills_description"
            placeholder="Provide more details about your expertise..."
            value={form.skills_description}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#5A8DB8] min-h-[120px]"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message}
          </div>
        )}

        {/* Button Group */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
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

export default ToolSkills;
