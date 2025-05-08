import { useState, useEffect } from 'react';
import { NewsCard } from '../components/NewsCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { SearchBar } from '../components/SearchBar';
import { fetchNews, fetchPersonalizedNews, getNewsByCategory, searchNews } from '../api/news';
import { useAuth } from '../contexts/AuthContext';
import type { NewsResponse } from '../types';

export const HomePage = () => {
  const [news, setNews] = useState<NewsResponse>({ items: [] });
  const [personalizedNews, setPersonalizedNews] = useState<NewsResponse>({ items: [] });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { authState } = useAuth();
  const isAuthenticated = authState.isAuthenticated;

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const newsData = await fetchNews();
        setNews(newsData);

        if (isAuthenticated && authState.user) {
          const personalized = await fetchPersonalizedNews(authState.user.preferences);
          setPersonalizedNews(personalized);
        }
      } catch (err) {
        setError('Failed to load news. Please try again later.');
        console.error('Error loading news:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [isAuthenticated, authState.user]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    // Clear search when changing categories
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter news based on category, then apply search filter
  const filteredByCategory = getNewsByCategory(news, selectedCategory);
  const filteredNews = searchQuery
    ? searchNews(filteredByCategory, searchQuery)
    : filteredByCategory;

  // Filter personalized news with search when search is active
  const filteredPersonalizedNews = searchQuery
    ? searchNews(personalizedNews, searchQuery)
    : personalizedNews;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-text dark:text-dark-text">Latest News</h1>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 dark:bg-red-900 dark:border-red-700 dark:text-red-100" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading news...</p>
          </div>
        </div>
      ) : (
        <div>
          {/* Personalized News Section - Only shown when logged in and we have results */}
          {isAuthenticated && filteredPersonalizedNews.items.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 text-text dark:text-dark-text">
                For You
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPersonalizedNews.items.map((article) => (
                  <NewsCard key={article.article_id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* All News Section with Category Filter */}
          <div>
            {news.items.length > 0 && (
              <CategoryFilter
                news={news}
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            )}

            {filteredNews.items.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredNews.items.map((article) => (
                  <NewsCard key={article.article_id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? `No articles found matching "${searchQuery}"${selectedCategory ? ` in the "${selectedCategory}" category` : ''}.`
                    : selectedCategory
                      ? `No articles found in the "${selectedCategory}" category.`
                      : 'No articles found.'}
                </p>
                {(selectedCategory || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Show all news
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
