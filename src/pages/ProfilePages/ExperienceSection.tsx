import { ChevronDown, Pencil, Plus, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEditMode } from '../../context/EditModeContext';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// import { ProfileData } from '../../types/profile';

interface Experience {
  company_name: string;
  position: string;
  key_responsibilities: string; 
  experience_start_date: string;
  experience_end_date: string;
}

interface ExperienceSectionProps {
  experiences?: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences = [] }) => {
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.createProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [localExperiences, setLocalExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<Experience>({
    company_name: "",
    position: "",
    experience_start_date: "",
    experience_end_date: "",
    key_responsibilities: "",
  });

  // Initialize experiences only when the component mounts or experiences prop changes
  useEffect(() => {
    const parsedExperiences = Array.isArray(experiences) ? experiences : [];
    if (JSON.stringify(parsedExperiences) !== JSON.stringify(localExperiences)) {
      setLocalExperiences(parsedExperiences);
    }
  }, [experiences]); // Only depend on experiences prop

  // Update form when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen) {
      if (editingExperience) {
        setForm(editingExperience);
      } else {
        setForm({
          company_name: "",
          position: "",
          experience_start_date: "",
          experience_end_date: "",
          key_responsibilities: "",
        });
      }
    }
  }, [isDialogOpen, editingExperience]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      
      // Create updated experiences array
      const updatedExperiences = editingExperience 
        ? localExperiences.map(exp => 
            exp === editingExperience ? form : exp
          )
        : [...localExperiences, form];
      
      // Convert experiences to string array format expected by the API
      const experiencesArray = updatedExperiences.map(exp => ({
        company_name: exp.company_name,
        position: exp.position,
        experience_start_date: exp.experience_start_date,
        experience_end_date: exp.experience_end_date,
        key_responsibilities: exp.key_responsibilities
      }));
      
      formData.append('experiences', JSON.stringify(experiencesArray));

      if (!profileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.id
      })).unwrap();
      
      if (result) {
        // Update local state immediately
        setLocalExperiences(updatedExperiences);
        
        // Update Redux store with the complete profile data
        dispatch(updateProfileData({
          ...profileData,
          experiences: experiencesArray
        }));

        toast.success(editingExperience ? "Experience updated successfully!" : "Experience added successfully!");
        setIsDialogOpen(false);
        setEditingExperience(null);
        setForm({
          company_name: "",
          position: "",
          experience_start_date: "",
          experience_end_date: "",
          key_responsibilities: "",
        });
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update experience");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingExperience(null);
    setForm({
      company_name: "",
      position: "",
      experience_start_date: "",
      experience_end_date: "",
      key_responsibilities: "",
    });
  };

  if (!experiences.length) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Experience</h2>
          {isEditMode && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
                onClick={() => {
                  setEditingExperience(null);
                  setForm({
                    company_name: "",
                    position: "",
                    experience_start_date: "",
                    experience_end_date: "",
                    key_responsibilities: "",
                  });
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-gray-600">No experience information available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Experience</h2>
        {isEditMode && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
              onClick={() => {
                setEditingExperience(null);
                setForm({
                  company_name: "",
                  position: "",
                  experience_start_date: "",
                  experience_end_date: "",
                  key_responsibilities: "",
                });
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Edit Experience' : 'Add Experience'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingExperience ? 'Saving Changes...' : 'Adding Experience...'}
                  </>
                ) : (
                  editingExperience ? 'Save Changes' : 'Add Experience'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {localExperiences.map((exp, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-4 relative bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                <p className="text-gray-600 mt-2">{exp.company_name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {exp.experience_start_date} - {exp.experience_end_date}
                </p>
                <p className="mt-2 text-gray-700">{exp.key_responsibilities}</p>
              </div>
              {isEditMode && (
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
                  onClick={() => handleEdit(exp)}
                  disabled={isLoading}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        variant="link" 
        className="mt-6 text-[#70a4d8] hover:text-[#3C5979] flex items-center p-0"
      >
        <span>Show all experiences</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ExperienceSection;