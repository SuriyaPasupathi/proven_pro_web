import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

interface ServicesSectionProps {
  services_categories?: string[] | string;
  services_description?: string;
  rate_range?: string;
  availability?: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  services_categories = [], 
  services_description,
  rate_range,
  availability 
}) => {
  // Debug logging for raw props
  useEffect(() => {
    console.log('Services Section - Raw Props:', {
      services_categories,
      services_description,
      rate_range,
      availability
    });
  }, [services_categories, services_description, rate_range, availability]);

  // Ensure services_categories is an array
  const servicesCategories = Array.isArray(services_categories) 
    ? services_categories 
    : typeof services_categories === 'string'
      ? services_categories.split(',').map(category => category.trim()).filter(Boolean)
      : [];

  // Debug logging for processed data
  useEffect(() => {
    console.log('Services Section - Processed Categories:', servicesCategories);
    console.log('Services Section - Type of services_categories:', typeof services_categories);
    console.log('Services Section - Is Array?', Array.isArray(services_categories));
  }, [servicesCategories, services_categories]);

  if (!services_description && servicesCategories.length === 0 && !rate_range && !availability) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Services</h2>
        <p className="text-gray-600">No services information available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Services</h2>
      
      {services_description && (
        <p className="text-gray-600 mb-4">{services_description}</p>
      )}

      {servicesCategories.length > 0 && (
        <div className="flex flex-wrap gap-x-2 gap-y-3 mb-4">
          {servicesCategories.map((service, index) => (
            <span 
              key={index}
              className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              {service}
            </span>
          ))}
        </div>
      )}

      {(rate_range || availability) && (
        <div className="space-y-2 mb-4">
          {rate_range && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Rate Range:</span> {rate_range}
            </p>
          )}
          {availability && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Availability:</span> {availability}
            </p>
          )}
        </div>
      )}
      
      <Button 
        variant="link" 
        className="mt-4 text-blue-600 hover:text-blue-800 flex items-center p-0"
      >
        <span>Show all services</span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default ServicesSection;