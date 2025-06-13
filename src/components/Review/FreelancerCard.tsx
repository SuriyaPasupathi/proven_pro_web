import React, { useState } from 'react';

export type Freelancer = {
  id: string;
  name: string;
  title: string;
  rating: number;
  image: string;
  linkedin: string;
  upwork: string;
  fiverr: string;
};

type Props = {
  freelancer: Freelancer;
};

const FreelancerCard: React.FC<Props> = ({ freelancer }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 py-6 border-b border-[#5A8DB8]/10 relative group hover:bg-[#5A8DB8]/5 transition-colors duration-200">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative group">
          <img
            src={freelancer.image}
            alt={freelancer.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-[#5A8DB8]/20 group-hover:border-[#5A8DB8]/40 transition-all duration-200"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#5A8DB8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
        <div className="sm:hidden">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent">{freelancer.name}</span>
          </div>
          <div className="text-base text-gray-700">{freelancer.title}</div>
        </div>
      </div>
      <div className="flex-1 w-full">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xl font-semibold bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent">{freelancer.name}</span>
        </div>
        <div className="hidden sm:block text-lg text-gray-700 mb-1">{freelancer.title}</div>
        <div className="flex items-center mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < freelancer.rating ? 'text-yellow-400' : 'text-gray-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          ))}
        </div>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex flex-wrap items-center group/link">
            <span className="font-semibold text-[#5A8DB8]">Linkedin:</span>
            <a href={freelancer.linkedin} target="_blank" rel="noopener noreferrer" className="ml-1 text-[#5A8DB8] hover:text-[#3C5979] underline-offset-2 hover:underline truncate transition-colors duration-200">
              {freelancer.linkedin}
            </a>
          </div>
          <div className="flex flex-wrap items-center group/link">
            <span className="font-semibold text-[#5A8DB8]">Upwork:</span>
            <a href={freelancer.upwork} target="_blank" rel="noopener noreferrer" className="ml-1 text-[#5A8DB8] hover:text-[#3C5979] underline-offset-2 hover:underline truncate transition-colors duration-200">
              {freelancer.upwork}
            </a>
          </div>
          <div className="flex flex-wrap items-center group/link">
            <span className="font-semibold text-[#5A8DB8]">Fiverr:</span>
            <a href={freelancer.fiverr} target="_blank" rel="noopener noreferrer" className="ml-1 text-[#5A8DB8] hover:text-[#3C5979] underline-offset-2 hover:underline truncate transition-colors duration-200">
              {freelancer.fiverr}
            </a>
          </div>
        </div>
      </div>
      <div className="absolute top-6 right-0 sm:relative sm:top-auto sm:ml-2">
        <button
          className="p-2 rounded-full hover:bg-[#5A8DB8]/10 focus:outline-none transition-colors duration-200"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg className="w-6 h-6 text-[#5A8DB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-[#5A8DB8]/20 rounded-lg shadow-lg z-10 overflow-hidden">
            <button className="block w-full text-left px-4 py-2 text-sm text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition-colors duration-200">Write a review</button>
            <button className="block w-full text-left px-4 py-2 text-sm text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition-colors duration-200">Share profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerCard;
