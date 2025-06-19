import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import ReviewDialog from '../ReviewDialog';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  shareToken?: string;
  profileId?: string;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen, shareToken, profileId }: NavbarProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Navigate to home page
    navigate('/');
  };

  const handleReviewSubmit = (review: { rating: number; content: string; name: string }) => {
    // Handle review submission here
    console.log('Review submitted:', review);
    // You can add API call here to submit the review
  };

  return (
    <header className="w-full border-b border-gray-200/50 bg-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] sticky top-0 z-50">
      <div className="w-11/12 mx-auto px-4 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center justify-between relative">
        {/* Premium Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5A8DB8]/5 via-transparent to-[#3C5979]/5 opacity-30"></div>
        
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto relative">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0" 
            onClick={handleLogoClick}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <img 
                src={logo} 
                alt="ProvenPro Logo" 
                className="relative w-6 h-6 sm:w-8 sm:h-8 transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error('Failed to load logo image:', e);
                  // Try fallback to the alternative logo
                  e.currentTarget.src = '../../../assets/logo 2.png';
                  e.currentTarget.onerror = () => {
                    console.error('Both logo files failed to load');
                    e.currentTarget.style.display = 'none';
                  };
                }}
                onLoad={() => {
                  console.log('Logo loaded successfully');
                }}
              />
            </div>
            <span className="text-base sm:text-lg font-semibold bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent">
              Proven<span className="font-light">Pro</span>
            </span>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block md:ml-4 lg:ml-6 w-full max-w-xs relative">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-8 sm:pl-9 h-8 sm:h-9 text-sm bg-white border-gray-200/50 shadow-sm focus:shadow-md transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Navigation Links & Mobile Actions */}
        <div className="flex items-center gap-4 lg:gap-6 relative">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-4 lg:gap-6 text-xs sm:text-sm font-semibold text-black relative">
            <button
              type="button"
              className="relative px-0 py-0 focus:outline-none group"
              onClick={() => setIsReviewDialogOpen(true)}
            >
              <span className="relative z-10">Write a Review</span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
            <button
              type="button"
              className="relative px-0 py-0 focus:outline-none group"
              onClick={() => navigate('/plans')}
            >
              <span className="relative z-10">Pricing</span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
            <button
              type="button"
              className="relative px-0 py-0 focus:outline-none group"
              onClick={() => navigate('/contact')}
            >
              <span className="relative z-10">Contact Us</span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2 relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-900 hover:text-[#3C5979] hover:bg-gray-50/80 transition-all duration-200 group"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              aria-label="Search"
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <Search className="relative w-5 h-5" />
              </div>
            </Button>
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-blue-900 hover:text-[#3C5979] hover:bg-gray-50/80 transform group-hover:scale-110 transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search - Slides down when active */}
      {isSearchVisible && (
        <div className="md:hidden px-4 py-3 border-t border-gray-200/50 bg-white">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 bg-white border-gray-200/50 shadow-sm focus:shadow-md transition-all duration-300 w-full"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200/50 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-black relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#5A8DB8]/5 to-transparent opacity-30"></div>
          <div className="relative">
            <button
              type="button"
              className="w-full text-left px-2 py-1 rounded-lg hover:bg-gray-50/80 transition-colors duration-200"
              onClick={() => {
                setIsReviewDialogOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Write a Review
            </button>
            <button
              type="button"
              className="w-full text-left px-2 py-1 rounded-lg hover:bg-gray-50/80 transition-colors duration-200"
              onClick={() => {
                navigate('/plans');
                setIsMenuOpen(false);
              }}
            >
              Pricing
            </button>
            <button
              type="button"
              className="w-full text-left px-2 py-1 rounded-lg hover:bg-gray-50/80 transition-colors duration-200"
              onClick={() => {
                navigate('/contact');
                setIsMenuOpen(false);
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
        shareToken={shareToken}
        profileId={profileId}
      />
    </header>
  );
};

export default Navbar;
