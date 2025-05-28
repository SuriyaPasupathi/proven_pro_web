import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import { useAppDispatch } from '@/store/store';
import { requestPasswordReset } from '@/store/Services/AuthService';
import { toast } from 'sonner';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await dispatch(requestPasswordReset(email)).unwrap();
      if (result.success) {
        toast.success('Password reset link sent to your email');
        navigate('/check-email', { state: { email } });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafbfc] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg bg-gray-100 mb-4 sm:mb-6">
          <KeyRound className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-500" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">Forgot password?</h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 text-center">No worries, we'll send you reset instructions.</p>
        <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-6">
          <div>
            <label className="block mb-1 text-xs sm:text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full text-sm sm:text-base"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#466184] hover:bg-[#3C5979] text-white font-semibold text-sm sm:text-base"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Reset your password'}
          </Button>
        </form>
        <button
          type="button"
          className="flex items-center gap-2 mt-6 sm:mt-8 text-[#466184] hover:underline text-xs sm:text-sm"
          onClick={() => navigate('/login')}
        >
          <span className="inline-block rotate-180">→</span> Back to log in
        </button>
      </div>
    </div>
  );
}
