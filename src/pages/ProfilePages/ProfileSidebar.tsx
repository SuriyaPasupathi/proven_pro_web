import { Video, Award, Pencil } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileData } from './Profile';
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

// Get the base URL from environment variable
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ProfileSidebarProps {
  profileData: ProfileData;
}

interface Certification {
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
  
  // Dialog states
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    first_name: profileData.first_name || '',
    last_name: profileData.last_name || '',
    profile_mail: profileData.profile_mail || '',
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

  // Function to get full image URL
  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const cleanPath = url.replace(/^\/+/, '');
    return `${baseUrl}/${cleanPath}`;
  };

  // Profile form handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
        profileId: profileData.profile_url || ''
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
        profileId: profileData.profile_url || ''
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

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
        profileId: profileData.profile_url || ''
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
      setIsCertUpdating(true);
      const formData = new FormData();
      formData.append('subscription_type', reduxProfileData?.subscription_type || 'premium');

      // Handle certification image upload
      if (selectedCertImage) {
        formData.append('certifications_image', selectedCertImage);
      }

      // Create updated certification object
      const updatedCert = {
        ...certForm,
        certifications_image: selectedCertImage ? selectedCertImage.name : certForm.certifications_image
      };

      // Update certifications array
      const updatedCerts = profileData.certifications?.map(cert => 
        cert.certifications_id === certForm.certifications_id ? updatedCert : cert
      ) || [];

      // Add certifications to form data
      formData.append('certifications', JSON.stringify(updatedCerts));

      // Optimistically update the UI
      dispatch(updateProfileData({
        ...reduxProfileData,
        certifications: updatedCerts
      }));

      const result = await dispatch(updateProfile({
        data: formData,
        profileId: profileData.profile_url || ''
      })).unwrap();
      
      if (result) {
        // Update with the actual server response
        dispatch(updateProfileData({
          ...reduxProfileData,
          certifications: result.certifications
        }));
        toast.success("Certification updated successfully!");
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
      }
    } catch (err) {
      const error = err as { message: string; code?: string };
      toast.error(error.message || "Failed to update certification");
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
  const handleOpenCertDialog = (certification: Certification) => {
    // Set the form data with the existing certification
    setCertForm({
      certifications_name: certification.certifications_name || '',
      certifications_issuer: certification.certifications_issuer || '',
      certifications_issued_date: certification.certifications_issued_date || '',
      certifications_expiration_date: certification.certifications_expiration_date || '',
      certifications_id: certification.certifications_id || '',
      certifications_image: certification.certifications_image || '',
      certifications_image_url: certification.certifications_image_url || ''
    });
    setIsCertDialogOpen(true);
  };

  // Function to handle closing the certification edit dialog
  const handleCloseCertDialog = () => {
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
  };

  // Add edit button back to each certification
  const renderCertification = (cert: Certification, index: number) => (
    <div key={index} className="space-y-1 text-sm">
      <div>
        <p className="font-medium">{cert.certifications_name}</p>
        <p className="text-gray-600">{cert.certifications_issuer}</p>
        <p className="text-gray-500 text-xs">
          {cert.certifications_issued_date} - {cert.certifications_expiration_date}
        </p>
        {cert.certifications_id && (
          <p className="text-gray-500 text-xs mt-1">
            ID: {cert.certifications_id}
          </p>
        )}
      </div>
      {cert.certifications_image_url && (
        <div className="mt-2">
          <img 
            src={getFullImageUrl(cert.certifications_image_url)} 
            alt={cert.certifications_name}
            className="w-full h-auto rounded-lg object-cover max-h-48"
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
      <div className="pb-8 border-b-2 border-gray-200">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-blue-900">
          {profileData.profile_pic_url || profileData.profile_pic ? (
            <div className="relative">
              <img 
                src={getFullImageUrl(profileData.profile_pic_url || profileData.profile_pic)}
                alt={`${profileData.first_name || ''} ${profileData.last_name || ''}`}
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  if (parent) {
                    const initials = `${profileData.first_name?.[0] || ''}${profileData.last_name?.[0] || ''}`.toUpperCase();
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'w-full aspect-square bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600';
                    fallbackDiv.textContent = initials || '?';
                    parent.replaceChild(fallbackDiv, target);
                  }
                }}
              />
              {isEditMode && (
                <Button 
                  variant="ghost" 
                  className="absolute top-2 right-2 p-2 h-auto bg-white/80 hover:bg-white text-[#3C5979] hover:text-[#3C5979] rounded-full"
                  onClick={() => setIsImageDialogOpen(true)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="relative w-full aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-semibold text-gray-600">
                {`${profileData.first_name?.[0] || ''}${profileData.last_name?.[0] || ''}`.toUpperCase() || '?'}
              </span>
              {isEditMode && (
                <Button 
                  variant="ghost" 
                  className="absolute top-2 right-2 p-2 h-auto bg-white/80 hover:bg-white text-[#3C5979] hover:text-[#3C5979] rounded-full"
                  onClick={() => setIsImageDialogOpen(true)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 to-transparent h-1/4"></div>
        </div>

        <div className="mt-4 text-center mb-6">
          <div className="flex justify-center items-center gap-2">
            <h2 className="text-xl font-bold">{profileData.first_name} {profileData.last_name}</h2>
            {isEditMode && (
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
                onClick={() => setIsProfileDialogOpen(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{profileData.profile_mail}</p>
        </div>

        <Card className="p-4 bg-gray-50 border-gray-200">
          <p className="text-sm italic text-center">
            {profileData.bio || "No bio available"}
          </p>
        </Card>
      </div>

      {/* Video Introduction */}
      {(profileData.video_intro || profileData.video_intro_url) && (
        <div className="pb-8 border-b-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-[#70a4d8]" />
              <h3 className="font-semibold">Video Introduction</h3>
            </div>
            {isEditMode && (
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
                onClick={() => setIsVideoDialogOpen(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="relative bg-gray-200 rounded-lg aspect-video overflow-hidden">
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{profileData.video_description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certifications */}
      {profileData.certifications && profileData.certifications.length > 0 && (
        <div className="pb-8 border-b-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#70a4d8]" />
              <h3 className="font-semibold">Certifications</h3>
            </div>
            {isEditMode && profileData.certifications && profileData.certifications.length > 0 && (
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
                onClick={() => profileData.certifications && handleOpenCertDialog(profileData.certifications[0])}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {profileData.certifications.map(renderCertification)}
          </div>
        </div>
      )}

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
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
            <div>
              <label className="block font-medium mb-1 text-sm">Email</label>
              <Input
                name="profile_mail"
                type="email"
                value={profileForm.profile_mail}
                onChange={handleProfileChange}
                className="bg-gray-50"
                required
                disabled={isProfileUpdating}
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm">Bio</label>
              <Textarea
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                className="bg-gray-50 min-h-[100px]"
                disabled={isProfileUpdating}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfileDialogOpen(false)}
                disabled={isProfileUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Image</DialogTitle>
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
                className="mb-2"
                disabled={isImageUploading}
              >
                {isImageUploading ? 'Uploading...' : 'Choose Image'}
              </Button>
              <p className="text-gray-500 text-sm">
                Recommended: Square image, max 5MB
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImageDialogOpen(false)}
                disabled={isImageUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                disabled={!selectedImage || isImageUploading}
              >
                {isImageUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Edit Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Video Introduction</DialogTitle>
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
              ) : (
                <div className="text-sm text-gray-600 mb-4">
                  {profileData.video_intro_url ? 'Current video will be replaced' : 'No video selected'}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={handleVideoClick}
                className="mb-2"
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
                className="bg-gray-50 min-h-[100px]"
                disabled={isVideoUpdating}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVideoDialogOpen(false)}
                disabled={isVideoUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCertSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-sm">Certification Name</label>
              <Input
                name="certifications_name"
                value={certForm.certifications_name}
                onChange={handleCertChange}
                className="bg-gray-50"
                required
                disabled={isCertUpdating}
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm">Issuer</label>
              <Input
                name="certifications_issuer"
                value={certForm.certifications_issuer}
                onChange={handleCertChange}
                className="bg-gray-50"
                required
                disabled={isCertUpdating}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block font-medium mb-1 text-sm">Expiration Date</label>
                <Input
                  name="certifications_expiration_date"
                  type="date"
                  value={certForm.certifications_expiration_date}
                  onChange={handleCertChange}
                  className="bg-gray-50"
                  required
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
                    src={certForm.certifications_image_url} 
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
                className="mb-2"
                disabled={isCertUpdating}
              >
                {isCertUpdating ? 'Uploading...' : 'Choose Image'}
              </Button>
              <p className="text-gray-500 text-sm">
                Recommended: Square image, max 5MB
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseCertDialog}
                disabled={isCertUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white"
                disabled={isCertUpdating}
              >
                {isCertUpdating ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSidebar;