import { ChevronDown, Pencil, Plus, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';

interface ServiceForm {
  services_categories: string;
  services_description: string;
  rate_range: string;
  availability: string;
}

interface ServiceCategory {
  id?: number;
  services_categories: string;
  services_description: string;
  rate_range: string;
  availability: string;
}

interface ServicesSectionProps {
  categories?: ServiceCategory[];
  services_categories?: string[] | string;
  services_description?: string;
  rate_range?: string;
  availability?: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  categories = [],
  services_categories = [], 
  services_description,
  rate_range,
  availability 
}) => {
  const { isEditMode } = useEditMode();
  const dispatch = useDispatch<AppDispatch>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCategory | null>(null);
  const [localServices, setLocalServices] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ServiceForm>({
    services_categories: '',
    services_description: '',
    rate_range: '',
    availability: '',
  });
  const { profileData: reduxProfileData } = useSelector((state: RootState) => state.createProfile);

  // Initialize services when component mounts or categories prop changes
  useEffect(() => {
    const parsedServices = Array.isArray(categories) ? categories : [];
    if (JSON.stringify(parsedServices) !== JSON.stringify(localServices)) {
      setLocalServices(parsedServices);
    }
  }, [categories]);

  // Update form when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen) {
      if (editingService) {
        setForm({
          services_categories: editingService.services_categories || '',
          services_description: editingService.services_description || '',
          rate_range: editingService.rate_range || '',
          availability: editingService.availability || '',
        });
      } else {
        setForm({
          services_categories: '',
          services_description: '',
          rate_range: '',
          availability: '',
        });
      }
    }
  }, [isDialogOpen, editingService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (service: ServiceCategory) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('subscription_type', reduxProfileData?.subscription_type || 'premium');
      
      // Create updated services array
      const updatedServices = editingService 
        ? localServices.map(service => 
            service === editingService ? form : service
          )
        : [...localServices, form];
      
      formData.append('categories', JSON.stringify(updatedServices));

      if (!reduxProfileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: reduxProfileData.id
      })).unwrap();
      
      if (result) {
        // Update local state immediately
        setLocalServices(updatedServices);
        
        // Update Redux store with the complete profile data
        dispatch(updateProfileData({
          ...reduxProfileData,
          categories: updatedServices
        }));

        toast.success(editingService ? "Service updated successfully!" : "Service added successfully!");
        setIsDialogOpen(false);
        setEditingService(null);
        setForm({
          services_categories: '',
          services_description: '',
          rate_range: '',
          availability: '',
        });
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update service");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setForm({
      services_categories: '',
      services_description: '',
      rate_range: '',
      availability: '',
    });
  };

  if (!categories.length && !services_description && !services_categories && !rate_range && !availability) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Services</h2>
          {isEditMode && (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
                onClick={() => {
                  setEditingService(null);
                  setForm({
                    services_categories: '',
                    services_description: '',
                    rate_range: '',
                    availability: '',
                  });
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-gray-600">No services information available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Services</h2>
        {isEditMode && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
              onClick={() => {
                setEditingService(null);
                setForm({
                  services_categories: '',
                  services_description: '',
                  rate_range: '',
                  availability: '',
                });
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add Service'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="services_categories" className="block font-medium mb-1 text-sm">
                Service Categories
              </label>
              <Input
                id="services_categories"
                name="services_categories"
                placeholder="Enter service categories (comma-separated)..."
                value={form.services_categories}
                onChange={handleChange}
                className="bg-gray-50"
                required
              />
            </div>

            <div>
              <label htmlFor="services_description" className="block font-medium mb-1 text-sm">
                Service Description
              </label>
              <Textarea
                id="services_description"
                name="services_description"
                placeholder="Describe your services and expertise..."
                value={form.services_description}
                onChange={handleChange}
                className="bg-gray-50 min-h-[120px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rate_range" className="block font-medium mb-1 text-sm">
                  Rate Range
                </label>
                <Input
                  id="rate_range"
                  name="rate_range"
                  placeholder="Enter your rate range..."
                  value={form.rate_range}
                  onChange={handleChange}
                  className="bg-gray-50"
                  required
                />
              </div>
              <div>
                <label htmlFor="availability" className="block font-medium mb-1 text-sm">
                  Availability
                </label>
                <Input
                  id="availability"
                  name="availability"
                  placeholder="Enter your availability..."
                  value={form.availability}
                  onChange={handleChange}
                  className="bg-gray-50"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingService ? 'Saving Changes...' : 'Adding Service...'}
                  </>
                ) : (
                  editingService ? 'Save Changes' : 'Add Service'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {localServices.map((service, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-4 relative bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {service.services_categories}
                </h3>
                <p className="text-gray-600 mt-2">{service.services_description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Rate Range:</span> {service.rate_range}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Availability:</span> {service.availability}
                  </p>
                </div>
              </div>
              {isEditMode && (
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
                  onClick={() => handleEdit(service)}
                  disabled={isLoading}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        variant="link" 
        className="mt-6 text-[#70a4d8] hover:text-[#3C5979] flex items-center p-0"
      >
        <span>Show all services</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ServicesSection;