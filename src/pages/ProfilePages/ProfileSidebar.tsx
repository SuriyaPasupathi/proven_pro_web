import { Video, Award, Pencil, Plus, Trash2, Image, FileVideo, Save, Upload, User, FileText, Calendar, Hash, Building2 } from 'lucide-react';
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
import { Label } from "@/components/ui/label";

// Get the base URL from environment variable
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

// Add custom styles for animations (matching ProfileHeader)
const blobAnimationStyles = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

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
      // Find the certification by certifications_id to get its UUID
      const cert = profileData.certifications?.find(c => c.certifications_id === certId);
      if (!cert?.id) {
        toast.error("Certification ID not found");
        return;
      }
      setCertificationToDelete(cert.id);
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
        // Optimistically update the UI first
        const updatedCerts = (profileData.certifications || []).filter(
          cert => cert.id !== certificationToDelete
        );
        
        // Update local state immediately
        dispatch(updateProfileData({
          ...reduxProfileData,
          certifications: updatedCerts
        }));

        // Then make the API call
        const result = await handleDelete('certification', certificationToDelete);

        // If deletion was successful, update the backend state
        if (result?.success && deleteSuccess) {
          const formData = new FormData();
          formData.append('certifications', JSON.stringify(updatedCerts));

          const updateResult = await dispatch(updateProfile({
            data: formData,
            profileId: profileData.id
          })).unwrap();
          
          if (updateResult) {
            toast.success("Certification deleted successfully!");
          }
        } else {
          // If deletion failed, revert the optimistic update
          dispatch(updateProfileData({
            ...reduxProfileData,
            certifications: profileData.certifications
          }));
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
      // Revert optimistic update on error
      if (deleteType === 'certification') {
        dispatch(updateProfileData({
          ...reduxProfileData,
          certifications: profileData.certifications
        }));
      }
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
      if (name === 'certifications_expiration_date' && certForm.certifications_issued_date) {
        const issueDate = new Date(certForm.certifications_issued_date);
        if (selectedDate < issueDate) {
          toast.error("Expiration date cannot be before issue date");
          return;
        }
      }

      // Validate issue date is not after expiration date
      if (name === 'certifications_issued_date' && certForm.certifications_expiration_date) {
        const expirationDate = new Date(certForm.certifications_expiration_date);
        if (selectedDate > expirationDate) {
          toast.error("Issue date cannot be after expiration date");
          return;
        }
      }
    }

    setCertForm(prev => ({ ...prev, [name]: value }));
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
    <div key={index} className="relative group">
      <div className="bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-[#5A8DB8]/15 hover:border-[#5A8DB8]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#5A8DB8]/10 overflow-hidden">
        {isEditMode && (
          <div className="absolute top-3 right-3 xs:top-4 xs:right-4 flex gap-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 rounded-full bg-white/95 shadow-lg hover:bg-white text-[#5A8DB8] border border-white/50 transition-all duration-300 hover:scale-110 hover:shadow-md"
              onClick={() => handleOpenCertDialog(cert)}
            >
              <Pencil className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4.5 sm:w-4.5" />
            </Button>
            {(profileData.profile_pic_url || profileData.profile_pic) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 rounded-full bg-white/95 shadow-lg hover:bg-white text-red-600 border border-white/50 transition-all duration-300 hover:scale-110 hover:shadow-md"
                onClick={() => handleDeleteClick('certification', cert.certifications_id)}
              >
                <Trash2 className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4.5 sm:w-4.5" />
              </Button>
            )}
          </div>
        )}
        
        <div className="p-4 xs:p-5 sm:p-6">
          <div className="space-y-4 xs:space-y-5">
            {/* Certification Name */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#5A8DB8]/15 to-[#5A8DB8]/10 flex-shrink-0">
                <Award className="h-4 w-4 xs:h-5 xs:w-5 text-[#5A8DB8]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#5A8DB8] text-sm xs:text-base sm:text-lg mb-1">Certification Name</h4>
                <p className="text-gray-800 font-medium text-sm xs:text-base sm:text-lg leading-relaxed break-words">{cert.certifications_name}</p>
              </div>
            </div>
            
            {/* Organization */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#5A8DB8]/15 to-[#5A8DB8]/10 flex-shrink-0">
                <Building2 className="h-4 w-4 xs:h-5 xs:w-5 text-[#5A8DB8]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#5A8DB8] text-sm xs:text-base mb-1">Issuing Organization</p>
                <span className="text-gray-800 font-medium text-sm xs:text-base leading-relaxed break-words">{cert.certifications_issuer}</span>
              </div>
            </div>
            
            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#5A8DB8]/15 to-[#5A8DB8]/10 flex-shrink-0">
                  <Calendar className="h-4 w-4 xs:h-5 xs:w-5 text-[#5A8DB8]" />
                </div>
                <div>
                  <p className="font-semibold text-[#5A8DB8] text-sm xs:text-base mb-1">Issue Date</p>
                  <span className="text-gray-800 font-medium text-sm xs:text-base">{new Date(cert.certifications_issued_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
              {cert.certifications_expiration_date && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#5A8DB8]/15 to-[#5A8DB8]/10 flex-shrink-0">
                    <Calendar className="h-4 w-4 xs:h-5 xs:w-5 text-[#5A8DB8]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#5A8DB8] text-sm xs:text-base mb-1">Expiry Date</p>
                    <span className="text-gray-800 font-medium text-sm xs:text-base">{new Date(cert.certifications_expiration_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Certification ID */}
            {cert.certifications_id && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#5A8DB8]/15 to-[#5A8DB8]/10 flex-shrink-0">
                  <Hash className="h-4 w-4 xs:h-5 xs:w-5 text-[#5A8DB8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-[#5A8DB8] text-sm xs:text-base mb-1 block">Certification ID</span>
                  <span className="text-gray-800 font-medium text-sm xs:text-base break-words font-mono bg-gray-100 px-2 py-1 rounded-md">{cert.certifications_id}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Certification Image */}
          {cert.certifications_image_url && (
            <div className="mt-5 xs:mt-6 sm:mt-7 rounded-xl sm:rounded-2xl overflow-hidden border border-[#5A8DB8]/15 bg-gradient-to-br from-white to-gray-50/50 shadow-sm">
              <img 
                src={getFullImageUrl(cert.certifications_image_url)} 
                alt={cert.certifications_name}
                className="w-full h-auto object-cover max-h-32 xs:max-h-40 sm:max-h-48 hover:scale-[1.02] transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: blobAnimationStyles }} />
      <div className="relative space-y-4 xs:space-y-6 sm:space-y-8">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-32 h-32 xs:w-48 xs:h-48 sm:w-72 sm:h-72 bg-[#5A8DB8] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-32 h-32 xs:w-48 xs:h-48 sm:w-72 sm:h-72 bg-[#3C5979] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-32 h-32 xs:w-48 xs:h-48 sm:w-72 sm:h-72 bg-[#5A8DB8] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Profile Image */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-[#5A8DB8] to-[#3C5979] rounded-lg xs:rounded-xl sm:rounded-2xl opacity-10 blur-xl"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="relative h-16 xs:h-20 sm:h-24 md:h-32 lg:h-40 xl:h-48 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10  "></div>
              <div className="absolute bottom-0 left-0 right-0 h-8 xs:h-12 sm:h-16 md:h-20 lg:h-24 xl:h-32 bg-gradient-to-t from-white/95 to-transparent"></div>
            </div>

            <div className="relative px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 -mt-8 xs:-mt-10 sm:-mt-12 md:-mt-16 lg:-mt-20 xl:-mt-24">
              {/* Profile Image - Full Width */}
              <div className="mb-3 xs:mb-4 sm:mb-6">
                <div className="relative group">
                  <div className="w-full aspect-square rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden shadow-xl transition-all duration-300  group-hover:shadow-2xl">
                    {!imageError && (profileData.profile_pic_url || profileData.profile_pic) ? (
                      <img 
                        src={getFullImageUrl(profileData.profile_pic_url || profileData.profile_pic)}
                        alt={`${profileData.first_name || ''} ${profileData.last_name || ''}`}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] flex items-center justify-center">
                        <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
                          {`${profileData.first_name?.[0] || ''}${profileData.last_name?.[0] || ''}`.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  {isEditMode && (
                    <div className="absolute top-2 right-2 xs:top-3 xs:right-3 flex gap-1 xs:gap-1.5 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 rounded-full bg-white/90 shadow-lg hover:bg-white text-[#5A8DB8] border-2 border-white transition-all duration-300 hover:scale-110"
                        onClick={() => setIsImageDialogOpen(true)}
                      >
                        <Pencil className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-4.5 lg:w-4.5 xl:h-5 xl:w-5" />
                      </Button>
                      {(profileData.profile_pic_url || profileData.profile_pic) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 rounded-full bg-white/90 shadow-lg hover:bg-white text-red-600 border-2 border-white transition-all duration-300 hover:scale-110"
                          onClick={() => handleDeleteClick('image')}
                        >
                          <Trash2 className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-4.5 lg:w-4.5 xl:h-5 xl:w-5" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Email - Centered Below Image */}
              <div className="text-center mb-3 xs:mb-4 sm:mb-6">
                <div className="flex items-center justify-center gap-1 xs:gap-2 mb-1 xs:mb-2">
                  <h2 className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-5xl font-bold text-[#5A8DB8] leading-tight">
                    {profileData.first_name} {profileData.last_name}
                  </h2>
                  {isEditMode && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-12 xl:w-12 rounded-full bg-white/90 shadow-lg hover:bg-white text-[#3C5979] hover:text-[#5A8DB8] hover:bg-[#5A8DB8]/10 border border-white/50 transition-all duration-300 hover:scale-110 hover:shadow-md"
                      onClick={handleOpenProfileDialog}
                    >
                      <Pencil className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                    </Button>
                  )}
                </div>
                <p className="text-xs xs:text-sm text-gray-600">{profileData.profile_mail}</p>
              </div>

              {/* Bio Section */}
              <div className="p-2 xs:p-3 sm:p-4 md:p-6 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 rounded-lg xs:rounded-xl sm:rounded-2xl">
                <p className="text-xs xs:text-sm italic text-gray-700">
                  {profileData.bio || "No bio available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#5A8DB8]/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 py-2 rounded-full border border-[#5A8DB8]/20 shadow-sm">
              <div className="w-3 h-3 xs:w-4 xs:h-4 bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] rounded-full"></div>
            </span>
          </div>
        </div>

        {/* Video Introduction */}
        {(profileData.video_intro || profileData.video_intro_url) && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-[#5A8DB8] to-[#3C5979] rounded-lg xs:rounded-xl sm:rounded-2xl opacity-10 blur-xl"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <div className="p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 xs:gap-2">
                    <div className="p-1.5 xs:p-2 rounded-lg xs:rounded-xl bg-[#5A8DB8]/10">
                      <Video className="h-4 w-4 xs:h-5 xs:w-5 text-[#5A8DB8]" />
                    </div>
                    <h3 className="font-semibold text-sm xs:text-base sm:text-lg md:text-xl text-[#5A8DB8]">Video Introduction</h3>
                  </div>
                  {isEditMode && (
                    <div className="flex gap-1 xs:gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 text-gray-500 hover:text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition-colors duration-300"
                        onClick={handleOpenVideoDialog}
                      >
                        <Pencil className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-4.5 lg:w-4.5 xl:h-5 xl:w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-300"
                        onClick={() => handleDeleteClick('video')}
                      >
                        <Trash2 className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-4.5 lg:w-4.5 xl:h-5 xl:w-5" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                  <div className="relative bg-gray-100 rounded-lg xs:rounded-xl aspect-video overflow-hidden group hover:shadow-md transition-shadow duration-300">
                    <video 
                      src={getFullImageUrl(profileData.video_intro_url || profileData.video_intro)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      controls
                      preload="metadata"
                      controlsList="nodownload"
                      playsInline
                    />
                  </div>
                  {profileData.video_description && (
                    <div className="bg-gradient-to-br from-white to-gray-50/50 p-3 xs:p-4 rounded-lg xs:rounded-xl border border-[#5A8DB8]/10">
                      <p className="text-xs xs:text-sm text-gray-700">{profileData.video_description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Horizontal Divider */}
        {(profileData.video_intro || profileData.video_intro_url) && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#5A8DB8]/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 py-2 rounded-full border border-[#5A8DB8]/20 shadow-sm">
                <div className="w-3 h-3 xs:w-4 xs:h-4 bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] rounded-full"></div>
              </span>
            </div>
          </div>
        )}

        {/* Certifications */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-[#5A8DB8] to-[#3C5979] rounded-lg xs:rounded-xl sm:rounded-2xl opacity-10 blur-xl"></div>
          <div className="relative bg-white/95 backdrop-blur-sm rounded-lg xs:rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-6">
                <div className="flex items-center gap-1 xs:gap-2">
                  <div className="p-1.5 xs:p-2 rounded-lg xs:rounded-xl bg-[#5A8DB8]/10">
                    <Award className="h-4 w-4 xs:h-5 xs:w-5 text-[#5A8DB8]" />
                  </div>
                  <h3 className="font-semibold text-sm xs:text-base sm:text-lg md:text-xl text-[#5A8DB8]">Certifications</h3>
                </div>
                {isEditMode && (
                  <div className="flex gap-1 xs:gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="p-0 h-auto text-[#3C5979] hover:text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition-colors duration-300"
                      onClick={() => handleOpenCertDialog()}
                    >
                      <Plus className="w-4 h-4 xs:w-5 xs:h-5" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                {profileData.certifications && profileData.certifications.length > 0 ? (
                  profileData.certifications.map((cert, index) => (
                    <div key={index} className="relative group">
                      {renderCertification(cert, index)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 xs:py-10 sm:py-12 bg-gradient-to-br from-white/95 to-gray-50/80 rounded-xl sm:rounded-2xl border border-[#5A8DB8]/15">
                    <div className="p-4 xs:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#5A8DB8]/10 to-[#5A8DB8]/5 inline-block mb-4 xs:mb-5">
                      <Award className="w-8 h-8 xs:w-10 xs:h-10 text-[#5A8DB8] mx-auto" />
                    </div>
                    <p className="text-gray-600 text-sm xs:text-base sm:text-lg font-medium mb-4 xs:mb-5">No certifications added yet</p>
                    {isEditMode && (
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 transition-colors duration-300 border-[#5A8DB8]/30 text-sm xs:text-base font-medium"
                        onClick={() => handleOpenCertDialog()}
                      >
                        <Plus className="w-4 h-4 xs:w-5 xs:h-5 mr-2" />
                        Add Your First Certification
                      </Button>
                    )}
                  </div>
                )}

      
              </div>
            </div>
          </div>
        </div>
                  {/* Horizontal Divider */}
                  <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#5A8DB8]/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 py-2 rounded-full border border-[#5A8DB8]/20 shadow-sm">
              <div className="w-3 h-3 xs:w-4 xs:h-4 bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] rounded-full"></div>
            </span>
          </div>
        </div>

        {/* Profile Edit Dialog */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-[#5A8DB8]/30 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300">
            <DialogHeader className="space-y-3 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#3C5979] flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5A8DB8]/10">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" />
                  </div>
                  Edit Profile Information
                </DialogTitle>
              </div>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
            </DialogHeader>
            <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm font-medium text-[#3C5979] flex items-center gap-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={profileForm.first_name}
                    onChange={handleProfileChange}
                    className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
                    required
                    disabled={isProfileUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-medium text-[#3C5979] flex items-center gap-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={profileForm.last_name}
                    onChange={handleProfileChange}
                    className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
                    required
                    disabled={isProfileUpdating}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-[#3C5979] flex items-center gap-2">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                  disabled={isProfileUpdating}
                />
              </div>
              <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProfileDialogOpen(false)}
                  disabled={isProfileUpdating}
                  className="w-full sm:w-auto border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition text-sm sm:text-base py-2 sm:py-2.5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProfileUpdating}
                  className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  {isProfileUpdating ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Image Edit Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-[#5A8DB8]/30 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300">
            <DialogHeader className="space-y-3 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#3C5979] flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5A8DB8]/10">
                    <Image className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" />
                  </div>
                  Update Profile Image
                </DialogTitle>
              </div>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
            </DialogHeader>
            <form onSubmit={handleImageSubmit} className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="border-2 border-dashed border-[#5A8DB8]/30 rounded-xl p-6 sm:p-8 text-center bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm hover:border-[#5A8DB8]/40 transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isImageUploading}
                />
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-40 h-40 mx-auto rounded-xl object-cover mb-4 shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#5A8DB8]/10 to-[#70a4d8]/10 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-[#5A8DB8]">No image selected</span>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageClick}
                  className="mb-2 border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/40 transition-all duration-300"
                  disabled={isImageUploading}
                >
                  {isImageUploading ? 'Uploading...' : 'Choose Image'}
                </Button>
                <p className="text-sm text-[#5A8DB8]/70">
                  Recommended: Square image, max 5MB
                </p>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsImageDialogOpen(false)}
                  disabled={isImageUploading}
                  className="w-full sm:w-auto border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/40 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedImage || isImageUploading}
                  className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  {isImageUploading ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                      Upload Image
                    </>
                  )}
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
          <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-[#5A8DB8]/30 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300">
            <DialogHeader className="space-y-3 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#3C5979] flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5A8DB8]/10">
                    <Video className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" />
                  </div>
                  Update Video Introduction
                </DialogTitle>
              </div>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
            </DialogHeader>
            <form onSubmit={handleVideoSubmit} className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="border-2 border-dashed border-[#5A8DB8]/30 rounded-xl p-6 sm:p-8 text-center bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm hover:border-[#5A8DB8]/40 transition-all duration-300">
                <input
                  type="file"
                  accept="video/*"
                  ref={videoInputRef}
                  className="hidden"
                  onChange={handleVideoFileChange}
                  disabled={isVideoUpdating}
                />
                {selectedVideo ? (
                  <div className="text-sm text-[#5A8DB8] mb-4 flex items-center justify-center gap-2 bg-white/60 p-4 rounded-xl shadow-sm">
                    <FileVideo className="w-5 h-5" />
                    {selectedVideo.name}
                  </div>
                ) : profileData.video_intro_url ? (
                  <div className="text-sm text-[#5A8DB8] mb-4 flex items-center justify-center gap-2 bg-white/60 p-4 rounded-xl shadow-sm">
                    <FileVideo className="w-5 h-5" />
                    Current video will be replaced
                  </div>
                ) : (
                  <div className="text-sm text-[#5A8DB8] mb-4 flex items-center justify-center gap-2 bg-white/60 p-4 rounded-xl shadow-sm">
                    <FileVideo className="w-5 h-5" />
                    No video selected
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVideoClick}
                  className="mb-2 border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/40 transition-all duration-300"
                  disabled={isVideoUpdating}
                >
                  {isVideoUpdating ? 'Uploading...' : 'Choose Video'}
                </Button>
                <p className="text-sm text-[#5A8DB8]/70">
                  Recommended: MP4 format, max 100MB
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video_description" className="text-sm font-medium text-[#3C5979]">Description</Label>
                <Textarea
                  id="video_description"
                  value={videoForm.video_description}
                  onChange={handleVideoDescriptionChange}
                  placeholder="Add a description for your video..."
                  className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                  disabled={isVideoUpdating}
                />
              </div>
              <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsVideoDialogOpen(false)}
                  disabled={isVideoUpdating}
                  className="w-full sm:w-auto border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition text-sm sm:text-base py-2 sm:py-2.5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isVideoUpdating}
                  className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  {isVideoUpdating ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Certification Edit Dialog */}
        <Dialog open={isCertDialogOpen} onOpenChange={handleCloseCertDialog}>
          <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-[#5A8DB8]/30 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300 max-h-[90vh]">
            <DialogHeader className="space-y-3 px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#3C5979] flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5A8DB8]/10">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" />
                  </div>
                  {isAddingNewCert ? 'Add New Certification' : 'Edit Certification'}
                </DialogTitle>
              </div>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
            </DialogHeader>
            <form onSubmit={handleCertSubmit} className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto max-h-[calc(90vh-8rem)] pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certifications_name" className="text-sm font-medium text-[#3C5979] flex items-center gap-2">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                    Certification Name
                  </Label>
                  <Input
                    id="certifications_name"
                    name="certifications_name"
                    value={certForm.certifications_name}
                    onChange={handleCertChange}
                    className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
                    required
                    disabled={isCertUpdating}
                    placeholder="Enter certification name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certifications_issuer" className="text-sm font-medium text-[#3C5979] flex items-center gap-2">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    Issuing Organization
                  </Label>
                  <Input
                    id="certifications_issuer"
                    name="certifications_issuer"
                    value={certForm.certifications_issuer}
                    onChange={handleCertChange}
                    className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
                    required
                    disabled={isCertUpdating}
                    placeholder="Enter organization name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certifications_issued_date" className="text-sm font-medium text-[#3C5979] flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    Issue Date
                  </Label>
                  <Input
                    id="certifications_issued_date"
                    name="certifications_issued_date"
                    type="date"
                    value={certForm.certifications_issued_date}
                    onChange={handleCertChange}
                    className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
                    required
                    disabled={isCertUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certifications_expiration_date" className="text-sm font-medium text-[#3C5979] flex items-center gap-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    Expiration Date 
                  </Label>
                  <Input
                    id="certifications_expiration_date"
                    name="certifications_expiration_date"
                    type="date"
                    value={certForm.certifications_expiration_date}
                    onChange={handleCertChange}
                    className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
                    disabled={isCertUpdating}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="certifications_id" className="text-sm font-medium text-[#3C5979] flex items-center gap-2">
                  <Hash className="w-3 h-3 sm:w-4 sm:h-4" />
                  Certification ID
                </Label>
                <Input
                  id="certifications_id"
                  name="certifications_id"
                  value={certForm.certifications_id}
                  onChange={handleCertChange}
                  className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
                  required
                  disabled={isCertUpdating}
                  placeholder="Enter certification ID"
                />
              </div>
              <div className="border-2 border-dashed border-[#5A8DB8]/30 rounded-xl p-4 sm:p-6 text-center bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm hover:border-[#5A8DB8]/40 transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  ref={certImageInputRef}
                  className="hidden"
                  onChange={handleCertImageChange}
                  disabled={isCertUpdating}
                />
                {selectedCertImage ? (
                  <div className="text-sm text-[#5A8DB8] mb-3 flex items-center justify-center gap-2 bg-white/60 p-3 rounded-xl shadow-sm">
                    <Image className="w-4 h-4" />
                    {selectedCertImage.name}
                  </div>
                ) : certForm.certifications_image_url ? (
                  <div className="relative group">
                    <img 
                      src={getFullImageUrl(certForm.certifications_image_url)} 
                      alt="Current certification"
                      className="w-32 h-32 mx-auto object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <p className="text-sm text-[#5A8DB8] mt-2">Current image will be replaced</p>
                  </div>
                ) : (
                  <div className="text-sm text-[#5A8DB8] mb-3 flex items-center justify-center gap-2 bg-white/60 p-3 rounded-xl shadow-sm">
                    <Image className="w-4 h-4" />
                    No image selected
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCertImageClick}
                  className="mb-2 border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/40 transition-all duration-300"
                  disabled={isCertUpdating}
                >
                  {isCertUpdating ? 'Uploading...' : 'Choose Image'}
                </Button>
                <p className="text-xs text-[#5A8DB8]/70">
                  Recommended: Square image, max 5MB
                </p>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseCertDialog}
                  disabled={isCertUpdating}
                  className="w-full sm:w-auto border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition text-sm sm:text-base py-2 sm:py-2.5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCertUpdating}
                  className="w-full sm:w-auto bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  {isCertUpdating ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                      {isAddingNewCert ? 'Add Certification' : 'Save Changes'}
                    </>
                  )}
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
    </>
  );
};

export default ProfileSidebar;