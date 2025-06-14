import { Video, Award, Pencil, Plus, Trash2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileData } from '../../types/profile';
import { useEditMode } from '../../context/EditModeContext';
import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { updateProfile } from '../../store/Services/CreateProfileService';
import { updateProfileData } from '../../store/Slice/CreateProfileSlice';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

interface ProfileSidebarProps {
  profileData: ProfileData;
}

interface Certification {
  id?: string;
  certifications_name: string;
  certifications_issuer: string;
  certifications_issued_date: string;
  certifications_expiration_date: string;
  certifications_id: string;
  certifications_image: string;
  certifications_image_url: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profileData }) => {
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const { profileData: reduxProfileData } = useAppSelector((state) => state.createProfile);
  const [imageError, setImageError] = useState(false);
  
  // Dialog states
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  
  // Delete states
  const [deleteType, setDeleteType] = useState<'image' | 'video' | 'certification' | null>(null);
  const [certificationToDelete, setCertificationToDelete] = useState<string | null>(null);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    first_name: profileData.first_name || '',
    last_name: profileData.last_name || '',
    bio: profileData.bio || '',
  });
  
  const [videoForm, setVideoForm] = useState({
    video_description: profileData.video_description || '',
  });
  
  const [certForm, setCertForm] = useState<Certification>({
    certifications_name: '',
    certifications_issuer: '',
    certifications_issued_date: '',
    certifications_expiration_date: '',
    certifications_id: '',
    certifications_image: '',
    certifications_image_url: ''
  });

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Loading states
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isVideoUpdating, setIsVideoUpdating] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  // Certification states
  const [isCertUpdating, setIsCertUpdating] = useState(false);
  const [selectedCertImage, setSelectedCertImage] = useState<File | null>(null);
  const certImageInputRef = useRef<HTMLInputElement>(null);

  // Add new state for tracking if we're adding a new certification
  const [isAddingNewCert, setIsAddingNewCert] = useState(false);

  // Replace the delete states with useDeleteItem hook
  const {
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    isLoading: isDeleteLoading,
    error: deleteError,
    success: deleteSuccess
  } = useDeleteItem();

  // Update handleDeleteClick to use the new hook
  const handleDeleteClick = (type: 'image' | 'video' | 'certification', certId?: string) => {
    if (!profileData.id) {
      toast.error("Profile ID is missing");
      return;
    }

    const modelMap: Record<'image' | 'video' | 'certification', 'profile_pic' | 'video_intro' | 'certification'> = {
      'image': 'profile_pic',
      'video': 'video_intro',
      'certification': 'certification'
    };

    const modelName = modelMap[type];
    if (!modelName) {
      toast.error("Invalid delete type");
      return;
    }

    // Store the delete info in state for the confirmation dialog
    setDeleteType(type);
    if (type === 'certification' && certId) {
      setCertificationToDelete(certId);
    }

    // Open the delete dialog
    openDeleteDialog();
  };

  // Update handleDeleteConfirm to use the new hook
  const handleDeleteConfirm = async () => {
    if (!deleteType || !profileData.id) {
      toast.error("Missing required information for deletion");
      return;
    }

    try {
      if (deleteType === 'certification' && certificationToDelete) {
        // First delete the certification using the API
        const result = await handleDelete('certification', certificationToDelete);

        // If deletion was successful, update the local state and Redux store
        if (result?.success && deleteSuccess) {
          const updatedCerts = (profileData.certifications || []).filter(
            cert => cert.certifications_id !== certificationToDelete
          );
          
          const formData = new FormData();
          formData.append('certifications', JSON.stringify(updatedCerts));

          const updateResult = await dispatch(updateProfile({
            data: formData,
            profileId: profileData.id
          })).unwrap();
          
          if (updateResult) {
            // Update local state
            dispatch(updateProfileData({
              ...reduxProfileData,
              certifications: updatedCerts
            }));
            
            toast.success("Certification deleted successfully!");
          }
        } else {
          toast.error(result?.message || "Failed to delete certification");
        }
      } else {
        // For other types (image, video), use the delete endpoint
        const result = await handleDelete(
          deleteType === 'image' ? 'profile_pic' : 'video_intro', 
          profileData.id
        );

        // If deletion was successful, update the UI
        if (result?.success) {
          const formData = new FormData();

          switch (deleteType) {
            case 'image':
              formData.append('profile_pic', '');
              dispatch(updateProfileData({
                ...reduxProfileData,
                profile_pic: '',
                profile_pic_url: ''
              }));
              break;

            case 'video':
              formData.append('video_intro', '');
              formData.append('video_description', '');
              dispatch(updateProfileData({
                ...reduxProfileData,
                video_intro: '',
                video_intro_url: '',
                video_description: ''
              }));
              break;
          }

          // Update the profile with the changes
          await dispatch(updateProfile({
            data: formData,
            profileId: profileData.id
          }));

          toast.success(result.message || `${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted successfully!`);
        } else {
          toast.error(result?.message || `Failed to delete ${deleteType}`);
        }
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(deleteError || error.message || `Failed to delete ${deleteType}`);
    } finally {
      closeDeleteDialog();
      setDeleteType(null);
      setCertificationToDelete(null);
    }
  };

  // Function to get full image URL
  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const cleanPath = url.replace(/^\/+/, '');
    return `${baseUrl}/${cleanPath}`;
  };

  // Add new function to handle opening the profile dialog
  const handleOpenProfileDialog = () => {
    setProfileForm({
      first_name: profileData.first_name || '',
      last_name: profileData.last_name || '',
      bio: profileData.bio || '',
    });
    setIsProfileDialogOpen(true);
  };

  // Profile form handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profileData.id) {
        toast.error("Profile ID is missing");
        return;
      }
      setIsProfileUpdating(true);
      const formData = new FormData();
      formData.append('subscription_type', reduxProfileData?.subscription_type || 'premium');
      
      Object.entries(profileForm).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Optimistically update the UI
      dispatch(updateProfileData({
        ...reduxProfileData,
        ...profileForm
      }));

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.id as string
      })).unwrap();
      
      if (result) {
        // Update with the actual server response
        dispatch(updateProfileData({
          ...reduxProfileData,
          ...result
        }));
        toast.success("Profile information updated successfully!");
        setIsProfileDialogOpen(false);
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update profile information");
      // Revert optimistic update on error
      dispatch(updateProfileData({
        ...reduxProfileData,
        ...profileData
      }));
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // Image handlers
  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    try {
      if (!profileData.id) {
        toast.error("Profile ID is missing");
        return;
      }
      setIsImageUploading(true);
      const formData = new FormData();
      formData.append('subscription_type', reduxProfileData?.subscription_type || 'premium');
      formData.append('profile_pic', selectedImage);

      // Optimistically update the UI with the preview
      if (imagePreview) {
        dispatch(updateProfileData({
          ...reduxProfileData,
          profile_pic_url: imagePreview
        }));
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.id as string
      })).unwrap();
      
      if (result) {
        // Update with the actual server response
        dispatch(updateProfileData({
          ...reduxProfileData,
          profile_pic_url: result.profile_pic_url
        }));
        toast.success("Profile image updated successfully!");
        setIsImageDialogOpen(false);
        setSelectedImage(null);
        setImagePreview('');
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update profile image");
      // Revert optimistic update on error
      dispatch(updateProfileData({
        ...reduxProfileData,
        profile_pic_url: profileData.profile_pic_url
      }));
    } finally {
      setIsImageUploading(false);
    }
  };

  // Video handlers
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('Video size should be less than 100MB');
        return;
      }
      setSelectedVideo(file);
    }
  };

  const handleVideoDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVideoForm({ ...videoForm, video_description: e.target.value });
  };

  // Add this new function to handle opening the video dialog
  const handleOpenVideoDialog = () => {
    setVideoForm({
      video_description: profileData.video_description || '',
    });
    setIsVideoDialogOpen(true);
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profileData.id) {
        toast.error("Profile ID is missing");
        return;
      }
      setIsVideoUpdating(true);
      const formData = new FormData();
      formData.append('subscription_type', reduxProfileData?.subscription_type || 'premium');
      
      if (selectedVideo) {
        formData.append('video_intro', selectedVideo);
      }
      
      if (videoForm.video_description) {
        formData.append('video_description', videoForm.video_description);
      }

      // Optimistically update the UI
      if (videoForm.video_description) {
        dispatch(updateProfileData({
          ...reduxProfileData,
          video_description: videoForm.video_description
        }));
      }

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.id as string
      })).unwrap();
      
      if (result) {
        // Update with the actual server response
        dispatch(updateProfileData({
          ...reduxProfileData,
          video_description: result.video_description,
          video_intro_url: result.video_intro_url
        }));
        toast.success("Video updated successfully!");
        setIsVideoDialogOpen(false);
        setSelectedVideo(null);
        setVideoForm({ video_description: '' });
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update video");
      // Revert optimistic update on error
      dispatch(updateProfileData({
        ...reduxProfileData,
        video_description: profileData.video_description
      }));
    } finally {
      setIsVideoUpdating(false);
    }
  };

  // Certification handlers
  const handleCertImageClick = () => {
    certImageInputRef.current?.click();
  };

  const handleCertImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedCertImage(file);
    }
  };

  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertForm({ ...certForm, [e.target.name]: e.target.value });
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profileData.id) {
        toast.error("Profile ID is missing");
        return;
      }
      setIsCertUpdating(true);

      // Create the certification object
      const certificationData = {
        certifications_name: certForm.certifications_name,
        certifications_issuer: certForm.certifications_issuer,
        certifications_issued_date: certForm.certifications_issued_date,
        certifications_id: certForm.certifications_id,
        certifications_expiration_date: certForm.certifications_expiration_date || '',
        certifications_image: selectedCertImage ? selectedCertImage.name : certForm.certifications_image,
        certifications_image_url: certForm.certifications_image_url || ''
      };

      // Get existing certifications
      const existingCerts = profileData.certifications || [];
      
      // Create a new FormData instance
      const formData = new FormData();
      
      // Handle certification image upload if selected
      if (selectedCertImage) {
        formData.append('certifications_image', selectedCertImage);
      }

      let updatedCerts: Certification[];
      if (isAddingNewCert) {
        // Check if certification with same ID already exists
        const existingCert = existingCerts.find(cert => cert.certifications_id === certForm.certifications_id);
        if (existingCert) {
          toast.error("A certification with this ID already exists");
          return;
        }
        // Add new certification without ID
        const newCertification = {
          certifications_name: certForm.certifications_name.trim(),
          certifications_issuer: certForm.certifications_issuer.trim(),
          certifications_issued_date: certForm.certifications_issued_date.trim(),
          certifications_expiration_date: certForm.certifications_expiration_date.trim() || '',
          certifications_id: certForm.certifications_id.trim(),
          certifications_image: selectedCertImage ? selectedCertImage.name : '',
          certifications_image_url: certForm.certifications_image_url || ''
        };
        formData.append('certifications', JSON.stringify([newCertification]));
        updatedCerts = [...existingCerts, newCertification];
      } else {
        // If editing, find the existing certification to get its ID
        const existingCert = existingCerts.find(cert => cert.certifications_id === certForm.certifications_id) as Certification;
        if (!existingCert) {
          toast.error("Certification not found");
          return;
        }

        // Create edited certification with the original ID
        const editedCertification = {
          id: existingCert.id, // Use the original ID
          ...certificationData
        };
        formData.append('certifications', JSON.stringify([editedCertification]));
        
        // Update local state with the edited certification
        updatedCerts = existingCerts.map(cert => 
          cert.certifications_id === certForm.certifications_id ? editedCertification : cert
        );
      }

      // Optimistically update the UI
      dispatch(updateProfileData({
        ...reduxProfileData,
        certifications: updatedCerts
      }));

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.id as string
      })).unwrap();
      
      if (result) {
        // Update with the actual server response
        dispatch(updateProfileData({
          ...reduxProfileData,
          certifications: result.certifications
        }));
        toast.success(isAddingNewCert ? "Certification added successfully!" : "Certification updated successfully!");
        setIsCertDialogOpen(false);
        setSelectedCertImage(null);
        setCertForm({
          certifications_name: '',
          certifications_issuer: '',
          certifications_issued_date: '',
          certifications_expiration_date: '',
          certifications_id: '',
          certifications_image: '',
          certifications_image_url: ''
        });
        setIsAddingNewCert(false);
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || (isAddingNewCert ? "Failed to add certification" : "Failed to update certification"));
      // Revert optimistic update on error
      dispatch(updateProfileData({
        ...reduxProfileData,
        certifications: profileData.certifications
      }));
    } finally {
      setIsCertUpdating(false);
    }
  };

  // Function to handle opening the certification edit dialog
  const handleOpenCertDialog = (certification?: Certification) => {
    if (certification) {
      // Editing existing certification
      setCertForm({
        certifications_name: certification.certifications_name || '',
        certifications_issuer: certification.certifications_issuer || '',
        certifications_issued_date: certification.certifications_issued_date || '',
        certifications_expiration_date: certification.certifications_expiration_date || '',
        certifications_id: certification.certifications_id || '',
        certifications_image: certification.certifications_image || '',
        certifications_image_url: certification.certifications_image_url || ''
      });
      setIsAddingNewCert(false);
    } else {
      // Adding new certification
      setCertForm({
        certifications_name: '',
        certifications_issuer: '',
        certifications_issued_date: '',
        certifications_expiration_date: '',
        certifications_id: '',
        certifications_image: '',
        certifications_image_url: ''
      });
      setIsAddingNewCert(true);
    }
    setIsCertDialogOpen(true);
  };

  // Function to handle closing the certification edit dialog
  const handleCloseCertDialog = () => {
    setIsCertDialogOpen(false);
    setSelectedCertImage(null);
    setIsAddingNewCert(false);
    setCertForm({
      certifications_name: '',
      certifications_issuer: '',
      certifications_issued_date: '',
      certifications_expiration_date: '',
      certifications_id: '',
      certifications_image: '',
      certifications_image_url: ''
    });
  };

  // Update the renderCertification function to use the new delete handler
  const renderCertification = (cert: Certification, index: number) => (
    <div key={index} className="space-y-3 p-3 sm:p-4 bg-gray-100 rounded-lg hover:bg-blue-50 transition-colors duration-200 relative">
      {isEditMode && (
        <div className="absolute top-2 right-2 flex gap-1.5">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded-full"
            onClick={() => handleOpenCertDialog(cert)}
          >
            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-full"
            onClick={() => handleDeleteClick('certification', cert.certifications_id)}
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      )}
      <div className="space-y-2.5 w-full">
        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
          <h4 className="font-bold text-[#5A8DB8] min-w-[70px] text-sm sm:text-base">Name :</h4>
          <span className="text-gray-700 font-medium text-sm sm:text-base break-words">{cert.certifications_name}</span>
        </div>
        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
          <p className="font-semibold text-[#5A8DB8] min-w-[70px] text-sm sm:text-base">Organization :</p>
          <span className="text-gray-700 font-medium text-sm sm:text-base break-words">{cert.certifications_issuer}</span>
        </div>
        <div className="flex justify-between items-start gap-2 text-sm">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-[#5A8DB8] text-xs sm:text-sm">Issued :</p>
            <span className="text-gray-700 font-medium text-xs sm:text-sm">{new Date(cert.certifications_issued_date).toLocaleDateString()}</span>
          </div>
          {cert.certifications_expiration_date && (
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-[#5A8DB8] text-xs sm:text-sm">Expires :</p>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">{new Date(cert.certifications_expiration_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        {cert.certifications_id && (
          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
            <span className="font-semibold text-[#5A8DB8] min-w-[70px] text-xs sm:text-sm">ID :</span>
            <span className="text-gray-700 font-medium text-xs sm:text-sm break-words">{cert.certifications_id}</span>
          </div>
        )}
      </div>
      {cert.certifications_image_url && (
        <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
          <img 
            src={getFullImageUrl(cert.certifications_image_url)} 
            alt={cert.certifications_name}
            className="w-full h-auto object-cover max-h-32 sm:max-h-48 hover:scale-[1.02] transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Profile Image */}
      <div className="pb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-[#5A8DB8] to-[#3C5979] rounded-lg opacity-20 blur-sm"></div>
        <div className="relative bg-white rounded-lg p-1 shadow-lg">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-blue-900">
              {!imageError && (profileData.profile_pic_url || profileData.profile_pic) ? (
                <div className="relative">
                  <img 
                    src={getFullImageUrl(profileData.profile_pic_url || profileData.profile_pic)}
                    alt={`${profileData.first_name || ''} ${profileData.last_name || ''}`}
                    className="w-full aspect-square object-cover hover:scale-[1.02] transition-transform duration-300"
                    onError={() => setImageError(true)}
                  />
                  {isEditMode && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white text-gray-500 hover:text-[#5A8DB8] transition-colors duration-300"
                        onClick={() => setIsImageDialogOpen(true)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white text-gray-500 hover:text-red-600 transition-colors duration-300"
                        onClick={() => handleDeleteClick('image')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full aspect-square bg-gradient-to-br from-gray-200 to-blue-900 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">
                    {`${profileData.first_name?.[0] || ''}${profileData.last_name?.[0] || ''}`.toUpperCase() || '?'}
                  </span>
                  {isEditMode && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white text-gray-500 hover:text-[#5A8DB8] transition-colors duration-300"
                      onClick={() => setIsImageDialogOpen(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 to-transparent h-1/4"></div>
            </div>

            <div className="mt-4 text-center mb-6">
              <div className="flex justify-center items-center gap-2">
                <h2 className="text-xl font-bold text-[#5A8DB8]">{profileData.first_name} {profileData.last_name}</h2>
                {isEditMode && (
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10 transition-colors duration-300"
                    onClick={handleOpenProfileDialog}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-600">{profileData.profile_mail}</p>
            </div>

            <Card className="p-4 bg-gradient-to-br from-gray-50 to-white border-[#5A8DB8]/10 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm italic text-gray-700">
                {profileData.bio || "No bio available"}
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Introduction */}
      {(profileData.video_intro || profileData.video_intro_url) && (
        <div className="pb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-[#5A8DB8] to-[#3C5979] rounded-lg opacity-20 blur-sm"></div>
          <div className="relative bg-white rounded-lg p-1 shadow-lg">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-[#5A8DB8]" />
                  <h3 className="font-semibold text-lg text-[#5A8DB8]">Video Introduction</h3>
                </div>
                {isEditMode && (
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition-colors duration-300"
                      onClick={handleOpenVideoDialog}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-300"
                      onClick={() => handleDeleteClick('video')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="relative bg-gray-200 rounded-lg aspect-video overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <video 
                    src={getFullImageUrl(profileData.video_intro_url || profileData.video_intro)}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    controlsList="nodownload"
                    playsInline
                  />
                </div>
                {profileData.video_description && (
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-[#5A8DB8]/10">
                    <p className="text-sm text-gray-700">{profileData.video_description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certifications */}
      <div className="pb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-[#5A8DB8] to-[#3C5979] rounded-lg opacity-20 blur-sm"></div>
        <div className="relative bg-white rounded-lg p-1 shadow-lg">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#5A8DB8]" />
                <h3 className="font-semibold text-lg text-[#5A8DB8]">Certifications</h3>
              </div>
              {isEditMode && (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10 transition-colors duration-300"
                    onClick={() => handleOpenCertDialog()}
                  >
                    <Plus className="w-5 h-5 text-[#5A8DB8] hover:text-[#3C5979]" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {profileData.certifications && profileData.certifications.length > 0 ? (
                profileData.certifications.map((cert, index) => (
                  <div key={index} className="relative group">
                    {renderCertification(cert, index)}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-[#5A8DB8]/10">
                  <p className="text-gray-500 text-sm italic">No certifications added yet</p>
                  {isEditMode && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="mt-2 text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#3C5979]/10 transition-colors duration-300"
                      onClick={() => handleOpenCertDialog()}
                    >
                      Add Your First Certification
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">Edit Profile Information</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-sm">First Name</label>
                <Input
                  name="first_name"
                  value={profileForm.first_name}
                  onChange={handleProfileChange}
                  className="bg-gray-50"
                  required
                  disabled={isProfileUpdating}
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm">Last Name</label>
                <Input
                  name="last_name"
                  value={profileForm.last_name}
                  onChange={handleProfileChange}
                  className="bg-gray-50"
                  required
                  disabled={isProfileUpdating}
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm">Bio</label>
              <Textarea
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                className="bg-gray-50 min-h-[100px] resize-y"
                disabled={isProfileUpdating}
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfileDialogOpen(false)}
                disabled={isProfileUpdating}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white w-full sm:w-auto"
                disabled={isProfileUpdating}
              >
                {isProfileUpdating ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Edit Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">Update Profile Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleImageSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                className="hidden"
                onChange={handleImageChange}
                disabled={isImageUploading}
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gray-400">No image selected</span>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleImageClick}
                className="mb-2 w-full sm:w-auto"
                disabled={isImageUploading}
              >
                {isImageUploading ? 'Uploading...' : 'Choose Image'}
              </Button>
              <p className="text-gray-500 text-sm">
                Recommended: Square image, max 5MB
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImageDialogOpen(false)}
                disabled={isImageUploading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white w-full sm:w-auto"
                disabled={!selectedImage || isImageUploading}
              >
                {isImageUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Edit Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setSelectedVideo(null);
          setVideoForm({ video_description: '' });
        }
        setIsVideoDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">Update Video Introduction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleVideoSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                className="hidden"
                onChange={handleVideoFileChange}
                disabled={isVideoUpdating}
              />
              {selectedVideo ? (
                <div className="text-sm text-gray-600 mb-4">
                  Selected: {selectedVideo.name}
                </div>
              ) : profileData.video_intro_url ? (
                <div className="text-sm text-gray-600 mb-4">
                  Current video will be replaced
                </div>
              ) : (
                <div className="text-sm text-gray-600 mb-4">
                  No video selected
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleVideoClick}
                className="mb-2 w-full sm:w-auto"
                disabled={isVideoUpdating}
              >
                {isVideoUpdating ? 'Uploading...' : 'Choose Video'}
              </Button>
              <p className="text-gray-500 text-sm">
                Recommended: MP4 format, max 100MB
              </p>
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm">Description</label>
              <Textarea
                value={videoForm.video_description}
                onChange={handleVideoDescriptionChange}
                placeholder="Add a description for your video..."
                className="bg-gray-50 min-h-[100px] resize-y"
                disabled={isVideoUpdating}
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVideoDialogOpen(false)}
                disabled={isVideoUpdating}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white w-full sm:w-auto"
                disabled={isVideoUpdating}
              >
                {isVideoUpdating ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Certification Edit Dialog */}
      <Dialog open={isCertDialogOpen} onOpenChange={handleCloseCertDialog}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">{isAddingNewCert ? 'Add New Certification' : 'Edit Certification'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCertSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-sm">Certification Name</label>
                <Input
                  name="certifications_name"
                  value={certForm.certifications_name}
                  onChange={handleCertChange}
                  className="bg-gray-50"
                  required
                  disabled={isCertUpdating}
                  placeholder="Enter certification name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm">Issuing Organization</label>
                <Input
                  name="certifications_issuer"
                  value={certForm.certifications_issuer}
                  onChange={handleCertChange}
                  className="bg-gray-50"
                  required
                  disabled={isCertUpdating}
                  placeholder="Enter organization name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1 text-sm">Issue Date</label>
                <Input
                  name="certifications_issued_date"
                  type="date"
                  value={certForm.certifications_issued_date}
                  onChange={handleCertChange}
                  className="bg-gray-50"
                  required
                  disabled={isCertUpdating}
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm">Expiration Date (Optional)</label>
                <Input
                  name="certifications_expiration_date"
                  type="date"
                  value={certForm.certifications_expiration_date}
                  onChange={handleCertChange}
                  className="bg-gray-50"
                  disabled={isCertUpdating}
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm">Certification ID</label>
              <Input
                name="certifications_id"
                value={certForm.certifications_id}
                onChange={handleCertChange}
                className="bg-gray-50"
                required
                disabled={isCertUpdating}
                placeholder="Enter certification ID"
              />
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
              <input
                type="file"
                accept="image/*"
                ref={certImageInputRef}
                className="hidden"
                onChange={handleCertImageChange}
                disabled={isCertUpdating}
              />
              {selectedCertImage ? (
                <div className="text-sm text-gray-600 mb-4">
                  Selected: {selectedCertImage.name}
                </div>
              ) : certForm.certifications_image_url ? (
                <div className="mb-4">
                  <img 
                    src={getFullImageUrl(certForm.certifications_image_url)} 
                    alt="Current certification"
                    className="w-32 h-32 mx-auto object-cover rounded"
                  />
                  <p className="text-sm text-gray-600 mt-2">Current image will be replaced</p>
                </div>
              ) : (
                <div className="text-sm text-gray-600 mb-4">
                  No image selected
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleCertImageClick}
                className="mb-2 w-full sm:w-auto"
                disabled={isCertUpdating}
              >
                {isCertUpdating ? 'Uploading...' : 'Choose Image'}
              </Button>
              <p className="text-gray-500 text-sm">
                Recommended: Square image, max 5MB
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseCertDialog}
                disabled={isCertUpdating}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white w-full sm:w-auto"
                disabled={isCertUpdating}
              >
                {isCertUpdating ? 'Saving...' : (isAddingNewCert ? 'Add Certification' : 'Save Changes')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DeleteConfirmationDialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          closeDeleteDialog();
          setDeleteType(null);
          setCertificationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteType ? deleteType.charAt(0).toUpperCase() + deleteType.slice(1) : ''}`}
        description={
          deleteType === 'certification' && certificationToDelete
            ? `Are you sure you want to delete this certification? This action cannot be undone.`
            : `Are you sure you want to delete your ${deleteType}? This action cannot be undone.`
        }
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default ProfileSidebar;