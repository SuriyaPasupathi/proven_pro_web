import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import logo from "../../../assets/logo.png";

export default function Footer() {
  return (
    <>
      {/* Minimal Mobile Footer */}
      <footer className="bg-[#466178] text-white pt-8 pb-4 px-4 flex flex-col items-center sm:hidden">
        <div className="flex items-center mb-6">
          <img
            src={logo}
            alt="ProvenPro Logo"
            className="h-8 w-8 mr-2 max-w-full"
          />
          <span className="text-xl font-bold">ProvenPro</span>
        </div>
        <div className="flex justify-center gap-8 mb-6">
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
        <div className="text-xs text-white/80">© 2025 ProvenPro. All rights reserved.</div>
      </footer>

      {/* Full Footer for sm and up */}
      <footer className="bg-[#466178] text-white pt-6 sm:pt-8 md:pt-10 pb-2 sm:pb-4 px-4 sm:px-6 md:px-8 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row md:items-start md:justify-between gap-8 sm:gap-10 md:gap-12">
          {/* Logo and Newsletter */}
          <div className="flex-1 min-w-[200px] sm:min-w-[240px] md:min-w-[280px]">
            <div className="flex items-center mb-4 sm:mb-6 md:mb-8">
              <img
                src={logo}
                alt="ProvenPro Logo"
                className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 mr-2 max-w-full"
              />
              <span className="text-lg sm:text-xl md:text-2xl font-bold">Proven<span className="font-normal">Pro</span></span>
            </div>
            <form className="flex mb-6 sm:mb-8 max-w-xs w-full">
              <Input
                type="email"
                placeholder="Your email here"
                className="rounded-none rounded-l-md focus:ring-0 text-gray-100 text-sm sm:text-base h-9 sm:h-10 md:h-11"
              />
              <Button
                type="submit"
                className="rounded-none rounded-r-md bg-white hover:bg-white text-[#466178] font-semibold px-3 sm:px-4 md:px-6 text-sm sm:text-base h-9 sm:h-10 md:h-11"
              >
                Join
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="flex-1 min-w-[140px] sm:min-w-[160px] md:min-w-[180px] mb-4 sm:mb-6 md:mb-0">
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg md:text-xl">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li><a href="#" className="hover:underline transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="hover:underline transition-colors duration-200">Blog Posts</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex-1 min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg md:text-xl">Follow Us</h4>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <li className="flex items-center gap-2">
                <FaFacebookF className="text-lg sm:text-xl" /> <a href="#" className="hover:underline transition-colors duration-200">Facebook</a>
              </li>
              <li className="flex items-center gap-2">
                <FaInstagram className="text-lg sm:text-xl" /> <a href="#" className="hover:underline transition-colors duration-200">Instagram</a>
              </li>
              <li className="flex items-center gap-2">
                <FaXTwitter className="text-lg sm:text-xl" /> <a href="#" className="hover:underline transition-colors duration-200">X</a>
              </li>
              <li className="flex items-center gap-2">
                <FaLinkedinIn className="text-lg sm:text-xl" /> <a href="#" className="hover:underline transition-colors duration-200">LinkedIn</a>
              </li>
              <li className="flex items-center gap-2">
                <FaYoutube className="text-lg sm:text-xl" /> <a href="#" className="hover:underline transition-colors duration-200">YouTube</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/30 my-4 sm:my-6 md:my-8"></div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs gap-3 sm:gap-4 text-white/80 px-2 sm:px-0">
          <div className="text-[11px] sm:text-xs md:text-sm">© 2025 ProvenPro.com All rights reserved.</div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
            <a href="#" className="hover:underline transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:underline transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:underline transition-colors duration-200">Cookies Settings</a>
          </div>
        </div>
      </footer>
    </>
  );
}
