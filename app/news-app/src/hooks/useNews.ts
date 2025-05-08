import useSWR from 'swr';
import type { NewsResponse, NewsArticle } from '@/types';
import { getNews, getNewsByCategory, getPersonalizedNews } from '@/services/newsService';
import { useAuth } from '@/contexts/AuthContext';

// Common fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useNews(category = 'all') {
  const { token, isAuthenticated } = useAuth();

  // Fetch regular news
  const { data: newsData, error: newsError, isLoading: newsLoading } = useSWR<NewsResponse>(
    'news-data',
    () => (category === 'all' ? getNews() : getNewsByCategory(category)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 300000, // 5 minutes
    }
  );

  // Fetch personalized news if authenticated
  const { data: personalizedData, error: personalizedError, isLoading: personalizedLoading } = useSWR<NewsResponse>(
    isAuthenticated ? 'personalized-news' : null,
    () => getPersonalizedNews(token || ''),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 300000, // 5 minutes
    }
  );

  // Filter and sort articles
  const articles: NewsArticle[] = newsData?.items || [];
  const personalizedArticles: NewsArticle[] = personalizedData?.items || [];

  return {
    articles,
    personalizedArticles,
    isLoading: newsLoading || (isAuthenticated && personalizedLoading),
    isError: !!newsError || (isAuthenticated && !!personalizedError),
  };
}
