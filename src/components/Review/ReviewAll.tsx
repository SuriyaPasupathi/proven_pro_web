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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top bar: sort left, search right, single row */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4 sm:gap-0 w-full">
          {/* Sort dropdown (left) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-gray-500 font-medium mr-2">Sort by:</span>
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded shadow-sm text-sm text-gray-700 flex items-center gap-2 min-w-[90px] focus:outline-none"
              >
                {sortOptions.find(opt => opt.value === sortBy)?.label}
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showSort ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSort && (
                <div className="absolute left-0 mt-1 w-32 bg-white rounded shadow-lg border border-gray-200 z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSort(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === option.value ? 'text-[#5A8DB8] font-semibold' : 'text-gray-700'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Search bar (right) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#5A8DB8]"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            <a href="#" className="ml-2 text-xs text-[#5A8DB8] font-medium hover:underline whitespace-nowrap">Search with filters</a>
          </div>
        </div>

        {searchLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#5A8DB8] border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 font-medium">Loading freelancers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-[#f0f0f3] rounded-2xl shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff]">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"
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
            <p className="text-lg sm:text-xl text-gray-600 font-medium">No freelancers found</p>
            <p className="mt-2 text-sm sm:text-base text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-12">
            {filtered.map((freelancer, index) => (
              <div
                key={freelancer.id}
                className={`relative transform transition-all duration-500 hover:scale-[1.02] ${
                  index % 2 === 0 
                    ? 'ml-0' 
                    : 'ml-0 sm:ml-12'
                }`}
              >
                <div className="relative">
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#f0f0f3] flex items-center justify-center text-[#5A8DB8] text-sm sm:text-base font-bold shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff]">
                    {index + 1}
                  </div>
                  <div className="p-4 sm:p-8">
                    <FreelancerCard
                      freelancer={freelancer}
                      totalReviews={freelancer.totalReviews}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAll;
