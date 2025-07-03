import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Share2, Mail, Send, MessageSquare, } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from '../../store/store';
import { shareProfile } from '../../store/Services/CreateProfileService';
import ReviewDialog from '../../pages/ProfilePages/ReviewDialog';

export type Freelancer = {
  id: string;
  name: string;
  title: string;
  rating: number;
  image: string;
  linkedin: string;
  upwork: string;
  fiverr: string;
};

type Props = {
  freelancer: Freelancer;
  totalReviews: number;
};

const FreelancerCard: React.FC<Props> = ({ freelancer, totalReviews }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${freelancer.id}`);
  };

  const handleReviewSubmit = (review: { rating: number; content: string; name: string }) => {
    // Here you would typically make an API call to submit the review
    console.log('Review submitted:', review);
    // Close the dialog after submission
    setIsReviewDialogOpen(false);
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !freelancer.id) return;

    try {
      setIsLoading(true);
      await dispatch(shareProfile({ 
        email, 
        user_id: freelancer.id 
      })).unwrap();
      
      toast({
        title: "Profile shared successfully",
        description: "The recipient will receive an email with the profile link",
      });
      setEmail('');
      setIsShareDialogOpen(false);
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
    <div className="flex flex-col sm:flex-row items-start py-4 sm:py-6 group border-b border-gray-200 last:border-b-0 w-full bg-transparent">
      {/* Avatar */}
      <div className="flex-shrink-0 cursor-pointer mb-3 sm:mb-0" onClick={handleProfileClick}>
        <img
          src={freelancer.image}
          alt={freelancer.name}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded object-cover border border-gray-100"
        />
      </div>
      {/* Main Content */}
      <div className="flex-1 min-w-0 sm:ml-4 md:ml-6 w-full">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className="text-lg sm:text-xl md:text-2xl font-bold text-black leading-tight cursor-pointer hover:text-[#5A8DB8] transition-colors duration-200"
                onClick={handleProfileClick}
              >
                {freelancer.name}
              </h3>
            </div>
            <p className="mt-1 text-sm sm:text-base text-[#6B6B6B] font-normal leading-snug truncate max-w-full sm:max-w-2xl">
              {freelancer.title}
            </p>
            {/* Rating */}
            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.round(freelancer.rating) ? 'text-[#FF3A3A]' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              ))}
              <span className="ml-2 text-xs sm:text-sm text-gray-500 font-medium">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            {/* Social Links as text
            <div className="mt-2 space-y-0.5">
              {freelancer.linkedin && (
                <div className="text-xs text-[#6B6B6B] font-normal">
                  <span className="font-bold text-black">LinkedIn:</span> 
                  <a 
                    href={freelancer.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#6B6B6B] underline break-all hover:text-[#5A8DB8] transition-colors duration-200"
                  >
                    {freelancer.linkedin}
                  </a>
                </div>
              )}
              {freelancer.upwork && (
                <div className="text-xs text-[#6B6B6B] font-normal">
                  <span className="font-bold text-black">Upwork:</span> 
                  <a 
                    href={freelancer.upwork} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#6B6B6B] underline break-all hover:text-[#5A8DB8] transition-colors duration-200"
                  >
                    {freelancer.upwork}
                  </a>
                </div>
              )}
              {freelancer.fiverr && (
                <div className="text-xs text-[#6B6B6B] font-normal">
                  <span className="font-bold text-black">Fiverr:</span> 
                  <a 
                    href={freelancer.fiverr} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#6B6B6B] underline break-all hover:text-[#5A8DB8] transition-colors duration-200"
                  >
                    {freelancer.fiverr}
                  </a>
                </div>
              )}
            </div> */}
          </div>
          {/* Menu Button, right-aligned, vertically centered, visible on mobile, hover on desktop */}
          <div className="relative flex-shrink-0 ml-2 sm:ml-4 flex items-center h-full">
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 sm:p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#5A8DB8] focus:ring-opacity-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
                  aria-label="Open menu"
                  type="button"
                >
                  <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 sm:w-40">
                <DropdownMenuItem onClick={() => {
                  setIsReviewDialogOpen(true);
                  setIsMenuOpen(false);
                }}>
                  Write a review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setIsShareDialogOpen(true);
                  setIsMenuOpen(false);
                }}>
                  Share profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Review Dialog */}
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
      />
      {/* Share Profile Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/80 backdrop-blur-xl border border-[#5A8DB8]/30 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300 mx-4 sm:mx-0">
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#3C5979] flex items-center gap-2">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Share Profile
              </DialogTitle>
            </div>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
          </DialogHeader>
          <form onSubmit={handleShare} className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[#3C5979] flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
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
                    className="pl-10 pr-4 py-2 sm:py-2.5 bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-md transition-all duration-300 text-sm sm:text-base"
                  />
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="bg-[#EAF3FA] p-3 rounded-lg border border-[#5A8DB8]/20">
                <p className="text-xs sm:text-sm text-[#5A8DB8] flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  The recipient will receive an email with a link to view this profile
                </p>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsShareDialogOpen(false)}
                disabled={isLoading}
                className="border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition w-full sm:w-auto text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Share Profile
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreelancerCard;
