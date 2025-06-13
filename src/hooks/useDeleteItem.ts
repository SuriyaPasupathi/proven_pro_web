import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { deleteItem } from '@/store/Services/CreateProfileService';

type ModelName = 'profile_pic' | 'video_intro' | 'certification' | 'category' | 'experience' | 'skill' | 'tool' | 'project';

interface UseDeleteItemReturn {
  isDeleteDialogOpen: boolean;
  openDeleteDialog: () => void;
  closeDeleteDialog: () => void;
  handleDelete: (modelName: ModelName, id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useDeleteItem = (): UseDeleteItemReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteLoading: isLoading, error, deleteSuccess: success } = useSelector(
    (state: RootState) => state.createProfile
  );

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleDelete = async (modelName: ModelName, id: string) => {
    try {
      await dispatch(deleteItem({ modelName, id })).unwrap();
      closeDeleteDialog();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return {
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    isLoading,
    error: error?.message || null,
    success,
  };
}; 