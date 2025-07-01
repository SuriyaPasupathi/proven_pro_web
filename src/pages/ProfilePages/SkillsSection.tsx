import {  Loader2, Plus, Pencil, CheckCircle2, X } from 'lucide-react';
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
  const [isTechnicalSkillsOpen, setIsTechnicalSkillsOpen] = useState(false);
  const [isSoftSkillsOpen, setIsSoftSkillsOpen] = useState(false);
  const [form, setForm] = useState<SkillsForm>({
    technical_skills: [],
    soft_skills: [],
    skills_description: ''
  });

  // Initialize form when component mounts or props change
  useEffect(() => {
    // Parse the skills if they are strings
    const parseSkills = (skills: any) => {
      if (!skills) return [];
      
      if (typeof skills === 'string') {
        try {
          // Handle empty string case
          if (skills.trim() === '') return [];
          
          // Try to parse the JSON string
          const parsed = JSON.parse(skills);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error('Error parsing skills:', e);
          // If parsing fails, try to handle it as a comma-separated string
          try {
            return skills.split(',').map(s => s.trim()).filter(Boolean);
          } catch (e2) {
            console.error('Error parsing skills as comma-separated string:', e2);
            return [];
          }
        }
      }
      
      // If it's already an array, return it
      if (Array.isArray(skills)) {
        return skills.map(skill => typeof skill === 'string' ? skill.trim() : skill);
      }
      
      // If it's an object with a skills property, try to use that
      if (skills && typeof skills === 'object' && 'skills' in skills) {
        return Array.isArray(skills.skills) ? skills.skills : [];
      }
      
      return [];
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

  const handleRemoveSkill = (skillToRemove: string, field: 'technical_skills' | 'soft_skills', isUpdate: boolean = false) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter(skill => skill !== skillToRemove)
    }));
    
    // Only show toast for individual removals, not during updates
    if (!isUpdate) {
      toast.success(`${skillToRemove} removed successfully!`);
    }
  };

  return (
    <div className="relative ">
      <div className="absolute inset-0 "></div>
      
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="text-xl xs:text-4xl font-bold text-black">
            Skills
          </h2>
        </div>
        
        {isEditMode && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-black hover:text-black p-2.5 sm:p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-black hover:text-black p-2.5 sm:p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-semibold text-black">
                Edit Skills
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">
                Skills Description
              </label>
              <Textarea
                value={form.skills_description}
                onChange={(e) => setForm(prev => ({ ...prev, skills_description: e.target.value }))}
                placeholder="Describe your skills and expertise..."
                className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 min-h-[120px] rounded-xl text-black"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Technical Skills
                </label>
                <Button
                  type="button"
                  onClick={() => setIsTechnicalSkillsOpen(true)}
                  className="w-full justify-start bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 hover:border-[#5A8DB8] text-black rounded-xl"
                >
                  {form.technical_skills.length > 0 ? form.technical_skills.join(", ") : "Select technical skills"}
                </Button>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.technical_skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 text-black px-3 py-1.5 rounded-full text-sm shadow-sm hover:shadow-md transition-all duration-200 min-w-0">
                      <span className="truncate text-sm font-medium">{skill}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 mt-1 flex-shrink-0 text-black hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 ml-1" 
                        onClick={() => handleRemoveSkill(skill, 'technical_skills', true)} 
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Soft Skills
                </label>
                <Button
                  type="button"
                  onClick={() => setIsSoftSkillsOpen(true)}
                  className="w-full justify-start bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 hover:border-[#5A8DB8] text-black rounded-xl"
                >
                  {form.soft_skills.length > 0 ? form.soft_skills.join(", ") : "Select soft skills"}
                </Button>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.soft_skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 text-black px-3 py-1.5 rounded-full text-sm shadow-sm hover:shadow-md transition-all duration-200 min-w-0">
                      <span className="truncate text-sm font-medium">{skill}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 flex-shrink-0 text-black hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 ml-1" 
                        onClick={() => handleRemoveSkill(skill, 'soft_skills', true)} 
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-[#5A8DB8]/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white rounded-xl shadow-lg hover:shadow-xl px-6 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add New Skills Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-semibold text-black">
                Add New Skills
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">
                Technical Skills
              </label>
              <Button
                type="button"
                onClick={() => setIsTechnicalSkillsOpen(true)}
                className="w-full justify-start bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 hover:border-[#5A8DB8] text-black rounded-xl"
              >
                {form.technical_skills.length > 0 ? form.technical_skills.join(", ") : "Select technical skills"}
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black">
                Soft Skills
              </label>
              <Button
                type="button"
                onClick={() => setIsSoftSkillsOpen(true)}
                className="w-full justify-start bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 hover:border-[#5A8DB8] text-black rounded-xl"
              >
                {form.soft_skills.length > 0 ? form.soft_skills.join(", ") : "Select soft skills"}
              </Button>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-[#5A8DB8]/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleSubmit(new Event('submit') as any);
                  setIsAddDialogOpen(false);
                }}
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white rounded-xl shadow-lg hover:shadow-xl px-6 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Skills...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Add Skills
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Technical Skills Dialog */}
      <Dialog open={isTechnicalSkillsOpen} onOpenChange={setIsTechnicalSkillsOpen}>
        <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-semibold text-black">
                Select Technical Skills
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dropdownLoading ? (
                <div className="col-span-2 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#5A8DB8]" />
                </div>
              ) : (
                getSkillsArray(dropdownSkills).map((skill: Skill) => (
                  <Button
                    key={skill.id}
                    type="button"
                    variant={form.technical_skills.includes(skill.name) ? "default" : "outline"}
                    className={`w-full justify-start ${
                      form.technical_skills.includes(skill.name)
                        ? 'bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white'
                        : 'bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 hover:border-[#5A8DB8] text-black'
                    } rounded-xl`}
                    onClick={() => handleAddSkill(skill, 'technical_skills')}
                  >
                    {skill.name}
                  </Button>
                ))
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-[#5A8DB8]/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTechnicalSkillsOpen(false)}
              className="border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => setIsTechnicalSkillsOpen(false)}
              className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] rounded-xl shadow-lg hover:shadow-xl px-6"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Soft Skills Dialog */}
      <Dialog open={isSoftSkillsOpen} onOpenChange={setIsSoftSkillsOpen}>
        <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-semibold text-black">
                Select Soft Skills
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dropdownLoading ? (
                <div className="col-span-2 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#5A8DB8]" />
                </div>
              ) : (
                getSkillsArray(dropdownSkills).map((skill: Skill) => (
                  <Button
                    key={skill.id}
                    type="button"
                    variant={form.soft_skills.includes(skill.name) ? "default" : "outline"}
                    className={`w-full justify-start ${
                      form.soft_skills.includes(skill.name)
                        ? 'bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white'
                        : 'bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 hover:border-[#5A8DB8] text-black'
                    } rounded-xl`}
                    onClick={() => handleAddSkill(skill, 'soft_skills')}
                  >
                    {skill.name}
                  </Button>
                ))
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-[#5A8DB8]/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSoftSkillsOpen(false)}
              className="border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => setIsSoftSkillsOpen(false)}
              className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] rounded-xl shadow-lg hover:shadow-xl px-6"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-black">
            Technical Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {form.technical_skills.length > 0 ? (
              form.technical_skills
                .map((skill, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-[#5A8DB8]/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">{skill}</span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No technical skills added yet</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-black">
            Soft Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {form.soft_skills.length > 0 ? (
              form.soft_skills
                .map((skill, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-[#5A8DB8]/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">{skill}</span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No soft skills added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;