import { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AccountDropdown from './AccountDropdown';
import logo from '../../assets/logo.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profileData } = useSelector((state: RootState) => state.createProfile);

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

  return (
    <header className="border-b bg-white sticky top-0 z-50 w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center w-full md:w-auto gap-4">
            {/* Logo Section */}
            <div className="flex items-center gap-2 shrink-0 cursor-pointer">
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
            <Button variant="link" className="text-gray-800 hover:text-blue-700 underline underline-offset-4 decoration-blue-700">
              Write a Review
            </Button>
            <Button variant="link" className="text-gray-800 hover:text-blue-700">
              Pricing
            </Button>
            <Button variant="link" className="text-gray-800 hover:text-blue-700">
              Contact Us
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>

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
              {isAccountOpen && <AccountDropdown />}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-8 bg-gray-100 border-gray-200 w-full"
              />
            </div>
            <nav className="flex flex-col space-y-2">
              <Button variant="ghost" className="text-left text-gray-800 hover:text-blue-700">
                Write a Review
              </Button>
              <Button variant="ghost" className="text-left text-gray-800 hover:text-blue-700">
                Pricing
              </Button>
              <Button variant="ghost" className="text-left text-gray-800 hover:text-blue-700">
                Contact Us
              </Button>
              <Button variant="ghost" className="text-left text-gray-800 hover:text-blue-700">
                Account
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
