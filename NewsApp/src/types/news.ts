export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
}

export type NewsCategory =
  | 'all'
  | 'business'
  | 'entertainment'
  | 'general'
  | 'health'
  | 'science'
  | 'sports'
  | 'technology';

export interface NewsResponse {
  articles: NewsArticle[];
  hasMore: boolean;
  nextPage?: number;
}
