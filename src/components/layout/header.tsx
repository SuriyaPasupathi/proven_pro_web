import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <div className="hidden md:block md:ml-6 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#5A8DB8]">
            <Input placeholder="Search..." className="bg-gray-100" />
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
