import { Video, Award, Tag } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { ProfileData } from './Profile';

// Get the base URL from environment variable
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ProfileSidebarProps {
  profileData: ProfileData;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profileData }) => {
  // Debug logging
  console.log('Profile Data:', profileData);
  console.log('Profile Pic URL:', profileData.profile_pic_url);
  console.log('Profile Pic:', profileData.profile_pic);

  // Function to get full image URL
  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${baseUrl}${url}`;
  };

  // Ensure services_categories is an array
  const servicesCategories = Array.isArray(profileData.services_categories) 
    ? profileData.services_categories 
    : [];

  return (
    <div className="space-y-8">
      {/* Profile Image */}
      <div>
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-blue-900">
          {profileData.profile_pic_url || profileData.profile_pic ? (
            <img 
              src={getFullImageUrl(profileData.profile_pic_url || profileData.profile_pic)}
              alt={`${profileData.first_name || ''} ${profileData.last_name || ''}`}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                console.error('Image load error:', e);
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No profile image</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 to-transparent h-1/4"></div>
        </div>

        <div className="mt-4 text-center mb-6">
          <h2 className="text-xl font-bold">{profileData.first_name} {profileData.last_name}</h2>
          <p className="text-sm text-muted-foreground">{profileData.bio}</p>
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
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Video Introduction</h3>
          </div>
          
          <div className="relative bg-gray-200 rounded-lg aspect-video overflow-hidden">
            <video 
              src={profileData.video_intro_url || profileData.video_intro}
              className="w-full h-full object-cover"
              controls
            />
            {profileData.video_description && (
              <p className="text-sm text-gray-600 mt-2">{profileData.video_description}</p>
            )}
          </div>
        </div>
      )}

      {/* Certifications */}
      {profileData.certifications && profileData.certifications.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Certifications</h3>
          </div>
          
          <div className="space-y-4">
            {profileData.certifications.map((cert, index) => (
              <div key={index} className="space-y-1 text-sm">
                <p className="font-medium">{cert.certifications_name}</p>
                <p className="text-gray-600">{cert.certifications_issuer}</p>
                <p className="text-gray-500 text-xs">
                  {cert.certifications_issued_date} - {cert.certifications_expiration_date}
                </p>
                {cert.certifications_image_url && (
                  <img 
                    src={cert.certifications_image_url} 
                    alt={cert.certifications_name}
                    className="w-full h-auto rounded mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Categories */}
      {servicesCategories.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Services</h3>
          </div>
          
          <div className="space-y-1 text-sm">
            {servicesCategories.map((category, index) => (
              <p key={index}>{category}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;