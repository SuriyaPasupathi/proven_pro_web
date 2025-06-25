import React, { useState, useEffect } from 'react';
import FreelancerCard from './FreelancerCard';
import Header from '../layout/header';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { searchUsers } from '../../store/Services/CreateProfileService';
import { useDebounce } from '../../hooks/useDebounce';

const sortOptions = [
  { label: 'Rating', value: 'rating' },
  { label: 'First name', value: 'name' },
];

const ReviewAll: React.FC = () => {
  const [sortBy, setSortBy] = useState('rating');
  const [search, setSearch] = useState('');
  const [showSort, setShowSort] = useState(false);
  const dispatch = useAppDispatch();
  const { searchResults, searchLoading } = useAppSelector((state) => state.createProfile);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(searchUsers({ 
          search: debouncedSearch || undefined,
          limit: 20,
          offset: 0,
          min_rating: 0
        })).unwrap();
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [debouncedSearch, dispatch]);

  const filtered = searchResults
    .map(user => ({
      id: user.id,
      name: user.username,
      title: user.bio || 'No bio available',
      rating: user.avg_rating || 0,
      totalReviews: user.total_reviews || 0,
      image: (user as any).profile_pic || 'https://randomuser.me/api/portraits/lego/1.jpg',
      linkedin: '#',
      upwork: '#',
      fiverr: '#'
    }))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f0f0f3]">
      <Header />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 md:py-8 lg:py-12 w-11/12">
        {/* Top bar: sort left, search right, single row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 gap-3 sm:gap-4 md:gap-6 w-full">
          {/* Sort dropdown (left) */}
          <div className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1">
            <span className="text-xs sm:text-sm text-gray-500 font-medium mr-2 whitespace-nowrap">Sort by:</span>
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded shadow-sm text-xs sm:text-sm text-gray-700 flex items-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[90px] md:min-w-[100px] focus:outline-none focus:ring-2 focus:ring-[#5A8DB8] focus:ring-opacity-50"
              >
                {sortOptions.find(opt => opt.value === sortBy)?.label}
                <svg
                  className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-300 ${showSort ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSort && (
                <div className="absolute left-0 mt-1 w-28 sm:w-32 md:w-36 bg-white rounded shadow-lg border border-gray-200 z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSort(false);
                      }}
                      className={`block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 transition-colors duration-150 ${sortBy === option.value ? 'text-[#5A8DB8] font-semibold' : 'text-gray-700'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Search bar (right) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
            <div className="relative w-full sm:w-64 md:w-72 lg:w-80">
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#5A8DB8] focus:ring-opacity-50 transition-all duration-200"
              />
              <svg
                className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <a href="#" className="text-xs sm:text-sm text-[#5A8DB8] font-medium hover:underline whitespace-nowrap self-end sm:self-auto">Search with filters</a>
          </div>
        </div>

        {searchLoading ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-4 border-[#5A8DB8] border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-gray-600 font-medium">Loading freelancers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 sm:py-12 md:py-16 lg:py-20 bg-[#f0f0f3] rounded-xl sm:rounded-2xl shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] mx-2 sm:mx-0">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-medium">No freelancers found</p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
            {filtered.map((freelancer, idx) => (
              <React.Fragment key={freelancer.id}>
                <div className="relative">
                  <FreelancerCard
                    freelancer={freelancer}
                    totalReviews={freelancer.totalReviews}
                  />
                </div>
                {idx !== filtered.length - 1 && (
                  <hr className="border-t border-gray-300 mx-2 sm:mx-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAll;
