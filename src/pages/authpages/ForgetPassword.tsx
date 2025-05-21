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
    <div className="flex min-h-screen items-center justify-center bg-[#fafbfc] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 flex flex-col items-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gray-100 mb-6">
          <KeyRound className="w-7 h-7 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Forgot password?</h1>
        <p className="text-gray-500 mb-8 text-center">No worries, we'll send you reset instructions.</p>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#466184] hover:bg-[#3C5979] text-white font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Reset your password'}
          </Button>
        </form>
        <button
          type="button"
          className="flex items-center gap-2 mt-8 text-[#466184] hover:underline text-sm"
          onClick={() => navigate('/login')}
        >
          <span className="inline-block rotate-180">→</span> Back to log in
        </button>
      </div>
    </div>
  );
}
