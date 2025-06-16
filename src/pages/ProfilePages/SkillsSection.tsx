import { ChevronDown, Loader2, ChevronUp, Wrench, Plus, X, Pencil, Trash2 } from 'lucide-react';
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
import { fetchSkills } from '../../store/Services/DropDownService';

interface Skill {
  id: number;
  name: string;
  category: string;
}

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
  const { skills: dropdownSkills, loading: dropdownLoading } = useAppSelector((state) => state.dropdown);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTechnicalSkillsOpen, setIsTechnicalSkillsOpen] = useState(false);
  const [isSoftSkillsOpen, setIsSoftSkillsOpen] = useState(false);
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
    isLoading: isDeleteLoading
  } = useDeleteItem();

  // State for tracking skill to delete
  const [skillToDelete, setSkillToDelete] = useState<{ skill: string; type: 'technical_skills' | 'soft_skills' } | null>(null);

  // Initialize form when component mounts or props change
  useEffect(() => {
    // Parse the skills if they are strings
    const parseSkills = (skills: any) => {
      if (typeof skills === 'string') {
        try {
          return JSON.parse(skills);
        } catch (e) {
          console.error('Error parsing skills:', e);
          return [];
        }
      }
      return Array.isArray(skills) ? skills : [];
    };

    const techSkills = parseSkills(technical_skills);
    const softSkills = parseSkills(soft_skills);
    const description = skills_description || '';
    
    console.log('Props received:', { technical_skills, soft_skills, skills_description });
    console.log('Parsed skills:', { techSkills, softSkills });
    console.log('Current form state:', form);
    
    // Only update if the values are different from current form state
    if (
      JSON.stringify(techSkills) !== JSON.stringify(form.technical_skills) ||
      JSON.stringify(softSkills) !== JSON.stringify(form.soft_skills) ||
      description !== form.skills_description
    ) {
      console.log('Updating form state with new values');
      setForm({
        technical_skills: techSkills,
        soft_skills: softSkills,
        skills_description: description
      });
    }
  }, [technical_skills, soft_skills, skills_description]);

  useEffect(() => {
    if (isTechnicalSkillsOpen) {
      dispatch(fetchSkills('technical'));
    }
  }, [isTechnicalSkillsOpen, dispatch]);

  useEffect(() => {
    if (isSoftSkillsOpen) {
      dispatch(fetchSkills('soft'));
    }
  }, [isSoftSkillsOpen, dispatch]);

  const getSkillsArray = (skills: any): Skill[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) {
      return skills.map((skill: { id: number; name: string; category: string }) => ({
        ...skill,
        name: skill.name.trim()
      }));
    }
    if (skills.skills && Array.isArray(skills.skills)) {
      return skills.skills.map((skill: { id: number; name: string; category: string }) => ({
        ...skill,
        name: skill.name.trim()
      }));
    }
    return [];
  };

  const handleAddSkill = (skill: Skill, field: 'technical_skills' | 'soft_skills') => {
    console.log('Adding skill:', skill, 'to field:', field);
    setForm(prev => {
      const currentValues = prev[field];
      if (!currentValues.includes(skill.name)) {
        const newValues = [...currentValues, skill.name];
        console.log('New values for', field, ':', newValues);
        return {
          ...prev,
          [field]: newValues
        };
      }
      return prev;
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

      console.log('Submitting form data:', {
        technical_skills: form.technical_skills,
        soft_skills: form.soft_skills,
        skills_description: form.skills_description
      });

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: reduxProfileData.id
      })).unwrap();
      
      if (result) {
        console.log('Update successful, new data:', result);
        
        // Parse the skills from the response if they are strings
        const parseResponseSkills = (skills: any) => {
          if (typeof skills === 'string') {
            try {
              return JSON.parse(skills);
            } catch (e) {
              console.error('Error parsing response skills:', e);
              return [];
            }
          }
          return Array.isArray(skills) ? skills : [];
        };

        const updatedTechnicalSkills = parseResponseSkills(result.technical_skills);
        const updatedSoftSkills = parseResponseSkills(result.soft_skills);
        
        // Update Redux store with parsed data
        dispatch(updateProfileData({
          ...reduxProfileData,
          technical_skills: updatedTechnicalSkills,
          soft_skills: updatedSoftSkills,
          skills_description: result.skills_description
        }));

        // Force update local state with parsed data
        setForm(prev => ({
          ...prev,
          technical_skills: updatedTechnicalSkills,
          soft_skills: updatedSoftSkills,
          skills_description: result.skills_description
        }));

        toast.success("Skills updated successfully!");
        setIsDialogOpen(false);
        setIsAddDialogOpen(false);
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      console.error('Update failed:', error);
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
      // Update the local state and Redux store first
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
    } catch (error) {
      toast.error("Failed to remove skill");
    } finally {
      closeDeleteDialog();
      setSkillToDelete(null);
    }
  };

  return (
    <div className="border-b border-[#5A8DB8]/20 pb-4 xs:pb-6 sm:pb-8">
      <div className="flex justify-between items-center mb-4 xs:mb-6">
        <h2 className="text-xl xs:text-2xl font-bold text-[#5A8DB8] flex items-center gap-2">
          <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 xs:p-2 rounded-lg shadow-sm">
            <Wrench className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
          </span>
          Skills
        </h2>
        {isEditMode && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="p-1 xs:p-1.5 h-auto text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-300"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="p-1 xs:p-1.5 h-auto text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-300"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#5A8DB8]">Edit Skills</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-gray-700">Skills Description</label>
              <Textarea
                value={form.skills_description}
                onChange={(e) => setForm(prev => ({ ...prev, skills_description: e.target.value }))}
                placeholder="Describe your skills and expertise..."
                className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2 text-gray-700">Technical Skills</label>
                <Button
                  type="button"
                  onClick={() => setIsTechnicalSkillsOpen(true)}
                  className="w-full justify-start bg-gray-50 border border-gray-300 hover:bg-gray-100 text-left"
                >
                  {form.technical_skills.length > 0 ? form.technical_skills.join(", ") : "Select technical skills"}
                </Button>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.technical_skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm shadow-sm hover:shadow-md transition-all duration-200">
                      <span>{skill}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-blue-800 hover:text-red-600 hover:bg-transparent"
                        onClick={() => handleDeleteClick(skill, 'technical_skills')}
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-700">Soft Skills</label>
                <Button
                  type="button"
                  onClick={() => setIsSoftSkillsOpen(true)}
                  className="w-full justify-start bg-gray-50 border border-gray-300 hover:bg-gray-100 text-left"
                >
                  {form.soft_skills.length > 0 ? form.soft_skills.join(", ") : "Select soft skills"}
                </Button>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.soft_skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gradient-to-r from-green-50 to-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm shadow-sm hover:shadow-md transition-all duration-200">
                      <span>{skill}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-green-800 hover:text-red-600 hover:bg-transparent"
                        onClick={() => handleDeleteClick(skill, 'soft_skills')}
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
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

      {/* Add New Skills Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#5A8DB8]">Add New Skills</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-gray-700">Technical Skills</label>
              <Button
                type="button"
                onClick={() => setIsTechnicalSkillsOpen(true)}
                className="w-full justify-start bg-gray-50 border border-gray-300 hover:bg-gray-100 text-left text-black"
              >
                {form.technical_skills.length > 0 ? form.technical_skills.join(", ") : "Select technical skills"}
              </Button>
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-700">Soft Skills</label>
              <Button
                type="button"
                onClick={() => setIsSoftSkillsOpen(true)}
                className="w-full justify-start bg-gray-50 border border-gray-300 hover:bg-gray-100 text-left text-black"
              >
                {form.soft_skills.length > 0 ? form.soft_skills.join(", ") : "Select soft skills"}
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleSubmit(new Event('submit') as any);
                  setIsAddDialogOpen(false);
                }}
                className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#2C4A6B] text-white shadow-sm hover:shadow-md transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Skills...
                  </>
                ) : (
                  'Add Skills'
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Technical Skills Dialog */}
      <Dialog open={isTechnicalSkillsOpen} onOpenChange={setIsTechnicalSkillsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Technical Skills</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {dropdownLoading ? (
              <div className="col-span-2 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              getSkillsArray(dropdownSkills).map((skill: Skill) => (
                <Button
                  key={skill.id}
                  type="button"
                  variant={form.technical_skills.includes(skill.name) ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleAddSkill(skill, 'technical_skills')}
                >
                  {skill.name}
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Soft Skills Dialog */}
      <Dialog open={isSoftSkillsOpen} onOpenChange={setIsSoftSkillsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Soft Skills</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {dropdownLoading ? (
              <div className="col-span-2 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              getSkillsArray(dropdownSkills).map((skill: Skill) => (
                <Button
                  key={skill.id}
                  type="button"
                  variant={form.soft_skills.includes(skill.name) ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleAddSkill(skill, 'soft_skills')}
                >
                  {skill.name}
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {form.skills_description && (
        <div className="bg-gradient-to-br from-[#5A8DB8]/5 to-white rounded-lg p-4 xs:p-6 border border-[#5A8DB8]/10 mb-6">
          <p className="text-[#5A8DB8] font-bold">Skills Description: <span className="text-gray-600 font-semibold">{form.skills_description}</span></p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#5A8DB8]">
            <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </span>
            Technical Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {form.technical_skills.length > 0 ? (
              form.technical_skills
                .slice(0, isExpanded ? undefined : 2)
                .map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 p-2 xs:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-[#5A8DB8]/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs xs:text-sm font-medium text-[#5A8DB8]">{skill}</span>
                    </div>
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 xs:h-6 xs:w-6 text-[#5A8DB8] hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                        onClick={() => handleDeleteClick(skill, 'technical_skills')}
                      >
                        <Trash2 className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                      </Button>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No technical skills added yet</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#5A8DB8]">
            <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            Soft Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {form.soft_skills.length > 0 ? (
              form.soft_skills
                .slice(0, isExpanded ? undefined : 2)
                .map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 p-2 xs:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-[#5A8DB8]/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs xs:text-sm font-medium text-[#5A8DB8]">{skill}</span>
                    </div>
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 xs:h-6 xs:w-6 text-[#5A8DB8] hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                        onClick={() => handleDeleteClick(skill, 'soft_skills')}
                      >
                        <Trash2 className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
                      </Button>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No soft skills added yet</p>
            )}
          </div>
        </div>
      </div>
      
      {(form.technical_skills.length > 1 || form.soft_skills.length > 1) && (
        <Button 
          variant="link" 
          className="mt-4 xs:mt-6 text-[#5A8DB8] hover:text-[#3C5979] flex items-center p-0 group transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm group-hover:underline">{isExpanded ? 'Show less' : 'Show all skills'}</span>
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