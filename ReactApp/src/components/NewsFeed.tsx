import { ExternalLink, Clock } from 'lucide-react';
import { Article } from '../types';
import { formatDate } from '../utils';

interface NewsFeedProps {
  articles: Article[];
}

export function NewsFeed({ articles = [] }: NewsFeedProps) {
  if (!articles.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">No articles available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <article
          key={`${article.title}-${index}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <time>{formatDate(article.publishedAt)}</time>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {article.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {article.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600">
                {article.source.name}
              </span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Read more
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}