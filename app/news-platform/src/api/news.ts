import axios from 'axios';
import type { NewsResponse } from '../types';
import { mockNewsData } from '../data/mockNews';

const API_URL = 'https:/anbzskof1m.execute-api.us-east-1.amazonaws.com/prod/getnews';
let useMockData = false;

export const fetchNews = async (): Promise<NewsResponse> => {
  if (useMockData) {
    return mockNewsData;
  }

  try {
    const response = await axios.get<NewsResponse>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching news, using mock data instead:', error);
    useMockData = true; // Switch to mock data for future requests
    return mockNewsData;
  }
};

// Simulating a personalized news API
export const fetchPersonalizedNews = async (
  preferences: { [category: string]: number }
): Promise<NewsResponse> => {
  try {
    // Get all news (either from API or mock data)
    const allNews = await fetchNews();

    if (!preferences || Object.keys(preferences).length === 0) {
      // If no preferences, return random subset of news
      return {
        items: allNews.items
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)
      };
    }

    // Sort news based on user preferences
    const sortedNews = [...allNews.items].sort((a, b) => {
      const scoreA = preferences[a.category] || 0;
      const scoreB = preferences[b.category] || 0;
      return scoreB - scoreA;
    });

    return {
      items: sortedNews.slice(0, 10) // Return top 10 matching articles
    };
  } catch (error) {
    console.error('Error fetching personalized news:', error);
    return { items: [] };
  }
};

export const getNewsByCategory = (
  news: NewsResponse,
  category: string | null
): NewsResponse => {
  if (!category) return news;

  return {
    items: news.items.filter(item =>
      item.category.toLowerCase() === category.toLowerCase()
    )
  };
};

export const searchNews = (
  news: NewsResponse,
  query: string
): NewsResponse => {
  if (!query || query.trim() === '') return news;

  const normalizedQuery = query.toLowerCase().trim();

  return {
    items: news.items.filter(item =>
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      item.content.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery)
    )
  };
};
