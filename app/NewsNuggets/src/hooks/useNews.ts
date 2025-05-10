import { useState, useEffect, useCallback, useRef } from 'react';
import { NewsArticle, NewsCategory } from '../types/news';
import { apiService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing category visits in AsyncStorage
const CATEGORY_VISITS_KEY = '@news_app_category_visits';

export const useNews = (initialCategory: NewsCategory = 'all') => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>(['all']);
  const [category, setCategory] = useState<NewsCategory>(initialCategory);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [categoryVisits, setCategoryVisits] = useState<Record<string, number>>({});
  const [forYouNews, setForYouNews] = useState<NewsArticle[]>([]);
  const lastKeyRef = useRef<string | undefined>(undefined);

  // Function to load category visits from AsyncStorage
  const loadCategoryVisits = useCallback(async () => {
    try {
      const storedVisits = await AsyncStorage.getItem(CATEGORY_VISITS_KEY);
      if (storedVisits) {
        setCategoryVisits(JSON.parse(storedVisits));
      }
    } catch (err) {
      console.error('Failed to load category visits:', err);
    }
  }, []);

  // Function to save category visits to AsyncStorage
  const saveCategoryVisits = useCallback(async (visits: Record<string, number>) => {
    try {
      await AsyncStorage.setItem(CATEGORY_VISITS_KEY, JSON.stringify(visits));
    } catch (err) {
      console.error('Failed to save category visits:', err);
    }
  }, []);

  // Load category visits when the component mounts
  useEffect(() => {
    loadCategoryVisits();
  }, [loadCategoryVisits]);

  // Function to track category visits
  const trackCategoryVisit = useCallback((cat: NewsCategory) => {
    if (cat === 'all') return; // Don't track "all" category

    setCategoryVisits(prevVisits => {
      const newVisits = {
        ...prevVisits,
        [cat]: (prevVisits[cat] || 0) + 1
      };

      // Save the updated visits
      saveCategoryVisits(newVisits);

      return newVisits;
    });
  }, [saveCategoryVisits]);

  // Function to extract unique categories from articles
  const extractCategories = useCallback((articles: NewsArticle[]) => {
    const uniqueCategories = new Set<string>();
    uniqueCategories.add('all'); // Always include 'all' option

    articles.forEach(article => {
      if (article.category) {
        uniqueCategories.add(article.category);
      }
    });

    return Array.from(uniqueCategories);
  }, []);

  // Function to filter news by category
  const filterNewsByCategory = useCallback((articles: NewsArticle[], cat: NewsCategory) => {
    if (cat === 'all') return articles;
    return articles.filter(article => article.category === cat);
  }, []);

  // Function to create "For You" personalized news
  const createForYouNews = useCallback((allArticles: NewsArticle[], visits: Record<string, number>) => {
    // Get top 3 categories by visit count
    const topCategories = Object.entries(visits)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3)
      .map(([cat]) => cat);

    // If user hasn't visited categories yet, return most recent articles
    if (topCategories.length === 0) {
      return [...allArticles].sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ).slice(0, 10);
    }

    // Get articles from top categories
    const personalizedArticles = allArticles.filter(
      article => topCategories.includes(article.category)
    );

    // Sort by date (newest first)
    return personalizedArticles.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, []);

  // Load news function with lastKey support
  const loadNews = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);

        // Use lastKey for pagination unless we're resetting
        const lastKey = reset ? undefined : lastKeyRef.current;

        // Fetch news using the real API
        const response = await apiService.getNews(lastKey);

        if (response.error || !response.data) {
          setError('Failed to load news');
          console.error(response.error);
          return;
        }

        // Store the lastKey for next pagination
        lastKeyRef.current = response.data.lastKey;
        setHasMore(!!response.data.lastKey);

        // Extract categories if this is a reset or first load
        if (reset) {
          const allCategories = extractCategories(response.data.articles);
          setCategories(allCategories);
        }

        // Update news articles
        const allArticles = reset
          ? response.data.articles
          : [...news, ...response.data.articles.filter(article =>
              !news.some(existing => existing.id === article.id)
            )];

        setNews(allArticles);

        // Filter articles by selected category if needed
        const filteredArticles = filterNewsByCategory(allArticles, category);

        // Create "For You" news section
        const personalized = createForYouNews(allArticles, categoryVisits);
        setForYouNews(personalized);
      } catch (err) {
        setError('Failed to load news');
        console.error(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, filterNewsByCategory, extractCategories, news, categoryVisits, createForYouNews]
  );

  // Initial load
  useEffect(() => {
    loadNews(true);
  }, [loadNews]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Reset lastKey on refresh
    lastKeyRef.current = undefined;
    loadNews(true);
  }, [loadNews]);

  // Handle category change
  const handleCategoryChange = useCallback((newCategory: NewsCategory) => {
    setCategory(newCategory);
    trackCategoryVisit(newCategory);
  }, [trackCategoryVisit]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadNews(false);
    }
  }, [loading, hasMore, loadNews]);

  return {
    news: filterNewsByCategory(news, category),
    allNews: news,
    forYouNews,
    loading,
    refreshing,
    error,
    hasMore,
    handleRefresh,
    handleLoadMore,
    categories,
    category,
    handleCategoryChange,
  };
};
