import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

interface ToolsSectionProps {
  primary_tools?: string[] | string;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ primary_tools = [] }) => {
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
        <h2 className="text-2xl font-bold mb-6">Tools</h2>
        <p className="text-gray-600">No tools information available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tools</h2>
      
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {toolsArray.map((tool, index) => (
          <span 
            key={index}
            className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
          >
            {tool}
          </span>
        ))}
      </div>
      
      <Button 
        variant="link" 
        className="mt-4 text-blue-600 hover:text-blue-800 flex items-center p-0"
      >
        <span>Show all tools</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ToolsSection;