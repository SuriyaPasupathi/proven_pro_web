import { ChevronDown, Pencil, Loader2, Trash2, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEditMode } from '../../context/EditModeContext';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useDeleteItem } from '@/hooks/useDeleteItem';

interface SkillsForm {
  technical_skills: string[];
  soft_skills: string[];
  skills_description: string;
}

interface SkillsSectionProps {
  technical_skills?: string[];
  soft_skills?: string[];
  skills_description?: string;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ 
  technical_skills = [], 
  soft_skills = [],
  skills_description = ''
}) => {
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const { profileData: reduxProfileData } = useAppSelector((state) => state.createProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState<SkillsForm>({
    technical_skills: [],
    soft_skills: [],
    skills_description: ''
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

  // State for tracking skill to delete
  const [skillToDelete, setSkillToDelete] = useState<{ skill: string; type: 'technical_skills' | 'soft_skills' } | null>(null);

  // Initialize form when component mounts or props change
  useEffect(() => {
    if (isDialogOpen) {
      setForm({
        technical_skills: Array.isArray(technical_skills) ? technical_skills : [],
        soft_skills: Array.isArray(soft_skills) ? soft_skills : [],
        skills_description: skills_description || ''
      });
    }
  }, [isDialogOpen, technical_skills, soft_skills, skills_description]);

  // Initialize form data from Redux store
  useEffect(() => {
    if (reduxProfileData) {
      setForm({
        technical_skills: Array.isArray(reduxProfileData.technical_skills) ? reduxProfileData.technical_skills : [],
        soft_skills: Array.isArray(reduxProfileData.soft_skills) ? reduxProfileData.soft_skills : [],
        skills_description: reduxProfileData.skills_description || ''
      });
    }
  }, [reduxProfileData]);

  const handleSkillSelect = (value: string, field: 'technical_skills' | 'soft_skills') => {
    setForm(prev => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!reduxProfileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const formData = new FormData();
      formData.append('subscription_type', reduxProfileData.subscription_type || 'premium');
      formData.append('technical_skills', JSON.stringify(form.technical_skills));
      formData.append('soft_skills', JSON.stringify(form.soft_skills));
      formData.append('skills_description', form.skills_description);

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: reduxProfileData.id
      })).unwrap();
      
      if (result) {
        dispatch(updateProfileData({
          ...reduxProfileData,
          technical_skills: form.technical_skills,
          soft_skills: form.soft_skills,
          skills_description: form.skills_description
        }));

        toast.success("Skills updated successfully!");
        setIsDialogOpen(false);
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update skills");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      technical_skills: Array.isArray(technical_skills) ? technical_skills : [],
      soft_skills: Array.isArray(soft_skills) ? soft_skills : [],
      skills_description: skills_description || ''
    });
    setIsDialogOpen(false);
  };

  const handleDeleteClick = (skill: string, type: 'technical_skills' | 'soft_skills') => {
    setSkillToDelete({ skill, type });
    openDeleteDialog();
  };

  const handleDeleteConfirm = async () => {
    if (!skillToDelete || !reduxProfileData?.id) {
      toast.error("Missing required data for deletion");
      return;
    }

    try {
      // First delete the skill using the API
      await handleDelete('skill', skillToDelete.skill);

      // If deletion was successful, update the local state and Redux store
      if (deleteSuccess) {
        const updatedSkills = {
          ...form,
          [skillToDelete.type]: form[skillToDelete.type].filter(s => s !== skillToDelete.skill)
        };

        const formData = new FormData();
        formData.append('subscription_type', reduxProfileData.subscription_type || 'premium');
        formData.append('technical_skills', JSON.stringify(updatedSkills.technical_skills));
        formData.append('soft_skills', JSON.stringify(updatedSkills.soft_skills));
        formData.append('skills_description', updatedSkills.skills_description);

        const result = await dispatch(updateProfile({
          data: formData,
          profileId: reduxProfileData.id
        })).unwrap();
        
        if (result) {
          setForm(updatedSkills);
          dispatch(updateProfileData({
            ...reduxProfileData,
            technical_skills: updatedSkills.technical_skills,
            soft_skills: updatedSkills.soft_skills,
            skills_description: updatedSkills.skills_description
          }));
          toast.success("Skill removed successfully!");
        }
      }
    } catch (error) {
      toast.error(deleteError || "Failed to remove skill");
    } finally {
      closeDeleteDialog();
      setSkillToDelete(null);
    }
  };

  return (
    <div className="border-b border-[#5A8DB8] pb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#5A8DB8]">Skills</h2>
        {isEditMode && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-blue-600"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Skills</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2">Skills Description</label>
              <Textarea
                value={form.skills_description}
                onChange={(e) => setForm(prev => ({ ...prev, skills_description: e.target.value }))}
                placeholder="Describe your skills and expertise..."
                className="bg-gray-50 min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Technical Skills</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md bg-gray-50"
                  placeholder="Add technical skill"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        handleSkillSelect(value, 'technical_skills');
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.technical_skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      <span>{skill}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-blue-800 hover:text-red-600 hover:bg-transparent"
                        onClick={() => handleDeleteClick(skill, 'technical_skills')}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Soft Skills</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md bg-gray-50"
                  placeholder="Add soft skill"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        handleSkillSelect(value, 'soft_skills');
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.soft_skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      <span>{skill}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-green-800 hover:text-red-600 hover:bg-transparent"
                        onClick={() => handleDeleteClick(skill, 'soft_skills')}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
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
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {form.skills_description && (
        <p className="text-[#5A8DB8] mb-6 font-bold">Skills Description : <span className="text-gray-600 font-semibold">{form.skills_description}</span></p>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
        <div className="flex flex-wrap gap-2">
          {form.technical_skills.length > 0 ? (
            form.technical_skills
              .slice(0, isExpanded ? undefined : 2)
              .map((skill, index) => (
                <span 
                  key={index}
                  className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {skill}
                </span>
              ))
          ) : (
            <p className="text-gray-500">No technical skills added yet</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Soft Skills</h3>
        <div className="flex flex-wrap gap-2">
          {form.soft_skills.length > 0 ? (
            form.soft_skills
                .slice(0, isExpanded ? undefined : 2)
              .map((skill, index) => (
                <span 
                  key={index}
                  className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                >
                  {skill}
                </span>
              ))
          ) : (
            <p className="text-gray-500">No soft skills added yet</p>
          )}
        </div>
      </div>
      
      {(form.technical_skills.length > 1 || form.soft_skills.length > 1) && (
        <Button 
          variant="link" 
          className="mt-4 text-[#70a4d8] hover:text-[#3C5979] flex items-center p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? 'Show less' : 'Show all skills'}</span>
          {isExpanded ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          closeDeleteDialog();
          setSkillToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Skill"
        description={`Are you sure you want to remove "${skillToDelete?.skill}" from your ${skillToDelete?.type === 'technical_skills' ? 'technical' : 'soft'} skills?`}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default SkillsSection;