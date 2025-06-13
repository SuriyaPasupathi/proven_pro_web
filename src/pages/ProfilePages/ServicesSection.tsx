import { ChevronDown, Pencil, Plus, Loader2, Trash2, ChevronUp, Briefcase } from 'lucide-react';
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
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useDeleteItem } from '@/hooks/useDeleteItem';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState<ServiceForm>({
    services_categories: '',
    services_description: '',
    rate_range: '',
    availability: '',
  });
  const { profileData: reduxProfileData } = useSelector((state: RootState) => state.createProfile);

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

  // State for tracking service to delete
  const [serviceToDelete, setServiceToDelete] = useState<ServiceCategory | null>(null);

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
      // Validate form data
      if (!form.services_categories.trim() || !form.services_description.trim() || 
          !form.rate_range.trim() || !form.availability.trim()) {
        toast.error("All fields are required!");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('subscription_type', reduxProfileData?.subscription_type || 'premium');
      
      // Create updated services array using ID for comparison
      let updatedServices;
      if (editingService) {
        // If editing, update the existing service
        updatedServices = localServices.map(service => 
          service.id === editingService.id 
            ? { ...form, id: editingService.id }
            : service
        );
      } else {
        // If adding new service, check for duplicates before adding
        const isDuplicate = localServices.some(
          service => 
            service.services_categories.toLowerCase() === form.services_categories.toLowerCase() &&
            service.services_description.toLowerCase() === form.services_description.toLowerCase() &&
            service.rate_range.toLowerCase() === form.rate_range.toLowerCase() &&
            service.availability.toLowerCase() === form.availability.toLowerCase()
        );

        if (isDuplicate) {
          toast.error("This service already exists!");
          setIsLoading(false);
          return;
        }

        // Add new service with a temporary ID
        const newService = {
          ...form,
          id: Date.now(),
          services_categories: form.services_categories.trim(),
          services_description: form.services_description.trim(),
          rate_range: form.rate_range.trim(),
          availability: form.availability.trim()
        };
        updatedServices = [...localServices, newService];
      }
      
      // Remove any duplicate services before sending to backend
      const uniqueServices = updatedServices.reduce((acc: ServiceCategory[], current) => {
        const isDuplicate = acc.some(
          service => 
            service.services_categories.toLowerCase() === current.services_categories.toLowerCase() &&
            service.services_description.toLowerCase() === current.services_description.toLowerCase() &&
            service.rate_range.toLowerCase() === current.rate_range.toLowerCase() &&
            service.availability.toLowerCase() === current.availability.toLowerCase()
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);

      formData.append('categories', JSON.stringify(uniqueServices));

      if (!reduxProfileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: reduxProfileData.id as string
      })).unwrap();
      
      if (result) {
        // Update local state immediately with unique services
        setLocalServices(uniqueServices);
        
        // Update Redux store with the complete profile data
        dispatch(updateProfileData({
          ...reduxProfileData,
          categories: uniqueServices
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

  // Add useEffect to clean up duplicates when component mounts
  useEffect(() => {
    if (categories && categories.length > 0) {
      const uniqueServices = categories.reduce((acc: ServiceCategory[], current) => {
        const isDuplicate = acc.some(
          service => 
            service.services_categories.toLowerCase() === current.services_categories.toLowerCase() &&
            service.services_description.toLowerCase() === current.services_description.toLowerCase() &&
            service.rate_range.toLowerCase() === current.rate_range.toLowerCase() &&
            service.availability.toLowerCase() === current.availability.toLowerCase()
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      if (uniqueServices.length !== categories.length) {
        setLocalServices(uniqueServices);
        // Update Redux store with unique services
        dispatch(updateProfileData({
          ...reduxProfileData,
          categories: uniqueServices
        }));
      }
    }
  }, [categories]);

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

  const handleDeleteClick = (service: ServiceCategory) => {
    if (!service.id) {
      toast.error("Service ID is missing");
      return;
    }
    setServiceToDelete(service);
    openDeleteDialog();
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete?.id || !reduxProfileData?.id) {
      toast.error("Missing required IDs for deletion");
      return;
    }

    try {
      // First delete the service using the API
      await handleDelete('category', serviceToDelete.id.toString());

      // If deletion was successful, update the local state and Redux store
      if (deleteSuccess) {
        const updatedServices = localServices.filter(service => service.id !== serviceToDelete.id);
        
        const formData = new FormData();
        formData.append('subscription_type', reduxProfileData.subscription_type || 'premium');
        formData.append('categories', JSON.stringify(updatedServices));

        const result = await dispatch(updateProfile({
          data: formData,
          profileId: reduxProfileData.id
        })).unwrap();
        
        if (result) {
          setLocalServices(updatedServices);
          dispatch(updateProfileData({
            ...reduxProfileData,
            categories: updatedServices
          }));
          toast.success("Service deleted successfully!");
        }
      }
    } catch (error) {
      toast.error(deleteError || "Failed to delete service");
    } finally {
      closeDeleteDialog();
      setServiceToDelete(null);
    }
  };

  if (!categories.length && !services_description && !services_categories && !rate_range && !availability) {
  
  }

  return (
    <div className="border-b border-[#5A8DB8]/20 pb-4 xs:pb-6 sm:pb-8">
      <div className="flex justify-between items-center mb-4 xs:mb-6">
        <h2 className="text-xl xs:text-2xl font-bold text-[#5A8DB8] flex items-center gap-2">
          <span className="bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] text-white p-1.5 xs:p-2 rounded-lg shadow-sm">
            <Briefcase className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
          </span>
          Services
        </h2>
        {isEditMode && (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="p-1 xs:p-1.5 h-auto text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-300"
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
              <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-gray-50/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#5A8DB8]">
              {editingService ? 'Edit Service' : 'Add Service'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="services_categories" className="block font-medium mb-1.5 text-sm text-gray-700">
                Service Categories
              </label>
              <Input
                id="services_categories"
                name="services_categories"
                placeholder="Enter service categories (comma-separated)..."
                value={form.services_categories}
                onChange={handleChange}
                className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="services_description" className="block font-medium mb-1.5 text-sm text-gray-700">
                Service Description
              </label>
              <Textarea
                id="services_description"
                name="services_description"
                placeholder="Describe your services and expertise..."
                value={form.services_description}
                onChange={handleChange}
                className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 min-h-[120px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rate_range" className="block font-medium mb-1.5 text-sm text-gray-700">
                  Rate Range
                </label>
                <Input
                  id="rate_range"
                  name="rate_range"
                  placeholder="Enter your rate range..."
                  value={form.rate_range}
                  onChange={handleChange}
                  className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="availability" className="block font-medium mb-1.5 text-sm text-gray-700">
                  Availability
                </label>
                <Input
                  id="availability"
                  name="availability"
                  placeholder="Enter your availability..."
                  value={form.availability}
                  onChange={handleChange}
                  className="bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20"
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
                className="border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#2C4A6B] text-white shadow-sm hover:shadow-md transition-all duration-300"
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

      {/* Services Section */}
      <div className="space-y-4 xs:space-y-6">
        {localServices.length === 0 ? (
          <div className="bg-gradient-to-br from-[#5A8DB8]/5 to-white rounded-lg p-4 xs:p-6 border border-[#5A8DB8]/10">
            <p className="text-sm xs:text-base text-gray-600">No services added yet.</p>
          </div>
        ) : (
          localServices
            .slice(0, isExpanded ? undefined : 2)
            .map((service, index) => (
              <div key={service.id || index} className="relative p-4 xs:p-6 border border-[#5A8DB8]/10 rounded-lg bg-gradient-to-br from-[#5A8DB8]/5 to-white hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-base xs:text-lg text-[#5A8DB8] font-bold">
                      Main Service Category: <span className="text-gray-700 font-semibold">{service.services_categories}</span>
                    </h3>
                    <p className="text-sm xs:text-base font-bold text-[#5A8DB8]">
                      Description: <span className="text-gray-700 font-semibold">{service.services_description}</span>
                    </p>
                    <div className="flex flex-col xs:flex-row xs:gap-4 text-sm text-gray-600">
                      <p className="font-bold">
                        Rate: <span className="text-gray-700 font-semibold">{service.rate_range} $</span>
                      </p>
                      <p className="font-bold">
                        Availability: <span className="text-gray-700 font-semibold">{service.availability}</span>
                      </p>
                    </div>
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 xs:h-8 xs:w-8 text-gray-500 hover:text-[#5A8DB8] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-200"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 xs:h-8 xs:w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                        onClick={() => handleDeleteClick(service)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
      
      {localServices.length > 2 && (
        <Button 
          variant="link" 
          className="mt-4 xs:mt-6 text-[#5A8DB8] hover:text-[#3C5979] flex items-center p-0 group transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm group-hover:underline">{isExpanded ? 'Show less' : 'Show all services'}</span>
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
          setServiceToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        description={`Are you sure you want to delete the service "${serviceToDelete?.services_categories}"? This action cannot be undone.`}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default ServicesSection;