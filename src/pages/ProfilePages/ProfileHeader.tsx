import { Copy, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProfileData } from './Profile';

interface ProfileHeaderProps {
  profileData: ProfileData;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profileData }) => {
  const copyToClipboard = () => {
    const profileUrl = profileData.profile_url || "https://www.mytrustworld.com/profile-d-ae111378";
    navigator.clipboard.writeText(profileUrl);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {profileData.first_name} {profileData.last_name}
            </h1>
            <p className="text-muted-foreground text-lg">{profileData.bio}</p>
            <p className="text-muted-foreground">{profileData.profile_mail}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Profile Verified 100%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Public profile & URL</h2>
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={profileData.profile_url || "https://www.mytrustworld.com/profile-d-ae111378"}
              readOnly
              className="flex-1 p-2 border rounded-md text-sm bg-gray-50"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={copyToClipboard}
              className="flex-shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="flex items-baseline gap-2 md:mb-3">
            <h2 className="text-4xl font-bold">{profileData.rating?.toFixed(1) || "5.0"}</h2>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground mb-3">Exceptional</p>
          
          <div className="w-full md:max-w-[240px] space-y-1.5">
            {[
              { label: "5-star", value: 100 },
              { label: "4-star", value: 0 },
              { label: "3-star", value: 0 },
              { label: "2-star", value: 0 },
              { label: "1-star", value: 0 },
            ].map((rating, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm min-w-[46px]">{rating.label}</span>
                <Progress value={rating.value} className="h-2 flex-1" />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{profileData.reviews?.length || 0} reviews</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Write a Review
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;