import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthState, User } from "../types";

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    username: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (category: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      isAuthenticated: Boolean(storedToken),
      token: storedToken,
    };
  });

  useEffect(() => {
    if (authState.user) {
      localStorage.setItem("user", JSON.stringify(authState.user));
    } else {
      localStorage.removeItem("user");
    }

    if (authState.token) {
      localStorage.setItem("token", authState.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [authState]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo, we'll create a fake user
      const response = await fetch(
        "https://anbzskof1m.execute-api.us-east-1.amazonaws.com/prod/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Login failed");
      }
      console.log(response.body);
      const data = await response.json();
      console.log(data);

      const fakeUser: User = {
        id: data.user_id,
        email,
        username: data.name,
        preferences: {},
      };

      const fakeToken = `fake-jwt-token-${Math.random().toString(36).substring(2, 15)}`;

      setAuthState({
        user: fakeUser,
        isAuthenticated: true,
        token: fakeToken,
      });

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (
    email: string,
    name: string,
    password: string
  ): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo, we'll create a fake user
      const response = await fetch(
        "https://anbzskof1m.execute-api.us-east-1.amazonaws.com/prod/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            password,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      const data = await response.json();
      const user: User = {
        id: data.id,
        name,
        email,
        username: "Suryansh",
      };

      const fakeToken = `fake-jwt-token-${Math.random().toString(36).substring(2, 15)}`;

      setAuthState({
        user: user,
        isAuthenticated: true,
        token: fakeToken,
      });

      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
    });
  };

  const updatePreferences = (category: string) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user };
    const currentPreferences = { ...updatedUser.preferences };

    currentPreferences[category] = (currentPreferences[category] || 0) + 1;
    updatedUser.preferences = currentPreferences;

    setAuthState({
      ...authState,
      user: updatedUser,
    });
  };

  return (
    <AuthContext.Provider
      value={{ authState, login, signup, logout, updatePreferences }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
