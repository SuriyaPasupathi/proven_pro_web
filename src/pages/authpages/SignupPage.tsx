import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LucideCheck, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import herosectionImg from '@/assets/herosection.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch } from '@/store/store';
import { postUserCredentials } from '@/store/Services/AuthService';
import { registerUser, verifyOTP } from '@/store/Services/RegisterService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const passwordSchema = z
  .string()
  .min(8, {
    message: 'Password must be at least 8 characters',
  })
  .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
    message: 'Password must contain at least one special character',
  });

const formSchema = z
  .object({
    email: z.string().email({
      message: 'Please enter a valid email address',
    }),
    username: z.string().min(3, {
      message: 'Username must be at least 3 characters',
    }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { error } = useSelector((state: RootState) => state.register);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { watch } = form;
  const password = watch('password');
  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Handle email verification
  useEffect(() => {
    const email = searchParams.get('email');
    const otp = searchParams.get('otp');

    if (email && otp) {
      dispatch(verifyOTP({ email, otp }))
        .unwrap()
        .then(() => {
          toast.success('Email verified successfully!', {
            description: 'You can now log in to your account.',
            duration: 4000,
          });
          navigate('/login');
        })
        .catch((error) => {
          toast.error('Verification failed', {
            description: error.message || 'Please try verifying your email again.',
            duration: 4000,
          });
        });
    }
  }, [searchParams, dispatch, navigate]);

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    
    try {
      const result = await dispatch(registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
      })).unwrap();

      if (result) {
        toast.success('Account created successfully!', {
          description: 'Please check your email for verification.',
          duration: 4000,
        });
        form.reset();
        navigate('/email-verify');
      }
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message || 'Please check your information and try again.',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Google Sign Up
  const handleGoogleSignup = async (credentialsResponse: any) => {
    if (!credentialsResponse.credential) {
      toast.error("Google Sign Up Failed", {
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
        toast.success('Account created successfully!', {
          description: 'Redirecting you to select a plan...',
          duration: 3000,
        });
        navigate("/plans");
      }
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast.error('Google Sign Up Failed', {
        description: error.message || 'Please try again later.',
        duration: 4000,
      });
    }
  };



  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Left: Hero Image and Logo */}
      <div className="hidden lg:flex w-1/2 flex-col bg-gradient-to-br from-[#3C5979] to-[#2C3E50] justify-center items-center p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="flex items-center gap-3 mb-12 self-start z-10">
          <img src={logo} alt="ProvenPro Logo" className="w-10 h-10 lg:w-12 lg:h-12" />
          <span className="text-2xl lg:text-3xl font-bold text-white">Proven<span className="font-light">Pro</span></span>
        </div>
        <div className="relative z-10">
          <img
            src={herosectionImg}
            alt="Hero section"
            className="max-w-[90%] drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2  p-6 text-center">
            <h3 className="text-white text-xl font-semibold mb-2">Join Our Community</h3>
            <p className="text-white/80 text-sm">Connect with talented professionals worldwide</p>
          </div>
        </div>
      </div>

      {/* Right: Signup Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-4 sm:px-8 lg:px-12 py-8 lg:py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logo} alt="ProvenPro Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-[#3C5979]">Proven<span className="font-light">Pro</span></span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-[#3C5979] to-[#2C3E50] bg-clip-text text-transparent">Create your account</h1>
          <p className="mb-6 sm:mb-8 text-gray-500">Join our community of professionals</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Username<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choose a username"
                        {...field}
                        disabled={isLoading}
                        className="w-full h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Email<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        disabled={isLoading}
                        className="w-full h-10 sm:h-11 text-sm sm:text-base"
                        autoComplete="email"
                        list="email-suggestions"
                      />
                    </FormControl>
                    <datalist id="email-suggestions">
                      <option value="@gmail.com" />
                      <option value="@yahoo.com" />
                      <option value="@hotmail.com" />
                      <option value="@outlook.com" />
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Password<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          {...field}
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
                    </FormControl>
                    <div className="mt-2 space-y-1">
                      <PasswordRequirement
                        text="Must be at least 8 characters"
                        isValid={hasMinLength}
                      />
                      <PasswordRequirement
                        text="Must contain one special character"
                        isValid={hasSpecialChar}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Confirm Password<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                          disabled={isLoading}
                          className="w-full h-10 sm:h-11 text-sm sm:text-base pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms and Privacy Checkbox */}
              <div className="flex items-start space-x-3 py-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                  className="mt-1 h-4 w-4 text-[#3C5979] border-gray-300 rounded focus:ring-[#3C5979]"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-[#3C5979] hover:underline font-medium"
                    onClick={() => navigate('/terms')}
                  >
                    terms of service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    className="text-[#3C5979] hover:underline font-medium"
                    onClick={() => navigate('/privacy')}
                  >
                    privacy policy
                  </button>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-[#3C5979] to-[#2C3E50] hover:from-[#2C3E50] hover:to-[#3C5979] text-white font-semibold transition-all duration-300"
                disabled={isLoading || !agreedToTerms}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>

              {/* OR CONTINUE WITH Separator */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-200" />
                <span className="mx-4 text-gray-400 text-xs font-medium">OR CONTINUE WITH</span>
                <div className="flex-grow h-px bg-gray-200" />
              </div>

              {/* Social Sign Up Button */}
              <div className="flex items-center justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSignup}
                  onError={() => {
                    console.log("Signup failed");
                    toast.error("Google signup failed. Please try again.");
                  }}
                />
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error.message}</p>
                </div>
              )}
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              className="text-[#3C5979] font-medium hover:underline"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

interface PasswordRequirementProps {
  text: string;
  isValid: boolean;
}

function PasswordRequirement({ text, isValid }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          isValid
            ? 'bg-[#2C3E50] text-white'
            : 'bg-muted text-muted-foreground'
        } transition-colors`}
      >
        <LucideCheck size={12} />
      </div>
      <span className={isValid ? 'text-foreground' : 'text-muted-foreground'}>
        {text}
      </span>
    </div>
  );
}

export default SignUpForm;