import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
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
      // Remove duplicate reviews based on content and name
      const uniqueReviews = initialReviews.reduce((acc: Review[], current) => {
        const isDuplicate = acc.some(
          review => 
            review.content.toLowerCase().trim() === current.content.toLowerCase().trim() &&
            review.name.toLowerCase().trim() === current.name.toLowerCase().trim()
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      if (uniqueReviews.length !== initialReviews.length) {
        setReviews(uniqueReviews);
      } else {
        setReviews(initialReviews);
      }
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
    for (let i = 0; i < visibleReviews; i++) {
      const index = (activeIndex + i) % totalReviews;
      if (reviews[index]) {
        result.push({
          ...reviews[index],
          displayIndex: i // Add a unique display index for key
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
        existingReview.name.toLowerCase().trim() === review.name.toLowerCase().trim()
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
      <div className="py-6 sm:py-8">
        <div className="flex justify-start mb-4 sm:mb-6">
          <Button 
            className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition-all duration-300 shadow-sm hover:shadow-md"
            onClick={() => {
              setIsReviewDialogOpen(true);
            }}
            disabled={isSubmitting}
          >
            Write a Review
          </Button>
        </div>
        <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-[#5A8DB8]/10 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-gray-600 text-sm sm:text-base">No reviews yet. Be the first to write a review!</p>
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
      <div className="flex justify-start mb-4 sm:mb-6">
        <Button 
          className="bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] hover:from-[#3C5979] hover:to-[#5A8DB8] text-white transition-all duration-300 shadow-sm hover:shadow-md"
          onClick={() => {
            setIsReviewDialogOpen(true);
          }}
          disabled={isSubmitting}
        >
          Write a Review
        </Button>
      </div>
      <div className="hidden md:grid md:grid-cols-3 gap-4 sm:gap-6">
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
        <div className="flex justify-between mt-4 sm:mt-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -left-2 sm:-left-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 -right-2 sm:-right-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
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
    <Card className="border border-[#5A8DB8]/10 bg-gradient-to-br from-gray-50 to-white h-full transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <h3 className="font-medium text-[#5A8DB8] text-sm sm:text-base">{review.name}</h3>
        </div>
        
        <div className="flex mb-2 sm:mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3 sm:h-4 sm:w-4 mr-0.5 transition-all duration-300",
                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              )}
            />
          ))}
        </div>
        
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{review.content}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCarousel;