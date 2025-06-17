import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MessageSquare, User, Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import ReviewDialog from './ReviewDialog';
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: number;
  name: string;
  rating: number;
  content: string;
  timestamp?: string; // Add timestamp to help with uniqueness
}

interface ReviewCarouselProps {
  reviews?: Review[];
  onSubmit?: (review: { rating: number; content: string; name: string }) => void;
  isSubmitting?: boolean;
}

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ 
  reviews: initialReviews = [], 
  onSubmit,
  isSubmitting = false 
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const { toast } = useToast();
  const visibleReviews = 3; // Number of reviews visible at once on desktop
  const totalReviews = reviews.length;

  // Update reviews whenever initialReviews changes and clean up duplicates
  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) {
      // Remove duplicate reviews based on id, content, name, and rating
      const uniqueReviews = initialReviews.reduce((acc: Review[], current) => {
        const isDuplicate = acc.some(
          review => 
            review.id === current.id || // Check ID first
            (review.content.toLowerCase().trim() === current.content.toLowerCase().trim() &&
            review.name.toLowerCase().trim() === current.name.toLowerCase().trim() &&
            review.rating === current.rating)
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      setReviews(uniqueReviews);
    } else {
      setReviews([]);
    }
  }, [initialReviews]);

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? totalReviews - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? totalReviews - 1 : prevIndex + 1));
  };

  // Calculate which reviews to show based on the active index
  const getVisibleReviews = () => {
    if (totalReviews === 0) return [];
    const result = [];
    const reviewsToShow = Math.min(visibleReviews, totalReviews);
    for (let i = 0; i < reviewsToShow; i++) {
      const index = (activeIndex + i) % totalReviews;
      if (reviews[index]) {
        result.push({
          ...reviews[index],
          displayIndex: i
        });
      }
    }
    return result;
  };

  const handleReviewSubmit = (review: { rating: number; content: string; name: string }) => {
    if (isSubmitting) return;

    // Check for duplicate review before submitting
    const isDuplicate = reviews.some(
      existingReview => 
        existingReview.content.toLowerCase().trim() === review.content.toLowerCase().trim() &&
        existingReview.name.toLowerCase().trim() === review.name.toLowerCase().trim() &&
        existingReview.rating === review.rating
    );

    if (isDuplicate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "A similar review already exists!"
      });
      return;
    }

    if (onSubmit) {
      onSubmit(review);
    }
  };

  // If no reviews, show a message
  if (totalReviews === 0) {
    return (
      <div className="py-8 sm:py-12">
        <div className="flex justify-start mb-6 sm:mb-8">
          <Button 
            className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
            onClick={() => setIsReviewDialogOpen(true)}
            disabled={isSubmitting}
          >
            <MessageSquare className="h-4 w-4" />
            Write a Review
          </Button>
        </div>
        <div className="text-center p-8 sm:p-12 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-[#5A8DB8]/10 shadow-sm hover:shadow-md transition-all duration-300">
          <MessageSquare className="h-12 w-12 text-[#5A8DB8]/30 mx-auto mb-4" />
          <p className="text-gray-600 text-base sm:text-lg">No reviews yet. Be the first to write a review!</p>
        </div>

        <ReviewDialog
          isOpen={isReviewDialogOpen}
          onClose={() => setIsReviewDialogOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-start mb-6 sm:mb-8">
        <Button 
          className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
          onClick={() => setIsReviewDialogOpen(true)}
          disabled={isSubmitting}
        >
          <MessageSquare className="h-4 w-4" />
          Write a Review
        </Button>
      </div>
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {getVisibleReviews().map((review) => (
          <ReviewCard key={`${review.id}-${review.displayIndex}`} review={review} />
        ))}
      </div>

      {/* Mobile version - show only one review */}
      <div className="md:hidden">
        {reviews[activeIndex] && (
          <ReviewCard 
            key={`${reviews[activeIndex].id}-mobile`} 
            review={reviews[activeIndex]} 
          />
        )}
      </div>

      {/* Navigation buttons */}
      {totalReviews > 1 && (
        <div className="flex justify-between mt-6 sm:mt-8">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -left-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -right-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="border border-[#5A8DB8]/10 bg-gradient-to-br from-white to-gray-50 h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A8DB8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-[#5A8DB8]/10 to-[#3C5979]/10 rounded-full">
            <User className="h-5 w-5 text-[#5A8DB8]" />
          </div>
          <h3 className="font-semibold text-[#5A8DB8] text-base">{review.name}</h3>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4 transition-all duration-300",
                  i < review.rating 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-200"
                )}
              />
            ))}
          </div>
          {review.timestamp && (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Calendar className="h-3 w-3" />
              <span>{review.timestamp}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-start gap-3">
          <MessageSquare className="h-4 w-4 text-[#5A8DB8] mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCarousel;