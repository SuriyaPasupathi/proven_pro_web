import { ChevronDown, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';
import { useEditMode } from '../../context/EditModeContext';

interface ToolsSectionProps {
  primary_tools?: string[] | string;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ primary_tools = [] }) => {
  const { isEditMode } = useEditMode();

  // Debug logging
  useEffect(() => {
    console.log('Tools Section - Raw Data:', { primary_tools });
  }, [primary_tools]);

  // Ensure primary_tools is an array
  const toolsArray = Array.isArray(primary_tools) 
    ? primary_tools 
    : typeof primary_tools === 'string'
      ? primary_tools.split(',').map(tool => tool.trim()).filter(Boolean)
      : [];

  // Debug logging for processed data
  useEffect(() => {
    console.log('Tools Section - Processed Tools:', toolsArray);
  }, [toolsArray]);

  if (toolsArray.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tools</h2>
          {isEditMode && (
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
            >
              <Pencil className="w-4 h-4 text-gray-600 hover:text-gray-800" />
            </Button>
          )}
        </div>
        <p className="text-gray-600">No tools information available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tools</h2>
        {isEditMode && (
          <Button 
            variant="ghost" 
            className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {toolsArray.map((tool, index) => (
          <span 
            key={index}
            className="text-gray-600 mb-4"
          >
            {tool}
          </span>
        ))}
      </div>
      
      <Button 
        variant="link" 
        className="mt-4 text-[#70a4d8] hover:text-[#3C5979] flex items-center p-0"
      >
        <span>Show all tools</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ToolsSection;
