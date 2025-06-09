import { ChevronDown, Pencil, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEditMode } from '../../context/EditModeContext';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { fetchSkills } from '../../store/Services/DropDownService';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const { skills, loading: skillsLoading } = useAppSelector((state) => state.dropdown);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<SkillsForm>({
    technical_skills: [],
    soft_skills: [],
    skills_description: ''
  });

  // Fetch skills when component mounts
  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  // Initialize form when component mounts or props change
  useEffect(() => {
    setForm({
      technical_skills: Array.isArray(technical_skills) ? technical_skills : [],
      soft_skills: Array.isArray(soft_skills) ? soft_skills : [],
      skills_description: skills_description || ''
    });
  }, [technical_skills, soft_skills, skills_description]);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills</h2>
        {isEditMode && (
          <Button 
            variant="ghost" 
            className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
            onClick={() => setIsDialogOpen(true)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
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
                <Select
                  value={form.technical_skills.join(',')}
                  onValueChange={(value) => handleSkillSelect(value, 'technical_skills')}
                >
                  <SelectTrigger className="w-full bg-gray-50">
                    <SelectValue placeholder="Select technical skills" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill: any) => (
                      <SelectItem key={skill.id} value={skill.name}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.technical_skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Soft Skills</label>
                <Select
                  value={form.soft_skills.join(',')}
                  onValueChange={(value) => handleSkillSelect(value, 'soft_skills')}
                >
                  <SelectTrigger className="w-full bg-gray-50">
                    <SelectValue placeholder="Select soft skills" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill: any) => (
                      <SelectItem key={skill.id} value={skill.name}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.soft_skills.map((skill, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading || skillsLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                disabled={isLoading || skillsLoading}
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
        <p className="text-gray-600 mb-6">{form.skills_description}</p>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
        <div className="flex flex-wrap gap-2">
          {form.technical_skills.length > 0 ? (
            form.technical_skills.map((skill, index) => (
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
            form.soft_skills.map((skill, index) => (
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
      
      <Button 
        variant="link" 
        className="mt-4 text-[#70a4d8] hover:text-[#3C5979] flex items-center p-0"
      >
        <span>Show all skills</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default SkillsSection;