import { ChevronDown, Pencil, Plus, Loader2, Trash2, ChevronUp } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchServices } from '../../store/Services/DropDownService';

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
  const { services, loading: servicesLoading } = useSelector((state: RootState) => state.dropdown);

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

  // Fetch services when component mounts
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

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
        formData.append('categories', JSON.stringify(updatedServices));
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

        // Add new service without ID and only send the new service data
        const newService = {
          services_categories: form.services_categories.trim(),
          services_description: form.services_description.trim(),
          rate_range: form.rate_range.trim(),
          availability: form.availability.trim()
        };
        formData.append('categories', JSON.stringify([newService]));
        updatedServices = [...localServices, newService];
      }

      if (!reduxProfileData?.id) {
        toast.error("Profile ID is missing");
        return;
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: reduxProfileData.id as string
      })).unwrap();
      
      if (result) {
        // Update local state with the new service data
        if (editingService) {
          // If editing, update the existing service in local state
          setLocalServices(updatedServices);
        } else {
          // If adding new service, append the new service to local state
          const newServiceWithId = {
            services_categories: form.services_categories.trim(),
            services_description: form.services_description.trim(),
            rate_range: form.rate_range.trim(),
            availability: form.availability.trim(),
            id: result.categories[result.categories.length - 1].id // Get the ID from the response
          };
          setLocalServices(prev => [...prev, newServiceWithId]);
        }
        
        // Update Redux store with the complete profile data
        dispatch(updateProfileData({
          ...reduxProfileData,
          categories: result.categories
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

  const handleServiceSelect = (value: string) => {
    setForm(prev => ({ ...prev, services_categories: value }));
  };

  if (!categories.length && !services_description && !services_categories && !rate_range && !availability) {
  
  }

  return (
    <div className="relative ">
      <div className=""></div>
      
      <div className="relative flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl xs:text-4xl font-bold">
            Services
          </h2>
        </div>
        
        {isEditMode && (
          <div>
            <Button 
              variant="ghost" 
            className="bg-white/80 backdrop-blur-sm hover:bg-white text-[#5A8DB8] hover:text-[#3C5979] p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
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
        <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent">
                {editingService ? 'Edit Service' : 'Add Service'}
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#3C5979]">
                Service Categories
              </label>
              <Select
                value={form.services_categories}
                onValueChange={handleServiceSelect}
              >
                <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl">
                  <SelectValue placeholder="Select a service category" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-xl shadow-lg">
                  {services.map((service: any) => (
                    <SelectItem key={service.id} value={service.name} className="hover:bg-[#5A8DB8]/5">
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#3C5979]">
                Service Description
              </label>
              <Textarea
                name="services_description"
                placeholder="Describe your services and expertise..."
                value={form.services_description}
                onChange={handleChange}
                className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 min-h-[120px] rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#3C5979]">
                  Rate Range
                </label>
                <Input
                  name="rate_range"
                  placeholder="Enter your rate range..."
                  value={form.rate_range}
                  onChange={handleChange}
                  className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#3C5979]">
                  Availability
                </label>
                <Input
                  name="availability"
                  placeholder="Enter your availability..."
                  value={form.availability}
                  onChange={handleChange}
                  className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl"
                  required
                />
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-[#5A8DB8]/10">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading || servicesLoading}
                className="border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 rounded-xl px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white rounded-xl shadow-lg hover:shadow-xl px-6 transition-all duration-300"
                disabled={isLoading || servicesLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {editingService ? 'Saving Changes...' : 'Adding Service...'}
                  </>
                ) : (
                  <>
                    {editingService ? 'Save Changes' : 'Add Service'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="relative space-y-4">
        {localServices.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-[#5A8DB8]/20 text-center">
            <div className="flex flex-col items-center gap-3">
              <p className="text-gray-600">No services added yet.</p>
            </div>
          </div>
        ) : (
          localServices
            .slice(0, isExpanded ? undefined : 2)
            .map((service, index) => (
              <div 
                key={service.id || index}
                className=""
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold ">
                        Service Category : {service.services_categories}
                      </h3>
                    </div>
                    <div className="flex items-start gap-3">
                      <p className="text-gray-700">
                        {service.services_description}
                      </p>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-semibold">Rate-range : {service.rate_range} $</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-semibold">Availability : {service.availability}</span>
                      </div>
                    </div>
                  </div>
                  {isEditMode && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-500 hover:text-[#5A8DB8] hover:bg-[#5A8DB8]/10 rounded-xl"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        onClick={() => handleDeleteClick(service)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
      
      {localServices.length > 2 && (
        <div className="mt-6">
          <Button 
            variant="ghost" 
            className="text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-xl px-4 py-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="mr-2">{isExpanded ? 'Show less' : 'Show all services'}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
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