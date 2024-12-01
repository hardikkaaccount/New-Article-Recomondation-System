import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Article } from '../types';
import { formatDate } from '../utils';

interface NewsReelsProps {
  articles: Article[];
}

const NewsReels: React.FC<NewsReelsProps> = ({ articles = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container
  const isScrolling = useRef(false); // Prevent excessive scrolling events

  const handleScroll = useCallback(
    (direction: 'up' | 'down') => {
      if (isScrolling.current) return; // Prevent scrolling while in animation
      isScrolling.current = true;

      if (direction === 'up' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (direction === 'down' && currentIndex < articles.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }

      setTimeout(() => {
        isScrolling.current = false; // Allow scrolling after animation
      }, 500); // Match CSS animation duration
    },
    [currentIndex, articles.length]
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (event.deltaY > 0) {
        handleScroll('down');
      } else {
        handleScroll('up');
      }
    },
    [handleScroll]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        handleScroll('up');
      } else if (event.key === 'ArrowDown') {
        handleScroll('down');
      }
    },
    [handleScroll]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Smooth scroll to the current article when the index changes
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const articleHeight = container.offsetHeight; // Height of the container
      container.scrollTo({
        top: currentIndex * articleHeight,
        behavior: 'smooth', // Smooth scroll animation
      });
    }
  }, [currentIndex]);

  if (!articles.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">No articles available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[100vh] overflow-hidden"
      onWheel={handleWheel} // Handle mouse wheel scrolling
      style={{
        overflowY: 'scroll', // Keep scroll functionality
        scrollbarWidth: 'none', // Hide scrollbar for Firefox
        msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
      }}
    >
      <div className="snap-y snap-mandatory h-full">
        {articles.map((article, index) => (
          <div
            key={article.title}
            className={`snap-center flex flex-col items-center justify-center h-full transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{article.source.name}</span>
                  <time>{formatDate(article.publishedAt)}</time>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-6 text-lg">{article.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {index + 1} of {articles.length}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Read full article
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add up and down buttons */}
      <button
        onClick={() => handleScroll('up')}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        disabled={currentIndex === 0}
      >
        Up
      </button>
      <button
        onClick={() => handleScroll('down')}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        disabled={currentIndex === articles.length - 1}
      >
        Down
      </button>
    </div>
  );
};

export default NewsReels;
