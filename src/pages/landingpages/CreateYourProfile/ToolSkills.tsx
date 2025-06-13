import React, { useState, useEffect } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import { fetchSkills } from "../../../store/Services/DropDownService";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

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

const TOTAL_STEPS = 8;
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
  const { loading, error } = useSelector((state: RootState) => state.createProfile);
  const { skills: dropdownSkills, loading: dropdownLoading } = useSelector((state: RootState) => state.dropdown);

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
        subscription_type: "premium" as const,
        primary_tools: form.primary_tools.map(tool => tool.name.trim()),
        technical_skills: form.technical_skills.map(skill => skill.name.trim()),
        soft_skills: form.soft_skills.map(skill => skill.name.trim()),
        skills_description: form.skills_description.trim(),
      };

      const result = await dispatch(createUserProfile(profileData)).unwrap();
      
      if (result) {
        toast.success("Tools and skills saved successfully!");
        navigate("/create-profile/portfolio");
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save tools and skills");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-6 flex flex-col">
      {/* Step Progress */}
      <div className="mb-8 w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Step {CURRENT_STEP} of {TOTAL_STEPS}
          </h2>
          <span className="text-gray-500 text-sm">{Math.round((CURRENT_STEP / TOTAL_STEPS) * 100)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-[#3C5979] rounded transition-all duration-300"
            style={{ width: `${Math.round((CURRENT_STEP / TOTAL_STEPS) * 100)}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm flex flex-col gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tools & Skills</h1>

        <div>
          <label htmlFor="primary_tools" className="block font-medium mb-1 text-sm">
            Primary Tools
          </label>
          <Button
            type="button"
            onClick={() => setIsToolsOpen(true)}
            className="w-full justify-start bg-gray-50 border border-gray-300 hover:bg-gray-100 text-left"
          >
            {form.primary_tools.length > 0 ? form.primary_tools.map(tool => tool.name).join(", ") : "Select tools"}
          </Button>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.primary_tools.map((tool) => (
              <div key={tool.id} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                <span>{tool.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(tool.id, 'primary_tools')}
                  className="text-blue-800 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="technical_skills" className="block font-medium mb-1 text-sm">
            Technical Skills
          </label>
          <Button
            type="button"
            onClick={() => setIsSkillsOpen(true)}
            className="w-full justify-start bg-gray-50 border border-gray-300 hover:bg-gray-100 text-left"
          >
            {form.technical_skills.length > 0 ? form.technical_skills.map(skill => skill.name).join(", ") : "Select technical skills"}
          </Button>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.technical_skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                <span>{skill.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(skill.id, 'technical_skills')}
                  className="text-green-800 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="soft_skills" className="block font-medium mb-1 text-sm">
            Soft Skills
          </label>
          <Button
            type="button"
            onClick={() => setIsSoftSkillsOpen(true)}
            className="w-full justify-start bg-gray-50 border border-gray-300 hover:bg-gray-100 text-left"
          >
            {form.soft_skills.length > 0 ? form.soft_skills.map(skill => skill.name).join(", ") : "Select soft skills"}
          </Button>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.soft_skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm"
              >
                <span>{skill.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(skill.id, 'soft_skills')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="skills_description" className="block font-medium mb-1 text-sm">
            Skills Description
          </label>
          <Textarea
            id="skills_description"
            name="skills_description"
            placeholder="Provide more details about your expertise..."
            value={form.skills_description}
            onChange={(e) => setForm(prev => ({ ...prev, skills_description: e.target.value }))}
            className="bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#5A8DB8] min-h-[120px]"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto hover:bg-[#5A8DB8] text-black"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </form>

      {/* Tools Dialog */}
      <Dialog open={isToolsOpen} onOpenChange={setIsToolsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Tools</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {dropdownLoading ? (
              <div className="col-span-2 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              getSkillsArray(dropdownSkills).map((tool: Skill) => (
                <Button
                  key={tool.id}
                  type="button"
                  variant={form.primary_tools.some(t => t.id === tool.id) ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleAddItem(tool, 'primary_tools')}
                >
                  {tool.name}
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Skills Dialog */}
      <Dialog open={isSkillsOpen} onOpenChange={setIsSkillsOpen}>
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
                  variant={form.technical_skills.some(s => s.id === skill.id) ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleAddItem(skill, 'technical_skills')}
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
                  variant={form.soft_skills.some(s => s.id === skill.id) ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleAddItem(skill, 'soft_skills')}
                >
                  {skill.name}
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ToolSkills;
