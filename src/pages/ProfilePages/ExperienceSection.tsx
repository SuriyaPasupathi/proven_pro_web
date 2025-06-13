import { ChevronDown, Pencil, Plus, Loader2, Trash2, ChevronUp, Building2 } from 'lucide-react';
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
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useDeleteItem } from '@/hooks/useDeleteItem';
// import { ProfileData } from '../../types/profile';

interface Experience {
  id?: string;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState<Experience>({
    company_name: "",
    position: "",
    experience_start_date: "",
    experience_end_date: "",
    key_responsibilities: "",
  });

  // Add useDeleteItem hook
  const {
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    isLoading: isDeleteLoading,
    error: deleteError,
    success: deleteSuccess
  } = useDeleteItem();

  // State for tracking experience to delete
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);

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
      // Validate form data
      if (!form.company_name.trim() || !form.position.trim() || 
          !form.experience_start_date.trim() || !form.experience_end_date.trim() ||
          !form.key_responsibilities.trim()) {
        toast.error("All fields are required!");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      
      // Create updated experiences array
      let updatedExperiences;
      if (editingExperience) {
        // If editing, update the existing experience
        updatedExperiences = localExperiences.map(exp => 
          exp === editingExperience ? form : exp
        );
      } else {
        // If adding new experience, check for duplicates before adding
        const isDuplicate = localExperiences.some(
          exp => 
            exp.company_name.toLowerCase() === form.company_name.toLowerCase() &&
            exp.position.toLowerCase() === form.position.toLowerCase() &&
            exp.experience_start_date === form.experience_start_date &&
            exp.experience_end_date === form.experience_end_date &&
            exp.key_responsibilities.toLowerCase() === form.key_responsibilities.toLowerCase()
        );

        if (isDuplicate) {
          toast.error("This experience already exists!");
          setIsLoading(false);
          return;
        }

        // Add new experience with trimmed values
        const newExperience = {
          company_name: form.company_name.trim(),
          position: form.position.trim(),
          experience_start_date: form.experience_start_date.trim(),
          experience_end_date: form.experience_end_date.trim(),
          key_responsibilities: form.key_responsibilities.trim()
        };
        updatedExperiences = [...localExperiences, newExperience];
      }
      
      // Remove any duplicate experiences before sending to backend
      const uniqueExperiences = updatedExperiences.reduce((acc: Experience[], current) => {
        const isDuplicate = acc.some(
          exp => 
            exp.company_name.toLowerCase() === current.company_name.toLowerCase() &&
            exp.position.toLowerCase() === current.position.toLowerCase() &&
            exp.experience_start_date === current.experience_start_date &&
            exp.experience_end_date === current.experience_end_date &&
            exp.key_responsibilities.toLowerCase() === current.key_responsibilities.toLowerCase()
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);

      // Format experiences for API
      const formattedExperiences = uniqueExperiences.map(exp => ({
        company_name: exp.company_name,
        position: exp.position,
        experience_start_date: exp.experience_start_date,
        experience_end_date: exp.experience_end_date,
        key_responsibilities: exp.key_responsibilities
      }));

      // Add experiences to formData
      formData.append('experiences', JSON.stringify(formattedExperiences));

      if (!profileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.id
      })).unwrap();
      
      if (result) {
        // Update local state immediately with unique experiences
        setLocalExperiences(uniqueExperiences);
        
        // Update Redux store with the complete profile data
        dispatch(updateProfileData({
          ...profileData,
          experiences: formattedExperiences
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

  // Add useEffect to clean up duplicates when component mounts
  useEffect(() => {
    if (experiences && experiences.length > 0) {
      const uniqueExperiences = experiences.reduce((acc: Experience[], current) => {
        const isDuplicate = acc.some(
          exp => 
            exp.company_name.toLowerCase() === current.company_name.toLowerCase() &&
            exp.position.toLowerCase() === current.position.toLowerCase() &&
            exp.experience_start_date === current.experience_start_date &&
            exp.experience_end_date === current.experience_end_date &&
            exp.key_responsibilities.toLowerCase() === current.key_responsibilities.toLowerCase()
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      if (uniqueExperiences.length !== experiences.length) {
        setLocalExperiences(uniqueExperiences);
        // Update Redux store with unique experiences
        dispatch(updateProfileData({
          ...profileData,
          experiences: uniqueExperiences
        }));
      }
    }
  }, [experiences]);

  // Add useEffect to sync with Redux store
  useEffect(() => {
    if (profileData?.work_experiences) {
      setLocalExperiences(profileData.work_experiences);
    }
  }, [profileData?.work_experiences]);

  const handleDeleteClick = (experience: Experience) => {
    if (!experience.id) {
      toast.error("Experience ID is missing");
      return;
    }
    setExperienceToDelete(experience);
    openDeleteDialog();
  };

  const handleDeleteConfirm = async () => {
    if (!experienceToDelete?.id || !profileData?.id) {
      toast.error("Missing required IDs for deletion");
      return;
    }

    try {
      // First delete the experience using the API
      await handleDelete('experience', experienceToDelete.id);

      // If deletion was successful, update the local state and Redux store
      if (deleteSuccess) {
        const updatedExperiences = localExperiences.filter(exp => exp.id !== experienceToDelete.id);
        
        const formData = new FormData();
        formData.append('subscription_type', profileData.subscription_type || 'premium');
        formData.append('experiences', JSON.stringify(updatedExperiences));

        const result = await dispatch(updateProfile({
          data: formData,
          profileId: profileData.id
        })).unwrap();
        
        if (result) {
          setLocalExperiences(updatedExperiences);
          dispatch(updateProfileData({
            ...profileData,
            experiences: updatedExperiences
          }));
          toast.success("Experience deleted successfully!");
        }
      }
    } catch (error) {
      toast.error(deleteError || "Failed to delete experience");
    } finally {
      closeDeleteDialog();
      setExperienceToDelete(null);
    }
  };

  if (!experiences.length) {
    return (
      <div className="border-b border-[#5A8DB8]/20 pb-4 xs:pb-6 sm:pb-8">
        <div className="flex justify-between items-center mb-4 xs:mb-6">
          <h2 className="text-xl xs:text-2xl font-bold text-[#5A8DB8] flex items-center gap-2">
            <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 xs:p-2 rounded-lg shadow-sm">
              <Building2 className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
            </span>
            Experience
          </h2>
          {isEditMode && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                className="p-1 xs:p-1.5 h-auto text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-300"
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
                <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-[#5A8DB8]/5 to-white rounded-lg p-4 xs:p-6 border border-[#5A8DB8]/10">
          <p className="text-sm xs:text-base text-gray-600">No experience information available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[#5A8DB8]/20 pb-4 xs:pb-6 sm:pb-8">
      <div className="flex justify-between items-center mb-4 xs:mb-6">
        <h2 className="text-xl xs:text-2xl font-bold text-[#5A8DB8] flex items-center gap-2">
          <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 xs:p-2 rounded-lg shadow-sm">
            <Building2 className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
          </span>
          Experience
        </h2>
        {isEditMode && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="p-1 xs:p-1.5 h-auto text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-300"
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
              <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#5A8DB8]">
              {editingExperience ? 'Edit Experience' : 'Add Experience'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="company_name" className="block font-medium mb-1.5 text-sm text-gray-700">
                Company Name
              </label>
              <Input
                id="company_name"
                name="company_name"
                placeholder="Enter company name"
                value={form.company_name}
                onChange={handleChange}
                className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="position" className="block font-medium mb-1.5 text-sm text-gray-700">
                Position
              </label>
              <Input
                id="position"
                name="position"
                placeholder="Enter your job title"
                value={form.position}
                onChange={handleChange}
                className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="experience_start_date" className="block font-medium mb-1.5 text-sm text-gray-700">
                  Start Date
                </label>
                <Input
                  id="experience_start_date"
                  name="experience_start_date"
                  type="date"
                  value={form.experience_start_date}
                  onChange={handleChange}
                  className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="experience_end_date" className="block font-medium mb-1.5 text-sm text-gray-700">
                  End Date
                </label>
                <Input
                  id="experience_end_date"
                  name="experience_end_date"
                  type="date"
                  value={form.experience_end_date}
                  onChange={handleChange}
                  className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="key_responsibilities" className="block font-medium mb-1.5 text-sm text-gray-700">
                Key Responsibilities
              </label>
              <Textarea
                id="key_responsibilities"
                name="key_responsibilities"
                placeholder="Describe your key responsibilities and achievements..."
                value={form.key_responsibilities}
                onChange={handleChange}
                className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 min-h-[120px]"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#2C4A6B] text-white shadow-sm hover:shadow-md transition-all duration-300"
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
      
      {/* Experience Section */}
      <div className="space-y-4 xs:space-y-6">
        {localExperiences.length === 0 ? (
          <div className="bg-gradient-to-br from-[#5A8DB8]/5 to-white rounded-lg p-4 xs:p-6 border border-[#5A8DB8]/10">
            <p className="text-sm xs:text-base text-gray-600">No experience information available.</p>
          </div>
        ) : (
          localExperiences
            .slice(0, isExpanded ? undefined : 2)
            .map((experience, index) => (
              <div key={index} className="relative p-4 xs:p-6 border border-[#5A8DB8]/10 rounded-lg bg-gradient-to-br from-[#5A8DB8]/5 to-white hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-base xs:text-lg text-[#5A8DB8] font-bold">
                      Position: <span className="text-gray-700 font-semibold">{experience.position}</span>
                    </h3>
                    <p className="text-sm xs:text-base font-bold text-[#5A8DB8]">
                      Company: <span className="text-gray-700 font-semibold">{experience.company_name}</span>
                    </p>
                    <div className="flex flex-col xs:flex-row xs:gap-4 text-sm text-gray-600">
                      <p className="font-bold">
                        Start Date: <span className="text-gray-700 font-semibold">{experience.experience_start_date}</span>
                      </p>
                      <p className="font-bold">
                        End Date: <span className="text-gray-700 font-semibold">{experience.experience_end_date}</span>
                      </p>
                    </div>
                    <p className="text-sm xs:text-base font-bold text-[#5A8DB8]">
                      Key Responsibilities: <span className="text-gray-700 font-semibold">{experience.key_responsibilities}</span>
                    </p>
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 xs:h-8 xs:w-8 text-gray-500 hover:text-[#5A8DB8] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-200"
                        onClick={() => handleEdit(experience)}
                        disabled={isLoading}
                      >
                        <Pencil className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 xs:h-8 xs:w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                        onClick={() => handleDeleteClick(experience)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
      
      {localExperiences.length > 2 && (
        <Button 
          variant="link" 
          className="mt-4 xs:mt-6 text-[#5A8DB8] hover:text-[#3C5979] flex items-center p-0 group transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm group-hover:underline">{isExpanded ? 'Show less' : 'Show all experiences'}</span>
          {isExpanded ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 xs:h-4 xs:w-4 transition-transform duration-200" />
          ) : (
            <ChevronDown className="ml-1 h-3.5 w-3.5 xs:h-4 xs:w-4 transition-transform duration-200" />
          )}
        </Button>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          closeDeleteDialog();
          setExperienceToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Experience"
        description={`Are you sure you want to delete your experience at "${experienceToDelete?.company_name}"? This action cannot be undone.`}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default ExperienceSection;