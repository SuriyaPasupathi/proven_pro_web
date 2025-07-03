import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import logo from "../../assets/logo.png";
import logoFallback from "../../assets/logo 2.png";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { searchUsers } from "@/store/Services/CreateProfileService";
import { clearSearchResults } from "@/store/Slice/CreateProfileSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { RootState } from "@/store/store";



export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { searchResults, searchError } = useAppSelector((state: RootState) => state.createProfile);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch) {
        setIsSearching(true);
        try {
          await dispatch(searchUsers({ 
            search: debouncedSearch,
            limit: 10 // Limit results for better performance
          })).unwrap();
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        dispatch(clearSearchResults());
      }
    };

    performSearch();
  }, [debouncedSearch, dispatch]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value) {
      dispatch(clearSearchResults());
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    setSearchQuery("");
    dispatch(clearSearchResults());
  };

  return (
    <header className="w-full border-b border-gray-200/50 bg-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] sticky top-0 z-50">
      <div className="w-11/12 mx-auto px-4 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center justify-between relative">
        {/* Premium Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5A8DB8]/5 via-transparent to-[#3C5979]/5 opacity-30"></div>
        
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 relative">
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <img 
                src={logo} 
                alt="ProvenPro Logo" 
                className="relative w-6 h-6 sm:w-8 sm:h-8 transform group-hover:scale-105 transition-transform duration-300 block rounded-lg"
                style={{ minWidth: '24px', minHeight: '24px' }}
                onError={(e) => {
                  console.error('Failed to load logo image:', e);
                  console.log('Attempting to load fallback logo...');
                  // Try fallback to the alternative logo
                  e.currentTarget.src = logoFallback;
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
          <div className="hidden md:block md:ml-4 lg:ml-6 flex-1 max-w-xs relative">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-8 sm:pl-9 h-8 sm:h-9 text-sm bg-white border-gray-200/50 shadow-sm focus:shadow-md transition-all duration-300"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            
            {/* Search Results Dropdown */}
            {searchQuery && (searchResults.length > 0 || isSearching) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-200/50 max-h-[280px] sm:max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-3 sm:p-4 text-center text-sm text-gray-500">Searching...</div>
                ) : searchError ? (
                  <div className="p-3 sm:p-4 text-center text-sm text-red-500">{searchError.message}</div>
                ) : (
                  searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-2.5 sm:p-3 hover:bg-gray-50/80 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <div className="font-medium text-sm sm:text-base text-gray-900">{user.username}</div>
                      {user.bio && (
                        <div className="text-xs sm:text-sm text-gray-500 truncate">{user.bio}</div>
                      )}
                      <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Rating: {(user.avg_rating || 0).toFixed(1)} ({user.total_reviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden flex-1 mx-4 relative">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input 
                placeholder="Search users..." 
                className="pl-8 h-8 text-sm bg-white border-gray-200/50 shadow-sm focus:shadow-md transition-all duration-300"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          {/* Mobile Search Results Dropdown */}
          {searchQuery && (searchResults.length > 0 || isSearching) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-200/50 max-h-64 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-3 text-center text-sm text-gray-500">Searching...</div>
              ) : searchError ? (
                <div className="p-3 text-center text-sm text-red-500">{searchError.message}</div>
              ) : (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="p-2.5 hover:bg-gray-50/80 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                    onClick={() => handleUserClick(user.id)}
                  >
                    <div className="font-medium text-sm text-gray-900">{user.username}</div>
                    {user.bio && (
                      <div className="text-xs text-gray-500 truncate">{user.bio}</div>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">
                        Rating: {(user.avg_rating || 0).toFixed(1)} ({user.total_reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Middle: Nav Links (Desktop) */}
        <nav className="hidden md:flex gap-4 lg:gap-6 mx-auto text-xs sm:text-sm font-semibold text-black relative">
          <button
            type="button"
            className="relative px-0 py-0 focus:outline-none group"
            onClick={() => navigate('/reviews')}
          >
            <span className="relative z-10">Write a Review</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
          <button
            type="button"
            className="relative px-0 py-0 focus:outline-none group"
            onClick={() => {
              navigate('/plans');
              const el = document.getElementById("plans-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="relative z-10">Pricing</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
          <button
            type="button"
            className="relative px-0 py-0 focus:outline-none group"
            onClick={() => {
              navigate('/contact');
              const el = document.getElementById("contact-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="relative z-10">Contact Us</span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </button>
        </nav>

        {/* Right: Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3 sm:gap-4 relative">
          <Button
            variant="default"
            className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm bg-[#5A8DB8] hover:bg-[#3C5979] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-300"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
          <Button
            variant="default"
            className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm bg-[#5A8DB8] hover:bg-[#3C5979] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-300"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile: Menu Icon */}
        <div className="md:hidden relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
          <Menu className="relative w-5 h-5 sm:w-6 sm:h-6 text-blue-900 cursor-pointer transform group-hover:scale-110 transition-transform duration-300" onClick={toggleMenu} />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200/50 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-black relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#5A8DB8]/5 to-transparent opacity-30"></div>
          <div className="relative">
            <button
              type="button"
              className="w-full text-left px-2 py-1 rounded-lg hover:bg-gray-50/80 transition-colors duration-200"
              onClick={() => navigate('/reviews')}
            >
              Write a Review
            </button>
            <button
              type="button"
              className="w-full text-left px-2 py-1 rounded-lg hover:bg-gray-50/80 transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                const el = document.getElementById("plans-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pricing
            </button>
            <button
              type="button"
              className="w-full text-left px-2 py-1 rounded-lg hover:bg-gray-50/80 transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                const el = document.getElementById("contact-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact Us
            </button>

            {/* Auth Buttons Mobile */}
            <Button
              className="w-full h-8 sm:h-9 text-xs sm:text-sm bg-[#5A8DB8] hover:bg-[#3C5979] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-300 mt-2"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
            >
              Sign in
            </Button>
            <Button
              className="w-full h-8 sm:h-9 text-xs sm:text-sm bg-[#5A8DB8] hover:bg-[#3C5979] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-300 mt-2"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/signup");
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
