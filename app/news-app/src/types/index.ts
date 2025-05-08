export type NewsArticle = {
  title: string;
  description: string;
  summary: string;
  content: string;
  publishedAt: string;
  category: string;
  source: string;
  image_url: string;
  article_id: string;
};

export type NewsResponse = {
  items: NewsArticle[];
};

export type User = {
  id: string;
  name?: string;
  email?: string;
  username: string;
  preferences?: {
    [category: string]: number;
  };
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
};
