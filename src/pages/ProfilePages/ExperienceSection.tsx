import { ChevronDown, Pencil, Plus, Loader2, Trash2, ChevronUp,  } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJobPositions } from '../../store/Services/DropDownService';
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
  const { jobPositions, loading: jobPositionsLoading } = useAppSelector((state) => state.dropdown);
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

  // Function to format date to show month in text
  const formatDateToText = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    return `${month} ${year}`;
  };

  // Fetch job positions when component mounts
  useEffect(() => {
    dispatch(fetchJobPositions());
  }, [dispatch]);

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
    const { name, value } = e.target;

    // Add date validation for start and end dates
    if (name === 'experience_start_date' || name === 'experience_end_date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day

      if (selectedDate > today) {
        toast.error("Cannot select future dates");
        return;
      }

      // Validate end date is not before start date
      if (name === 'experience_end_date' && form.experience_start_date) {
        const startDate = new Date(form.experience_start_date);
        if (selectedDate < startDate) {
          toast.error("End date cannot be before start date");
          return;
        }
      }

      // Validate start date is not after end date
      if (name === 'experience_start_date' && form.experience_end_date) {
        const endDate = new Date(form.experience_end_date);
        if (selectedDate > endDate) {
          toast.error("Start date cannot be after end date");
          return;
        }
      }
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePositionSelect = (value: string) => {
    setForm(prev => ({ ...prev, position: value }));
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
      
      // Create updated experiences array using ID for comparison
      let updatedExperiences;
      if (editingExperience) {
        // If editing, update the existing experience
        updatedExperiences = localExperiences.map(exp => 
          exp.id === editingExperience.id 
            ? { ...form, id: editingExperience.id }
            : exp
        );
        formData.append('work_experiences', JSON.stringify(updatedExperiences));
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

        // Add new experience without ID and only send the new experience data
        const newExperience = {
          company_name: form.company_name.trim(),
          position: form.position.trim(),
          experience_start_date: form.experience_start_date.trim(),
          experience_end_date: form.experience_end_date.trim(),
          key_responsibilities: form.key_responsibilities.trim()
        };
        formData.append('work_experiences', JSON.stringify([newExperience]));
        updatedExperiences = [...localExperiences, newExperience];
      }

      if (!profileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.id
      })).unwrap();
      
      if (result) {
        // Update local state with the new experience data
        if (editingExperience) {
          // If editing, update the existing experience in local state
          setLocalExperiences(updatedExperiences);
        } else {
          // If adding new experience, append the new experience to local state
          const newExperienceWithId = {
            company_name: form.company_name.trim(),
            position: form.position.trim(),
            experience_start_date: form.experience_start_date.trim(),
            experience_end_date: form.experience_end_date.trim(),
            key_responsibilities: form.key_responsibilities.trim(),
            id: result.work_experiences[result.work_experiences.length - 1].id // Get the ID from the response
          };
          setLocalExperiences(prev => [...prev, newExperienceWithId]);
        }
        
        // Update Redux store with the complete profile data
        dispatch(updateProfileData({
          ...profileData,
          work_experiences: result.work_experiences
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
          work_experiences: uniqueExperiences
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
        formData.append('work_experiences', JSON.stringify(updatedExperiences));

        const result = await dispatch(updateProfile({
          data: formData,
          profileId: profileData.id
        })).unwrap();
        
        if (result) {
          // Update local state
          setLocalExperiences(updatedExperiences);
          
          // Update Redux store
          dispatch(updateProfileData({
            ...profileData,
            work_experiences: result.work_experiences
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

  return (
    <div className="border-b border-[#5A8DB8]/20 pb-4 xs:pb-6 sm:pb-8">
      <div className="flex justify-between items-center mb-4 xs:mb-6">
        <h2 className="text-2xl font-bold text-black">
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
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5A8DB8]/5 to-[#70a4d8]/5 pointer-events-none"></div>
          <DialogHeader className="space-y-4 relative">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-[#3C5979] to-[#5A8DB8] bg-clip-text text-transparent">
                {editingExperience ? 'Edit Experience' : 'Add Experience'}
              </DialogTitle>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-[#5A8DB8]/20 via-[#70a4d8]/20 to-[#5A8DB8]/20 rounded-full"></div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="space-y-2 group">
              <label htmlFor="company_name" className="font-medium mb-1.5 text-sm text-[#3C5979] group-hover:text-[#5A8DB8] transition-colors">
                Company Name
              </label>
              <Input
                id="company_name"
                name="company_name"
                placeholder="Enter company name"
                value={form.company_name}
                onChange={handleChange}
                className="bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                required
              />
            </div>

            <div className="space-y-2 group">
              <label htmlFor="position" className="font-medium mb-1.5 text-sm text-[#3C5979] group-hover:text-[#5A8DB8] transition-colors">
                Position
              </label>
              <Select
                value={form.position}
                onValueChange={handlePositionSelect}
              >
                <SelectTrigger className="w-full bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-xl shadow-lg">
                  {jobPositions.map((position: any) => (
                    <SelectItem key={position.id} value={position.title} className="hover:bg-[#5A8DB8]/5">
                      {position.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 group">
                <label htmlFor="experience_start_date" className="font-medium mb-1.5 text-sm text-[#3C5979] group-hover:text-[#5A8DB8] transition-colors">
                  Start Date
                </label>
                <Input
                  id="experience_start_date"
                  name="experience_start_date"
                  type="date"
                  value={form.experience_start_date}
                  onChange={handleChange}
                  className="bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  required
                />
              </div>
              <div className="space-y-2 group">
                <label htmlFor="experience_end_date" className="font-medium mb-1.5 text-sm text-[#3C5979] group-hover:text-[#5A8DB8] transition-colors">
                  End Date
                </label>
                <Input
                  id="experience_end_date"
                  name="experience_end_date"
                  type="date"
                  value={form.experience_end_date}
                  onChange={handleChange}
                  className="bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label htmlFor="key_responsibilities" className="font-medium mb-1.5 text-sm text-[#3C5979] group-hover:text-[#5A8DB8] transition-colors">
                Key Responsibilities
              </label>
              <Textarea
                id="key_responsibilities"
                name="key_responsibilities"
                placeholder="Describe your key responsibilities and achievements..."
                value={form.key_responsibilities}
                onChange={handleChange}
                className="bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 min-h-[120px] rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                required
              />
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-[#5A8DB8]/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading || jobPositionsLoading}
                className="border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 transition-all duration-300 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2"
                disabled={isLoading || jobPositionsLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingExperience ? 'Saving Changes...' : 'Adding Experience...'}
                  </>
                ) : (
                  <>
                    {editingExperience ? 'Save Changes' : 'Add Experience'}
                  </>
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
          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#5A8DB8]/20 to-[#5A8DB8]/10"></div>
            
            {localExperiences
              .slice(0, isExpanded ? undefined : 2)
              .map((experience, index) => (
                <div key={index} className="relative pl-12 mb-6 last:mb-0">
                  {/* Timeline dot */}
                  {/* <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] border-2 border-white shadow-md transform -translate-x-1/2"></div> */}
                  
                  <div className="relative p-4 ">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      {/* Main content - 75% width on large screens, full width on mobile */}
                      <div className="flex-1 w-full lg:w-3/4">
                        <div className="flex flex-col space-y-4">
                          {/* Header row with date, company, position */}
                          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
                            {/* Date - Left side */}
                            <div className="flex-shrink-0 text-xs xs:text-sm text-gray-600 font-medium order-1 xs:order-1">
                              {formatDateToText(experience.experience_start_date)} - {formatDateToText(experience.experience_end_date)}
                            </div>
                            
                            {/* Company Name - Center */}
                            <div className="flex-1 text-center order-2 xs:order-2">
                              <h3 className="text-sm xs:text-base lg:text-lg font-bold">
                                {experience.company_name}
                              </h3>
                            </div>
                            
                            {/* Position - Right side */}
                            <div className="flex-shrink-0 text-right order-3 xs:order-3">
                              <span className="text-xs xs:text-sm lg:text-base font-semibold">
                                {experience.position}
                              </span>
                            </div>
                          </div>
                          
                          {/* Key Responsibilities - Below */}
                          <div className="mt-4 pt-4 border-t border-[#5A8DB8]/10">
                            <h4 className="text-xs xs:text-sm font-semibold mb-2">
                              Key Responsibilities
                            </h4>
                            <p className="text-xs xs:text-sm text-gray-700 leading-relaxed">
                              {experience.key_responsibilities}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Edit buttons - 25% width on large screens, full width on mobile */}
                      {isEditMode && (
                        <div className="flex-shrink-0 w-full lg:w-1/4 flex justify-center lg:justify-end gap-2 order-4 xs:order-4 lg:order-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 xs:h-8 xs:w-8 text-gray-500 hover:text-[#5A8DB8] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-200 hover:scale-110"
                            onClick={() => handleEdit(experience)}
                            disabled={isLoading}
                          >
                            <Pencil className="h-3 w-3 xs:h-4 xs:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 xs:h-8 xs:w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
                            onClick={() => handleDeleteClick(experience)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-3 w-3 xs:h-4 xs:w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      
      {localExperiences.length > 2 && (
        <Button 
          variant="link" 
          className="mt-4 xs:mt-6 text-[#5A8DB8] hover:text-[#3C5979] flex items-center p-0 group transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm group-hover:underline">{isExpanded ? 'Show less' : 'Show all experiences'}</span>
          <div className="ml-1 transition-transform duration-200 group-hover:translate-y-0.5">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
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