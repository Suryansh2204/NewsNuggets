import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsResponse, copyToNewsArticle } from '../types/news';

// API base URL
const BASE_URL = 'https://anbzskof1m.execute-api.us-east-1.amazonaws.com/prod';

// API endpoints
const ENDPOINTS = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  GET_NEWS: '/getnews',
};

// User storage key
const USER_STORAGE_KEY = '@news_app_user';

// Types
interface LoginResponse {
  userId: string;
  name: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

// API service methods
export const apiService = {
  // Login user
  login: async (data: LoginData): Promise<{ data: LoginResponse | null; error: Error | null }> => {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: new Error(errorData.message || 'Login failed') };
      }

      const userData = await response.json();

      // Store user data in AsyncStorage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      return { data: userData, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error: error as Error };
    }
  },

  // Sign up user
  signup: async (data: SignupData): Promise<{ data: LoginResponse | null; error: Error | null }> => {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: new Error(errorData.message || 'Signup failed') };
      }

      const userData = await response.json();

      // Store user data in AsyncStorage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      return { data: userData, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error: error as Error };
    }
  },

  // Get news with lastKey support for pagination
  getNews: async (lastKey?: string): Promise<{ data: NewsResponse | null; error: Error | null }> => {
    try {
      // Create request body with lastKey if provided
      const url = lastKey ? `${BASE_URL}${ENDPOINTS.GET_NEWS}?lastKey=${lastKey}` : `${BASE_URL}${ENDPOINTS.GET_NEWS}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: new Error(errorData.message || 'Failed to fetch news') };
      }

      const res = await response.json();
      // The API returns an object with 'items' array and possibly a 'lastKey'
      const items = res['items'];
      const articles = Array.isArray(items)
        ? items.map((item: any) => copyToNewsArticle(item))
        : [];

      const formattedResponse: NewsResponse = {
        articles,
        hasMore: !!res['lastKey'], // If lastKey exists, there are more articles to load
        lastKey: res['lastKey'] // Include the lastKey in the response
      };

      return { data: formattedResponse, error: null };
    } catch (error) {
      console.error('Get news error:', error);
      return { data: null, error: error as Error };
    }
  },

  // Get current user from AsyncStorage
  getCurrentUser: async (): Promise<LoginResponse | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Clear user data from AsyncStorage (logout)
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};
