import { Provider } from 'react-redux';
import { store } from './store/store';
import { useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { Toaster } from 'sonner';
import LandingPage from './pages/landingpages/landingpage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpForm from './pages/authpages/SignupPage'; // adjust path as needed
import { LoginForm } from './pages/authpages/LoginPage';
import ForgetPassword from './pages/authpages/ForgetPassword';
import PersonalInfo from './pages/landingpages/CreateYourProfile/PersonalInfo';
import ProfileImg from './pages/landingpages/CreateYourProfile/ProfileImg';
import ServicesOffer from './pages/landingpages/CreateYourProfile/ServicesOffer';
import WorkExp from './pages/landingpages/CreateYourProfile/WorkExp';
import ToolSkills from './pages/landingpages/CreateYourProfile/ToolSkills';
import Portfolio from './pages/landingpages/CreateYourProfile/Portfolio';
import Licenses  from './pages/landingpages/CreateYourProfile/Licenses';
import VideoIntro from './pages/landingpages/CreateYourProfile/VideoIntro';
import CheckEmail from './pages/authpages/CheckEmail';
import SetPassword from './pages/authpages/SetPassword';
import ResetSuccess from './pages/authpages/ResetSuccess';
import EmailVerify from './pages/authpages/EmailVerify';
import CheckEmailCode from './pages/authpages/CheckEmailCode';
import VerifiedEmail from './pages/authpages/VerifiedEmail';
import Profile from './pages/ProfilePages/Profile';
import Plans from './pages/landingpages/LandingPreview/Plans';
import AccountSettings from './pages/ProfilePages/Accounts/AccountSettings';
import Verification from './pages/ProfilePages/Accounts/Verification';
import MembershipPlans from './pages/ProfilePages/Accounts/MembershipPlans';
import { EditModeProvider } from './context/EditModeContext';

function ThemeProvider({ children }: { children: React.ReactNode }) {
const { theme } = useTheme();
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  return <>{children}</>;
}


function App() {
  return (
    <Provider store={store}>
      <EditModeProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Toaster richColors position="top-center" />
            <Routes>
              <Route path="/" element={<LandingPage />} />

              {/* Plan Pages */}
              <Route path="/plans" element={<Plans />} />

              

              {/* Auth Pages */}
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/check-email" element={<CheckEmail />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/reset-success" element={<ResetSuccess />} />
              <Route path="/email-verify" element={<EmailVerify />} />
              <Route path="/check-email-code" element={<CheckEmailCode />} />
              <Route path="/verified-email" element={<VerifiedEmail />} />

              {/* Create Your Profile */}
              <Route path="/create-profile/personal-info" element={<PersonalInfo />} />
              <Route path="/create-profile/profile-img" element={<ProfileImg />} />
              <Route path="/create-profile/services-offer" element={<ServicesOffer />} />
              <Route path="/create-profile/work-exp" element={<WorkExp />} />
              <Route path="/create-profile/tool-skills" element={<ToolSkills />} />
              <Route path="/create-profile/portfolio" element={<Portfolio />} />
              <Route path="/create-profile/licenses" element={<Licenses />} />
              <Route path="/create-profile/video-intro" element={<VideoIntro />} />

              {/* Profile Pages */}
              <Route path="/profile" element={<Profile />} />

              <Route path="/profile/account-settings" element={<AccountSettings />} />
              <Route path="/profile/verification" element={<Verification />} />
              <Route path="/profile/membership-plans" element={<MembershipPlans />} />

              


            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </EditModeProvider>
    </Provider>
  );
}

export default App;