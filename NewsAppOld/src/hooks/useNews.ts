import { useState, useEffect, useCallback } from 'react';
import { fetchMockNews } from '../services/newsService';
import { NewsArticle, NewsCategory } from '../types/news';

export const useNews = (initialCategory: NewsCategory = 'all') => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [category, setCategory] = useState<NewsCategory>(initialCategory);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const fetchNews = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await fetch('https:/anbzskof1m.execute-api.us-east-1.amazonaws.com/prod')
  //     const data = await response.json();
  //     setNews(data.articles);
  //   } catch (err) {
  //     setError('Failed to load news');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };
  // useEffect(() => {

  //   fetchNews();
  // },);

  const loadNews = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);

        const currentPage = reset ? 1 : page;
        const response = await fetchMockNews(category, currentPage);

        setNews(prev => reset ? response.articles : [...prev, ...response.articles]);
        setHasMore(response.hasMore);
        // fetchNews();
        if (!reset) {
          setPage(prev => prev + 1);
        } else {
          setPage(2); // Next page will be 2 after refresh
        }
      } catch (err) {
        setError('Failed to load news');
        console.error(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, page]
  );

  // Initial load
  useEffect(() => {
    loadNews(true);
  }, [category]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNews(true);
  }, [loadNews]);

  // Handle category change
  const handleCategoryChange = useCallback((newCategory: NewsCategory) => {
    setCategory(newCategory);
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadNews();
    }
  }, [loading, hasMore, loadNews]);

  return {
    news,
    loading,
    refreshing,
    error,
    hasMore,
    handleRefresh,
    handleLoadMore,
    category,
    handleCategoryChange,
  };
};
