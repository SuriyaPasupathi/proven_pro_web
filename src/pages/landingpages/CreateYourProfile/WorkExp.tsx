import React, { useState, useEffect } from "react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile, updateProfile } from "../../../store/Services/CreateProfileService";
import { updateProfileData } from "../../../store/Slice/CreateProfileSlice";
import { fetchJobPositions } from "../../../store/Services/DropDownService";
import toast from "react-hot-toast";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

const TOTAL_STEPS = 8;
const CURRENT_STEP = 4;

interface WorkExperience {
  id?: string;
  company_name: string;
  position: string;
  experience_start_date: string;
  experience_end_date: string;
  key_responsibilities: string;
}

const WorkExp: React.FC = () => {
  const [workForms, setWorkForms] = useState<WorkExperience[]>([{
    company_name: "",
    position: "",
    experience_start_date: "",
    experience_end_date: "",
    key_responsibilities: "",
  }]);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, profileData } = useSelector((state: RootState) => state.createProfile);
  const { jobPositions, loading: jobPositionsLoading } = useSelector((state: RootState) => state.dropdown);

  useEffect(() => {
    dispatch(fetchJobPositions());
  }, [dispatch]);

  // Initialize form with existing data if available
  useEffect(() => {
    if (profileData?.work_experiences && profileData.work_experiences.length > 0) {
      setWorkForms(profileData.work_experiences);
    }
  }, [profileData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newForms = [...workForms];
    newForms[index] = {
      ...newForms[index],
      [e.target.name]: e.target.value
    };
    setWorkForms(newForms);
  };

  const handlePositionSelect = (value: string, index: number) => {
    const newForms = [...workForms];
    newForms[index] = {
      ...newForms[index],
      position: value
    };
    setWorkForms(newForms);
  };

  const addNewWorkExperience = () => {
    setWorkForms([
      ...workForms,
      {
        company_name: "",
        position: "",
        experience_start_date: "",
        experience_end_date: "",
        key_responsibilities: "",
      }
    ]);
  };

  const removeWorkExperience = (index: number) => {
    if (workForms.length > 1) {
      const newForms = workForms.filter((_, i) => i !== index);
      setWorkForms(newForms);
    } else {
      toast.error("You must have at least one work experience");
    }
  };

  const validateForm = () => {
    for (const form of workForms) {
      if (!form.company_name || form.company_name.trim() === '') {
        toast.error("Please enter company name");
        return false;
      }
      if (!form.position || form.position.trim() === '') {
        toast.error("Please select a position");
        return false;
      }
      if (!form.experience_start_date || form.experience_start_date.trim() === '') {
        toast.error("Please enter start date");
        return false;
      }
      if (!form.experience_end_date || form.experience_end_date.trim() === '') {
        toast.error("Please enter end date");
        return false;
      }
      if (!form.key_responsibilities || form.key_responsibilities.trim() === '') {
        toast.error("Please enter key responsibilities");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || isUpdating) return;
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      formData.append('experiences', JSON.stringify(workForms));

      // Add other profile data
      if (profileData) {
        Object.entries(profileData).forEach(([key, value]) => {
          if (key !== 'experiences' && key !== 'subscription_type' && value !== undefined) {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'string') {
              formData.append(key, value);
            }
          }
        });
      }

      const result = await dispatch(createUserProfile(formData)).unwrap();
      
      if (result) {
        dispatch(updateProfileData({
          ...profileData,
          experiences: workForms
        }));
        
        toast.success("Work experiences saved successfully!");
        
        setTimeout(() => {
          navigate("/create-profile/tool-skills");
        }, 100);
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save work experiences");
    } finally {
      setIsUpdating(false);
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
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Work Experience
          </h1>
          <Button
            type="button"
            onClick={addNewWorkExperience}
            className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        </div>

        {workForms.map((form, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-6 relative">
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                onClick={() => removeWorkExperience(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <h3 className="text-lg font-semibold text-gray-800">
              Work Experience {index + 1}
            </h3>

            <div>
              <label htmlFor={`company_name_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <Input
                id={`company_name_${index}`}
                name="company_name"
                placeholder="Enter company name"
                value={form.company_name}
                onChange={(e) => handleChange(e, index)}
                className="bg-gray-50"
                required
              />
            </div>

            <div>
              <label htmlFor={`position_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <Select
                value={form.position}
                onValueChange={(value) => handlePositionSelect(value, index)}
              >
                <SelectTrigger className="w-full bg-gray-50">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {jobPositions.map((position: any) => (
                    <SelectItem key={position.id} value={position.title}>
                      {position.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`experience_start_date_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  id={`experience_start_date_${index}`}
                  name="experience_start_date"
                  type="date"
                  value={form.experience_start_date}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-50"
                  required
                />
              </div>
              <div>
                <label htmlFor={`experience_end_date_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  id={`experience_end_date_${index}`}
                  name="experience_end_date"
                  type="date"
                  value={form.experience_end_date}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor={`key_responsibilities_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Key Responsibilities
              </label>
              <Textarea
                id={`key_responsibilities_${index}`}
                name="key_responsibilities"
                placeholder="Describe your key responsibilities and achievements..."
                value={form.key_responsibilities}
                onChange={(e) => handleChange(e, index)}
                className="bg-gray-50 min-h-[120px]"
                required
              />
            </div>
          </div>
        ))}

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
            disabled={loading || isUpdating || jobPositionsLoading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
            disabled={loading || isUpdating || jobPositionsLoading}
          >
            {loading || isUpdating ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkExp;
