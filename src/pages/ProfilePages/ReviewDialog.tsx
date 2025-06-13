import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; content: string; name: string }) => void;
}

const ReviewDialog = ({ isOpen, onClose, onSubmit }: ReviewDialogProps) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = () => {
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      onSubmit({ 
        rating, 
        content: content.trim(), 
        name: name.trim()
      });
      
      // Reset form
      setRating(0);
      setContent('');
      setName('');
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({
        submit: 'Failed to submit review. Please try again.'
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
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-gray-50/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#5A8DB8]">Write a Review</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={cn(
                "border-[#5A8DB8]/20 bg-gradient-to-br from-gray-50 to-white focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 transition-all duration-300",
                errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
              )}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rating</label>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Comments</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your review here..."
              className={cn(
                "min-h-[100px] border-[#5A8DB8]/20 bg-gradient-to-br from-gray-50 to-white focus:border-[#5A8DB8] focus:ring-[#5A8DB8]/20 transition-all duration-300",
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
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
            className="border-[#5A8DB8]/20 hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog; 