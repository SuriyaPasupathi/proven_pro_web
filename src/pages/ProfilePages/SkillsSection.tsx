import { ChevronDown, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEditMode } from '../../context/EditModeContext';

interface SkillsSectionProps {
  technical_skills?: string[];
  soft_skills?: string[];
  skills_description?: string;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ 
  technical_skills = [], 
  soft_skills = [],
  skills_description 
}) => {
  const { isEditMode } = useEditMode();

  // Ensure both skills arrays are actually arrays
  const technicalSkillsArray = Array.isArray(technical_skills) 
    ? technical_skills 
    : [];
  
  const softSkillsArray = Array.isArray(soft_skills) 
    ? soft_skills 
    : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills</h2>
        {isEditMode && (
          <Button 
            variant="ghost" 
            className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {skills_description && (
        <p className="text-gray-600 mb-4">{skills_description}</p>
      )}

      {technicalSkillsArray.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Technical Skills</h3>
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {technicalSkillsArray.map((skill, index) => (
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

      {softSkillsArray.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Soft Skills</h3>
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {softSkillsArray.map((skill, index) => (
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