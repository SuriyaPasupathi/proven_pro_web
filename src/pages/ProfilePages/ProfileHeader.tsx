import { Copy, Star, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProfileData } from './Profile';
import { useEditMode } from '../../context/EditModeContext';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../store/Services/CreateProfileService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileHeaderProps {
  profileData: ProfileData;
}

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onSave: (data: Partial<ProfileData>) => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  isOpen,
  onClose,
  profileData,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    first_name: profileData.first_name || '',
    last_name: profileData.last_name || '',
    bio: profileData.bio || '',
    profile_mail: profileData.profile_mail || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile_mail">Email</Label>
            <Input
              id="profile_mail"
              type="email"
              value={formData.profile_mail}
              onChange={(e) => setFormData(prev => ({ ...prev, profile_mail: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#70a4d8] hover:bg-[#3C5979] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profileData }) => {
  const { isEditMode } = useEditMode();
  const dispatch = useDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    const profileUrl = profileData.profile_url || "https://www.mytrustworld.com/profile-d-ae111378";
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Profile URL has been copied to your clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the URL manually",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async (data: Partial<ProfileData>) => {
    try {
      const updateData = {
        subscription_type: profileData.subscription_type || 'free',
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        profile_mail: data.profile_mail
      };
      await dispatch(updateProfile(updateData) as any);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                {profileData.first_name} {profileData.last_name}
              </h1>
              {isEditMode && (
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-[#3C5979] hover:text-[#3C5979] hover:bg-[#3C5979]/10"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={copyToClipboard}
                    className={`flex-shrink-0 transition-colors ${isCopied ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
                  >
                    <Copy className={`h-4 w-4 ${isCopied ? 'text-green-600' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCopied ? 'Copied!' : 'Copy to clipboard'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
              { label: "5-star", value: 70 },
              { label: "4-star", value: 20 },
              { label: "3-star", value: 5 },
              { label: "2-star", value: 3 },
              { label: "1-star", value: 2 },
            ].map((rating, index) => (
              <div key={index} className="flex items-center gap-2 ">
                <span className="text-sm min-w-[46px]">{rating.label}</span>
                <Progress value={rating.value} className="h-2 flex-1 bg-[#bad3eb]" />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{profileData.reviews?.length || 0} reviews</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <Button className="bg-[#70a4d8] hover:bg-[#3C5979] text-white">
          Write a Review
        </Button>
      </div>

      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        profileData={profileData}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfileHeader;