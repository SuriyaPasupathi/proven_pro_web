import { Button } from "@/components/ui/button";
import { User, ShieldCheck, Users, Settings, LogOut, Edit, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { ProfileData } from '../../types/profile';
import { logout } from '../../store/Services/CreateProfileService';
import { toast } from 'sonner';
import { useEditMode } from '../../context/EditModeContext';

interface AccountDropdownProps {
  closeDropdown: () => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ closeDropdown }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profileData } = useSelector((state: RootState) => state.createProfile);
  const { setIsEditMode } = useEditMode();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          await dispatch(logout());
        } catch (apiError) {
          console.error('API logout failed:', apiError);
        }
      }
      
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_email');
      
      toast.success('Logged out successfully', {
        description: 'You have been logged out of your account.',
        duration: 3000,
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
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

  const handleEditProfile = () => {
    setIsEditMode(true);
    navigate(`/profile/${userData.id}`);
  };

  const userData = profileData as ProfileData;
  const userEmail = localStorage.getItem('user_email') || '';

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white/100 backdrop-blur-xl border border-[#5A8DB8]/30 rounded-2xl  z-50 overflow-hidden transform origin-top-right transition-all duration-300 ease-in-out">
      {/* User Info Section */}
      <div className="p-4 border-b border-[#5A8DB8]/10 bg-gradient-to-br from-[#5A8DB8]/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#5A8DB8] to-[#70a4d8] flex items-center justify-center text-white font-semibold">
            {userData?.first_name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-black truncate">
              {userData?.first_name && userData?.last_name 
                ? `${userData.first_name} ${userData.last_name}`
                : 'User'}
            </div>
            <div className="text-sm text-black/70 truncate">{userEmail}</div>
          </div>
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="py-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-between px-4 py-3 text-sm text-black hover:text-black hover:bg-[#5A8DB8]/5 transition-all duration-300 group"
          onClick={() => {
            setIsEditMode(false);
            navigate(`/profile/${userData.id}`);
            closeDropdown();
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#5A8DB8]/10 flex items-center justify-center group-hover:bg-[#5A8DB8]/20 transition-colors">
              <User className="h-4 w-4 text-[#5A8DB8]" />
            </div>
            <span className="truncate">My Profile</span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#5A8DB8]/50 group-hover:text-[#5A8DB8] transition-colors" />
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-between px-4 py-3 text-sm text-black hover:text-black hover:bg-[#5A8DB8]/5 transition-all duration-300 group"
          onClick={() => {
            handleEditProfile();
            closeDropdown();
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#5A8DB8]/10 flex items-center justify-center group-hover:bg-[#5A8DB8]/20 transition-colors">
              <Edit className="h-4 w-4 text-[#5A8DB8]" />
            </div>
            <span className="truncate">Edit Profile</span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#5A8DB8]/50 group-hover:text-[#5A8DB8] transition-colors" />
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-between px-4 py-3 text-sm text-black hover:text-black hover:bg-[#5A8DB8]/5 transition-all duration-300 group"
          onClick={() => {
            navigate(`/profile/verification/${userData.id}`);
            closeDropdown();
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#5A8DB8]/10 flex items-center justify-center group-hover:bg-[#5A8DB8]/20 transition-colors">
              <ShieldCheck className="h-4 w-4 text-[#5A8DB8]" />
            </div>
            <span className="truncate">Verification</span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#5A8DB8]/50 group-hover:text-[#5A8DB8] transition-colors" />
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-between px-4 py-3 text-sm text-black hover:text-black hover:bg-[#5A8DB8]/5 transition-all duration-300 group"
          onClick={() => {
            navigate(`/profile/membership-plans/${userData.id}`);
            closeDropdown();
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#5A8DB8]/10 flex items-center justify-center group-hover:bg-[#5A8DB8]/20 transition-colors">
              <Users className="h-4 w-4 text-[#5A8DB8]" />
            </div>
            <span className="truncate">Membership Plan</span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#5A8DB8]/50 group-hover:text-[#5A8DB8] transition-colors" />
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-3 text-sm text-black hover:text-black hover:bg-[#5A8DB8]/5 transition-all duration-300 group"
          onClick={() => {
            navigate(`/profile/account-settings/${userData.id}`);
            closeDropdown();
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#5A8DB8]/10 flex items-center justify-center group-hover:bg-[#5A8DB8]/20 transition-colors">
              <Settings className="h-4 w-4 text-[#5A8DB8]" />
            </div>
            <span className="truncate">Account Settings</span>
          </div>
          <ChevronRight className="h-4 w-4 text-[#5A8DB8]/50 group-hover:text-[#5A8DB8] transition-colors" />
        </Button>
      </div>
      
      {/* Logout Section */}
      <div className="border-t border-[#5A8DB8]/10 py-2 bg-gradient-to-br from-transparent to-[#5A8DB8]/5">
        <Button 
          variant="ghost" 
          className="w-full justify-between px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-300 group"
          onClick={() => {
            handleLogout();
            closeDropdown();
          }}
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-red-100/50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut className="h-4 w-4 text-red-600" />
            </div>
            <span className="truncate">Log out</span>
          </div>
          <ChevronRight className="h-4 w-4 text-red-400/50 group-hover:text-red-500 transition-colors" />
        </Button>
      </div>
    </div>
  );
};

export default AccountDropdown;