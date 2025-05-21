import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Experience {
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
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Experience</h2>
      
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <h3 className="font-semibold text-lg">{exp.position}</h3>
              <p className="text-gray-600">{exp.company_name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {exp.experience_start_date} - {exp.experience_end_date}
              </p>
              <p className="mt-2 text-gray-700">{exp.key_responsibilities}</p>
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        variant="link" 
        className="mt-6 text-blue-600 hover:text-blue-800 flex items-center p-0"
      >
        <span>Show all experiences</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ExperienceSection;