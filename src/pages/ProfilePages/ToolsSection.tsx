import { ChevronDown, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ToolsSectionProps {
  primary_tools?: string[] | string;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ primary_tools = [] }) => {
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.createProfile);
  const { skills } = useAppSelector((state) => state.dropdown);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tools, setTools] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState('');

  // Convert tools input to array
  const getToolsArray = (input: string[] | string): string[] => {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return input.split(',').map(tool => tool.trim()).filter(Boolean);
      }
    }
    return [];
  };

  useEffect(() => {
    if (primary_tools) {
      const toolsArray = getToolsArray(primary_tools);
      setTools(toolsArray);
    }
  }, [primary_tools]);

  const handleToolSelect = (value: string) => {
    if (!tools.includes(value)) {
      setTools(prevTools => [...prevTools, value]);
    }
    setSelectedTool('');
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setTools(prevTools => prevTools.filter(tool => tool !== toolToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      formData.append('primary_tools', JSON.stringify(tools));

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData?.id || ''
      })).unwrap();
      
      if (result) {
        dispatch(updateProfileData({
          ...profileData,
          primary_tools: tools
        }));

        toast.success("Tools updated successfully!");
        setIsDialogOpen(false);
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update tools");
    }
  };

  const handleCancel = () => {
    setTools(getToolsArray(primary_tools));
    setIsDialogOpen(false);
  };

  if (!tools || tools.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tools</h2>
          {isEditMode && (
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
              onClick={() => setIsDialogOpen(true)}
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
            onClick={() => setIsDialogOpen(true)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Tools</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-sm">
                  Select Tools
                </label>
                <Select
                  value={selectedTool}
                  onValueChange={handleToolSelect}
                >
                  <SelectTrigger className="w-full bg-gray-50">
                    <SelectValue placeholder="Select tools" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill: any) => (
                      <SelectItem key={skill.id} value={skill.name}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2">
                {tools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <span>{tool}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(tool)}
                      className="text-blue-800 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
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

      <div className="flex flex-wrap gap-2">
        {tools.map((tool, index) => (
          <span 
            key={index}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
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
