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

  // Facebook Sign Up
  const handleFacebookSignup = () => {
    // Implementation for Facebook sign-up
    console.log("Facebook sign-up");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Hero Image and Logo */}
      <div className="hidden md:flex w-1/2 flex-col bg-[#3C5979] justify-center items-center p-12">
        <div className="flex items-center gap-3 mb-12 self-start">
          <img src={logo} alt="ProvenPro Logo" className="w-12 h-12" />
          <span className="text-3xl font-bold text-white">Proven<span className="font-light">Pro</span></span>
        </div>
        <img
          src={herosectionImg}
          alt="Hero section"
          className="max-w-[90%] drop-shadow-2xl"
        />
      </div>
      {/* Right: Signup Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-[#f5f8fa] px-8 py-12 min-h-screen">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Sign up</h1>
          <p className="mb-8 text-gray-500">Create your free account</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choose a username"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
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
                    <FormLabel>Email<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
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
                    <FormLabel>Password<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          {...field}
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
                    <FormLabel>Confirm Password<span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                          disabled={isLoading}
                          className="w-full pr-10"
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
              <div className="flex items-center mb-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-[#5A8DB8] hover:underline font-bold"
                    onClick={() => navigate('/signup')}
                  >
                    terms of service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    className="text-[#5A8DB8] hover:underline font-bold"
                    onClick={() => navigate('/signup')}
                  >
                    privacy policy
                  </button>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#2C3E50] hover:bg-[#34495E] text-white font-semibold"
                disabled={isLoading || !agreedToTerms}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
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
                    onSuccess={handleGoogleSignup}
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
                    onClick={handleFacebookSignup}
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
          </Form>
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              className="text-[#5A8DB8] font-bold hover:underline"
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