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

  // Facebook Sign In
  const handleFacebookLogin = () => {
    console.log("Facebook Sign In");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-8 py-12">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 mb-8 self-start">
          <img src={logo} alt="ProvenPro Logo" className="w-12 h-12" />
          <span className="text-3xl font-bold text-blue-900">Proven<span className="font-light">Pro</span></span>
        </div>
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="mb-8 text-gray-500">Welcome back! Please enter your details.</p>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                {...form.register('email')}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...form.register('password')}
                  disabled={isLoading}
                  className="w-full pr-10"
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
              <div className="flex items-center ">
                <Checkbox
                  checked={!!form.watch('rememberMe')}
                  onCheckedChange={(checked) => form.setValue('rememberMe', !!checked)}
                />
                <span className="ml-2 text-sm">Remember for 30 days</span>
              </div>
              <button
                type="button"
                className="text-[#5A8DB8] text-sm hover:underline"
                onClick={() => navigate('/forget-password')}
              >
                Forgot password?
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2C3E50] hover:bg-[#34495E] text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Log in'}
            </Button>
            
            {/* OR CONTINUE WITH Separator */}
            <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-3 text-gray-400 text-xs font-semibold">OR CONTINUE WITH</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

               {/* Google & Facebook Sign Up */}
               <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="w-full md:w-1/2 flex items-center justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      console.log("Signup failed");
                      toast.error("Google signup failed. Please try again.");
                    }}
                  />
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm transition"
                    onClick={handleFacebookLogin}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                    Facebook
                  </button>
                </div>
              </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            )}
          </form>
          <p className="mt-8 text-center text-sm text-gray-500">
            Not a member?{' '}
            <button
              className="text-[#5A8DB8] font-bold hover:underline"
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
                className="text-[#5A8DB8] hover:underline font-bold"
                onClick={() => navigate('/login')}
              >
                Privacy Policy
              </button>
              {' '}and{' '}
              <button
                className="text-[#5A8DB8] hover:underline font-bold"
                onClick={() => navigate('/login')}
              >
                Terms & Conditions
              </button>
            </p>
          </div>
        </div>
      </div>
      {/* Right: Hero Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#3C5979]">
        <img
          src={herosectionImg}
          alt="Hero section"
          className="max-w-[90%] drop-shadow-2xl"
        />
      </div>
    </div>
  );
}