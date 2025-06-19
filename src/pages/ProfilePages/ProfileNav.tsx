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
    <header className="w-full border-b border-gray-200/50 bg-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] sticky top-0 z-50">
      <div className="w-11/12 mx-auto px-4 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center justify-between relative">
        {/* Premium Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5A8DB8]/5 via-transparent to-[#3C5979]/5 opacity-30"></div>
        
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto relative">
          <div 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <img src={logo  } alt="ProvenPro Logo" className="relative w-6 h-6 sm:w-8 sm:h-8 transform group-hover:scale-105 transition-transform duration-300"
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

        {/* Right: Navigation Items */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <button
            type="button"
            className="relative px-0 py-0 focus:outline-none group"
            onClick={() => navigate('/plans')}
          >
            <span className="relative z-10 text-black">Pricing</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
          <button
            type="button"
            className="relative px-0 py-0 focus:outline-none group"
            onClick={() => navigate('/contact')}
          >
            <span className="relative z-10 text-black">Contact Us</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
          <NotificationSheet />
          
          {/* Account */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-50/80 transition-all duration-200 group"
              onClick={() => setIsAccountOpen(!isAccountOpen)}
            >
              {profileData?.profile_pic ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-full blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <img 
                    src={profileData.profile_pic} 
                    alt={`${profileData.first_name} ${profileData.last_name}`}
                    className="relative h-8 w-8 rounded-full object-cover ring-2 ring-gray-200/50 group-hover:ring-[#5A8DB8]/40 transition-all duration-200"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-full blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                  <div className="relative h-8 w-8 rounded-full bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] flex items-center justify-center text-white ring-2 ring-gray-200/50 group-hover:ring-[#5A8DB8]/40 transition-all duration-200">
                    <span className="text-sm font-medium">{getUserInitials()}</span>
                  </div>
                </div>
              )}
              <ChevronDown className="h-4 w-4 text-gray-600 transition-transform duration-200" style={{ transform: isAccountOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </Button>
            {isAccountOpen && <AccountDropdown closeDropdown={() => setIsAccountOpen(false)} />}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
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
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-900 hover:text-[#3C5979] hover:bg-gray-50/80 transition-all duration-200 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              {isMenuOpen ? <X className="relative w-5 h-5" /> : <Menu className="relative w-5 h-5" />}
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
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
        <div className="md:hidden bg-white border-t border-gray-200/50 shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="text-left text-black hover:text-[#3C5979] hover:bg-gray-50/80 justify-start transition-all duration-200 group"
                onClick={() => {
                  setIsReviewDialogOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <span className="relative z-10">Write a Review</span>
                <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Button>
              <Button 
                variant="ghost" 
                className="text-left text-black hover:text-[#3C5979] hover:bg-gray-50/80 justify-start transition-all duration-200 group"
                onClick={() => {
                  navigate('/plans');
                  setIsMenuOpen(false);
                }}
              >
                <span className="relative z-10">Pricing</span>
                <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Button>
              <Button 
                variant="ghost" 
                className="text-left text-black hover:text-[#3C5979] hover:bg-gray-50/80 justify-start transition-all duration-200 group"
                onClick={() => {
                  navigate('/contact');
                  setIsMenuOpen(false);
                }}
              >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Button>
              
              {/* Mobile Account Section */}
              <div className="pt-2 border-t border-gray-200/50">
                <div className="px-4 py-2">
                  <div className="font-medium text-gray-900">
                    {profileData?.first_name && profileData?.last_name 
                      ? `${profileData.first_name} ${profileData.last_name}`
                      : 'User'}
                  </div>
                  <div className="text-sm text-gray-500">{localStorage.getItem('user_email') || ''}</div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-black hover:text-[#3C5979] hover:bg-gray-50/80 transition-all duration-200 group"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsEditMode(false);
                    navigate('/profile');
                  }}
                >
                  <span className="relative z-10">My Profile</span>
                  <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-black hover:text-[#3C5979] hover:bg-gray-50/80 transition-all duration-200 group"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsEditMode(true);
                    setTimeout(() => {
                      navigate('/profile');
                    }, 0);
                  }}
                >
                  <span className="relative z-10">Edit Profile</span>
                  <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-black hover:text-[#3C5979] hover:bg-gray-50/80 transition-all duration-200 group"
                  onClick={() => {
                    navigate('/profile/verification');
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="relative z-10">Verification</span>
                  <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-black hover:text-[#3C5979] hover:bg-gray-50/80 transition-all duration-200 group"
                  onClick={() => {
                    navigate('/profile/membership-plans');
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="relative z-10">Membership Plan</span>
                  <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-black hover:text-[#3C5979] hover:bg-gray-50/80 transition-all duration-200 group"
                  onClick={() => {
                    navigate('/profile/account-settings');
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="relative z-10">Account Settings</span>
                  <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 group"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="relative z-10">Log out</span>
                  <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
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
