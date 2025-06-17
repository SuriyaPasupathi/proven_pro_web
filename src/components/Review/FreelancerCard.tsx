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
    <div className="relative group">
      {/* Card Container with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Neumorphic Card Container */}
        <div className="relative p-4 sm:p-6 shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#d1d1d1,inset_-8px_-8px_16px_#ffffff] transition-all duration-500">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            {/* Profile Image Section with Neumorphic Effect */}
            <div 
              className="relative group cursor-pointer w-full sm:w-auto" 
              onClick={handleProfileClick}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] group-hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-300 mx-auto sm:mx-0">
                <img
                  src={freelancer.image}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-lg sm:text-xl font-bold cursor-pointer text-[#5A8DB8]  transition-colors duration-300"
                    onClick={handleProfileClick}
                  >
                    {freelancer.name}
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-gray-600 line-clamp-2 font-semibold">{freelancer.title}</p>
                </div>

                {/* Menu Button with Neumorphic Effect */}
                <div className="relative">
                  <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-white/10"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
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

              {/* Rating Section with Neumorphic Stars */}
              <div className="mt-4 flex items-center justify-center sm:justify-start">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 transform hover:scale-110 transition-transform duration-200 ${
                        i < Math.round(freelancer.rating) 
                          ? 'text-yellow-400' 
                          : 'text-gray-200'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {freelancer.rating.toFixed(1)}
                  </span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>

              {/* Social Links with Neumorphic Effect */}
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
                {freelancer.linkedin && (
                  <a
                    href={freelancer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-300"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {freelancer.upwork && (
                  <a
                    href={freelancer.upwork}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-300"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-.58c.837.515 1.79.806 2.811.806 1.304 0 2.38-.36 3.209-1.077.83-.717 1.245-1.677 1.245-2.88 0-1.203-.415-2.163-1.245-2.88-.83-.717-1.905-1.077-3.209-1.077-1.304 0-2.38.36-3.209 1.077-.83.717-1.245 1.677-1.245 2.88 0 .45.06.87.18 1.26l-1.38.45c-.12-.45-.18-.93-.18-1.44 0-1.8.63-3.33 1.89-4.59 1.26-1.26 2.79-1.89 4.59-1.89 1.8 0 3.33.63 4.59 1.89 1.26 1.26 1.89 2.79 1.89 4.59 0 1.8-.63 3.33-1.89 4.59-1.26 1.26-2.79 1.89-4.59 1.89zm-9.561 0c-1.8 0-3.33-.63-4.59-1.89-1.26-1.26-1.89-2.79-1.89-4.59 0-1.8.63-3.33 1.89-4.59 1.26-1.26 2.79-1.89 4.59-1.89 1.8 0 3.33.63 4.59 1.89 1.26 1.26 1.89 2.79 1.89 4.59 0 1.8-.63 3.33-1.89 4.59-1.26 1.26-2.79 1.89-4.59 1.89zm0-2.7c1.304 0 2.38-.36 3.209-1.077.83-.717 1.245-1.677 1.245-2.88 0-1.203-.415-2.163-1.245-2.88-.83-.717-1.905-1.077-3.209-1.077-1.304 0-2.38.36-3.209 1.077-.83.717-1.245 1.677-1.245 2.88 0 1.203.415 2.163 1.245 2.88.83.717 1.905 1.077 3.209 1.077z"/>
                    </svg>
                  </a>
                )}
                {freelancer.fiverr && (
                  <a
                    href={freelancer.fiverr}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] transition-all duration-300"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.004 5.882c-1.414-.001-2.531 1.16-2.531 2.585 0 1.424 1.116 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584 0-1.425-1.117-2.584-2.531-2.584zm-9.531 2.585c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584zm-5.063 0c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584zm0 5.17c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584zm5.063 0c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584zm5.063 0c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
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
  <DialogContent className="sm:max-w-md bg-white/80 backdrop-blur-xl border border-[#5A8DB8]/30 rounded-3xl shadow-2xl transition-all duration-300">
    <DialogHeader className="space-y-3">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-2xl font-semibold text-[#3C5979] flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Profile
        </DialogTitle>
        
      </div>
      <div className="h-1 w-20 bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] rounded-full"></div>
    </DialogHeader>

    <form onSubmit={handleShare} className="space-y-6">
      <div className="space-y-4">
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
              className="pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/30 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-md transition-all duration-300"
            />
            <Mail className="w-5 h-5 text-[#5A8DB8]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="bg-[#EAF3FA] p-3 rounded-lg border border-[#5A8DB8]/20">
          <p className="text-sm text-[#5A8DB8] flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            The recipient will receive an email with a link to view this profile
          </p>
        </div>
      </div>

      <DialogFooter className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsShareDialogOpen(false)}
          disabled={isLoading}
          className="border-[#5A8DB8]/30 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-[#5A8DB8] to-[#70a4d8] text-white hover:from-[#3C5979] hover:to-[#5A8DB8] transition flex items-center gap-2"
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
