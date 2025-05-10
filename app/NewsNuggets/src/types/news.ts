export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
  content: string;
  description: string;
}

export function copyToNewsArticle(data: any): NewsArticle {
  return {
    id: data.article_id,
    title: data.title,
    description: data.description,
    content: data.content,
    imageUrl: data.image_url || undefined,
    summary: data.summary,
    category: data.category,
    source: data.source,
    publishedAt: data.publishedAt,
  };
}

// Make NewsCategory a dynamic type that can accept any string
export type NewsCategory = string;

export interface NewsResponse {
  articles: NewsArticle[];
  hasMore: boolean;
  lastKey?: string; // Add lastKey for pagination
}
