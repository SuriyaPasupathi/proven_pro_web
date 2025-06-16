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
      <footer className="bg-gradient-to-br from-[#3C5979] to-[#5A8DB8] text-white pt-6 sm:pt-8 pb-4 px-4 flex flex-col items-center sm:hidden relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative z-10 w-full max-w-xs">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <img
              src={logo}
              alt="ProvenPro Logo"
              className="h-7 w-7 sm:h-8 sm:w-8 mr-2"
            />
            <span className="text-lg sm:text-xl font-bold">ProvenPro</span>
          </div>
          <div className="flex justify-center gap-6 sm:gap-8 mb-4 sm:mb-6">
            <a href="#" className="text-sm hover:text-white/90 transition-colors duration-300">Terms</a>
            <a href="#" className="text-sm hover:text-white/90 transition-colors duration-300">Privacy</a>
            <a href="#" className="text-sm hover:text-white/90 transition-colors duration-300">Contact</a>
          </div>
          <div className="text-[10px] sm:text-xs text-white/80 text-center">© 2025 ProvenPro. All rights reserved.</div>
        </div>
      </footer>

      {/* Full Footer for sm and up */}
      <footer className="bg-gradient-to-br from-[#3C5979] to-[#5A8DB8] text-white pt-6 sm:pt-8 md:pt-10 pb-2 sm:pb-4 px-4 sm:px-6 md:px-8 hidden sm:block relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row md:items-start md:justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10">
          {/* Logo and Newsletter */}
          <div className="flex-1 min-w-[200px] sm:min-w-[240px] md:min-w-[280px]">
            <div className="flex items-center mb-4 sm:mb-6 md:mb-8">
              <img
                src={logo}
                alt="ProvenPro Logo"
                className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 mr-2"
              />
              <span className="text-lg sm:text-xl md:text-2xl font-bold">Proven<span className="font-normal">Pro</span></span>
            </div>
            <form className="flex mb-6 sm:mb-8 max-w-xs w-full group">
              <Input
                type="email"
                placeholder="Your email here"
                className="rounded-none rounded-l-md focus:ring-0 text-gray-100 text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 bg-white/10 border-white/20 placeholder:text-white/60 focus:border-white/40 transition-colors duration-300"
              />
              <Button
                type="submit"
                className="rounded-none rounded-r-md bg-white hover:bg-white/90 text-[#3C5979] font-semibold px-3 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Join
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="flex-1 min-w-[140px] sm:min-w-[160px] md:min-w-[180px] mb-4 sm:mb-6 md:mb-0">
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base">
              <li><a href="#" className="hover:text-white/90 transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-white/90 transition-colors duration-300">Contact Us</a></li>
              <li><a href="#" className="hover:text-white/90 transition-colors duration-300">Blog Posts</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex-1 min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Follow Us</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base">
              <li className="flex items-center gap-2 group">
                <FaFacebookF className="text-base sm:text-lg md:text-xl group-hover:text-white/90 transition-colors duration-300" /> 
                <a href="#" className="hover:text-white/90 transition-colors duration-300">Facebook</a>
              </li>
              <li className="flex items-center gap-2 group">
                <FaInstagram className="text-base sm:text-lg md:text-xl group-hover:text-white/90 transition-colors duration-300" /> 
                <a href="#" className="hover:text-white/90 transition-colors duration-300">Instagram</a>
              </li>
              <li className="flex items-center gap-2 group">
                <FaXTwitter className="text-base sm:text-lg md:text-xl group-hover:text-white/90 transition-colors duration-300" /> 
                <a href="#" className="hover:text-white/90 transition-colors duration-300">X</a>
              </li>
              <li className="flex items-center gap-2 group">
                <FaLinkedinIn className="text-base sm:text-lg md:text-xl group-hover:text-white/90 transition-colors duration-300" /> 
                <a href="#" className="hover:text-white/90 transition-colors duration-300">LinkedIn</a>
              </li>
              <li className="flex items-center gap-2 group">
                <FaYoutube className="text-base sm:text-lg md:text-xl group-hover:text-white/90 transition-colors duration-300" /> 
                <a href="#" className="hover:text-white/90 transition-colors duration-300">YouTube</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-4 sm:my-6 md:my-8 relative z-10"></div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs gap-3 sm:gap-4 text-white/80 px-2 sm:px-0 relative z-10">
          <div className="text-[10px] sm:text-xs md:text-sm">© 2025 ProvenPro.com All rights reserved.</div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
            <a href="#" className="text-[10px] sm:text-xs md:text-sm hover:text-white/90 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-[10px] sm:text-xs md:text-sm hover:text-white/90 transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-[10px] sm:text-xs md:text-sm hover:text-white/90 transition-colors duration-300">Cookies Settings</a>
          </div>
        </div>
      </footer>
    </>
  );
}
