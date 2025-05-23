import { ChevronDown, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ToolsSectionProps {
  primary_tools?: string[] | string;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ primary_tools = [] }) => {
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.createProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');

  // Ensure primary_tools is an array and update local state
  useEffect(() => {
    const toolsArray = Array.isArray(primary_tools) 
      ? primary_tools 
      : typeof primary_tools === 'string'
        ? primary_tools.split(',').map(tool => tool.trim()).filter(Boolean)
        : [];
    setTools(toolsArray);
  }, [primary_tools]);

  const handleAddTool = () => {
    if (newTool.trim()) {
      setTools([...tools, newTool.trim()]);
      setNewTool('');
    }
  };

  const handleRemoveTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      formData.append('primary_tools', JSON.stringify(tools));

      // Add other profile data
      if (profileData) {
        Object.entries(profileData).forEach(([key, value]) => {
          if (key !== 'primary_tools' && key !== 'subscription_type' && value !== undefined) {
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

      const result = await dispatch(updateProfile(formData)).unwrap();
      
      if (result) {
        // Update Redux store
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
    // Reset to original tools
    const toolsArray = Array.isArray(primary_tools) 
      ? primary_tools 
      : typeof primary_tools === 'string'
        ? primary_tools.split(',').map(tool => tool.trim()).filter(Boolean)
        : [];
    setTools(toolsArray);
    setIsDialogOpen(false);
  };

  if (tools.length === 0 && !isDialogOpen) {
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
              {tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={tool}
                    onChange={(e) => {
                      const newTools = [...tools];
                      newTools[index] = e.target.value;
                      setTools(newTools);
                    }}
                    className="bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveTool(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="Add new tool"
                  className="bg-gray-50"
                />
                <Button
                  type="button"
                  onClick={handleAddTool}
                  className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                >
                  Add
                </Button>
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

      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {tools.map((tool, index) => (
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
