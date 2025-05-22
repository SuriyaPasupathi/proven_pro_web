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
  const { error, loading } = useSelector((state: RootState) => state.login);

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
          toast.success('Successfully logged in!');
          navigate("/profile");
        } else {
          toast.info('Please select a plan to continue');
          navigate("/plans");
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Google Sign In
  const handleGoogleLogin = async (credentialsResponse: any) => {
    if (!credentialsResponse.credential) {
      toast.error("Failed to get credentials from Google");
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
          toast.success('Successfully logged in!');
          navigate("/profile");
        } else {
          toast.info('Please select a plan to continue');
          navigate("/plans");
        }
      }
    } catch (error: any) {
      console.error('Google login error:', error);
    }
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
            {/* Google Sign In */}
            <div className="w-full flex items-center justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log("Login failed");
                  toast.error("Google login failed. Please try again.");
                }}
              />
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