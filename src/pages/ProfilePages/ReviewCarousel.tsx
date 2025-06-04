import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import ReviewDialog from './ReviewDialog';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const visibleReviews = 3; // Number of reviews visible at once on desktop
  const totalReviews = initialReviews.length;

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? totalReviews - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? totalReviews - 1 : prevIndex + 1));
  };

  // Calculate which reviews to show based on the active index
  const getVisibleReviews = () => {
    const result = [];
    for (let i = 0; i < visibleReviews; i++) {
      const index = (activeIndex + i) % totalReviews;
      result.push(initialReviews[index]);
    }
    return result;
  };

  const handleReviewSubmit = (review: { rating: number; content: string; name: string }) => {
    if (isSubmitting) return;

    if (onSubmit) {
      onSubmit(review);
    }
  };

  // If no reviews, show a message
  if (totalReviews === 0) {
    return (
      <div className="py-8">
        <div className="flex justify-start mb-4">
          <Button 
            className="bg-[#70a4d8] hover:bg-[#3C5979] text-white"
            onClick={() => {
              setIsReviewDialogOpen(true);
            }}
            disabled={isSubmitting}
          >
            Write a Review
          </Button>
        </div>
        <div className="text-center">
          <p className="text-gray-500">No reviews yet. Be the first to write a review!</p>
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
      <div className="flex justify-start mb-6">
        <Button 
          className="bg-[#70a4d8] hover:bg-[#3C5979] text-white"
          onClick={() => {
            setIsReviewDialogOpen(true);
          }}
          disabled={isSubmitting}
        >
          Write a Review
        </Button>
      </div>
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {getVisibleReviews().map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>

      {/* Mobile version - show only one review */}
      <div className="md:hidden">
        <ReviewCard review={initialReviews[activeIndex]} />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -left-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border shadow-sm"
          onClick={goToPrevious}
          disabled={totalReviews <= 1}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -right-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border shadow-sm"
          onClick={goToNext}
          disabled={totalReviews <= 1}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

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
    <Card className="border-gray-200 h-full transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-medium">{review.name}</h3>
        </div>
        
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4 mr-0.5",
                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              )}
            />
          ))}
        </div>
        
        <p className="text-sm">{review.content}</p>
      </CardContent>
    </Card>
  );
};

export default ReviewCarousel;