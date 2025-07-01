import React, { useState, useEffect } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import { fetchSkills } from "../../../store/Services/DropDownService";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { SubscriptionType, getTotalSteps, getStepProgress, getNextAvailableStep } from "../../../utils/subscriptionUtils";
import StepAccessControl from "../../../components/StepAccessControl";

interface Skill {
  id: number;
  name: string;
  category: string;
}

interface FormData {
  primary_tools: Skill[];
  technical_skills: Skill[];
  soft_skills: Skill[];
  skills_description: string;
}

const CURRENT_STEP = 5;

const ToolSkills: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    primary_tools: [],
    technical_skills: [],
    soft_skills: [],
    skills_description: "",
  });

  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isSoftSkillsOpen, setIsSoftSkillsOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, profileData } = useSelector((state: RootState) => state.createProfile);
  const { skills: dropdownSkills, loading: dropdownLoading } = useSelector((state: RootState) => state.dropdown);

  // Get subscription type from Redux store
  const subscriptionType = profileData?.subscription_type || 'free';
  const totalSteps = getTotalSteps(subscriptionType as SubscriptionType);
  const progressPercent = getStepProgress(CURRENT_STEP, subscriptionType as SubscriptionType);

  useEffect(() => {
    if (isToolsOpen) {
      dispatch(fetchSkills('primary'));
    }
  }, [isToolsOpen, dispatch]);

  useEffect(() => {
    if (isSkillsOpen) {
      dispatch(fetchSkills('technical'));
    }
  }, [isSkillsOpen, dispatch]);

  useEffect(() => {
    if (isSoftSkillsOpen) {
      dispatch(fetchSkills('soft'));
    }
  }, [isSoftSkillsOpen, dispatch]);

  // Pre-fill form with existing data if available
  useEffect(() => {
    if (profileData) {
      console.log('ToolSkills: Pre-filling with existing data:', {
        primary_tools: profileData.primary_tools,
        technical_skills: profileData.technical_skills,
        soft_skills: profileData.soft_skills,
        skills_description: profileData.skills_description
      });

      setForm(prev => ({
        ...prev,
        primary_tools: getSkillsArray(profileData.primary_tools),
        technical_skills: getSkillsArray(profileData.technical_skills),
        soft_skills: getSkillsArray(profileData.soft_skills),
        skills_description: profileData.skills_description || ""
      }));
    }
  }, [profileData]);

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

  const handleAddItem = (skill: Skill, field: keyof FormData) => {
    setForm(prev => {
      const currentValues = prev[field] as Skill[];
      const cleanSkill = {
        ...skill,
        name: skill.name.trim()
      };
      if (!currentValues.some(s => s.id === cleanSkill.id)) {
        return {
          ...prev,
          [field]: [...currentValues, cleanSkill]
        };
      }
      return prev;
    });
  };

  const handleRemoveItem = (skillId: number, field: keyof FormData) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field] as Skill[]).filter(s => s.id !== skillId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const profileData = {
        subscription_type: subscriptionType as SubscriptionType,
        primary_tools: form.primary_tools.map(tool => tool.name.trim()),
        technical_skills: form.technical_skills.map(skill => skill.name.trim()),
        soft_skills: form.soft_skills.map(skill => skill.name.trim()),
        skills_description: form.skills_description.trim(),
      };

      // Debug logging
      console.log('ToolSkills: Form submission debug:', {
        subscriptionType,
        primary_tools: profileData.primary_tools,
        technical_skills: profileData.technical_skills,
        soft_skills: profileData.soft_skills,
        skills_description: profileData.skills_description
      });

      const result = await dispatch(createUserProfile(profileData)).unwrap();
      
      if (result) {
        toast.success("Tools and skills saved successfully!");
        
        // Navigate to the next available step
        const nextStep = getNextAvailableStep(CURRENT_STEP, subscriptionType as SubscriptionType);
        if (nextStep) {
          navigate(nextStep.path);
        } else {
          // If no next step, navigate to profile page
          const profileId = result.data?.id || localStorage.getItem('userProfileId');
          if (profileId) {
            navigate(`/profile/${profileId}`);
          }
        }
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save tools and skills");
    }
  };

  return (
    <StepAccessControl currentStep={CURRENT_STEP}>
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FBFF] px-4 sm:px-6 md:px-8 py-8 flex flex-col">
        {/* Step Progress */}
        <div className="mb-10 w-full max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-black flex items-center gap-2">
              Step {CURRENT_STEP} of {totalSteps}
            </h2>
            <span className="text-black/80 text-sm font-medium bg-[#5A8DB8]/5 px-3 py-1 rounded-full">
              {progressPercent}% Complete
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                Tools & Skills
              </h1>
              <p className="text-sm text-black/70 mt-1">Showcase your expertise and capabilities</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="primary_tools" className="text-sm font-medium text-black mb-2">
                Primary Tools
              </label>
              <Button
                type="button"
                onClick={() => setIsToolsOpen(true)}
                className="w-full justify-start bg-white border-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 text-black transition-all duration-300 rounded-xl"
              >
                {form.primary_tools.length > 0 ? form.primary_tools.map(tool => tool.name).join(", ") : "Select tools"}
              </Button>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.primary_tools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between gap-2 bg-[#5A8DB8]/10 text-black px-3 py-1.5 rounded-full text-sm font-medium shadow-sm min-w-0">
                    <span className="truncate">{tool.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(tool.id, 'primary_tools')}
                      className="flex-shrink-0 text-[#5A8DB8] hover:text-red-500 transition-colors duration-300 ml-1 font-bold text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="technical_skills" className="text-sm font-medium text-black mb-2">
                Technical Skills
              </label>
              <Button
                type="button"
                onClick={() => setIsSkillsOpen(true)}
                className="w-full justify-start bg-white border-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 text-black transition-all duration-300 rounded-xl"
              >
                {form.technical_skills.length > 0 ? form.technical_skills.map(skill => skill.name).join(", ") : "Select technical skills"}
              </Button>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.technical_skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between gap-2 bg-[#5A8DB8]/10 text-black px-3 py-1.5 rounded-full text-sm font-medium shadow-sm min-w-0">
                    <span className="truncate">{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(skill.id, 'technical_skills')}
                      className="flex-shrink-0 text-[#5A8DB8] hover:text-red-500 transition-colors duration-300 ml-1 font-bold text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="soft_skills" className="text-sm font-medium text-black mb-2">
                Soft Skills
              </label>
              <Button
                type="button"
                onClick={() => setIsSoftSkillsOpen(true)}
                className="w-full justify-start bg-white border-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 text-black transition-all duration-300 rounded-xl"
              >
                {form.soft_skills.length > 0 ? form.soft_skills.map(skill => skill.name).join(", ") : "Select soft skills"}
              </Button>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.soft_skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between gap-2 bg-[#5A8DB8]/10 text-black px-3 py-1.5 rounded-full text-sm font-medium shadow-sm min-w-0">
                    <span className="truncate">{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(skill.id, 'soft_skills')}
                      className="flex-shrink-0 text-[#5A8DB8] hover:text-red-500 transition-colors duration-300 ml-1 font-bold text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="skills_description" className="text-sm font-medium text-black mb-2">
                Skills Description
              </label>
              <Textarea
                id="skills_description"
                name="skills_description"
                placeholder="Provide more details about your expertise..."
                value={form.skills_description}
                onChange={(e) => setForm(prev => ({ ...prev, skills_description: e.target.value }))}
                className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 min-h-[120px]"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-[#EAF3FA] p-4 rounded-xl border-2 border-[#5A8DB8]/20">
              <p className="text-sm text-black flex items-center gap-2">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              className="border-2 border-[#5A8DB8]/30 text-black hover:bg-[#5A8DB8]/10 transition flex items-center gap-2 px-6 py-2 rounded-xl"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save and Continue
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Tools Dialog */}
        <Dialog open={isToolsOpen} onOpenChange={setIsToolsOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-black">
                Select Tools
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {dropdownLoading ? (
                <div className="col-span-2 flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin text-[#5A8DB8] border-2 border-[#5A8DB8]/20 border-t-[#5A8DB8] rounded-full" />
                </div>
              ) : (
                getSkillsArray(dropdownSkills).map((tool: Skill) => (
                  <Button
                    key={tool.id}
                    type="button"
                    variant={form.primary_tools.some(t => t.id === tool.id) ? "default" : "outline"}
                    className={`w-full justify-start rounded-xl transition-all duration-300 ${
                      form.primary_tools.some(t => t.id === tool.id)
                        ? "bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white"
                        : "bg-white border-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 text-black"
                    }`}
                    onClick={() => handleAddItem(tool, 'primary_tools')}
                  >
                    {tool.name}
                  </Button>
                ))
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsToolsOpen(false)}
                className="border-2 border-[#5A8DB8]/30 text-black hover:bg-[#5A8DB8]/10 transition px-4 py-2 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setIsToolsOpen(false)}
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition px-4 py-2 rounded-xl"
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Skills Dialog */}
        <Dialog open={isSkillsOpen} onOpenChange={setIsSkillsOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-black">
                Select Technical Skills
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {dropdownLoading ? (
                <div className="col-span-2 flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin text-[#5A8DB8] border-2 border-[#5A8DB8]/20 border-t-[#5A8DB8] rounded-full" />
                </div>
              ) : (
                getSkillsArray(dropdownSkills).map((skill: Skill) => (
                  <Button
                    key={skill.id}
                    type="button"
                    variant={form.technical_skills.some(s => s.id === skill.id) ? "default" : "outline"}
                    className={`w-full justify-start rounded-xl transition-all duration-300 ${
                      form.technical_skills.some(s => s.id === skill.id)
                        ? "bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white"
                        : "bg-white border-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 text-black"
                    }`}
                    onClick={() => handleAddItem(skill, 'technical_skills')}
                  >
                    {skill.name}
                  </Button>
                ))
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSkillsOpen(false)}
                className="border-2 border-[#5A8DB8]/30 text-black hover:bg-[#5A8DB8]/10 transition px-4 py-2 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setIsSkillsOpen(false)}
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition px-4 py-2 rounded-xl"
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Soft Skills Dialog */}
        <Dialog open={isSoftSkillsOpen} onOpenChange={setIsSoftSkillsOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-black">
                Select Soft Skills
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {dropdownLoading ? (
                <div className="col-span-2 flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin text-[#5A8DB8] border-2 border-[#5A8DB8]/20 border-t-[#5A8DB8] rounded-full" />
                </div>
              ) : (
                getSkillsArray(dropdownSkills).map((skill: Skill) => (
                  <Button
                    key={skill.id}
                    type="button"
                    variant={form.soft_skills.some(s => s.id === skill.id) ? "default" : "outline"}
                    className={`w-full justify-start rounded-xl transition-all duration-300 ${
                      form.soft_skills.some(s => s.id === skill.id)
                        ? "bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white"
                        : "bg-white border-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 text-black"
                    }`}
                    onClick={() => handleAddItem(skill, 'soft_skills')}
                  >
                    {skill.name}
                  </Button>
                ))
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSoftSkillsOpen(false)}
                className="border-2 border-[#5A8DB8]/30 text-black hover:bg-[#5A8DB8]/10 transition px-4 py-2 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setIsSoftSkillsOpen(false)}
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition px-4 py-2 rounded-xl"
              >
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </StepAccessControl>
  );
};

export default ToolSkills;
