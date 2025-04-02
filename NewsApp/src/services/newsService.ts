import { NewsArticle, NewsCategory, NewsResponse } from '../types/news';

// Constants
const ITEMS_PER_PAGE = 10;

// Generate mock news data
const generateMockArticles = (): NewsArticle[] => {
  return Array.from({ length: 50 }, (_, i) => {
    const categories: NewsCategory[] = [
      'business',
      'entertainment',
      'general',
      'health',
      'science',
      'sports',
      'technology',
    ];
    const categoryIndex = i % categories.length;
    const articleCategory = categories[categoryIndex];

    return {
      id: `article-${i}`,
      title: `News Article ${i + 1}`,
      summary: `This is a summary of news article ${i + 1}. It contains important information about recent events in the ${articleCategory} category.`,
      source: `News Source ${(i % 5) + 1}`,
      url: 'https://example.com/news',
      category: articleCategory,
      publishedAt: new Date(
        Date.now() - i * 3600000
      ).toISOString(),
      imageUrl: i % 3 === 0 ? `https://picsum.photos/seed/${i}/400/200` : undefined,
    };
  });
};

// Store the mock articles to keep them consistent between calls
const mockArticles = generateMockArticles();

/**
 * Fetch mock news articles with optional filtering by category
 *
 * @param category The category to filter by, or 'all' for all categories
 * @param page The page number for pagination
 * @returns A NewsResponse object with articles and pagination info
 */
export const fetchMockNews = async (
  category: NewsCategory = 'all',
  page: number = 1
): Promise<NewsResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filter by category if not 'all'
  const filteredArticles = category === 'all'
    ? mockArticles
    : mockArticles.filter(article => article.category === category);

  // Paginate
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredArticles.length;

  return {
    articles: paginatedArticles,
    hasMore,
    nextPage: hasMore ? page + 1 : undefined,
  };
};

// Set fetchNews to be the same as fetchMockNews for simplicity
export const fetchNews = fetchMockNews;
