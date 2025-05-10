import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { apiService } from '../services/apiService';

type Session = {
  user: User | null;
  userId?: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on load
    const checkSession = async () => {
      const currentUser = await apiService.getCurrentUser();

      if (currentUser) {
        const mockUser = {
          id: currentUser.userId,
          email: '',
          aud: 'authenticated',
          role: 'authenticated',
        } as User;

        const currentSession = {
          user: mockUser,
          userId: currentUser.userId,
          name: currentUser.name,
        };

        setUser(mockUser);
        setSession(currentSession);
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await apiService.signup({ email, password, name });

      if (data && !error) {
        const mockUser = {
          id: data.userId,
          email: email,
          aud: 'authenticated',
          role: 'authenticated',
        } as User;

        const newSession = {
          user: mockUser,
          userId: data.userId,
          name: data.name,
        };

        setUser(mockUser);
        setSession(newSession);
      }

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await apiService.login({ email, password });

      if (data && !error) {
        const mockUser = {
          id: data.userId,
          email: email,
          aud: 'authenticated',
          role: 'authenticated',
        } as User;

        const newSession = {
          user: mockUser,
          userId: data.userId,
          name: data.name,
        };

        setUser(mockUser);
        setSession(newSession);
      }

      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    await apiService.logout();
    setUser(null);
    setSession(null);
  };

  const googleSignIn = async () => {
    try {
      // For now, just use the same mock implementation
      // In a real app, this would call the appropriate OAuth endpoint
      console.warn('Google sign in not implemented with real API');
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
