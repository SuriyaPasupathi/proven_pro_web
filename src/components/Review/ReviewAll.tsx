import React, { useState } from 'react';
import FreelancerCard, { Freelancer } from './FreelancerCard';
import Header from '../layout/header';

const mockFreelancers: Freelancer[] = [
  {
    id: '1',
    name: 'Sarah P.',
    title: 'UI/UX Designer | Figma | Platform | Website',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    linkedin: 'https://www.linkedin.com/sarah-p-b5a692206/',
    upwork: 'https://www.upwork.com/freelancers/~013958b79acf9b255',
    fiverr: 'https://www.fiverr.com/freelancers/~013958b79acf9b255',
  },
  {
    id: '2',
    name: 'John D.',
    title: 'UX / UI Designer – Front End Developer / No Code Builder',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    linkedin: 'https://www.linkedin.com/sarah-p-b5a692206/',
    upwork: 'https://www.upwork.com/freelancers/~013958b79acf9b255',
    fiverr: 'https://www.fiverr.com/freelancers/~013958b79acf9b255',
  },
  {
    id: '3',
    name: 'Adriana S.',
    title: 'Social Media Manager, Content Creator & Organic Growth Exper',
    rating: 4,
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    linkedin: 'https://www.linkedin.com/sarah-p-b5a692206/',
    upwork: 'https://www.upwork.com/freelancers/~013958b79acf9b255',
    fiverr: 'https://www.fiverr.com/freelancers/~013958b79acf9b255',
  },
  {
    id: '4',
    name: 'Drew C.',
    title: 'Whiteboards Specialist | Animated eCourse | 2D Explainers | AI Videos',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    linkedin: 'https://www.linkedin.com/sarah-p-b5a692206/',
    upwork: 'https://www.upwork.com/freelancers/~013958b79acf9b255',
    fiverr: 'https://www.fiverr.com/freelancers/~013958b79acf9b255',
  },
];

const sortOptions = [
  { label: 'Rating', value: 'rating' },
  { label: 'First name', value: 'name' },
];

const ReviewAll: React.FC = () => {
  const [sortBy, setSortBy] = useState('rating');
  const [search, setSearch] = useState('');
  const [showSort, setShowSort] = useState(false);

  const filtered = mockFreelancers
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white min-h-screen">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <span className="text-sm text-[#5A8DB8] font-bold">Sort by:</span>
            <div className="relative w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-3 py-1 border border-gray-300 rounded text-sm flex items-center justify-between sm:justify-start gap-2 min-w-[100px] hover:bg-gray-50"
                onClick={() => setShowSort(v => !v)}
              >
                {sortOptions.find(opt => opt.value === sortBy)?.label}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSort && (
                <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded shadow z-10">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === opt.value ? 'bg-[#5A8DB8] text-white' : ''}`}
                      onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name"
              className="w-full sm:w-auto border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A8DB8]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <a href="#" className="text-[#5A8DB8] text-sm hover:text-[#3C5979] hover:underline font-bold">Search with filters</a>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filtered.map(freelancer => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewAll;
