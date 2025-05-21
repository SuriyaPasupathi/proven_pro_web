import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface Review {
  id: number;
  name: string;
  company: string;
  rating: number;
  content: string;
}

interface ReviewCarouselProps {
  reviews?: Review[];
}

const ReviewCarousel: React.FC<ReviewCarouselProps> = ({ reviews = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleReviews = 3; // Number of reviews visible at once on desktop
  const totalReviews = reviews.length;

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? totalReviews - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === totalReviews - 1 ? 0 : prevIndex + 1));
  };

  // Calculate which reviews to show based on the active index
  const getVisibleReviews = () => {
    const result = [];
    for (let i = 0; i < visibleReviews; i++) {
      const index = (activeIndex + i) % totalReviews;
      result.push(reviews[index]);
    }
    return result;
  };

  // If no reviews, show a message
  if (totalReviews === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to write a review!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {getVisibleReviews().map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Mobile version - show only one review */}
      <div className="md:hidden">
        <ReviewCard review={reviews[activeIndex]} />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center md:justify-between w-full mt-6 md:mt-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -left-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border shadow-sm"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 -right-4 -translate-y-1/2 md:static md:translate-y-0 bg-white border shadow-sm"
          onClick={goToNext}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
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
          <p className="text-sm text-muted-foreground">{review.company}</p>
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