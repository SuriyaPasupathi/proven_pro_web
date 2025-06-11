import { Copy, Star, Pencil, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProfileData } from '../../types/profile';
import { useEditMode } from '../../context/EditModeContext';
import { useState } from 'react';
import { useAppDispatch } from '../../store/store';
import { updateProfile, shareProfile } from '../../store/Services/CreateProfileService';
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
import ReviewDialog from './ReviewDialog';

interface VerificationDetails {
  government_id: {
    uploaded: boolean;
    verified: boolean;
    percentage: number;
  };
  address_proof: {
    uploaded: boolean;
    verified: boolean;
    percentage: number;
  };
  mobile: {
    provided: boolean;
    verified: boolean;
    percentage: number;
  };
}

interface ProfileHeaderProps {
  profileData: {
    id?: string;
    subscription_type: 'free' | 'standard' | 'premium';
    first_name?: string;
    last_name?: string;
    bio?: string;
    profile_mail?: string;
    profile_url?: string;
    rating?: number;
    reviews?: Array<{
      id: number;
      reviewer_name: string;
      rating: number;
      comment: string;
      created_at: string;
      company?: string;
    }>;
    verification_details?: {
      government_id: {
        uploaded: boolean;
        verified: boolean;
        percentage: number;
      };
      address_proof: {
        uploaded: boolean;
        verified: boolean;
        percentage: number;
      };
      mobile: {
        provided: boolean;
        verified: boolean;
        percentage: number;
      };
    };
  };
}

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onSave: (data: Partial<ProfileData>) => void;
}

interface ShareProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    id?: string;
    first_name?: string;
    last_name?: string;
  };
}

const calculateVerificationPercentage = (details: VerificationDetails): number => {
  let totalPercentage = 0;

  // Government ID verification is worth 50%
  if (details.government_id.verified) {
    totalPercentage += 50;
  }

  // Address proof verification is worth 25%
  if (details.address_proof.verified) {
    totalPercentage += 25;
  }

  // Mobile verification is worth 25%
  if (details.mobile.verified) {
    totalPercentage += 25;
  }

  return totalPercentage;
};

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

const ShareProfileDialog: React.FC<ShareProfileDialogProps> = ({
  isOpen,
  onClose,
  profileData,
}) => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !profileData?.id) return;

    try {
      setIsLoading(true);
      await dispatch(shareProfile({ 
        email, 
        user_id: profileData.id 
      })).unwrap();
      
      toast({
        title: "Profile shared successfully",
        description: "The recipient will receive an email with the profile link",
      });
      setEmail('');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share profile';
      toast({
        title: "Error sharing profile",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
              disabled={isLoading}
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#70a4d8] hover:bg-[#3C5979] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sharing..." : "Share"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profileData }) => {
  const { isEditMode } = useEditMode();
  const dispatch = useAppDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
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
      if (!profileData.id) {
        toast({
          title: "Error",
          description: "Profile ID is required for updates",
          variant: "destructive",
        });
        return;
      }
      const updateData = {
        data: {
          subscription_type: profileData.subscription_type || 'free',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          bio: data.bio || '',
          profile_mail: data.profile_mail || ''
        },
        profileId: profileData.id
      };
      await dispatch(updateProfile(updateData));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleReviewSubmit = (review: { rating: number; content: string; name: string; company?: string }) => {
    // TODO: Implement review submission logic
    console.log('Review submitted:', review);
    toast({
      title: "Review submitted",
      description: "Thank you for your review!",
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 md:p-8">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-col gap-4">
              {/* Top Section: Name and Edit Button */}
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5A8DB8]">
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

              {/* Below Section: Verification */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center">
                  <div className="text-green-700 rounded-lg bg-green-50 p-4 text-base font-medium w-full sm:w-[360px]">
                    {profileData.verification_details ? (
                      <div className="flex flex-col">
                        <span className="text-lg font-bold">Profile Verified {calculateVerificationPercentage(profileData.verification_details)}%</span>
                        <div className="flex flex-wrap gap-2 text-sm mt-1">
                          {profileData.verification_details.government_id.verified && (
                            <span className="text-green-600 bg-green-100 px-2 py-1 rounded">✓ Government ID</span>
                          )}
                          {profileData.verification_details.address_proof.verified && (
                            <span className="text-green-600 bg-green-100 px-2 py-1 rounded">✓ Address</span>
                          )}
                          {profileData.verification_details.mobile.verified && (
                            <span className="text-green-600 bg-green-100 px-2 py-1 rounded">✓ Mobile</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span>Profile Verification Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-b-2 border-gray-200 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-[#5A8DB8]">Public profile & URL</h2>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={profileData.profile_url || "https://www.mytrustworld.com/profile-d-ae111378"}
                readOnly
                className="flex-1 p-2 border rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5A8DB8]/20"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={copyToClipboard}
                      className={`flex-shrink-0 transition-colors ${isCopied ? 'bg-green-50 text-green-600 border-green-200' : 'hover:bg-[#5A8DB8]/10'}`}
                    >
                      <Copy className={`h-4 w-4 ${isCopied ? 'text-green-600' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCopied ? 'Copied!' : 'Copy to clipboard'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setIsShareDialogOpen(true)}
                      className="flex-shrink-0 hover:bg-[#5A8DB8]/10"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <div className="flex flex-col sm:flex-row items-center bg-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl p-4 sm:p-6 w-full max-w-2xl border border-[#5A8DB8]/10">
              {/* Left: Rating, label, stars, reviews */}
              <div className="flex flex-col items-center sm:items-start flex-1 min-w-[160px] mb-4 sm:mb-0">
                <span className="text-4xl sm:text-5xl font-extrabold leading-tight text-[#5A8DB8]">{profileData.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-base sm:text-lg font-semibold mt-1 mb-1">Exceptional</span>
                <div className="flex items-center mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm sm:text-base text-muted-foreground">{profileData.reviews?.length || 0} reviews</span>
              </div>
              {/* Right: Rating bars */}
              <div className="flex flex-col flex-1 md:max-w-[240px] space-y-1.5 sm:ml-8 w-full">
                {[
                  { label: "5-star", value: 70 },
                  { label: "4-star", value: 20 },
                  { label: "3-star", value: 5 },
                  { label: "2-star", value: 3 },
                  { label: "1-star", value: 2 },
                ].map((rating, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm min-w-[46px]">{rating.label}</span>
                    <Progress value={rating.value} className="h-2 flex-1 bg-[#bad3eb]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        profileData={profileData}
        onSave={handleSaveProfile}
      />

      <ShareProfileDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        profileData={profileData}
      />

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default ProfileHeader;