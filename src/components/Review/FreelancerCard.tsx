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
    <div className="flex flex-col sm:flex-row items-start gap-4 py-6 border-b border-gray-200 relative group">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <img
          src={freelancer.image}
          alt={freelancer.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover border border-gray-300"
        />
        <div className="sm:hidden">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#5A8DB8]">{freelancer.name}</span>
          </div>
          <div className="text-base text-gray-700">{freelancer.title}</div>
        </div>
      </div>
      <div className="flex-1 w-full">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xl font-semibold text-[#5A8DB8]">{freelancer.name}</span>
        </div>
        <div className="hidden sm:block text-lg text-gray-700 mb-1">{freelancer.title}</div>
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < freelancer.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          ))}
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex flex-wrap items-center">
            <span className="font-semibold">Linkedin:</span>
            <a href={freelancer.linkedin} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 underline truncate">
              {freelancer.linkedin}
            </a>
          </div>
          <div className="flex flex-wrap items-center">
            <span className="font-semibold">Upwork:</span>
            <a href={freelancer.upwork} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 underline truncate">
              {freelancer.upwork}
            </a>
          </div>
          <div className="flex flex-wrap items-center">
            <span className="font-semibold">Fiverr:</span>
            <a href={freelancer.fiverr} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 underline truncate">
              {freelancer.fiverr}
            </a>
          </div>
        </div>
      </div>
      <div className="absolute top-6 right-0 sm:relative sm:top-auto sm:ml-2">
        <button
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow z-10">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Write a review</button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Share profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerCard;
