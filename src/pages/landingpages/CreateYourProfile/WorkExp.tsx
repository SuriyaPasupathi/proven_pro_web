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
import { Trash2, Edit2 } from "lucide-react";
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
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({
    company_name: "",
    position: "",
    experience_start_date: "",
    experience_end_date: "",
    key_responsibilities: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, profileData } = useSelector((state: RootState) => state.createProfile);
  const { jobPositions, loading: jobPositionsLoading } = useSelector((state: RootState) => state.dropdown);

  useEffect(() => {
    dispatch(fetchJobPositions());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentExperience({ ...currentExperience, [e.target.name]: e.target.value });
  };

  const handlePositionSelect = (value: string) => {
    setCurrentExperience({ ...currentExperience, position: value });
  };

  const updateExperiencesInNetwork = async (updatedExperiences: WorkExperience[]) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      formData.append('work_experiences', JSON.stringify(updatedExperiences));

      // Add other profile data
      if (profileData) {
        Object.entries(profileData).forEach(([key, value]) => {
          if (key !== 'work_experiences' && key !== 'subscription_type' && value !== undefined) {
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

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData?.profile_url || ''
      })).unwrap();
      
      if (result) {
        dispatch(updateProfileData({
          ...profileData,
          work_experiences: updatedExperiences
        }));
        toast.success("Work experiences updated successfully!");
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update work experiences");
      // Revert to previous state on error
      setExperiences(experiences);
    } finally {
      setIsUpdating(false);
    }
  };

  const addOrUpdateExperience = async () => {
    if (!currentExperience.company_name || !currentExperience.position || 
        !currentExperience.experience_start_date || !currentExperience.experience_end_date || 
        !currentExperience.key_responsibilities) {
      toast.error("Please fill in all fields");
      return;
    }

    // Check for duplicate experience
    const isDuplicate = experiences.some(exp => 
      exp.company_name.toLowerCase() === currentExperience.company_name.toLowerCase() && 
      exp.position.toLowerCase() === currentExperience.position.toLowerCase() &&
      exp.id !== editingId
    );

    if (isDuplicate) {
      toast.error("This work experience already exists");
      return;
    }

    let updatedExperiences: WorkExperience[];
    
    if (editingId) {
      updatedExperiences = experiences.map(exp => 
        exp.id === editingId ? { ...currentExperience, id: editingId } : exp
      );
    } else {
      // Add new experience with a unique ID
      const newExperience = {
        ...currentExperience,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      updatedExperiences = [...experiences, newExperience];
    }

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      formData.append('work_experiences', JSON.stringify(updatedExperiences));

      // Add other profile data
      if (profileData) {
        Object.entries(profileData).forEach(([key, value]) => {
          if (key !== 'work_experiences' && key !== 'subscription_type' && value !== undefined) {
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
        // Update local state only after successful API call
        setExperiences(updatedExperiences);
        dispatch(updateProfileData({
          ...profileData,
          work_experiences: updatedExperiences
        }));
        
        // Reset form
        setCurrentExperience({
          company_name: "",
          position: "",
          experience_start_date: "",
          experience_end_date: "",
          key_responsibilities: "",
        });
        setEditingId(null);
        toast.success(editingId ? "Experience updated successfully!" : "Experience added successfully!");
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save experience");
    } finally {
      setIsUpdating(false);
    }
  };

  const editExperience = (experience: WorkExperience) => {
    setCurrentExperience(experience);
    setEditingId(experience.id || null);
  };

  const deleteExperience = async (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    
    // Optimistically update UI
    setExperiences(updatedExperiences);
    
    // Update in network
    await updateExperiencesInNetwork(updatedExperiences);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (experiences.length === 0) {
      toast.error("Please add at least one work experience");
      return;
    }

    try {
      navigate("/create-profile/tool-skills");
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to proceed to next step");
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
      <div className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md flex flex-col gap-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          Work Experience
        </h1>

        {/* Current Experience Form */}
        <form onSubmit={(e) => { e.preventDefault(); addOrUpdateExperience(); }} className="flex flex-col gap-6">
          <div>
            <label htmlFor="company_name" className="block font-medium mb-1 text-sm">
              Company Name
            </label>
            <Input
              id="company_name"
              name="company_name"
              placeholder="Enter company name"
              value={currentExperience.company_name}
              onChange={handleChange}
              className="bg-gray-50"
              required
            />
          </div>

          <div>
            <label htmlFor="position" className="block font-medium mb-1 text-sm">
              Position
            </label>
            <Select
              value={currentExperience.position}
              onValueChange={handlePositionSelect}
            >
              <SelectTrigger className="w-full bg-gray-50">
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {jobPositions.map((position: any) => (
                  <SelectItem key={position.id} value={position.name}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="experience_start_date" className="block font-medium mb-1 text-sm">
                Start Date
              </label>
              <Input
                id="experience_start_date"
                name="experience_start_date"
                type="date"
                value={currentExperience.experience_start_date}
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
                value={currentExperience.experience_end_date}
                onChange={handleChange}
                className="bg-gray-50"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="key_responsibilities" className="block font-medium mb-1 text-sm">
              Key Responsibilities
            </label>
            <Textarea
              id="key_responsibilities"
              name="key_responsibilities"
              placeholder="Describe your key responsibilities and achievements..."
              value={currentExperience.key_responsibilities}
              onChange={handleChange}
              className="bg-gray-50 min-h-[120px]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
            disabled={isUpdating || jobPositionsLoading}
          >
            {isUpdating ? "Updating..." : editingId ? "Update Experience" : "Add Experience"}
          </Button>
        </form>

        {/* List of Added Experiences */}
        {experiences.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Added Experiences</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{exp.position} at {exp.company_name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editExperience(exp)}
                        disabled={isUpdating || jobPositionsLoading}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteExperience(exp.id!)}
                        disabled={isUpdating || jobPositionsLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {exp.experience_start_date} - {exp.experience_end_date}
                  </p>
                  <p className="mt-2 text-sm">{exp.key_responsibilities}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
            type="button"
            className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
            onClick={handleSubmit}
            disabled={loading || isUpdating || jobPositionsLoading}
          >
            {loading ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkExp;
