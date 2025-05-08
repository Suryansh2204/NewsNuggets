import axios from 'axios';
import type { NewsResponse } from '@/types';

const API_URL = 'https://2sk4mizhja.execute-api.us-east-1.amazonaws.com/prod/getnews';

export async function getNews(): Promise<NewsResponse> {
  try {
    const response = await axios.get<NewsResponse>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function getNewsByCategory(category: string): Promise<NewsResponse> {
  try {
    const response = await axios.get<NewsResponse>(`${API_URL}?category=${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error);
    throw error;
  }
}

export function getCategories(): string[] {
  return [
    'general',
    'business',
    'entertainment',
    'health',
    'science',
    'sports',
    'technology',
  ];
}

export async function getPersonalizedNews(token: string): Promise<NewsResponse> {
  try {
    const response = await axios.get<NewsResponse>(`${API_URL}/personalized`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching personalized news:', error);
    // Return empty array if personalized news fails
    return { items: [] };
  }
}
