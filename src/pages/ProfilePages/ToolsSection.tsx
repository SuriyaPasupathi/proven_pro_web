import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
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
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';

interface ToolsSectionProps {
  primary_tools?: string[] | string;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ primary_tools = [] }) => {
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.createProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);

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

  const [tools, setTools] = useState<string[]>(() => getToolsArray(primary_tools));
  const [newTool, setNewTool] = useState('');

  // Update tools when dialog opens or primary_tools changes
  useEffect(() => {
    if (isDialogOpen) {
      const toolsArray = getToolsArray(primary_tools);
      setTools(toolsArray);
    }
  }, [isDialogOpen, primary_tools]);

  // Update tools from Redux store
  useEffect(() => {
    if (profileData?.primary_tools) {
      const toolsArray = getToolsArray(profileData.primary_tools);
      setTools(toolsArray);
    }
  }, [profileData?.primary_tools]);

  const handleToolAdd = () => {
    if (newTool.trim() && !tools.includes(newTool.trim())) {
      setTools(prevTools => [...prevTools, newTool.trim()]);
      setNewTool('');
    }
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setTools(prevTools => prevTools.filter(tool => tool !== toolToRemove));
  };

  const handleDeleteClick = (tool: string) => {
    setToolToDelete(tool);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!toolToDelete) return;

    try {
      const updatedTools = tools.filter(tool => tool !== toolToDelete);
      
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      formData.append('primary_tools', JSON.stringify(updatedTools));

      if (!profileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.id
      })).unwrap();
      
      if (result) {
        setTools(updatedTools);
        dispatch(updateProfileData({
          ...profileData,
          primary_tools: updatedTools
        }));
        toast.success("Tool removed successfully!");
        setDeleteDialogOpen(false);
        setToolToDelete(null);
      }
    } catch (error) {
      toast.error("Failed to remove tool");
    }
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
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-blue-600"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
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
                  Add Tool
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    className="flex-1 p-2 border rounded-md bg-gray-50"
                    placeholder="Enter tool name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleToolAdd();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleToolAdd}
                    className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <span>{tool}</span>
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-blue-800 hover:text-red-600 hover:bg-transparent"
                        onClick={() => handleDeleteClick(tool)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
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
          <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            <span>{tool}</span>
            {isEditMode && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-blue-800 hover:text-red-600 hover:bg-transparent"
                onClick={() => handleDeleteClick(tool)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <Button 
        variant="link" 
        className="mt-4 text-[#70a4d8] hover:text-[#3C5979] flex items-center p-0"
      >
        <span>Show all tools</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setToolToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Tool"
        description={`Are you sure you want to remove "${toolToDelete}" from your tools?`}
      />
    </div>
  );
};

export default ToolsSection;
