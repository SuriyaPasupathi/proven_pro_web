import { ChevronDown, Loader2, ChevronUp, Plus,  Pencil, CheckCircle2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEditMode } from '../../context/EditModeContext';
import { useState, useEffect } from 'react';
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
  const { profileData: reduxProfileData } = useAppSelector((state) => state.createProfile);
  const { skills: dropdownSkills, loading: dropdownLoading } = useAppSelector((state) => state.dropdown);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // Convert tools input to array
  const getToolsArray = (input: string[] | string): string[] => {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
      try {
        // Handle empty string case
        if (input.trim() === '') return [];
        
        // Try to parse the JSON string
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing tools:', e);
        // If parsing fails, try to handle it as a comma-separated string
        try {
          return input.split(',').map(tool => tool.trim()).filter(Boolean);
        } catch (e2) {
          console.error('Error parsing tools as comma-separated string:', e2);
          return [];
        }
      }
    }
    return [];
  };

  const [tools, setTools] = useState<string[]>(() => getToolsArray(primary_tools));

  // Initialize tools when component mounts or props change
  useEffect(() => {
    const toolsArray = getToolsArray(primary_tools);
    console.log('Props received:', { primary_tools });
    console.log('Parsed tools:', toolsArray);
    console.log('Current tools state:', tools);
    
    // Only update if the values are different from current state
    if (JSON.stringify(toolsArray) !== JSON.stringify(tools)) {
      console.log('Updating tools state with new values');
      setTools(toolsArray);
    }
  }, [primary_tools]);

  // Update tools from Redux store
  useEffect(() => {
    if (reduxProfileData?.primary_tools) {
      const toolsArray = getToolsArray(reduxProfileData.primary_tools);
      if (JSON.stringify(toolsArray) !== JSON.stringify(tools)) {
        setTools(toolsArray);
      }
    }
  }, [reduxProfileData?.primary_tools]);

  // Fetch skills when dialog opens
  useEffect(() => {
    if (isToolsOpen) {
      dispatch(fetchSkills('primary'));
    }
  }, [isToolsOpen, dispatch]);

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

  const handleAddTool = (tool: Skill) => {
    console.log('Adding tool:', tool);
    setTools(prev => {
      const currentValues = prev;
      if (!currentValues.includes(tool.name)) {
        const newValues = [...currentValues, tool.name];
        console.log('New tools values:', newValues);
        return newValues;
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!reduxProfileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const formData = new FormData();
      formData.append('subscription_type', reduxProfileData.subscription_type || 'premium');
      formData.append('primary_tools', JSON.stringify(tools));

      console.log('Submitting tools data:', {
        primary_tools: tools
      });

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: reduxProfileData.id
      })).unwrap();
      
      if (result) {
        console.log('Update successful, new data:', result);
        
        // Parse the tools from the response if they are strings
        const parseResponseTools = (tools: any) => {
          if (typeof tools === 'string') {
            try {
              return JSON.parse(tools);
            } catch (e) {
              console.error('Error parsing response tools:', e);
              return [];
            }
          }
          return Array.isArray(tools) ? tools : [];
        };

        const updatedTools = parseResponseTools(result.primary_tools);
        
        // Update Redux store with parsed data
        dispatch(updateProfileData({
          ...reduxProfileData,
          primary_tools: updatedTools
        }));

        // Force update local state with parsed data
        setTools(updatedTools);

        toast.success("Tools updated successfully!");
        setIsDialogOpen(false);
        setIsAddDialogOpen(false);
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      console.error('Update failed:', error);
      toast.error(error.message || "Failed to update tools");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTools(getToolsArray(primary_tools));
    setIsDialogOpen(false);
  };

  const handleRemoveTool = (toolToRemove: string, isUpdate: boolean = false) => {
    setTools(prev => prev.filter(tool => tool !== toolToRemove));
    
    // Only show toast for individual removals, not during updates
    if (!isUpdate) {
      toast.success(`${toolToRemove} removed successfully!`);
    }
  };

    return (
    <div className="relative ">
      <div className="absolute inset-0 "></div>
      
      <div className="relative flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl xs:text-4xl font-bold text-black">
            Tools
          </h2>
        </div>
        
        {isEditMode && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-black hover:text-black p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              className="bg-white/80 backdrop-blur-sm hover:bg-white text-black hover:text-black p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-semibold text-black">
                Edit Tools
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black">
                  Tools
                </label>
                <Button
                  type="button"
                  onClick={() => setIsToolsOpen(true)}
                  className="w-full justify-start bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 hover:border-[#5A8DB8] text-black rounded-xl"
                >
                  {tools.length > 0 ? tools.join(", ") : "Select tools"}
                </Button>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tools.map((tool, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 text-black px-3 py-1.5 rounded-full text-sm shadow-sm hover:shadow-md transition-all duration-200">
                      <span>{tool}
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-black hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200" onClick={() => handleRemoveTool(tool, true)} disabled={isLoading}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-[#5A8DB8]/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white rounded-xl shadow-lg hover:shadow-xl px-6 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add New Tools Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-semibold text-black">
                Add New Tools
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">
                Tools
              </label>
              <Button
                type="button"
                onClick={() => setIsToolsOpen(true)}
                className="w-full justify-start bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 hover:border-[#5A8DB8] text-black rounded-xl"
              >
                {tools.length > 0 ? tools.join(", ") : "Select tools"}
              </Button>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-[#5A8DB8]/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleSubmit(new Event('submit') as any);
                  setIsAddDialogOpen(false);
                }}
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white rounded-xl shadow-lg hover:shadow-xl px-6 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Tools...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Add Tools
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tools Selection Dialog */}
      <Dialog open={isToolsOpen} onOpenChange={setIsToolsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-semibold text-black">
                Select Tools
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {dropdownLoading ? (
                <div className="col-span-2 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#5A8DB8]" />
                </div>
              ) : (
                getSkillsArray(dropdownSkills).map((tool: Skill) => (
                  <Button
                    key={tool.id}
                    type="button"
                    variant={tools.includes(tool.name) ? "default" : "outline"}
                    className={`w-full justify-start ${
                      tools.includes(tool.name)
                        ? 'bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white'
                        : 'bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 hover:border-[#5A8DB8] text-black'
                    } rounded-xl`}
                    onClick={() => handleAddTool(tool)}
                  >
                    {tool.name}
                  </Button>
                ))
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-[#5A8DB8]/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsToolsOpen(false)}
              className="border-[#5A8DB8]/20 text-black hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 rounded-xl px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => setIsToolsOpen(false)}
              className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] rounded-xl shadow-lg hover:shadow-xl px-6"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-black">
            Primary Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {tools.length > 0 ? (
              tools
                .slice(0, isExpanded ? undefined : 2)
                .map((tool, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-[#5A8DB8]/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black">{tool}</span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No tools added yet</p>
            )}
          </div>
        </div>
      </div>
      
      {tools.length > 2 && (
        <div className="mt-6">
          <Button 
            variant="ghost" 
            className="text-black hover:text-black hover:bg-[#5A8DB8]/10 rounded-xl px-4 py-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="mr-2">{isExpanded ? 'Show less' : 'Show all tools'}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ToolsSection;
