import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

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
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
