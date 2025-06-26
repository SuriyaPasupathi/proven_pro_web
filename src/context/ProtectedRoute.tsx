import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '../store/store';
import { checkProfileStatus } from '../store/Services/CreateProfileService';

const ProtectedRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.login);
  const { profileStatusLoading } = useSelector((state: RootState) => state.createProfile);

  useEffect(() => {
    if (isAuthenticated) {
      // Check profile status to get subscription type
      dispatch(checkProfileStatus());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while checking profile status
  if (profileStatusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
