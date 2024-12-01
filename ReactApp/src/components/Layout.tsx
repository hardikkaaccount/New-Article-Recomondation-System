import React from 'react';
import { Newspaper, Film, Compass } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'feed' | 'reels' | 'explore';
  onTabChange: (tab: 'feed' | 'reels' | 'explore') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  // Handle the "Explore" button click
  const handleExploreClick = (): void => {
    window.location.href = 'http://localhost:5000'; // Open the page in the same tab
  };

  return (
  <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Newspaper className="h-4 w-4 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">NewsHub</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => onTabChange('feed')}
                  className={`${
                    activeTab === 'feed'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Newspaper className="h-4 w-4 mr-2" />
                  News Feed
                </button>
                <button
                  onClick={() => onTabChange('reels')}
                  className={`${
                    activeTab === 'reels'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Film className="h-4 w-4 mr-2" />
                  News Reels
                </button>
                <button
                  onClick={handleExploreClick} // Call handleExploreClick on click
                  className={`${
                    activeTab === 'explore'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Compass className="h-4 w-4 mr-2" />
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
