import { ChevronDown, Pencil, Trash2, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { toast } from 'sonner';
import { fetchSkills } from '../../store/Services/DropDownService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useDeleteItem } from '@/hooks/useDeleteItem';

interface ToolsSectionProps {
  primary_tools?: string[] | string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ primary_tools = [] }) => {
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.createProfile);
  const { skills: dropdownSkills, loading: dropdownLoading } = useAppSelector((state) => state.dropdown);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Add useDeleteItem hook
  const {
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    isLoading: isDeleteLoading,
    error: deleteError,
    success: deleteSuccess
  } = useDeleteItem();

  // State for tracking tool to delete
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

  // Fetch skills when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      dispatch(fetchSkills('primary'));
    }
  }, [isDialogOpen, dispatch]);

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

  const handleToolAdd = (tool: Skill) => {
    const toolName = tool.name.trim();
    if (toolName && !tools.includes(toolName)) {
      setTools(prevTools => [...prevTools, toolName]);
    }
  };

  const handleDeleteClick = (tool: string) => {
    setToolToDelete(tool);
    openDeleteDialog();
  };

  const handleDeleteConfirm = async () => {
    if (!toolToDelete || !profileData?.id) {
      toast.error("Missing required data for deletion");
      return;
    }

    try {
      // First delete the tool using the API
      await handleDelete('tool', toolToDelete);

      // If deletion was successful, update the local state and Redux store
      if (deleteSuccess) {
        const updatedTools = tools.filter(tool => tool !== toolToDelete);
        
        const formData = new FormData();
        formData.append('subscription_type', profileData.subscription_type || 'premium');
        formData.append('primary_tools', JSON.stringify(updatedTools));

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
        }
      }
    } catch (error) {
      toast.error(deleteError || "Failed to remove tool");
    } finally {
      closeDeleteDialog();
      setToolToDelete(null);
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

  if (!tools || tools.length === 0) {
    return (
      <div className="border-b border-[#5A8DB8]/20 pb-4 xs:pb-6 sm:pb-8">
        <div className="flex justify-between items-center mb-4 xs:mb-6">
          <h2 className="text-xl xs:text-2xl font-bold text-[#5A8DB8] flex items-center gap-2">
            <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 xs:p-2 rounded-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            Tools
          </h2>
          {isEditMode && (
            <Button 
              variant="ghost" 
              className="p-1 xs:p-1.5 h-auto text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-300"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
        </div>
        <div className="bg-gradient-to-br from-[#5A8DB8]/5 to-white rounded-lg p-4 xs:p-6 border border-[#5A8DB8]/10">
          <p className="text-sm xs:text-base text-gray-600">No tools information available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[#5A8DB8]/20 pb-4 xs:pb-6 sm:pb-8">
      <div className="flex justify-between items-center mb-4 xs:mb-6">
        <h2 className="text-xl xs:text-2xl font-bold text-[#5A8DB8] flex items-center gap-2">
          <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 xs:p-2 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          Tools
        </h2>
        {isEditMode && (
          <div className="flex gap-1.5 xs:gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 xs:h-8 xs:w-8 text-gray-500 hover:text-[#5A8DB8] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-200"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#5A8DB8]">Edit Tools</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1.5 text-sm text-gray-700">
                  Select Tools
                </label>
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
                        variant={tools.includes(tool.name.trim()) ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleToolAdd(tool)}
                      >
                        {tool.name}
                      </Button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#2C4A6B] text-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap gap-2 xs:gap-3">
        {tools
          .slice(0, isExpanded ? undefined : 2)
          .map((tool, index) => (
          <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 p-2 xs:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-[#5A8DB8]/10">
            <div className="flex items-center gap-2">
              <span className="text-xs xs:text-sm font-medium text-[#5A8DB8]">{tool}</span>
            </div>
            {isEditMode && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 xs:h-6 xs:w-6 text-[#5A8DB8] hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                onClick={() => handleDeleteClick(tool)}
              >
                <Trash2 className="h-3 w-3 xs:h-3.5 xs:w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {tools.length > 2 && (
        <Button 
          variant="link" 
          className="mt-3 xs:mt-4 text-[#5A8DB8] hover:text-[#3C5979] flex items-center p-0 group transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm group-hover:underline">{isExpanded ? 'Show less' : 'Show all tools'}</span>
          {isExpanded ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 xs:h-4 xs:w-4 transition-transform duration-200" />
          ) : (
            <ChevronDown className="ml-1 h-3.5 w-3.5 xs:h-4 xs:w-4 transition-transform duration-200" />
          )}
        </Button>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          closeDeleteDialog();
          setToolToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Tool"
        description={`Are you sure you want to remove "${toolToDelete}" from your tools?`}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default ToolsSection;
