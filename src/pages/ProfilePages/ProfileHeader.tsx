import { Copy, Star,Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
    <div className="space-y-4 xs:space-y-6 sm:space-y-8 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50/50">
      {/* Main Profile Section */}
      <div className="relative overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#5A8DB8]/5 to-white p-3 xs:p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="relative space-y-3 xs:space-y-4 sm:space-y-6">
          {/* Name and Edit Section */}
          <div className="flex flex-col xs:flex-row xs:items-end justify-between gap-2 xs:gap-3 sm:gap-4">
            <div className="space-y-2 xs:space-y-3 sm:space-y-4">
              <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#5A8DB8] break-words">
                  {profileData.first_name} {profileData.last_name}
                </h1>
                {isEditMode && (
                  <Button
                    variant="ghost"
                    className="p-1 xs:p-1.5 sm:p-2 h-auto text-[#5A8DB8] hover:text-[#3C5979] hover:bg-[#5A8DB8]/10 rounded-full transition-all duration-300"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    {/* <Pencil className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" /> */}
                  </Button>
                )}
              </div>

              {/* Verification Badge */}
              <div className="flex items-center w-full">
                <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-md xs:rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-green-100">
                  {profileData.verification_details ? (
                    <div className="flex flex-col gap-1.5 xs:gap-2">
                      <div className="flex items-center gap-1.5 xs:gap-2">
                        <div className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                          <span className="text-white text-xs xs:text-sm sm:text-base font-bold">{calculateVerificationPercentage(profileData.verification_details)}%</span>
                        </div>
                        <span className="text-sm xs:text-base sm:text-lg font-semibold text-green-700">Profile Verified</span>
                      </div>
                      <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2">
                        {profileData.verification_details.government_id.verified && (
                          <span className="text-[10px] xs:text-xs sm:text-sm text-green-700 bg-green-100/80 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-full font-medium">✓ Government ID</span>
                        )}
                        {profileData.verification_details.address_proof.verified && (
                          <span className="text-[10px] xs:text-xs sm:text-sm text-green-700 bg-green-100/80 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-full font-medium">✓ Address</span>
                        )}
                        {profileData.verification_details.mobile.verified && (
                          <span className="text-[10px] xs:text-xs sm:text-sm text-green-700 bg-green-100/80 px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-full font-medium">✓ Mobile</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 xs:gap-2">
                      <div className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                        <span className="text-white text-xs xs:text-sm sm:text-base font-bold">!</span>
                      </div>
                      <span className="text-sm xs:text-base sm:text-lg font-semibold text-yellow-700">Profile Verification Pending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile URL and Rating Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 md:gap-8">
        {/* Profile URL Card */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-md xs:rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#5A8DB8]/10">
          <h2 className="text-base xs:text-lg sm:text-xl font-bold mb-2 xs:mb-3 sm:mb-4 text-[#5A8DB8]">Public Profile URL</h2>
          <div className="flex items-center gap-1.5 xs:gap-2">
            <input
              type="text"
              value={profileData.profile_url || "https://www.mytrustworld.com/profile-d-ae111378"}
              readOnly
              className="flex-1 p-1.5 xs:p-2 sm:p-3 border border-[#5A8DB8]/20 rounded-md sm:rounded-lg text-[10px] xs:text-xs sm:text-sm bg-gradient-to-br from-gray-50 to-white focus:outline-none focus:ring-2 focus:ring-[#5A8DB8]/20 transition-all duration-300"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={copyToClipboard}
                    className={`flex-shrink-0 h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 transition-all duration-300 ${isCopied ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' : 'hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8]'}`}
                  >
                    <Copy className={`h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 ${isCopied ? 'text-green-600' : ''}`} />
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
                    className="flex-shrink-0 h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
                  >
                    <Share2 className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-md xs:rounded-lg sm:rounded-xl p-3 xs:p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#5A8DB8]/10">
          <div className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 sm:gap-6">
            {/* Rating Display */}
            <div className="flex flex-col items-center xs:items-start">
              <div className="relative">
                <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#5A8DB8]">
                  {profileData.rating?.toFixed(1) || "5.0"}
                </span>
                <div className="absolute -top-1 -right-1 xs:-top-1.5 xs:-right-1.5 sm:-top-2 sm:-right-2">
                  <div className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Star className="h-1.5 w-1.5 xs:h-2 xs:w-2 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>
              <span className="text-sm xs:text-base sm:text-lg font-semibold mt-1 xs:mt-1.5 sm:mt-2 text-[#5A8DB8]">Exceptional</span>
              <div className="flex items-center gap-0.5 xs:gap-1 mt-0.5 xs:mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 mt-0.5 xs:mt-1">{profileData.reviews?.length || 0} reviews</span>
            </div>

            {/* Rating Bars */}
            <div className="flex flex-col gap-1 xs:gap-1.5 sm:gap-2 flex-1 w-full">
              {[
                { label: "5-star", value: 70, color: "from-green-400 to-emerald-500" },
                { label: "4-star", value: 20, color: "from-blue-400 to-indigo-500" },
                { label: "3-star", value: 5, color: "from-yellow-400 to-orange-500" },
                { label: "2-star", value: 3, color: "from-orange-400 to-red-500" },
                { label: "1-star", value: 2, color: "from-red-400 to-pink-500" },
              ].map((rating, index) => (
                <div key={index} className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <span className="text-[10px] xs:text-xs sm:text-sm min-w-[36px] xs:min-w-[40px] sm:min-w-[46px] text-gray-600">{rating.label}</span>
                  <div className="flex-1 h-1 xs:h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${rating.color} transition-all duration-500`}
                      style={{ width: `${rating.value}%` }}
                    />
                  </div>
                  <span className="text-[10px] xs:text-xs sm:text-sm text-gray-500 min-w-[24px] xs:min-w-[28px] sm:min-w-[32px]">{rating.value}%</span>
                </div>
              ))}
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