import { Copy, Star,Share2, Pencil, Save, Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ProfileData } from '../../types/profile';
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
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import ReviewDialog from './ReviewDialog';
import ReviewCarousel from './ReviewCarousel';

// Add custom styles for animations
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

  //edit profile dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-[#5A8DB8]/30 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300">
        <DialogHeader className="space-y-3 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#3C5979] flex items-center gap-2">
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
              Edit Profile
            </DialogTitle>
          </div>
          <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-sm font-medium text-[#3C5979]">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-sm font-medium text-[#3C5979]">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-[#3C5979]">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile_mail" className="text-sm font-medium text-[#3C5979]">Email</Label>
            <Input
              id="profile_mail"
              type="email"
              value={formData.profile_mail}
              onChange={(e) => setFormData(prev => ({ ...prev, profile_mail: e.target.value }))}
              className="bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition text-sm sm:text-base py-2 sm:py-2.5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-2.5"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4" />
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

//share profile dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 backdrop-blur-xl border border-[#5A8DB8]/30 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300">
        <DialogHeader className="space-y-3 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#3C5979] flex items-center gap-2">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Share Profile
            </DialogTitle>
          </div>
          <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
        </DialogHeader>
        <form onSubmit={handleShare} className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-[#3C5979] flex items-center gap-2"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                Email Address
              </Label>
              <div className="relative mt-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  disabled={isLoading}
                  className="pl-10 pr-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-lg transition-all duration-300 text-sm sm:text-base"
                />
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="bg-[#EAF3FA] p-3 sm:p-4 rounded-lg border border-[#5A8DB8]/20">
              <p className="text-xs sm:text-sm text-[#5A8DB8] flex items-start gap-2">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                The recipient will receive an email with a link to view this profile
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition text-sm sm:text-base py-2 sm:py-2.5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition flex items-center justify-center gap-2 text-sm sm:text-base py-2 sm:py-2.5"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  Share Profile
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const calculateRatingDistribution = (reviews: Array<{ rating: number }> = []) => {
  const totalReviews = reviews.length;
  if (totalReviews === 0) return [
    { label: "5-star", value: 0, color: "from-green-400 to-emerald-500" },
    { label: "4-star", value: 0, color: "from-blue-400 to-indigo-500" },
    { label: "3-star", value: 0, color: "from-yellow-400 to-orange-500" },
    { label: "2-star", value: 0, color: "from-orange-400 to-red-500" },
    { label: "1-star", value: 0, color: "from-red-400 to-pink-500" },
  ];

  // Initialize counts for 5-1 stars (in reverse order)
  const distribution = [0, 0, 0, 0, 0];
  
  reviews.forEach(review => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      // Store in reverse order (5-star at index 0, 1-star at index 4)
      distribution[5 - rating]++;
    }
  });

  return distribution.map((count, index) => ({
    label: `${5 - index}-star`,
    value: Math.round((count / totalReviews) * 100),
    color: [
      "from-green-400 to-emerald-500",
      "from-blue-400 to-indigo-500",
      "from-yellow-400 to-orange-500",
      "from-orange-400 to-red-500",
      "from-red-400 to-pink-500"
    ][index]
  }));
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profileData }) => {
  const dispatch = useAppDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    const profileUrl = profileData.profile_url || "https://www.mytrustworld.com/profile-d-ae111378";
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Copied to clipboard",
        description: "Profile URL has been copied to your clipboard",
      });
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
    console.log('Review submitted:', review);
    toast({
      title: "Review submitted",
      description: "Thank you for your review!",
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: blobAnimationStyles }} />
      <div className="relative min-h-screen bg-gradient-to-br from-[#5A8DB8]/5 via-white to-[#3C5979]/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-[#5A8DB8] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-[#3C5979] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-[#5A8DB8] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
{/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            <div className="xl:col-span-9 space-y-4 sm:space-y-5 md:space-y-6 h-fit">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full">
                <div className="relative h-24 sm:h-32 md:h-40 lg:h-48 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979]">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 lg:h-32 bg-gradient-to-t from-white/95 to-transparent"></div>
                </div>
{/* Profile Image and Name Section */}
                <div className="relative px-3 sm:px-4 md:px-6 lg:px-8 -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4 md:gap-6">
                    <div className="relative group">
                      <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-xl sm:rounded-2xl bg-white p-1 shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                        <div className="w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            {profileData.first_name?.[0]}{profileData.last_name?.[0]}
                          </span>
                        </div>
                      </div>
                 
                    </div>
{/* Name and Share Section */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-[#3C5979]">
                          {profileData.first_name} {profileData.last_name}
                        </h1>
                        <div className="flex items-center justify-center sm:justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 transition-all duration-300 hover:scale-105"
                            onClick={copyToClipboard}
                          >
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Copy URL
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 transition-all duration-300 hover:scale-105"
                            onClick={() => setIsShareDialogOpen(true)}
                          >
                            <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                      {profileData.bio && (
                        <p className="mt-2 text-gray-600 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 max-w-full">
                          {profileData.bio}
                        </p>
                      )}
                    </div>
                  </div>
{/* Verification Section */}
                  <div className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-[#5A8DB8]/5 to-[#3C5979]/5 rounded-xl sm:rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative">
                          <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] flex items-center justify-center shadow-lg">
                            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">
                              {profileData.verification_details ? calculateVerificationPercentage(profileData.verification_details) : 0}%
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-full bg-white border-2 border-[#5A8DB8] flex items-center justify-center">
                            <span className="text-[#5A8DB8] text-xs sm:text-sm">✓</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">Verification Status</h3>
                          <p className="text-gray-600 text-xs sm:text-sm">Complete your profile verification</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center sm:justify-end gap-1.5 sm:gap-2">
                        {profileData.verification_details?.government_id.verified && (
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#5A8DB8]/10 text-[#3C5979] border border-[#5A8DB8]/20">
                            ✓ Government ID
                          </span>
                        )}
                        {profileData.verification_details?.address_proof.verified && (
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#5A8DB8]/10 text-[#3C5979] border border-[#5A8DB8]/20">
                            ✓ Address
                          </span>
                        )}
                        {profileData.verification_details?.mobile.verified && (
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#5A8DB8]/10 text-[#3C5979] border border-[#5A8DB8]/20">
                            ✓ Mobile
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
{/* Rating Section */}
            <div className="xl:col-span-3 h-fit">
              <div className="bg-white/95 backdrop-blur-sm  rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-white/20 p-2 sm:p-3 md:p-4 lg:p-5 sticky top-4 sm:top-6 md:top-8 transition-all duration-300 hover:shadow-2xl">
                <div className="space-y-2 sm:space-y-3">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#5A8DB8] to-[#3C5979] shadow-lg mb-2 sm:mb-3 transition-all duration-300 hover:scale-105">
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        {profileData.rating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = profileData.rating || 0;
                        const isFilled = star <= rating;
                        const isHalfFilled = star > rating && star - rating < 1;
                        
                        return (
                          <Star 
                            key={star} 
                            className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-all duration-300 ${
                              isFilled 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : isHalfFilled 
                                ? 'fill-yellow-200 text-yellow-400' 
                                : 'fill-gray-200 text-gray-300'
                            }`} 
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{profileData.reviews?.length || 0} reviews</p>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    {calculateRatingDistribution(profileData.reviews).map((rating, index) => (
                      <div key={index} className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm text-gray-600 min-w-[25px] sm:min-w-[30px] md:min-w-[35px]">{rating.label}</span>
                        <div className="flex-1 h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${rating.color} transition-all duration-500`}
                            style={{ width: `${rating.value}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 min-w-[15px] sm:min-w-[20px] md:min-w-[25px]">{rating.value}%</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
          
          {/* Review Carousel Section - Full Width */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16">
            <ReviewCarousel reviews={profileData.reviews?.map(review => ({
              id: review.id,
              name: review.reviewer_name,
              rating: review.rating,
              content: review.comment,
              timestamp: review.created_at
            }))} />
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
    </>
  );
};

export default ProfileHeader;