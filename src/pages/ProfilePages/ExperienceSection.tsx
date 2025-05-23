import { ChevronDown, Pencil } from 'lucide-react';
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
  const [localExperiences, setLocalExperiences] = useState<Experience[]>(experiences);
  const [form, setForm] = useState<Experience>({
    company_name: "",
    position: "",
    experience_start_date: "",
    experience_end_date: "",
    key_responsibilities: "",
  });

  // Update local experiences when prop changes
  useEffect(() => {
    setLocalExperiences(experiences);
  }, [experiences]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setForm(experience);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let updatedExperiences: Experience[];
      
      if (editingExperience) {
        // Update existing experience
        updatedExperiences = localExperiences.map(exp => 
          exp === editingExperience ? form : exp
        );
      } else {
        // Add new experience
        updatedExperiences = [...localExperiences, form];
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      formData.append('experiences', JSON.stringify(updatedExperiences));

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

      const result = await dispatch(updateProfile(formData)).unwrap();
      
      if (result) {
        // Update local state
        setLocalExperiences(updatedExperiences);
        
        // Update Redux store
        dispatch(updateProfileData({
          ...profileData,
          experiences: updatedExperiences
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Experience</h2>
        {isEditMode && (
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
            <Pencil className="w-4 h-4" />
          </Button>
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
              >
                {editingExperience ? 'Save Changes' : 'Add Experience'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {localExperiences.map((exp, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <h3 className="font-semibold text-lg">{exp.position}</h3>
              <p className="text-gray-600">{exp.company_name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {exp.experience_start_date} - {exp.experience_end_date}
              </p>
              <p className="mt-2 text-gray-700">{exp.key_responsibilities}</p>
            </div>
            {isEditMode && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
                  onClick={() => handleEdit(exp)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            )}
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