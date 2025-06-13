import { useState, useEffect, useRef } from 'react';
import { Pencil, X, Trash2, Plus, ChevronUp, ChevronDown, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEditMode } from '../../context/EditModeContext';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { ProfileData } from '../../types/profile';
// import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useDeleteItem } from '@/hooks/useDeleteItem';

// Get the base URL from environment variable
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Add this constant at the top of the file after imports
const PLACEHOLDER_IMAGE = 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image';

interface ProjectImage {
  file: File;
  previewUrl: string;
}

interface Project {
  id?: number;
  project_title: string;
  project_description: string;
  project_url: string;
  project_image?: string;
  project_image_url?: string;
}

interface PortfolioSectionProps {
  projects?: Project[];
  portfolio?: Project[];
}

const PortfolioSection: React.FC<PortfolioSectionProps> = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.createProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [projectItems, setProjectItems] = useState<Project[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Project & { project_images: ProjectImage[] }>({
    project_title: "",
    project_description: "",
    project_url: "",
    project_image: "",
    project_images: [],
  });
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

  // State for tracking item to delete
  const [itemToDelete, setItemToDelete] = useState<Project | null>(null);

  // Initialize projectItems from profileData
  useEffect(() => {
    if (profileData?.portfolio) {
      console.log('Profile Data Projects:', profileData.portfolio);
      const parsedProjects = parseProjects(profileData.portfolio);
      console.log('Parsed Projects:', parsedProjects);
      setProjectItems(parsedProjects);
    }
  }, []); // Empty dependency array since we only want to initialize once

  // Parse project data
  const parseProjects = (data: Project[] | string | undefined): Project[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return [];
  };

  

  // Update form when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen) {
      if (editingItem) {
        setForm({
          ...editingItem,
          project_images: [],
        });
      } else {
        setForm({
          project_title: "",
          project_description: "",
          project_url: "",
          project_image: "",
          project_images: [],
        });
      }
    }
  }, [isDialogOpen, editingItem]);

  // Function to get full image URL
  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return PLACEHOLDER_IMAGE;
    if (url.startsWith('http')) return url;
    return `${baseUrl}${url}`;
  };

  const handleItemClick = (id: number) => {
    setSelectedItem(id === selectedItem ? null : id);
  };

  const handleEdit = (item: Project) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Validate each file
      for (const file of newFiles) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 5MB`);
          return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          return;
        }
      }

      // Create preview URLs for new files
      const newImages = newFiles.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));

      setForm(prev => ({
        ...prev,
        project_images: [...prev.project_images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => {
      const newImages = [...prev.project_images];
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].previewUrl);
      newImages.splice(index, 1);
      return { ...prev, project_images: newImages };
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!form.project_title.trim() || !form.project_description.trim() || 
          !form.project_url.trim()) {
        toast.error("All fields are required!");
        return;
      }

      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      
      // Create updated portfolio array
      let updatedPortfolio;
      if (editingItem) {
        // If editing, update the existing item
        updatedPortfolio = projectItems.map(item => 
          item.id === editingItem.id ? { ...form, id: editingItem.id } : item
        );
      } else {
        // If adding new, check for duplicates before adding
        const isDuplicate = projectItems.some(
          item => 
            item.project_title.toLowerCase() === form.project_title.toLowerCase() &&
            item.project_description.toLowerCase() === form.project_description.toLowerCase() &&
            item.project_url.toLowerCase() === form.project_url.toLowerCase()
        );

        if (isDuplicate) {
          toast.error("This project already exists!");
          return;
        }

        // Add new project with trimmed values
        const newProject = {
          project_title: form.project_title.trim(),
          project_description: form.project_description.trim(),
          project_url: form.project_url.trim(),
          id: Date.now() // Temporary ID for new items
        };
        updatedPortfolio = [...projectItems, newProject];
      }
      
      // Remove any duplicate projects before sending to backend
      const uniqueProjects = updatedPortfolio.reduce((acc: Project[], current) => {
        const isDuplicate = acc.some(
          item => 
            item.project_title.toLowerCase() === current.project_title.toLowerCase() &&
            item.project_description.toLowerCase() === current.project_description.toLowerCase() &&
            item.project_url.toLowerCase() === current.project_url.toLowerCase()
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);

      // Format projects for API
      const formattedProjects = uniqueProjects.map(project => ({
        project_title: project.project_title,
        project_description: project.project_description,
        project_url: project.project_url,
        id: project.id
      }));

      // Add projects to formData
      formData.append('portfolio', JSON.stringify(formattedProjects));

      // Append project images if any
      form.project_images.forEach((image, index) => {
        formData.append(`project_image_${index}`, image.file);
      });

      if (!profileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.id
      })).unwrap();
      
      if (result) {
        // Update local state immediately with unique projects
        setProjectItems(uniqueProjects);
        
        // Update Redux store with the complete profile data
        dispatch(updateProfileData({
          ...profileData,
          portfolio: formattedProjects
        }));

        toast.success(editingItem ? "Project updated successfully!" : "Project added successfully!");
        setIsDialogOpen(false);
        setEditingItem(null);
        setForm({
          project_title: "",
          project_description: "",
          project_url: "",
          project_image: "",
          project_images: [],
        });
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update project");
    }
  };

  // Add useEffect to clean up duplicates when component mounts
  useEffect(() => {
    if (profileData?.portfolio && profileData.portfolio.length > 0) {
      const uniqueProjects = profileData.portfolio.reduce((acc: Project[], current) => {
        const isDuplicate = acc.some(
          item => 
            item.project_title.toLowerCase() === current.project_title.toLowerCase() &&
            item.project_description.toLowerCase() === current.project_description.toLowerCase() &&
            item.project_url.toLowerCase() === current.project_url.toLowerCase()
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      if (uniqueProjects.length !== profileData.portfolio.length) {
        setProjectItems(uniqueProjects);
        // Update Redux store with unique projects
        dispatch(updateProfileData({
          ...profileData,
          projects: uniqueProjects
        }));
      }
    }
  }, [profileData?.portfolio]);

  // Add useEffect to sync with Redux store
  useEffect(() => {
    if (profileData?.portfolio) {
      setProjectItems(profileData.portfolio);
    }
  }, [profileData?.portfolio]);

  const handleCancel = () => {
    // Clean up any preview URLs before closing
    form.project_images.forEach(image => {
      URL.revokeObjectURL(image.previewUrl);
    });
    
    setIsDialogOpen(false);
    setEditingItem(null);
    setForm({
      project_title: "",
      project_description: "",
      project_url: "",
      project_image: "",
      project_images: [],
    });
  };

  const handleDeleteClick = (item: Project) => {
    setItemToDelete(item);
    openDeleteDialog();
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete?.id || !profileData?.id) {
      toast.error("Missing required data for deletion");
      return;
    }

    try {
      // First delete the project using the API
      await handleDelete('project', itemToDelete.id.toString());

      // If deletion was successful, update the local state and Redux store
      if (deleteSuccess) {
        const updatedProjects = projectItems.filter(item => item.id !== itemToDelete.id);
        
        const formData = new FormData();
        formData.append('subscription_type', profileData.subscription_type || 'premium');
        formData.append('portfolio', JSON.stringify(updatedProjects));

        const result = await dispatch(updateProfile({
          data: formData,
          profileId: profileData.id
        })).unwrap();
        
        if (result) {
          setProjectItems(updatedProjects);
          dispatch(updateProfileData({
            ...profileData,
            portfolio: updatedProjects
          }));
          toast.success("Project deleted successfully!");
        }
      }
    } catch (error) {
      toast.error(deleteError || "Failed to delete project");
    } finally {
      closeDeleteDialog();
      setItemToDelete(null);
    }
  };

  if (!projectItems || projectItems.length === 0) {
    return (
      <div className="border-b border-[#5A8DB8]/20 pb-4 xs:pb-6 sm:pb-8">
        <div className="flex justify-between items-center mb-4 xs:mb-6">
          <h2 className="text-xl xs:text-2xl font-bold text-[#5A8DB8] flex items-center gap-2">
            <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 xs:p-2 rounded-lg shadow-sm">
              <Briefcase className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
            </span>
            Portfolio
          </h2>
          {isEditMode && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                className="p-1 xs:p-1.5 h-auto text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-300"
                onClick={() => {
                  setEditingItem(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-[#5A8DB8]/5 to-white rounded-lg p-4 xs:p-6 border border-[#5A8DB8]/10">
          <p className="text-sm xs:text-base text-gray-600">No projects available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[#5A8DB8]/20 pb-4 xs:pb-6 sm:pb-8">
      <div className="flex justify-between items-center mb-4 xs:mb-6">
        <h2 className="text-xl xs:text-2xl font-bold text-[#5A8DB8] flex items-center gap-2">
          <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 xs:p-2 rounded-lg shadow-sm">
            <Briefcase className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
          </span>
          Portfolio
        </h2>
        {isEditMode && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="p-1 xs:p-1.5 h-auto text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-300"
              onClick={() => {
                setEditingItem(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
        {projectItems
          .slice(0, isExpanded ? undefined : 1)
          .map((item: Project, index: number) => {
          const imageUrl = getFullImageUrl(item.project_image_url || item.project_image);
          
          return (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleItemClick(index)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={imageUrl}
                  alt={item.project_title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 xs:p-6">
                <h3 className="text-white font-semibold text-lg xs:text-xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.project_title}</h3>
                <p className="text-gray-200 text-sm xs:text-base transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">{item.project_description}</p>
                <a 
                  href={item.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-white hover:text-blue-300 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Project
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
              {isEditMode && (
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    className="p-2 h-auto bg-white/90 hover:bg-white text-[#3C5979] hover:text-[#3C5979] rounded-full shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="p-2 h-auto bg-white/90 hover:bg-white text-red-600 hover:text-red-700 rounded-full shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(item);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {projectItems.length > 1 && (
        <Button 
          variant="link" 
          className="mt-4 xs:mt-6 text-[#5A8DB8] hover:text-[#3C5979] flex items-center p-0 group transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm group-hover:underline">{isExpanded ? 'Show less' : 'Show all projects'}</span>
          {isExpanded ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 xs:h-4 xs:w-4 transition-transform duration-200" />
          ) : (
            <ChevronDown className="ml-1 h-3.5 w-3.5 xs:h-4 xs:w-4 transition-transform duration-200" />
          )}
        </Button>
      )}

      {selectedItem !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-lg overflow-hidden max-w-3xl w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={getFullImageUrl(projectItems[selectedItem].project_image_url || projectItems[selectedItem].project_image)} 
                alt={projectItems[selectedItem].project_title}
                className="w-full h-auto max-h-[60vh] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <div className="p-4 xs:p-6">
                <h3 className="text-xl xs:text-2xl font-semibold mb-2">{projectItems[selectedItem].project_title}</h3>
                <p className="text-gray-600 mb-4">{projectItems[selectedItem].project_description}</p>
                {projectItems[selectedItem].project_url && (
                  <a 
                    href={projectItems[selectedItem].project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5A8DB8] hover:text-[#3C5979] flex items-center gap-2"
                  >
                    View Project
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </div>
              <button 
                className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
                onClick={() => setSelectedItem(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#5A8DB8]">
              {editingItem ? 'Edit Project' : 'Add Project'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="project_title" className="block font-medium mb-1.5 text-sm text-gray-700">
                Project Title
              </label>
              <Input
                id="project_title"
                name="project_title"
                placeholder="Enter project name"
                value={form.project_title}
                onChange={handleChange}
                className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="project_description" className="block font-medium mb-1.5 text-sm text-gray-700">
                Project Description
              </label>
              <Textarea
                id="project_description"
                name="project_description"
                placeholder="Describe your project..."
                value={form.project_description}
                onChange={handleChange}
                className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 min-h-[120px]"
                required
              />
            </div>

            <div>
              <label htmlFor="project_url" className="block font-medium mb-1.5 text-sm text-gray-700">
                Project URL
              </label>
              <Input
                id="project_url"
                name="project_url"
                placeholder="https://..."
                value={form.project_url}
                onChange={handleChange}
                className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#5A8DB8]/20 rounded-xl flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8 text-center bg-gradient-to-br from-[#5A8DB8]/5 to-white">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                  multiple
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mb-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10"
                  onClick={handleUploadClick}
                >
                  Upload Project Images
                </Button>
                <p className="text-sm text-gray-500">
                  Upload project images (max 5MB each)
                </p>
              </div>

              {/* Image Previews */}
              {form.project_images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {form.project_images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.previewUrl}
                        alt={`Project preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#2C4A6B] text-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                {editingItem ? 'Save Changes' : 'Add Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          closeDeleteDialog();
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete "${itemToDelete?.project_title}"? This action cannot be undone.`}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default PortfolioSection;