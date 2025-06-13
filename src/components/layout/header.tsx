import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { searchUsers } from "@/store/Services/CreateProfileService";
import { clearSearchResults } from "@/store/Slice/CreateProfileSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { RootState } from "@/store/store";

interface SearchUser {
  id: string;
  username: string;
  bio: string;
  primary_tools: string[];
  technical_skills: string[];
  max_individual_rating: number;
  total_reviews: number;
  avg_rating: number;
}

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
    <header className="w-full border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src={logo} alt="ProvenPro Logo" className="w-8 h-8" />
            <span className="text-lg font-semibold text-blue-900">
              Proven<span className="font-light">Pro</span>
            </span>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block md:ml-6 w-full max-w-xs relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search users..." 
                className="pl-9 bg-gray-100"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            {/* Search Results Dropdown */}
            {searchQuery && (searchResults.length > 0 || isSearching) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : searchError ? (
                  <div className="p-4 text-center text-red-500">{searchError.message}</div>
                ) : (
                  searchResults.map((user: SearchUser) => (
                    <div
                      key={user.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <div className="font-medium text-gray-900">{user.username}</div>
                      {user.bio && (
                        <div className="text-sm text-gray-500 truncate">{user.bio}</div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
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

        {/* Middle: Nav Links (Desktop) */}
        <nav className="hidden md:flex gap-6 mx-auto text-sm font-semibold text-black">
          <button
            type="button"
            className="border-b-2 border-[#5A8DB8] bg-transparent px-0 py-0 focus:outline-none"
            onClick={() => navigate('/reviews')}
          >
            Write a Review
          </button>
          <button
            type="button"
            className="bg-transparent px-0 py-0 focus:outline-none"
            onClick={() => {
              navigate('/plans');
              const el = document.getElementById("plans-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Pricing
          </button>
          <button
            type="button"
            className="bg-transparent px-0 py-0 focus:outline-none"
            onClick={() => {
              navigate('/contact');
              const el = document.getElementById("contact-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Contact Us
          </button>
        </nav>

        {/* Right: Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="default"
            className="bg-[#5A8DB8] text-white hover:bg-[#3C5979]"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
          <Button
            variant="default"
            className="bg-[#5A8DB8] text-white hover:bg-[#3C5979]"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile: Menu Icon */}
        <div className="md:hidden">
          <Menu className="w-6 h-6 text-blue-900 cursor-pointer" onClick={toggleMenu} />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 text-sm font-semibold text-black">
          <button
            type="button"
            className="border-b-2 border-blue-900 bg-transparent px-0 py-0 focus:outline-none"
            onClick={() => navigate('/reviews')}
          >
            Write a Review
          </button>
          <button
            type="button"
            className="bg-transparent px-0 py-0 focus:outline-none"
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
            className="bg-transparent px-0 py-0 focus:outline-none"
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
            className="w-full bg-[#5A8DB8] text-white hover:bg-[#3C5979]"
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/login");
            }}
          >
            Sign in
          </Button>
          <Button
            className="w-full bg-[#5A8DB8] text-white hover:bg-[#3C5979]"
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/signup");
            }}
          >
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
}
