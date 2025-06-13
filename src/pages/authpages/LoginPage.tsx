import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch } from '@/store/store';
import { postUserCredentials } from '@/store/Services/AuthService';
import { loginUser } from '@/store/Services/LoginService';
import { checkProfileStatus } from '@/store/Services/CreateProfileService';
import logo from '@/assets/logo.png';
import herosectionImg from '@/assets/herosection.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Eye, EyeOff } from 'lucide-react';
// import { GoogleSignIn } from '@/components/auth/google-sign-in';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  rememberMe: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error } = useSelector((state: RootState) => state.login);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    
    try {
      const result = await dispatch(loginUser({
        email: data.email,
        password: data.password,
      })).unwrap();

      if (result) {
        // Check profile status after successful login
        const profileStatus = await dispatch(checkProfileStatus()).unwrap();
        
        if (profileStatus.has_profile) {
          toast.success('Welcome back! Successfully logged in.', {
            description: 'Redirecting to your profile...',
            duration: 3000,
          });
          navigate(`/profile/${result.user.id}`);
        } else {
          toast.info('Please select a plan to continue', {
            description: 'You need to choose a plan to access all features.',
            duration: 4000,
          });
          navigate("/plans");
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again.',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Google Sign In
  const handleGoogleLogin = async (credentialsResponse: any) => {
    if (!credentialsResponse.credential) {
      toast.error("Google Sign In Failed", {
        description: "Failed to get credentials from Google. Please try again.",
        duration: 4000,
      });
      return;
    }

    try {
      const data = jwtDecode(credentialsResponse.credential) as any;
      const payload = {
        login_type: "google",
        email: data.email,
        username: data.sub,
        name: `${data.given_name} ${data.family_name}`,
        token: credentialsResponse.credential
      };
      
      const result = await dispatch(postUserCredentials(payload)).unwrap();
      
      if (result) {
        // Check profile status after successful Google login
        const profileStatus = await dispatch(checkProfileStatus()).unwrap();
        
        if (profileStatus.has_profile) {
          toast.success('Welcome back! Successfully logged in with Google.', {
            description: 'Redirecting to your profile...',
            duration: 3000,
          });
          navigate(`/profile/${result.user.id}`);
        } else {
          toast.info('Please select a plan to continue', {
            description: 'You need to choose a plan to access all features.',
            duration: 4000,
          });
          navigate("/plans");
        }
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Google Sign In Failed', {
        description: error.message || 'Please try again later.',
        duration: 4000,
      });
    }
  };


  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Left: Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 mb-8 self-start">
          <img src={logo} alt="ProvenPro Logo" className="w-10 h-10 lg:w-12 lg:h-12" />
          <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#3C5979] to-[#2C3E50] bg-clip-text text-transparent">Proven<span className="font-light">Pro</span></span>
        </div>

        <div className="w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-[#3C5979] to-[#2C3E50] bg-clip-text text-transparent">Welcome back</h1>
          <p className="mb-6 sm:mb-8 text-gray-500">Sign in to your account</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block mb-1.5 text-sm sm:text-base font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                {...form.register('email')}
                disabled={isLoading}
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm sm:text-base font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...form.register('password')}
                  disabled={isLoading}
                  className="w-full h-10 sm:h-11 text-sm sm:text-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={!!form.watch('rememberMe')}
                  onCheckedChange={(checked) => form.setValue('rememberMe', !!checked)}
                  className="h-4 w-4 text-[#3C5979] border-gray-300 rounded focus:ring-[#3C5979]"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">Remember for 30 days</label>
              </div>
              <button
                type="button"
                className="text-sm text-[#3C5979] hover:underline font-medium"
                onClick={() => navigate('/forget-password')}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#3C5979] to-[#2C3E50] hover:from-[#2C3E50] hover:to-[#3C5979] text-white font-semibold transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* OR CONTINUE WITH Separator */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="mx-4 text-gray-400 text-xs font-medium">OR CONTINUE WITH</span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            {/* Social Sign In Button */}
            <div className="flex items-center justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log("Login failed");
                  toast.error("Google login failed. Please try again.");
                }}
              />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Not a member?{' '}
            <button
              className="text-[#3C5979] font-medium hover:underline"
              onClick={() => navigate('/signup')}
            >
              Register
            </button>
          </p>

          {/* Privacy Policy & Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{' '}
              <button
                className="text-[#3C5979] hover:underline font-medium"
                onClick={() => navigate('/privacy')}
              >
                Privacy Policy
              </button>
              {' '}and{' '}
              <button
                className="text-[#3C5979] hover:underline font-medium"
                onClick={() => navigate('/terms')}
              >
                Terms & Conditions
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right: Hero Image */}
      <div className="hidden lg:flex w-1/2 flex-col bg-gradient-to-br from-[#3C5979] to-[#2C3E50] justify-center items-center p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10">
          <img
            src={herosectionImg}
            alt="Hero section"
            className="max-w-[90%] drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 p-6 text-center">
            <h3 className="text-white text-xl font-semibold mb-2">Welcome Back!</h3>
            <p className="text-white/80 text-sm">Sign in to access your account</p>
          </div>
        </div>
      </div>
    </div>
  );
}