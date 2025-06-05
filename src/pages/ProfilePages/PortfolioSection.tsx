import { useState, useEffect, useRef } from 'react';
import { Pencil, X } from 'lucide-react';
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

  // Initialize projectItems from profileData
  useEffect(() => {
    if (profileData?.projects) {
      console.log('Profile Data Projects:', profileData.projects);
      const parsedProjects = parseProjects(profileData.projects);
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
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      
      // Create updated portfolio array
      const updatedPortfolio = editingItem 
        ? projectItems.map(item => 
            item === editingItem ? form : item
          )
        : [...projectItems, form];
      
      formData.append('portfolio', JSON.stringify(updatedPortfolio));

      // Append project images if any
      form.project_images.forEach((image, index) => {
        formData.append(`project_image_${index}`, image.file);
      });

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData?.id || ''
      })).unwrap();
      
      if (result) {
        dispatch(updateProfileData({
          ...profileData,
          portfolio: updatedPortfolio
        }));

        toast.success("Portfolio updated successfully!");
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
      toast.error(error.message || "Failed to update portfolio");
    }
  };

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

  if (!projectItems || projectItems.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Portfolio</h2>
          {isEditMode && (
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
              onClick={() => {
                setEditingItem(null);
                setIsDialogOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-gray-600">No projects available.</p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Project' : 'Add Project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="project_title" className="block font-medium mb-1 text-sm">
                  Project Title
                </label>
                <Input
                  id="project_title"
                  name="project_title"
                  placeholder="Enter project name"
                  value={form.project_title}
                  onChange={handleChange}
                  className="bg-gray-50"
                  required
                />
              </div>

              <div>
                <label htmlFor="project_description" className="block font-medium mb-1 text-sm">
                  Project Description
                </label>
                <Textarea
                  id="project_description"
                  name="project_description"
                  placeholder="Describe your project..."
                  value={form.project_description}
                  onChange={handleChange}
                  className="bg-gray-50 min-h-[120px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="project_url" className="block font-medium mb-1 text-sm">
                  Project URL
                </label>
                <Input
                  id="project_url"
                  name="project_url"
                  placeholder="https://..."
                  value={form.project_url}
                  onChange={handleChange}
                  className="bg-gray-50"
                  required
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8 text-center">
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
                    className="mb-2"
                    onClick={handleUploadClick}
                  >
                    Upload Project Images
                  </Button>
                  <p className="text-gray-500 text-sm">
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
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                >
                  {editingItem ? 'Save Changes' : 'Add Project'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Portfolio</h2>
        {isEditMode && (
          <Button 
            variant="ghost" 
            className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
            onClick={() => {
              setEditingItem(null);
              setIsDialogOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectItems.map((item: Project, index: number) => {
          const imageUrl = getFullImageUrl(item.project_image_url || item.project_image);
          
          return (
            <div 
              key={index}
              className="relative group overflow-hidden rounded-lg cursor-pointer"
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
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.project_title}</h3>
                  <p className="text-sm">{item.project_description}</p>
                </div>
              </div>
              {isEditMode && (
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 p-2 h-auto bg-white/80 hover:bg-white text-[#3C5979] hover:text-[#3C5979] rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
      
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
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{projectItems[selectedItem].project_title}</h3>
                <p className="text-gray-600 mb-4">{projectItems[selectedItem].project_description}</p>
                {projectItems[selectedItem].project_url && (
                  <a 
                    href={projectItems[selectedItem].project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Project →
                  </a>
                )}
              </div>
              <button 
                className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white rounded-full flex items-center justify-center"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Project' : 'Add Project'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="project_title" className="block font-medium mb-1 text-sm">
                Project Title
              </label>
              <Input
                id="project_title"
                name="project_title"
                placeholder="Enter project name"
                value={form.project_title}
                onChange={handleChange}
                className="bg-gray-50"
                required
              />
            </div>

            <div>
              <label htmlFor="project_description" className="block font-medium mb-1 text-sm">
                Project Description
              </label>
              <Textarea
                id="project_description"
                name="project_description"
                placeholder="Describe your project..."
                value={form.project_description}
                onChange={handleChange}
                className="bg-gray-50 min-h-[120px]"
                required
              />
            </div>

            <div>
              <label htmlFor="project_url" className="block font-medium mb-1 text-sm">
                Project URL
              </label>
              <Input
                id="project_url"
                name="project_url"
                placeholder="https://..."
                value={form.project_url}
                onChange={handleChange}
                className="bg-gray-50"
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8 text-center">
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
                  className="mb-2"
                  onClick={handleUploadClick}
                >
                  Upload Project Images
                </Button>
                <p className="text-gray-500 text-sm">
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
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
              >
                {editingItem ? 'Save Changes' : 'Add Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioSection;