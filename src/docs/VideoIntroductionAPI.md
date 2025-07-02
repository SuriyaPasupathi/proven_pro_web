# Video Introduction API Integration

This document explains the complete implementation of the Video Introduction functionality with API integration using Redux Toolkit and React hooks.

## Overview

The Video Introduction feature allows users to:
- Upload video files (max 100MB)
- Add descriptions to their videos
- Edit existing videos
- Delete videos
- View videos in their profile

## Backend API Endpoints

### 1. Delete Video Introduction
```http
DELETE /api/delete-video-intro/{user_id}/
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**
```json
{
  "message": "Video intro deleted successfully."
}
```

**Error Responses:**
- `400`: No video intro to delete
- `401`: Unauthorized
- `404`: User not found
- `500`: Server error

## Frontend Implementation

### 1. Redux Service (`CreateProfileService.ts`)

```typescript
export const deleteVideoIntro = createAsyncThunk(
  'profile/deleteVideoIntro',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(
        `${baseUrl}delete-video-intro/${userId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 204 || response.status === 200) {
        return { 
          success: true, 
          message: response.data?.message || 'Video intro deleted successfully',
          userId 
        };
      }

      return rejectWithValue({
        message: 'Unexpected response from server',
        status: response.status,
        code: 'UNEXPECTED_RESPONSE'
      });
    } catch (error) {
      // Handle various error cases
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        
        if (axiosError.response?.status === 400) {
          return rejectWithValue({
            message: axiosError.response.data?.error || 'No video intro to delete',
            status: 400,
            code: 'BAD_REQUEST'
          });
        }
        // ... other error handling
      }
      
      return rejectWithValue({
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      });
    }
  }
);
```

### 2. Redux Slice (`CreateProfileSlice.ts`)

```typescript
// State interface
interface CreateProfileState {
  // ... other state properties
  deleteVideoLoading: boolean;
  deleteVideoSuccess: boolean;
}

// Initial state
const initialState: CreateProfileState = {
  // ... other initial state
  deleteVideoLoading: false,
  deleteVideoSuccess: false,
};

// Reducers
.addCase(deleteVideoIntro.pending, (state) => {
  state.deleteVideoLoading = true;
  state.error = null;
  state.deleteVideoSuccess = false;
})
.addCase(deleteVideoIntro.fulfilled, (state, action) => {
  state.deleteVideoLoading = false;
  state.deleteVideoSuccess = true;
  state.error = null;
  // Update the profile data to remove video intro
  if (state.profileData) {
    state.profileData = {
      ...state.profileData,
      video_intro: undefined,
      video_intro_url: undefined,
      video_description: ''
    };
  }
})
.addCase(deleteVideoIntro.rejected, (state, action) => {
  state.deleteVideoLoading = false;
  state.deleteVideoSuccess = false;
  state.error = action.payload as ProfileError;
})
```

### 3. Custom Hook (`useDeleteVideoIntro.ts`)

```typescript
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
```

### 4. Component Usage (`ProfileSidebar.tsx`)

```typescript
import { useDeleteVideoIntro } from '@/hooks/useDeleteVideoIntro';

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profileData }) => {
  // Add video deletion hook
  const {
    deleteVideoIntro,
    isDeleting: isVideoDeleting,
    deleteSuccess: videoDeleteSuccess,
    error: videoDeleteError
  } = useDeleteVideoIntro();

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteType || !profileData.id) {
      toast.error("Missing required information for deletion");
      return;
    }

    try {
      if (deleteType === 'video') {
        // Use the dedicated video deletion hook
        const success = await deleteVideoIntro(profileData.id);
        if (success) {
          // The Redux state is already updated by the hook
          // No need for additional UI updates
        }
      }
      // ... handle other delete types
    } catch (err) {
      // Error handling
    } finally {
      closeDeleteDialog();
      setDeleteType(null);
    }
  };

  // Video introduction section
  return (
    <SectionLock requiredPlan="premium" title="Premium Features">
      {(profileData.video_intro || profileData.video_intro_url) && (
        <div className="relative w-full max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg text-gray-800">
              Video Introduction (Optional)
            </h3>
            {isEditMode && (
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleOpenVideoDialog}
                >
                  <Pencil size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteClick('video')}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="relative bg-gray-100 rounded-lg aspect-video">
              <video 
                src={getFullImageUrl(profileData.video_intro_url || profileData.video_intro)}
                className="w-full h-auto max-h-60 object-cover"
                controls
                preload="metadata"
                controlsList="nodownload"
                playsInline
              />
            </div>
            {profileData.video_description && (
              <div className="bg-gradient-to-br from-white to-gray-50/50 p-3 rounded-lg border border-[#5A8DB8]/10">
                <p className="text-sm text-gray-700">{profileData.video_description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </SectionLock>
  );
};
```

## Usage Examples

### 1. Upload Video Introduction

```typescript
const handleVideoUpload = async (file: File, description: string) => {
  const formData = new FormData();
  formData.append('video_intro', file);
  formData.append('video_description', description);
  formData.append('subscription_type', 'premium');

  try {
    const result = await dispatch(updateProfile({
      data: formData,
      profileId: profileData.id
    })).unwrap();
    
    if (result) {
      toast.success("Video uploaded successfully!");
    }
  } catch (error) {
    toast.error("Failed to upload video");
  }
};
```

### 2. Delete Video Introduction

```typescript
const { deleteVideoIntro, isDeleting } = useDeleteVideoIntro();

const handleDeleteVideo = async () => {
  if (!profileData.id) {
    toast.error("Profile ID is missing");
    return;
  }

  const success = await deleteVideoIntro(profileData.id);
  if (success) {
    // Video deleted successfully
    // Redux state is automatically updated
  }
};
```

### 3. Edit Video Description

```typescript
const handleEditVideoDescription = async (newDescription: string) => {
  const formData = new FormData();
  formData.append('video_description', newDescription);
  formData.append('subscription_type', 'premium');

  try {
    const result = await dispatch(updateProfile({
      data: formData,
      profileId: profileData.id
    })).unwrap();
    
    if (result) {
      toast.success("Video description updated successfully!");
    }
  } catch (error) {
    toast.error("Failed to update video description");
  }
};
```

## Error Handling

The implementation includes comprehensive error handling for:

1. **Network Errors**: Connection issues, server not responding
2. **Authentication Errors**: Invalid or expired tokens
3. **Authorization Errors**: Insufficient permissions
4. **Validation Errors**: Invalid file types, sizes, or data
5. **Server Errors**: Internal server errors
6. **File Errors**: File not found, upload failures

## File Validation

- **File Type**: Only video files are accepted
- **File Size**: Maximum 100MB
- **Supported Formats**: MP4 preferred, but accepts all video formats

## State Management

The video introduction state is managed through Redux with:

- **Loading States**: Track API call progress
- **Success States**: Confirm successful operations
- **Error States**: Handle and display errors
- **Optimistic Updates**: Immediate UI feedback
- **Rollback**: Revert changes on failure

## Security Considerations

1. **Authentication**: All operations require valid JWT tokens
2. **Authorization**: Users can only modify their own videos
3. **File Validation**: Server-side validation of file types and sizes
4. **CSRF Protection**: Django's built-in CSRF protection
5. **File Storage**: Secure file storage with proper access controls

## Performance Optimizations

1. **Lazy Loading**: Videos load only when needed
2. **Caching**: Redux state caching for better performance
3. **Optimistic Updates**: Immediate UI feedback
4. **Error Boundaries**: Graceful error handling
5. **Loading States**: User feedback during operations 