import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  totalReviews: number;
};

const FreelancerCard: React.FC<Props> = ({ freelancer, totalReviews }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${freelancer.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
          {/* Profile Image Section */}
          <div 
            className="relative group cursor-pointer w-full sm:w-auto" 
            onClick={handleProfileClick}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden ring-4 ring-[#5A8DB8]/10 group-hover:ring-[#5A8DB8]/20 transition-all duration-300 mx-auto sm:mx-0">
              <img
                src={freelancer.image}
                alt={freelancer.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#5A8DB8]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#5A8DB8] to-[#3C5979] bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleProfileClick}
                >
                  {freelancer.name}
                </h3>
                <p className="mt-1 text-sm sm:text-base text-gray-600 line-clamp-2">{freelancer.title}</p>
              </div>

              {/* Menu Button */}
              <div className="relative">
                <button
                  className="p-2 rounded-lg hover:bg-[#5A8DB8]/10 focus:outline-none transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((v) => !v);
                  }}
                >
                  <svg className="w-5 h-5 text-[#5A8DB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#5A8DB8]/20 z-10 overflow-hidden">
                    <button 
                      className="flex items-center w-full px-4 py-3 text-sm text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${freelancer.id}/review`);
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Write a review
                    </button>
                    <button 
                      className="flex items-center w-full px-4 py-3 text-sm text-[#5A8DB8] hover:bg-[#5A8DB8]/10 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${freelancer.id}/share`);
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div className="mt-4 flex items-center justify-center sm:justify-start">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.round(freelancer.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {freelancer.rating.toFixed(1)}
                </span>
              </div>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {/* Social Links */}
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
              {freelancer.linkedin && (
                <a
                  href={freelancer.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-[#5A8DB8]/10 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              {freelancer.upwork && (
                <a
                  href={freelancer.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-[#5A8DB8]/10 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-.58c.837.515 1.79.806 2.811.806 1.304 0 2.38-.36 3.209-1.077.83-.717 1.245-1.677 1.245-2.88 0-1.203-.415-2.163-1.245-2.88-.83-.717-1.905-1.077-3.209-1.077-1.304 0-2.38.36-3.209 1.077-.83.717-1.245 1.677-1.245 2.88 0 .45.06.87.18 1.26l-1.38.45c-.12-.45-.18-.93-.18-1.44 0-1.8.63-3.33 1.89-4.59 1.26-1.26 2.79-1.89 4.59-1.89 1.8 0 3.33.63 4.59 1.89 1.26 1.26 1.89 2.79 1.89 4.59 0 1.8-.63 3.33-1.89 4.59-1.26 1.26-2.79 1.89-4.59 1.89zm-9.561 0c-1.8 0-3.33-.63-4.59-1.89-1.26-1.26-1.89-2.79-1.89-4.59 0-1.8.63-3.33 1.89-4.59 1.26-1.26 2.79-1.89 4.59-1.89 1.8 0 3.33.63 4.59 1.89 1.26 1.26 1.89 2.79 1.89 4.59 0 1.8-.63 3.33-1.89 4.59-1.26 1.26-2.79 1.89-4.59 1.89zm0-2.7c1.304 0 2.38-.36 3.209-1.077.83-.717 1.245-1.677 1.245-2.88 0-1.203-.415-2.163-1.245-2.88-.83-.717-1.905-1.077-3.209-1.077-1.304 0-2.38.36-3.209 1.077-.83.717-1.245 1.677-1.245 2.88 0 1.203.415 2.163 1.245 2.88.83.717 1.905 1.077 3.209 1.077z"/>
                  </svg>
                </a>
              )}
              {freelancer.fiverr && (
                <a
                  href={freelancer.fiverr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-[#5A8DB8]/10 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A8DB8]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.004 5.882c-1.414-.001-2.531 1.16-2.531 2.585 0 1.424 1.116 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584 0-1.425-1.117-2.584-2.531-2.584zm-9.531 2.585c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584zm-5.063 0c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584zm0 5.17c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584zm5.063 0c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584zm5.063 0c0-1.425-1.117-2.585-2.531-2.585-1.414 0-2.531 1.16-2.531 2.585 0 1.424 1.117 2.584 2.531 2.584 1.414 0 2.531-1.16 2.531-2.584z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerCard;
