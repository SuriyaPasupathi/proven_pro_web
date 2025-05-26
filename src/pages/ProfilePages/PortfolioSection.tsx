import { useState, useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEditMode } from '../../context/EditModeContext';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface PortfolioItem {
  project_title: string;
  project_description: string;
  project_url: string;
  project_image: string;
  project_image_url: string;
}

interface PortfolioSectionProps {
  portfolio?: PortfolioItem[];
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolio = [] }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const { profileData } = useAppSelector((state) => state.createProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const isInitialMount = useRef(true);
  const [form, setForm] = useState<PortfolioItem>({
    project_title: "",
    project_description: "",
    project_url: "",
    project_image: "",
    project_image_url: "",
  });

  // Parse portfolio data
  const parsePortfolio = (data: PortfolioItem[] | string | undefined): PortfolioItem[] => {
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

  // Initialize portfolio items only once on mount
  useEffect(() => {
    if (isInitialMount.current) {
      setPortfolioItems(parsePortfolio(portfolio));
      isInitialMount.current = false;
    }
  }, []);

  // Update form when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen) {
      if (editingItem) {
        setForm(editingItem);
      } else {
        setForm({
          project_title: "",
          project_description: "",
          project_url: "",
          project_image: "",
          project_image_url: "",
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

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let updatedPortfolio: PortfolioItem[];
      
      if (editingItem) {
        // Update existing portfolio item
        updatedPortfolio = portfolioItems.map(item => 
          item === editingItem ? form : item
        );
      } else {
        // Add new portfolio item
        updatedPortfolio = [...portfolioItems, form];
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('subscription_type', profileData?.subscription_type || 'premium');
      formData.append('portfolio', JSON.stringify(updatedPortfolio));

      // Add other profile data
      if (profileData) {
        Object.entries(profileData).forEach(([key, value]) => {
          if (key !== 'portfolio' && key !== 'subscription_type' && value !== undefined) {
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
          portfolio: updatedPortfolio
        }));

        // Update local state
        setPortfolioItems(updatedPortfolio);

        toast.success(editingItem ? "Portfolio item updated successfully!" : "Portfolio item added successfully!");
        setIsDialogOpen(false);
        setEditingItem(null);
        setForm({
          project_title: "",
          project_description: "",
          project_url: "",
          project_image: "",
          project_image_url: "",
        });
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update portfolio");
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setForm({
      project_title: "",
      project_description: "",
      project_url: "",
      project_image: "",
      project_image_url: "",
    });
  };

  if (!portfolioItems || portfolioItems.length === 0) {
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
        <p className="text-gray-600">No portfolio items available.</p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
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
                  {editingItem ? 'Save Changes' : 'Add Item'}
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
        {portfolioItems.map((item: PortfolioItem, index: number) => {
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
                src={getFullImageUrl(portfolioItems[selectedItem].project_image_url || portfolioItems[selectedItem].project_image)} 
                alt={portfolioItems[selectedItem].project_title}
                className="w-full h-auto max-h-[60vh] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{portfolioItems[selectedItem].project_title}</h3>
                <p className="text-gray-600 mb-4">{portfolioItems[selectedItem].project_description}</p>
                {portfolioItems[selectedItem].project_url && (
                  <a 
                    href={portfolioItems[selectedItem].project_url}
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
              {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
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
                {editingItem ? 'Save Changes' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioSection;