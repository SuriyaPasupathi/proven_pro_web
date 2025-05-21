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
    <footer className="bg-[#466178] text-white pt-8 sm:pt-10 pb-2 sm:pb-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row md:items-start md:justify-between gap-6 sm:gap-8">
        {/* Logo and Newsletter */}
        <div className="flex-1 min-w-[180px] sm:min-w-[220px]">
          <div className="flex items-center mb-6 sm:mb-8">
            <img
              src={logo}
              alt="ProvenPro Logo"
              className="h-8 w-8 mr-2 max-w-full"
            />
            <span className="text-xl sm:text-2xl font-bold">Proven<span className="font-normal">Pro</span></span>
          </div>
          <form className="flex mb-6 sm:mb-8 max-w-xs w-full">
            <Input
              type="email"
              placeholder="Your email here"
              className="rounded-none rounded-l-md  focus:ring-0 text-gray-100 text-xs sm:text-base"
            />
            <Button
              type="submit"
              className="rounded-none rounded-r-md bg-white hover:bg-white text-[#466178] font-semibold px-4 sm:px-6 text-xs sm:text-base"
            >
              Join
            </Button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="flex-1 min-w-[120px] sm:min-w-[160px] mb-6 sm:mb-8 md:mb-0">
          <h4 className="font-semibold mb-2 sm:mb-4 text-base sm:text-lg">Quick Links</h4>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Blog Posts</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex-1 min-w-[120px] sm:min-w-[160px]">
          <h4 className="font-semibold mb-2 sm:mb-4 text-base sm:text-lg">Follow Us</h4>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li className="flex items-center gap-2">
              <FaFacebookF /> <a href="#" className="hover:underline">Facebook</a>
            </li>
            <li className="flex items-center gap-2">
              <FaInstagram /> <a href="#" className="hover:underline">Instagram</a>
            </li>
            <li className="flex items-center gap-2">
              <FaXTwitter /> <a href="#" className="hover:underline">X</a>
            </li>
            <li className="flex items-center gap-2">
              <FaLinkedinIn /> <a href="#" className="hover:underline">LinkedIn</a>
            </li>
            <li className="flex items-center gap-2">
              <FaYoutube /> <a href="#" className="hover:underline">YouTube</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/30 my-4 sm:my-6"></div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs gap-2 text-white/80 px-2 sm:px-0">
        <div className="text-[10px] sm:text-xs">© 2025 ProvenPro.com All rights reserved.</div>
        <div className="flex gap-2 sm:gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Cookies Settings</a>
        </div>
      </div>
    </footer>
  );
}
