import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { User, type AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (category: string) => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Check if token exists in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      setAuthState({
        user: JSON.parse(userData),
        isAuthenticated: true,
        token,
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        'https://anbzskof1m.execute-api.us-east-1.amazonaws.com/prod/login',
        { username, password }
      );

      const { token, user } = response.data;

      // Initialize preferences if they don't exist
      if (!user.preferences) {
        user.preferences = {};
      }

      // Store auth data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        token,
      });
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(
        'https://anbzskof1m.execute-api.us-east-1.amazonaws.com/prod/signup',
        { username, email, password }
      );

      const { token, user } = response.data;

      // Initialize empty preferences
      user.preferences = {};

      // Store auth data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        token,
      });
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setAuthState(initialState);
  };

  const updatePreferences = (category: string) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user };
    const preferences = updatedUser.preferences || {};

    preferences[category] = (preferences[category] || 0) + 1;
    updatedUser.preferences = preferences;

    // Update localStorage
    localStorage.setItem('user_data', JSON.stringify(updatedUser));

    // Update state
    setAuthState({
      ...authState,
      user: updatedUser,
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout,
      updatePreferences
    }}>
      {children}
    </AuthContext.Provider>
  );
};
