import { useState, useEffect } from 'react';

// Get the base URL from environment variable
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface PortfolioItem {
  project_title: string;
  project_description: string;
  project_url: string;
  project_image: string;
  project_image_url: string;
}

interface PortfolioSectionProps {
  portfolio?: PortfolioItem[];
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolio = [] }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // Function to get full image URL
  const getFullImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${baseUrl}${url}`;
  };

  const handleItemClick = (id: number) => {
    setSelectedItem(id === selectedItem ? null : id);
  };

  // Debug logging
  useEffect(() => {
    console.log('Portfolio Section - Raw Portfolio Data:', portfolio);
    console.log('Portfolio Section - Portfolio Length:', portfolio.length);
    if (portfolio.length > 0) {
      console.log('Portfolio Section - First Portfolio Item:', portfolio[0]);
      console.log('Portfolio Section - First Item Image URL:', getFullImageUrl(portfolio[0].project_image_url || portfolio[0].project_image));
    }
  }, [portfolio]);

  // Parse portfolio data if it's a string
  const parsedPortfolio = Array.isArray(portfolio) ? portfolio : 
    typeof portfolio === 'string' ? JSON.parse(portfolio) : [];

  if (!parsedPortfolio || parsedPortfolio.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
        <p className="text-gray-600">No portfolio items available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parsedPortfolio.slice(0, 3).map((item: PortfolioItem, index: number) => {
          const imageUrl = getFullImageUrl(item.project_image_url || item.project_image);
          console.log(`Portfolio Section - Item ${index} Image URL:`, imageUrl);
          
          return (
            <div 
              key={index}
              className="relative group overflow-hidden rounded-lg cursor-pointer"
              onClick={() => handleItemClick(index)}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={imageUrl}
                  alt={item.project_title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    console.error('Portfolio Section - Image load error:', e);
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.project_title}</h3>
                  <p className="text-sm">{item.project_description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedItem !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-lg overflow-hidden max-w-3xl w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={getFullImageUrl(parsedPortfolio[selectedItem].project_image_url || parsedPortfolio[selectedItem].project_image)} 
                alt={parsedPortfolio[selectedItem].project_title}
                className="w-full h-auto max-h-[60vh] object-contain"
                onError={(e) => {
                  console.error('Portfolio Section - Modal Image load error:', e);
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{parsedPortfolio[selectedItem].project_title}</h3>
                <p className="text-gray-600 mb-4">{parsedPortfolio[selectedItem].project_description}</p>
                {parsedPortfolio[selectedItem].project_url && (
                  <a 
                    href={parsedPortfolio[selectedItem].project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Project →
                  </a>
                )}
              </div>
              <button 
                className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white rounded-full flex items-center justify-center"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;