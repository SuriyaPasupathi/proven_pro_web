import { ChevronDown, Pencil, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { useEditMode } from '../../context/EditModeContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { Textarea } from "@/components/ui/textarea";
import Select, { MultiValue } from 'react-select';
import { serviceCategoryOptions, rateRangeOptions, availabilityOptions } from '../../components/common';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';

interface Option {
  value: string;
  label: string;
}

interface ServiceForm {
  services_categories: Option[];
  services_description: string;
  rate_range: Option | null;
  availability: Option | null;
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
  const [serviceForms, setServiceForms] = useState<ServiceForm[]>([{
    services_categories: [],
    services_description: '',
    rate_range: null,
    availability: null,
  }]);
  const { loading } = useSelector((state: RootState) => state.createProfile);

  // Initialize form with current values when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      if (categories && categories.length > 0) {
        const formattedCategories = categories.map(category => {
          // Parse services_categories from comma-separated string to array of options
          const categories = category.services_categories
            ? category.services_categories.split(',').map(cat => ({
                value: cat.trim(),
                label: cat.trim()
              }))
            : [];

          // Find matching rate range option
          const rateRange = category.rate_range
            ? rateRangeOptions.find(opt => opt.value === category.rate_range) || null
            : null;

          // Find matching availability option
          const availability = category.availability
            ? availabilityOptions.find(opt => opt.value === category.availability) || null
            : null;

          return {
            services_categories: categories,
            services_description: category.services_description || '',
            rate_range: rateRange,
            availability: availability
          };
        });
        setServiceForms(formattedCategories);
      } else {
        setServiceForms([{
          services_categories: Array.isArray(services_categories) 
            ? services_categories.map(cat => ({ value: cat, label: cat }))
            : services_categories ? [{ value: services_categories, label: services_categories }] : [],
          services_description: services_description || '',
          rate_range: rate_range ? rateRangeOptions.find(opt => opt.value === rate_range) || null : null,
          availability: availability ? availabilityOptions.find(opt => opt.value === availability) || null : null,
        }]);
      }
    }
  }, [isDialogOpen, categories, services_categories, services_description, rate_range, availability]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newForms = [...serviceForms];
    newForms[index] = {
      ...newForms[index],
      [e.target.name]: e.target.value
    };
    setServiceForms(newForms);
  };

  const handleMultiSelectChange = (field: string, index: number) => (selectedOptions: MultiValue<Option>) => {
    const newForms = [...serviceForms];
    newForms[index] = {
      ...newForms[index],
      [field]: selectedOptions as Option[]
    };
    setServiceForms(newForms);
  };

  const handleSingleSelectChange = (field: string, index: number) => (selectedOption: Option | null) => {
    const newForms = [...serviceForms];
    newForms[index] = {
      ...newForms[index],
      [field]: selectedOption
    };
    setServiceForms(newForms);
  };

  const addNewService = () => {
    setServiceForms([
      ...serviceForms,
      {
        services_categories: [],
        services_description: '',
        rate_range: null,
        availability: null,
      }
    ]);
  };

  const removeService = (index: number) => {
    if (serviceForms.length > 1) {
      const newForms = serviceForms.filter((_, i) => i !== index);
      setServiceForms(newForms);
    } else {
      toast.error("You must have at least one service category");
    }
  };

  const validateForm = () => {
    for (const form of serviceForms) {
      if (!form.services_categories || form.services_categories.length === 0) {
        toast.error("Please select at least one service category");
        return false;
      }
      if (!form.services_description || form.services_description.trim() === '') {
        toast.error("Please provide a service description");
        return false;
      }
      if (!form.rate_range) {
        toast.error("Please select a rate range");
        return false;
      }
      if (!form.availability) {
        toast.error("Please select availability");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const formattedCategories = serviceForms.map(form => {
        const categories = Array.isArray(form.services_categories) 
          ? form.services_categories.map(cat => cat.value).join(', ')
          : form.services_categories || '';

        const rateRange = form.rate_range 
          ? (typeof form.rate_range === 'object' ? form.rate_range.value : form.rate_range)
          : '';

        const availability = form.availability
          ? (typeof form.availability === 'object' ? form.availability.value : form.availability)
          : '';

        return {
          services_categories: categories,
          services_description: form.services_description || '',
          rate_range: rateRange,
          availability: availability
        };
      });

      const profileData = {
        subscription_type: 'premium' as const,
        categories: formattedCategories
      };

      const result = await dispatch(updateProfile(profileData)).unwrap();
      
      if (result) {
        toast.success("Services information updated successfully!");
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error('Services update error:', err);
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update services information");
    }
  };

  if (!categories.length && !services_description && !services_categories && !rate_range && !availability) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Services</h2>
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
        <p className="text-gray-600">No services information available.</p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Services</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {serviceForms.map((form, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4 relative">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                      onClick={() => removeService(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800">
                    Service Category {index + 1}
                  </h3>

                  <div>
                    <label htmlFor={`services_categories_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Main Service Category
                    </label>
                    <Select
                      id={`services_categories_${index}`}
                      name="services_categories"
                      options={serviceCategoryOptions}
                      isMulti
                      placeholder="Select your service categories..."
                      value={form.services_categories}
                      onChange={handleMultiSelectChange('services_categories', index)}
                      className="bg-gray-50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor={`services_description_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Service Description
                    </label>
                    <Textarea
                      id={`services_description_${index}`}
                      name="services_description"
                      placeholder="Describe your main services and expertise..."
                      value={form.services_description}
                      onChange={(e) => handleChange(e, index)}
                      className="bg-gray-50 min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`rate_range_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Rate Range
                      </label>
                      <Select
                        id={`rate_range_${index}`}
                        name="rate_range"
                        options={rateRangeOptions}
                        placeholder="Select your rate range..."
                        value={form.rate_range}
                        onChange={handleSingleSelectChange('rate_range', index)}
                        className="bg-gray-50"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={`availability_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <Select
                        id={`availability_${index}`}
                        name="availability"
                        options={availabilityOptions}
                        placeholder="Select your availability..."
                        value={form.availability}
                        onChange={handleSingleSelectChange('availability', index)}
                        className="bg-gray-50"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={addNewService}
                className="w-full bg-[#5A8DB8] hover:bg-[#3C5979] text-white flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Service
              </Button>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
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
        <h2 className="text-2xl font-bold">Services</h2>
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
      
      {categories.map((category, index) => (
        <div key={index} className="mb-8 last:mb-0">
          {category.services_description && (
            <p className="text-gray-600 mb-4">{category.services_description}</p>
          )}

          {category.services_categories && (
            <div className="flex flex-wrap gap-x-2 gap-y-3 mb-4">
              {category.services_categories.split(',').map((service, serviceIndex) => (
                <span 
                  key={serviceIndex}
                  className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {service.trim()}
                </span>
              ))}
            </div>
          )}

          {(category.rate_range || category.availability) && (
            <div className="space-y-2 mb-4">
              {category.rate_range && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Rate Range:</span> {category.rate_range}
                </p>
              )}
              {category.availability && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Availability:</span> {category.availability}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
      
      <Button 
        variant="link" 
        className="mt-4 text-[#70a4d8] hover:text-[#3C5979] flex items-center p-0"
      >
        <span>Show all services</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Services</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {serviceForms.map((form, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4 relative">
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                    onClick={() => removeService(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <h3 className="text-lg font-semibold text-gray-800">
                  Service Category {index + 1}
                </h3>

                <div>
                  <label htmlFor={`services_categories_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Main Service Category
                  </label>
                  <Select
                    id={`services_categories_${index}`}
                    name="services_categories"
                    options={serviceCategoryOptions}
                    isMulti
                    placeholder="Select your service categories..."
                    value={form.services_categories}
                    onChange={handleMultiSelectChange('services_categories', index)}
                    className="bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`services_description_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Service Description
                  </label>
                  <Textarea
                    id={`services_description_${index}`}
                    name="services_description"
                    placeholder="Describe your main services and expertise..."
                    value={form.services_description}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-gray-50 min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`rate_range_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Range
                    </label>
                    <Select
                      id={`rate_range_${index}`}
                      name="rate_range"
                      options={rateRangeOptions}
                      placeholder="Select your rate range..."
                      value={form.rate_range}
                      onChange={handleSingleSelectChange('rate_range', index)}
                      className="bg-gray-50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor={`availability_${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <Select
                      id={`availability_${index}`}
                      name="availability"
                      options={availabilityOptions}
                      placeholder="Select your availability..."
                      value={form.availability}
                      onChange={handleSingleSelectChange('availability', index)}
                      className="bg-gray-50"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={addNewService}
              className="w-full bg-[#5A8DB8] hover:bg-[#3C5979] text-white flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Service
            </Button>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesSection;