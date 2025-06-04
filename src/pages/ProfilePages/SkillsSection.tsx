import { ChevronDown, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEditMode } from '../../context/EditModeContext';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const { profileData } = useAppSelector((state) => state.createProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');

  // Initialize state only once when component mounts
  useEffect(() => {
    const techSkills = Array.isArray(technical_skills) ? technical_skills : [];
    const softSkills = Array.isArray(soft_skills) ? soft_skills : [];
    setTechnicalSkills(techSkills);
    setSoftSkills(softSkills);
    setDescription(skills_description || '');
  }, []); // Empty dependency array means this runs only once on mount

  const handleAddTechnicalSkill = () => {
    if (newTechnicalSkill.trim()) {
      setTechnicalSkills([...technicalSkills, newTechnicalSkill.trim()]);
      setNewTechnicalSkill('');
    }
  };

  const handleAddSoftSkill = () => {
    if (newSoftSkill.trim()) {
      setSoftSkills([...softSkills, newSoftSkill.trim()]);
      setNewSoftSkill('');
    }
  };

  const handleRemoveTechnicalSkill = (index: number) => {
    setTechnicalSkills(technicalSkills.filter((_, i) => i !== index));
  };

  const handleRemoveSoftSkill = (index: number) => {
    setSoftSkills(softSkills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      formData.append('technical_skills', JSON.stringify(technicalSkills));
      formData.append('soft_skills', JSON.stringify(softSkills));
      formData.append('skills_description', description);

      if (profileData) {
        Object.entries(profileData).forEach(([key, value]) => {
          if (!['technical_skills', 'soft_skills', 'skills_description', 'subscription_type'].includes(key) && value !== undefined) {
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
          technical_skills: technicalSkills,
          soft_skills: softSkills,
          skills_description: description
        }));

        toast.success("Skills updated successfully!");
        setIsDialogOpen(false);
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update skills");
    }
  };

  const handleCancel = () => {
    // Reset to original values
    const techSkills = Array.isArray(technical_skills) ? technical_skills : [];
    const softSkills = Array.isArray(soft_skills) ? soft_skills : [];
    setTechnicalSkills(techSkills);
    setSoftSkills(softSkills);
    setDescription(skills_description || '');
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your skills and expertise..."
                className="bg-gray-50 min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Technical Skills</label>
                <div className="space-y-2">
                  {technicalSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...technicalSkills];
                          newSkills[index] = e.target.value;
                          setTechnicalSkills(newSkills);
                        }}
                        className="bg-gray-50"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveTechnicalSkill(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newTechnicalSkill}
                      onChange={(e) => setNewTechnicalSkill(e.target.value)}
                      placeholder="Add new technical skill"
                      className="bg-gray-50"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTechnicalSkill}
                      className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Soft Skills</label>
                <div className="space-y-2">
                  {softSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...softSkills];
                          newSkills[index] = e.target.value;
                          setSoftSkills(newSkills);
                        }}
                        className="bg-gray-50"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveSoftSkill(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newSoftSkill}
                      onChange={(e) => setNewSoftSkill(e.target.value)}
                      placeholder="Add new soft skill"
                      className="bg-gray-50"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSoftSkill}
                      className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}

      {technicalSkills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {technicalSkills.map((skill, index) => (
              <span 
                key={index}
                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {softSkills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Soft Skills</h3>
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {softSkills.map((skill, index) => (
              <span 
                key={index}
                className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
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