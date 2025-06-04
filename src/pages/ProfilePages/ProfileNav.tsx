import { useState, useEffect, useRef } from 'react';
import { Search,ChevronDown, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AccountDropdown from './AccountDropdown';
import logo from '../../assets/logo.png';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store/store';
import NotificationSheet from "@/components/layout/notificationsheet";
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/Services/CreateProfileService';
import { toast } from 'sonner';
import { useEditMode } from '../../context/EditModeContext';
import ReviewDialog from '@/pages/ProfilePages/ReviewDialog';


interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profileData } = useSelector((state: RootState) => state.createProfile);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setIsEditMode } = useEditMode();

  const handleLogout = async () => {
    try {
      // First, attempt to call the logout API
      await dispatch(logout());
      
      // Clear all local storage items
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_email');
      
      toast.success('Logged out successfully', {
        description: 'You have been logged out of your account.',
        duration: 3000,
      });
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Even if the API call fails, clear local storage and redirect
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_email');
      
      toast.error('Logout failed', {
        description: 'There was an error logging out. Please try again.',
        duration: 4000,
      });
      
      navigate('/login');
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!profileData?.first_name || !profileData?.last_name) return 'U';
    return `${profileData.first_name[0]}${profileData.last_name[0]}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReviewSubmit = (review: { rating: number; content: string; name: string }) => {
    try {
      console.log('Review submitted:', review);
      toast.success('Review submitted successfully!', {
        description: 'Thank you for your feedback.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review', {
        description: 'Please try again later.',
        duration: 4000,
      });
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50 w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center w-full md:w-auto gap-4">
            {/* Logo Section */}
            <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <img src={logo} alt="ProvenPro Logo" className="w-8 h-8" />
              <span className="text-lg font-semibold text-blue-900">
                Proven<span className="font-light">Pro</span>
              </span>
            </div>

            {/* Search Bar - only shown on medium and up */}
            <div className="hidden md:block w-full max-w-sm lg:max-w-md xl:max-w-lg ml-6">
              <Input placeholder="Search..." className="bg-gray-100" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button 
              variant="link" 
              className="text-[#70a4d8] hover:text-[#597999]"
              onClick={() => setIsReviewDialogOpen(true)}
            >
              Write a Review
            </Button>
            <Button 
              variant="link" 
              className="text-[#70a4d8] hover:text-[#597999]"
              onClick={() => navigate('/plans')}
            >
              Pricing
            </Button>
            <Button 
              variant="link" 
              className="text-[#70a4d8] hover:text-[#597999]"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
            <NotificationSheet />

            {/* Account */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
              >
                {profileData?.profile_pic ? (
                  <img 
                    src={profileData.profile_pic} 
                    alt={`${profileData.first_name} ${profileData.last_name}`}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#88adc8] flex items-center justify-center text-white">
                    <span className="text-sm font-medium">{getUserInitials()}</span>
                  </div>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
                {isAccountOpen && <AccountDropdown closeDropdown={() => setIsAccountOpen(false)} />}
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Slides down when active */}
        {isSearchVisible && (
          <div className="md:hidden px-4 py-3 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 bg-gray-100 border-gray-200 w-full"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="text-left text-gray-800 hover:text-blue-700 justify-start"
                onClick={() => {
                  setIsReviewDialogOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                Write a Review
              </Button>
              <Button 
                variant="ghost" 
                className="text-left text-gray-800 hover:text-blue-700 justify-start"
                onClick={() => {
                  navigate('/plans');
                  setIsMenuOpen(false);
                }}
              >
                Pricing
              </Button>
              <Button 
                variant="ghost" 
                className="text-left text-gray-800 hover:text-blue-700 justify-start"
                onClick={() => {
                  navigate('/contact');
                  setIsMenuOpen(false);
                }}
              >
                Contact Us
              </Button>
              
              {/* Mobile Account Section */}
              <div className="pt-2 border-t">
                <div className="px-4 py-2">
                  <div className="font-medium">
                    {profileData?.first_name && profileData?.last_name 
                      ? `${profileData.first_name} ${profileData.last_name}`
                      : 'User'}
                  </div>
                  <div className="text-sm text-gray-500">{localStorage.getItem('user_email') || ''}</div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-800 hover:text-blue-700"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsEditMode(false);
                    navigate('/profile');
                  }}
                >
                  My Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-800 hover:text-blue-700"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsEditMode(true);
                    setTimeout(() => {
                      navigate('/profile');
                    }, 0);
                  }}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-800 hover:text-blue-700"
                  onClick={() => {
                    navigate('/profile/verification');
                    setIsMenuOpen(false);
                  }}
                >
                  Verification
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-800 hover:text-blue-700"
                  onClick={() => {
                    navigate('/profile/membership-plans');
                    setIsMenuOpen(false);
                  }}
                >
                  Membership Plan
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-800 hover:text-blue-700"
                  onClick={() => {
                    navigate('/profile/account-settings');
                    setIsMenuOpen(false);
                  }}
                >
                  Account Settings
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Log out
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </header>
  );
};

export default Navbar;
