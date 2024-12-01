import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { NewsFeed } from './components/NewsFeed';
import NewsReels from './components/NewsReels';
import type { Article } from './types';

const API_Key = "YOUR_NEWS_API_KEY" //ur nes apikey (visit "https://newsapi.org/" for key)

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'reels'>('feed');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=apple&from=2024-11-30&to=2024-11-30&sortBy=popularity&apiKey=${API_Key}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        if (data.status === 'error') {
          throw new Error(data.message || 'Failed to fetch news');
        }
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (error) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        activeTab === 'feed' ? (
          <NewsFeed articles={articles} />
        ) : (
          <NewsReels articles={articles} />
        )
      )}
    </Layout>
  );
}

export default App;