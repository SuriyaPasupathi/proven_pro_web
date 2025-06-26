import React, { useState, useEffect } from "react";
// import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import { fetchServices } from "../../../store/Services/DropDownService";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import StepAccessControl from "../../../components/StepAccessControl";
import { getTotalSteps, getStepProgress, getNextAvailableStep, SubscriptionType } from "../../../utils/subscriptionUtils";

interface ServiceForm {
  services_categories: string;
  services_description: string;
  rate_range: string;
  availability: string;
}

const CURRENT_STEP = 3;

const ServicesOffer: React.FC = () => {
  const [serviceForms, setServiceForms] = useState<ServiceForm[]>([{
    services_categories: "",
    services_description: "",
    rate_range: "",
    availability: "",
  }]);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, profileData } = useSelector((state: RootState) => state.createProfile);
  const { services, loading: servicesLoading } = useSelector((state: RootState) => state.dropdown);

  // Get subscription type from Redux store
  const subscriptionType = profileData?.subscription_type || 'free';
  const totalSteps = getTotalSteps(subscriptionType as SubscriptionType);
  const progressPercent = getStepProgress(CURRENT_STEP, subscriptionType as SubscriptionType);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Add debug logging
  useEffect(() => {
    console.log('Services state:', services);
    console.log('Services loading state:', servicesLoading);
  }, [services, servicesLoading]);

  // Initialize form with existing data if available
  useEffect(() => {
    if (profileData?.categories && profileData.categories.length > 0) {
      const formattedCategories = profileData.categories.map(category => ({
        services_categories: category.services_categories || '',
        services_description: category.services_description || '',
        rate_range: category.rate_range || '',
        availability: category.availability || ''
      }));
      setServiceForms(formattedCategories);
    }
  }, [profileData]);

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

  const handleServiceSelect = (value: string, index: number) => {
    const newForms = [...serviceForms];
    newForms[index] = {
      ...newForms[index],
      services_categories: value
    };
    setServiceForms(newForms);
  };

  const addNewService = () => {
    setServiceForms([
      ...serviceForms,
      {
        services_categories: "",
        services_description: "",
        rate_range: "",
        availability: "",
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
      if (!form.services_categories || form.services_categories.trim() === '') {
        toast.error("Please select a service category");
        return false;
      }
      if (!form.services_description || form.services_description.trim() === '') {
        toast.error("Please provide a service description");
        return false;
      }
      if (!form.rate_range || form.rate_range.trim() === '') {
        toast.error("Please enter a rate range");
        return false;
      }
      if (!form.availability || form.availability.trim() === '') {
        toast.error("Please enter availability");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions while loading
    if (loading) return;
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const formattedCategories = serviceForms.map(form => ({
        services_categories: form.services_categories,
        services_description: form.services_description,
        rate_range: form.rate_range,
        availability: form.availability
      }));

      const profileData = {
        subscription_type: subscriptionType as SubscriptionType,
        categories: formattedCategories
      };

      const result = await dispatch(createUserProfile(profileData)).unwrap();
      
      if (result) {
        // Reset form state after successful submission
        setServiceForms([{
          services_categories: "",
          services_description: "",
          rate_range: "",
          availability: "",
        }]);
        
        toast.success("Services information saved successfully!");
        
        // Navigate to the next available step
        const nextStep = getNextAvailableStep(CURRENT_STEP, subscriptionType as SubscriptionType);
        if (nextStep) {
          navigate(nextStep.path);
        } else {
          // If no next step, navigate to profile page
          const profileId = result.data?.id || localStorage.getItem('userProfileId');
          if (profileId) {
            navigate(`/profile/${profileId}`);
          }
        }
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to save services information");
    }
  };

  return (
    <StepAccessControl currentStep={CURRENT_STEP}>
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FBFF] px-4 sm:px-6 md:px-8 py-8 flex flex-col">
        {/* Progress Section */}
        <div className="mb-10 w-full max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-black flex items-center gap-2">
              Step {CURRENT_STEP} of {totalSteps}
            </h2>
            <span className="text-black/80 text-sm font-medium bg-[#5A8DB8]/5 px-3 py-1 rounded-full">
              {progressPercent}% Complete
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                  Services Offered
                </h1>
                <p className="text-sm text-black/70 mt-1">Add the services you provide</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={addNewService}
              className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-xl"
            >
              Add Service
            </Button>
          </div>

          {serviceForms.map((form, index) => (
            <div 
              key={index} 
              className="border-2 border-[#5A8DB8]/20 rounded-xl p-6 space-y-6 relative bg-white/50 hover:bg-white/80 transition-colors duration-300"
            >
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-[#5A8DB8]/40 hover:text-red-500 hover:bg-red-50 transition-colors duration-300"
                  onClick={() => removeService(index)}
                >
                  ×
                </Button>
              )}
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-black">
                  Service Category {index + 1}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor={`services_categories_${index}`} className="text-sm font-medium text-black mb-2">
                    Main Service Category
                  </label>
                  <Select
                    value={form.services_categories}
                    onValueChange={(value) => handleServiceSelect(value, index)}
                  >
                    <SelectTrigger className="w-full bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300">
                      <SelectValue placeholder="Select a service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {services && services.length > 0 ? (
                        services.map((service: any) => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>
                          {servicesLoading ? "Loading services..." : "No services available"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor={`services_description_${index}`} className="text-sm font-medium text-black mb-2">
                    Service Description
                  </label>
                  <Textarea
                    id={`services_description_${index}`}
                    name="services_description"
                    placeholder="Describe your main services and expertise..."
                    value={form.services_description}
                    onChange={(e) => handleChange(e, index)}
                    className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor={`rate_range_${index}`} className="text-sm font-medium text-black mb-2">
                      Rate Range
                    </label>
                    <input
                      type="text"
                      id={`rate_range_${index}`}
                      name="rate_range"
                      value={form.rate_range}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-3 bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                      placeholder="Enter your rate range..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor={`availability_${index}`} className="text-sm font-medium text-black mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      id={`availability_${index}`}
                      name="availability"
                      value={form.availability}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-3 bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                      placeholder="Enter your availability..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Error Message */}
          {error && (
            <div className="bg-[#EAF3FA] p-4 rounded-xl border-2 border-[#5A8DB8]/20">
              <p className="text-sm text-black flex items-center gap-2">
                {error.message}
              </p>
            </div>
          )}

          {/* Button Group */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              className="border-2 border-[#5A8DB8]/30 text-black hover:bg-[#5A8DB8]/10 transition flex items-center gap-2 px-6 py-2 rounded-xl"
              onClick={() => navigate(-1)}
              disabled={loading || servicesLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl"
              disabled={loading || servicesLoading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save and Continue
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </StepAccessControl>
  );
};

export default ServicesOffer;
