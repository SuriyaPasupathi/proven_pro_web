import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MessageSquare, Calendar, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Pagination settings
  const reviewsPerPage = 3; // Number of reviews per page
  const totalReviews = reviews.length;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

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
      // Reset to first page when reviews change
      setCurrentPage(1);
    } else {
      setReviews([]);
      setCurrentPage(1);
    }
  }, [initialReviews]);

  // Get current page reviews
  const getCurrentPageReviews = () => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return reviews.slice(startIndex, endIndex);
  };

  // Navigation functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
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
            className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base"
            onClick={() => setIsReviewDialogOpen(true)}
            disabled={isSubmitting}
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

  const currentPageReviews = getCurrentPageReviews();
  const pageNumbers = getPageNumbers();

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4 xs:mb-6 sm:mb-8">
        <Button 
          className="bg-[#5A8DB8] hover:bg-[#3C5979] text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm sm:text-base"
          onClick={() => setIsReviewDialogOpen(true)}
          disabled={isSubmitting}
        >
          <MessageSquare className="h-3 w-3 xs:h-4 xs:w-4" />
          Reviews
        </Button>
        
        {/* Reviews count and page info */}
        <div className="text-sm text-gray-600">
          <span className="hidden sm:inline">Showing </span>
          <span className="font-medium text-[#5A8DB8]">
            {((currentPage - 1) * reviewsPerPage) + 1}-{Math.min(currentPage * reviewsPerPage, totalReviews)}
          </span>
          <span className="hidden sm:inline"> of {totalReviews} reviews</span>
          <span className="sm:hidden"> • {totalReviews} total</span>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 lg:gap-8 mb-6">
        {currentPageReviews.map((review, index) => (
          <ReviewCard 
            key={`${review.id}-${currentPage}-${index}`} 
            review={review} 
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          {/* Page info for mobile */}
          <div className="sm:hidden text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1 xs:gap-2">
            {/* First page button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 xs:h-10 xs:w-10 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>

            {/* Previous page button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 xs:h-10 xs:w-10 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-8 w-8 xs:h-10 xs:w-10 text-xs xs:text-sm font-medium transition-all duration-300",
                    currentPage === pageNum
                      ? "bg-[#5A8DB8] text-white shadow-md"
                      : "bg-white border border-[#5A8DB8]/20 text-[#5A8DB8] hover:bg-[#5A8DB8]/10"
                  )}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            {/* Next page button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 xs:h-10 xs:w-10 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>

            {/* Last page button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 xs:h-10 xs:w-10 bg-white border border-[#5A8DB8]/20 shadow-sm hover:bg-[#5A8DB8]/10 hover:text-[#5A8DB8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          </div>

          {/* Page info for desktop */}
          <div className="hidden sm:block text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
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
    <Card className="border border-black transition-all duration-300 hover:shadow-lg hover:scale-[1.02] relative overflow-hidden group rounded-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A8DB8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 relative h-full flex flex-col">
        {/* Header with user info */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-1.5 xs:mb-2 sm:mb-3">
          {/* <div className="p-1 xs:p-1.5 sm:p-2 bg-gradient-to-br from-[#5A8DB8]/10 to-[#3C5979]/10 rounded-full">
            <User className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-[#5A8DB8]" />
          </div> */}
          <h3 className="font-semibold  xs:text-xs sm:text-sm md:text-base truncate">{review.name}</h3>
        </div>
        
        {/* Rating and timestamp section */}
        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-1.5 sm:gap-2 mb-2 xs:mb-2.5 sm:mb-3">
          <div className="flex items-center gap-1 xs:gap-1.5">
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
              {/* <MessageSquare className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-[#5A8DB8] mt-0.5 xs:mt-1 flex-shrink-0" /> */}
          <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-600 line-clamp-3 xs:line-clamp-4 sm:line-clamp-5 md:line-clamp-6 leading-tight xs:leading-relaxed">{review.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCarousel;