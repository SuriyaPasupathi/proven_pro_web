import React from 'react';

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-11/12 mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-11/12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mt-6 md:mt-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-3 order-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                
                {/* Profile Image */}
                <div className="flex flex-col items-center mb-6">
                  <div className="h-24 w-24 bg-gray-200 rounded-full mb-4 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                  </div>
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Stats */}
                <div className="space-y-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-9 order-2">
            {/* Header Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="space-y-8 md:space-y-12 mt-6 md:mt-8">
              {/* Services Section Skeleton */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                
                <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Experience Section Skeleton */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                
                <div className="h-6 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-l-4 border-gray-200 pl-4">
                      <div className="h-5 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Section Skeleton */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                
                <div className="h-6 w-24 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Tools Section Skeleton */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                
                <div className="h-6 w-20 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                      <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Portfolio Section Skeleton */}
              <div className="bg-white rounded-lg shadow-sm p-6 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                
                <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton; 