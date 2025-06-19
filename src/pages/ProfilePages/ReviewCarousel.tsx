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
      <div className="py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="flex justify-start mb-4 xs:mb-6 sm:mb-8">
          <Button 
            className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base"
            // onClick={() => setIsReviewDialogOpen(true)}
            // disabled={isSubmitting}
          >
            <MessageSquare className="h-3 w-3 xs:h-4 xs:w-4" />
            Reviews
          </Button>
        </div>
        <div className="text-center p-6 xs:p-8 sm:p-10 md:p-12 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-[#5A8DB8]/10 shadow-sm hover:shadow-md transition-all duration-300">
          <MessageSquare className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 text-[#5A8DB8]/30 mx-auto mb-3 xs:mb-4" />
          <p className="text-gray-600 text-sm xs:text-base sm:text-lg md:text-xl">No reviews yet. Be the first to write a review!</p>
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
      <div className="flex justify-start mb-4 xs:mb-6 sm:mb-8">
        <Button 
          className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base"
            // onClick={() => setIsReviewDialogOpen(true)}
            // disabled={isSubmitting}
        >
          <MessageSquare className="h-3 w-3 xs:h-4 xs:w-4" />
          Reviews
        </Button>
      </div>
      <div className="hidden md:grid md:grid-cols-3 gap-4 xs:gap-6 lg:gap-8">
        {getVisibleReviews().map((review) => (
          <ReviewCard key={`${review.id}-${review.displayIndex}`} review={review} />
        ))}
      </div>

      {/* Tablet version - show 2 reviews */}
      <div className="hidden sm:block md:hidden">
        <div className="grid grid-cols-2 gap-4 xs:gap-6">
          {getVisibleReviews().slice(0, 2).map((review) => (
            <ReviewCard key={`${review.id}-${review.displayIndex}-tablet`} review={review} />
          ))}
        </div>
      </div>

      {/* Mobile version - show only one review */}
      <div className="sm:hidden">
        {reviews[activeIndex] && (
          <ReviewCard 
            key={`${reviews[activeIndex].id}-mobile`} 
            review={reviews[activeIndex]} 
          />
        )}
      </div>

      {/* Navigation buttons */}
      {totalReviews > 1 && (
        <div className="flex justify-between mt-4 xs:mt-6 sm:mt-8">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -left-2 xs:-left-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300 h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -right-2 xs:-right-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300 h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
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
    <Card className="border border-[#5A8DB8]/10 bg-gradient-to-br from-white to-gray-50 h-[160px] xs:h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A8DB8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 relative h-full flex flex-col">
        {/* Header with user info */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-1.5 xs:mb-2 sm:mb-3">
          <div className="p-1 xs:p-1.5 sm:p-2 bg-gradient-to-br from-[#5A8DB8]/10 to-[#3C5979]/10 rounded-full">
            <User className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-[#5A8DB8]" />
          </div>
          <h3 className="font-semibold text-[#5A8DB8] text-[10px] xs:text-xs sm:text-sm md:text-base truncate">{review.name}</h3>
        </div>
        
        {/* Rating and timestamp section */}
        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-1.5 sm:gap-2 mb-2 xs:mb-2.5 sm:mb-3">
          <div className="flex items-center gap-1 xs:gap-1.5">
            <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-[#5A8DB8]">Rating:</span>
            <div className="flex items-center gap-0.5 xs:gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-all duration-300",
                      i < review.rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-[#5A8DB8]">({review.rating}/5)</span>
            </div>
          </div>
         
         
         {review.timestamp && (
            <div className="flex items-center gap-1 text-gray-500 text-[9px] xs:text-[10px] sm:text-xs">
              <Calendar className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3" />
              <span className="truncate">{review.timestamp}</span>
            </div>
          )}
        </div>
        
        {/* Review content */}
        <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-2.5 flex-grow">
          <MessageSquare className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-[#5A8DB8] mt-0.5 xs:mt-1 flex-shrink-0" />
          <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-600 line-clamp-3 xs:line-clamp-4 sm:line-clamp-5 md:line-clamp-6 leading-tight xs:leading-relaxed">{review.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCarousel;