import React, { useRef, useState,} from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { createUserProfile } from "../../../store/Services/CreateProfileService";
import toast from "react-hot-toast";
import StepAccessControl from "../../../components/StepAccessControl";
import { SubscriptionType, getTotalSteps, getStepProgress, getNextAvailableStep } from "../../../utils/subscriptionUtils";

const CURRENT_STEP = 7;

interface Certification {
  certifications_name: string;
  certifications_issuer: string;
  certifications_issued_date: string;
  certifications_expiration_date: string;
  certifications_id: string;
  certifications_image: File | null;
  certifications_image_url: string;
}

const Licenses: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      certifications_name: "",
      certifications_issuer: "",
      certifications_issued_date: "",
      certifications_expiration_date: "",
      certifications_id: "",
      certifications_image: null,
      certifications_image_url: "",
    },
  ]);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, profileData } = useSelector((state: RootState) => state.createProfile);

  // Get subscription type from Redux store
  const subscriptionType = profileData?.subscription_type || 'free';
  const totalSteps = getTotalSteps(subscriptionType as SubscriptionType);
  const progressPercent = getStepProgress(CURRENT_STEP, subscriptionType as SubscriptionType);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Add date validation for issue and expiration dates
    if (name === 'certifications_issued_date' || name === 'certifications_expiration_date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day

      if (selectedDate > today) {
        toast.error("Cannot select future dates");
        return;
      }

      // Validate expiration date is not before issue date
      if (name === 'certifications_expiration_date' && certifications[index].certifications_issued_date) {
        const issueDate = new Date(certifications[index].certifications_issued_date);
        if (selectedDate < issueDate) {
          toast.error("Expiration date cannot be before issue date");
          return;
        }
      }

      // Validate issue date is not after expiration date
      if (name === 'certifications_issued_date' && certifications[index].certifications_expiration_date) {
        const expirationDate = new Date(certifications[index].certifications_expiration_date);
        if (selectedDate > expirationDate) {
          toast.error("Issue date cannot be after expiration date");
          return;
        }
      }
    }

    const updatedCertifications = [...certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [name]: value,
    };
    setCertifications(updatedCertifications);
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updatedCertifications = [...certifications];
      updatedCertifications[index] = {
        ...updatedCertifications[index],
        certifications_image: file,
        certifications_image_url: URL.createObjectURL(file),
      };
      setCertifications(updatedCertifications);
    }
  };

  const handleUploadClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        certifications_name: "",
        certifications_issuer: "",
        certifications_issued_date: "",
        certifications_expiration_date: "",
        certifications_id: "",
        certifications_image: null,
        certifications_image_url: "",
      },
    ]);
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions while loading
    if (loading) return;
    
    try {
      // Validate certifications
      const hasEmptyFields = certifications.some(cert => 
        !cert.certifications_name || 
        !cert.certifications_issuer || 
        !cert.certifications_issued_date
      );

      if (hasEmptyFields) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Format certifications as expected by the API
      const formattedCertifications = certifications.map(cert => ({
        certifications_name: cert.certifications_name,
        certifications_issuer: cert.certifications_issuer,
        certifications_issued_date: cert.certifications_issued_date,
        certifications_expiration_date: cert.certifications_expiration_date,
        certifications_id: cert.certifications_id,
        certifications_image_url: cert.certifications_image_url,
      }));

      const formData = new FormData();
      formData.append('subscription_type', subscriptionType);
      formData.append('certifications', JSON.stringify(formattedCertifications));

      // Append certification images if they exist
      certifications.forEach((cert, index) => {
        if (cert.certifications_image) {
          formData.append(`certification_image_${index}`, cert.certifications_image);
        }
      });

      const result = await dispatch(createUserProfile(formData)).unwrap();
      
      if (result) {
        // Clean up object URLs
        certifications.forEach(cert => {
          if (cert.certifications_image_url) {
            URL.revokeObjectURL(cert.certifications_image_url);
          }
        });

        // Reset form state after successful submission
        setCertifications([{
          certifications_name: "",
          certifications_issuer: "",
          certifications_issued_date: "",
          certifications_expiration_date: "",
          certifications_id: "",
          certifications_image: null,
          certifications_image_url: "",
        }]);
        
        toast.success("Licenses and certifications saved successfully!");
        
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
      toast.error(error.message || "Failed to save licenses and certifications");
    }
  };

  return (
    <StepAccessControl currentStep={CURRENT_STEP}>
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F8FBFF] px-4 sm:px-6 md:px-8 py-8 flex flex-col">
        {/* Step Progress */}
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
          className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg flex flex-col gap-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">
                  Licenses & Certifications
                </h1>
                <p className="text-sm text-black/70 mt-1">Add your professional certifications</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={addCertification}
              className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-xl"
            >
              Add Certification
            </Button>
          </div>

          {certifications.map((certification, index) => (
            <div 
              key={index} 
              className="border-2 border-[#5A8DB8]/20 rounded-xl p-6 relative bg-white/50 hover:bg-white/80 transition-colors duration-300"
            >
              {certifications.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-[#5A8DB8]/40 hover:text-red-500 hover:bg-red-50 transition-colors duration-300"
                  onClick={() => removeCertification(index)}
                >
                  ×
                </Button>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor={`certifications_name_${index}`} className="text-sm font-medium text-black mb-2">
                    Certification Name
                  </label>
                  <Input
                    id={`certifications_name_${index}`}
                    name="certifications_name"
                    placeholder="Enter certification name"
                    value={certification.certifications_name}
                    onChange={(e) => handleChange(index, e)}
                    className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`certifications_issuer_${index}`} className="text-sm font-medium text-black mb-2">
                    Issuing Organization
                  </label>
                  <Input
                    id={`certifications_issuer_${index}`}
                    name="certifications_issuer"
                    placeholder="Enter organization name"
                    value={certification.certifications_issuer}
                    onChange={(e) => handleChange(index, e)}
                    className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor={`certifications_issued_date_${index}`} className="text-sm font-medium text-black mb-2">
                      Issue Date
                    </label>
                    <Input
                      id={`certifications_issued_date_${index}`}
                      name="certifications_issued_date"
                      type="date"
                      value={certification.certifications_issued_date}
                      onChange={(e) => handleChange(index, e)}
                      className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`certifications_expiration_date_${index}`} className="text-sm font-medium text-black mb-2">
                      Expiry Date (Optional)
                    </label>
                    <Input
                      id={`certifications_expiration_date_${index}`}
                      name="certifications_expiration_date"
                      type="date"
                      value={certification.certifications_expiration_date}
                      onChange={(e) => handleChange(index, e)}
                      className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`certifications_id_${index}`} className="text-sm font-medium text-black mb-2">
                    Credential ID
                  </label>
                  <Input
                    id={`certifications_id_${index}`}
                    name="certifications_id"
                    placeholder="Enter credential ID"
                    value={certification.certifications_id}
                    onChange={(e) => handleChange(index, e)}
                    className="bg-white border-2 border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300"
                  />
                </div>

                {/* Certificate Upload */}
                <div 
                  className="border-2 border-dashed border-[#5A8DB8]/30 rounded-xl flex flex-col items-center justify-center py-8 px-4 sm:px-8 bg-white/50 hover:bg-white/80 transition-colors duration-300"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files) {
                      handleFileChange(index, { target: { files: e.dataTransfer.files } } as any);
                    }
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    ref={(el) => (fileInputRefs.current[index] = el)}
                    className="hidden"
                    onChange={(e) => handleFileChange(index, e)}
                  />
                  <div className="h-16 w-16 rounded-full bg-[#5A8DB8]/10 flex items-center justify-center mb-4">
                    <div className="text-[#5A8DB8] text-2xl font-bold">+</div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mb-3 bg-white border-2 border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/5 text-black transition-all duration-300 rounded-xl"
                    onClick={() => handleUploadClick(index)}
                  >
                    Upload Certificate
                  </Button>
                  <p className="text-black/70 text-sm text-center">
                    Drag and drop or click to upload (PDF or image)
                  </p>
                  {certification.certifications_image && (
                    <div className="mt-3 text-sm text-black bg-[#5A8DB8]/10 px-3 py-1.5 rounded-full break-all max-w-full text-center font-medium">
                      {certification.certifications_image.name}
                    </div>
                  )}
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

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              className="border-2 border-[#5A8DB8]/30 text-black hover:bg-[#5A8DB8]/10 transition flex items-center gap-2 px-6 py-2 rounded-xl"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl"
              disabled={loading}
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

export default Licenses;
