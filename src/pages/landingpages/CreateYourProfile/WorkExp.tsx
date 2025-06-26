import React, { useState, useEffect } from "react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import { updateProfileData } from "../../../store/Slice/CreateProfileSlice";
import { fetchJobPositions } from "../../../store/Services/DropDownService";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import StepAccessControl from "../../../components/StepAccessControl";
import { getTotalSteps, getStepProgress, getNextAvailableStep, SubscriptionType } from "../../../utils/subscriptionUtils";

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

  // Get subscription type from Redux store
  const subscriptionType = profileData?.subscription_type || 'free';
  const totalSteps = getTotalSteps(subscriptionType as SubscriptionType);
  const progressPercent = getStepProgress(CURRENT_STEP, subscriptionType as SubscriptionType);

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
    const { name, value } = e.target;

    // Enhanced date validation for start and end dates
    if (name === 'experience_start_date' || name === 'experience_end_date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today

      // Validate that selected date is not in the future
      if (selectedDate > today) {
        toast.error("Cannot select future dates");
        return;
      }

      // Validate end date is not before start date
      if (name === 'experience_end_date' && workForms[index].experience_start_date) {
        const startDate = new Date(workForms[index].experience_start_date);
        if (selectedDate < startDate) {
          toast.error("End date cannot be before start date");
          return;
        }
      }

      // Validate start date is not after end date
      if (name === 'experience_start_date' && workForms[index].experience_end_date) {
        const endDate = new Date(workForms[index].experience_end_date);
        if (selectedDate > endDate) {
          toast.error("Start date cannot be after end date");
          return;
        }
      }
    }

    newForms[index] = {
      ...newForms[index],
      [name]: value
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
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today

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

      // Additional date validation
      const startDate = new Date(form.experience_start_date);
      const endDate = new Date(form.experience_end_date);

      // Check if start date is in the future
      if (startDate > today) {
        toast.error("Start date cannot be in the future");
        return false;
      }

      // Check if end date is in the future
      if (endDate > today) {
        toast.error("End date cannot be in the future");
        return false;
      }

      // Check if end date is before start date
      if (endDate < startDate) {
        toast.error("End date cannot be before start date");
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
      formData.append('subscription_type', subscriptionType);
      formData.append('work_experiences', JSON.stringify(workForms));

      const result = await dispatch(createUserProfile(formData)).unwrap();
      
      if (result) {
        dispatch(updateProfileData({
          ...profileData,
          work_experiences: workForms
        }));
        
        toast.success("Work experiences saved successfully!");
        
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
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save work experiences");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <StepAccessControl currentStep={CURRENT_STEP}>
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FBFF] px-4 sm:px-6 md:px-8 py-8 flex flex-col">
        {/* Step Progress */}
        <div className="mb-10 w-full max-w-4xl mx-auto">
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
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                  Work Experience
                </h1>
                <p className="text-sm text-black/70 mt-1">Add your professional experience</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={addNewWorkExperience}
              className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-xl"
            >
              Add Experience
            </Button>
          </div>

          {workForms.map((form, index) => (
            <div 
              key={index} 
              className="border-2 border-[#5A8DB8]/20 rounded-xl p-6 space-y-6 relative bg-white/50 hover:bg-white/80 transition-colors duration-300"
            >
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-[#5A8DB8]/40 hover:text-red-500 hover:bg-red-50 transition-colors duration-300"
                  onClick={() => removeWorkExperience(index)}
                >
                  ×
                </Button>
              )}
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-black">
                  Work Experience {index + 1}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor={`company_name_${index}`} className="text-sm font-medium text-black mb-2">
                    Company Name
                  </label>
                  <Input
                    id={`company_name_${index}`}
                    name="company_name"
                    placeholder="Enter company name"
                    value={form.company_name}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`position_${index}`} className="text-sm font-medium text-black mb-2">
                    Position
                  </label>
                  <Select
                    value={form.position}
                    onValueChange={(value) => handlePositionSelect(value, index)}
                  >
                    <SelectTrigger className="w-full bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor={`experience_start_date_${index}`} className="text-sm font-medium text-black mb-2">
                      Start Date
                    </label>
                    <Input
                      id={`experience_start_date_${index}`}
                      name="experience_start_date"
                      type="date"
                      value={form.experience_start_date}
                      onChange={(e) => handleChange(e, index)}
                      className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`experience_end_date_${index}`} className="text-sm font-medium text-black mb-2">
                      End Date
                    </label>
                    <Input
                      id={`experience_end_date_${index}`}
                      name="experience_end_date"
                      type="date"
                      value={form.experience_end_date}
                      onChange={(e) => handleChange(e, index)}
                      className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`key_responsibilities_${index}`} className="text-sm font-medium text-black mb-2">
                    Key Responsibilities
                  </label>
                  <Textarea
                    id={`key_responsibilities_${index}`}
                    name="key_responsibilities"
                    placeholder="Describe your key responsibilities and achievements..."
                    value={form.key_responsibilities}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 min-h-[120px]"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

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
              disabled={loading || isUpdating || jobPositionsLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl"
              disabled={loading || isUpdating || jobPositionsLoading}
            >
              {loading || isUpdating ? (
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

export default WorkExp;
