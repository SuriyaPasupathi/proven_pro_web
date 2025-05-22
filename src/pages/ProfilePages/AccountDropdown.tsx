import { Button } from "@/components/ui/button";
import { User, ShieldCheck, Users, Settings, LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { ProfileData } from './Profile';
import { logout } from '../../store/Services/CreateProfileService';
import { toast } from 'sonner';

const AccountDropdown = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profileData } = useSelector((state: RootState) => state.createProfile);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      // Clear auth tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Clear any other stored data
      localStorage.removeItem('user');
      localStorage.removeItem('user_email');
      
      toast.success('Logged out successfully', {
        description: 'You have been logged out of your account.',
        duration: 3000,
      });
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, we should still clear local storage and redirect
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

  const userData = profileData as ProfileData;
  const userEmail = localStorage.getItem('user_email') || '';

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-50 overflow-hidden">
      <div className="p-4 border-b">
        <div className="font-medium">
          {userData?.first_name && userData?.last_name 
            ? `${userData.first_name} ${userData.last_name}`
            : 'User'}
        </div>
        <div className="text-sm text-gray-500">{userEmail}</div>
      </div>
      
      <div className="py-2">
        <Button variant="ghost" className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
          onClick={() => navigate('/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
          onClick={() => navigate('/profile/verification')}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          <span>Verification</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
          onClick={() => navigate('/profile/membership-plans')}
        >
          <Users className="mr-2 h-4 w-4" />
          <span>Membership Plan</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
          onClick={() => navigate('/profile/account-settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </Button>
      </div>
      
      <div className="border-t py-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default AccountDropdown;