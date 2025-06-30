import { useState, useEffect } from 'react';
import { Star, User, MessageSquare, Star as StarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../store/store';
import { submitProfileReview, getProfileReviewsPublic } from '../../store/Services/CreateProfileService';
import { toast } from 'sonner';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; content: string; name: string }) => void;
  shareToken?: string;
  profileId?: string;
}

const ReviewDialog = ({ isOpen, onClose, onSubmit, shareToken, profileId }: ReviewDialogProps) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Validate rating
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    // Validate content
    if (!content.trim()) {
      newErrors.content = 'Review content is required';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Review must be at least 10 characters';
    } else if (content.trim().length > 500) {
      newErrors.content = 'Review must not exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // If we have shareToken and profileId, use the real API
      if (shareToken && profileId) {
        const result = await dispatch(submitProfileReview({
          id: profileId,
          share_token: shareToken,
          reviewer_name: name.trim(),
          rating: rating,
          comment: content.trim()
        })).unwrap();
        
        toast.success('Review submitted successfully!');
        console.log('Review submitted via API:', result);

        // Refresh reviews after successful submission
        await dispatch(getProfileReviewsPublic(profileId));
      } else {
        // Fallback to the original onSubmit for backward compatibility
        onSubmit({ 
          rating, 
          content: content.trim(), 
          name: name.trim()
        });
      }
      
      // Reset form
      setRating(0);
      setContent('');
      setName('');
      setErrors({});
      onClose();
    } catch (error: any) {
      console.error('Review submission error:', error);
      const errorMessage = error?.message || 'Failed to submit review. Please try again.';
      toast.error(errorMessage);
      setErrors({
        submit: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setContent('');
      setName('');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border border-[#5A8DB8]/20 rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5A8DB8]/5 to-[#70a4d8]/5 pointer-events-none"></div>
        <DialogHeader className="space-y-4 relative">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-[#3C5979] to-[#5A8DB8] bg-clip-text text-transparent flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#5A8DB8]/10 to-[#70a4d8]/10">
                <StarIcon className="w-5 h-5 text-[#5A8DB8]" />
              </div>
              Write a Review
            </DialogTitle>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-[#5A8DB8]/20 via-[#70a4d8]/20 to-[#5A8DB8]/20 rounded-full"></div>
        </DialogHeader>
        <div className="grid gap-4 py-4 relative">
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-[#3C5979] group-hover:text-[#5A8DB8] transition-colors flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={cn(
                "bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md",
                errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              )}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2 group">
            <label className="text-sm font-medium text-[#3C5979] group-hover:text-[#5A8DB8] transition-colors flex items-center gap-2">
              <Star className="w-4 h-4" />
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
                  disabled={isSubmitting}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-all duration-300",
                      (hoverRating >= star || rating >= star)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    )}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-medium text-[#3C5979] group-hover:text-[#5A8DB8] transition-colors flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Your Comments
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your review here..."
              className={cn(
                "min-h-[120px] bg-white/60 backdrop-blur-sm border border-[#5A8DB8]/20 focus:border-[#5A8DB8] focus:ring-2 focus:ring-[#5A8DB8]/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md",
                errors.content ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              )}
              disabled={isSubmitting}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500">{errors.submit}</p>
          )}
        </div>
        <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-[#5A8DB8]/10">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
            className="border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10 hover:border-[#5A8DB8]/30 transition-all duration-300 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog; 