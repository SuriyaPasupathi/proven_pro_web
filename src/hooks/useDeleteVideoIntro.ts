import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { deleteVideoIntro } from '@/store/Services/CreateProfileService';
import { toast } from 'sonner';

interface UseDeleteVideoIntroReturn {
  deleteVideoIntro: (userId: string) => Promise<boolean>;
  isDeleting: boolean;
  deleteSuccess: boolean;
  error: string | null;
}

export const useDeleteVideoIntro = (): UseDeleteVideoIntroReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { deleteVideoLoading, deleteVideoSuccess, error } = useSelector(
    (state: RootState) => state.createProfile
  );

  const [localError, setLocalError] = useState<string | null>(null);

  const handleDeleteVideoIntro = async (userId: string): Promise<boolean> => {
    try {
      setLocalError(null);
      
      if (!userId) {
        const errorMsg = 'User ID is required';
        setLocalError(errorMsg);
        toast.error(errorMsg);
        return false;
      }

      const result = await dispatch(deleteVideoIntro(userId)).unwrap();
      
      if (result?.success) {
        toast.success(result.message || 'Video introduction deleted successfully!');
        return true;
      } else {
        const errorMsg = result?.message || 'Failed to delete video introduction';
        setLocalError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'An unexpected error occurred while deleting video introduction';
      setLocalError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
  };

  return {
    deleteVideoIntro: handleDeleteVideoIntro,
    isDeleting: deleteVideoLoading,
    deleteSuccess: deleteVideoSuccess,
    error: localError || (error?.message || null)
  };
}; 