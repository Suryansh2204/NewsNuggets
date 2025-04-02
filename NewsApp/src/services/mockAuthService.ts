import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock users database
interface MockUser {
  id: string;
  email: string;
  password: string;
}

// Initial mock users
const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'user@example.com',
    password: 'password123'
  }
];

// Keys for AsyncStorage
const USER_STORAGE_KEY = '@news_app_current_user';
const SESSION_STORAGE_KEY = '@news_app_session';

// Generate a mock session
const createMockSession = (user: MockUser) => {
  const session = {
    access_token: `mock_token_${Date.now()}`,
    refresh_token: `mock_refresh_${Date.now()}`,
    user: {
      id: user.id,
      email: user.email,
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
    },
    expires_at: Date.now() + 3600 * 1000 * 24, // 24 hours from now
  };
  return session;
};

// Store session in AsyncStorage
const storeSession = async (session: any) => {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

// Store user in AsyncStorage
const storeUser = async (user: any) => {
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

// Mock sign up function
export const mockSignUp = async (email: string, password: string) => {
  try {
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return {
        data: null,
        error: new Error('User already exists with this email'),
      };
    }

    // Create new user
    const newUser = {
      id: `user-${mockUsers.length + 1}`,
      email,
      password,
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Create session
    const session = createMockSession(newUser);

    // Store in AsyncStorage
    await storeSession(session);
    await storeUser(newUser);

    return {
      data: { session, user: newUser },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
};

// Mock sign in function
export const mockSignIn = async (email: string, password: string) => {
  try {
    // Find user
    const user = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return {
        data: null,
        error: new Error('Invalid login credentials'),
      };
    }

    // Create session
    const session = createMockSession(user);

    // Store in AsyncStorage
    await storeSession(session);
    await storeUser(user);

    return {
      data: { session, user },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
};

// Mock sign out function
export const mockSignOut = async () => {
  await AsyncStorage.removeItem(USER_STORAGE_KEY);
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  return { error: null };
};

// Mock function to get the current session
export const mockGetSession = async () => {
  try {
    const sessionStr = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    const session = sessionStr ? JSON.parse(sessionStr) : null;

    // Check if session is expired
    if (session && session.expires_at < Date.now()) {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      return { session: null };
    }

    return { session };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null };
  }
};

// Auth state change listeners
let listeners: Array<(event: string, session: any) => void> = [];

// Function to subscribe to auth changes
export const mockOnAuthStateChange = (callback: (event: string, session: any) => void) => {
  listeners.push(callback);

  // Call with current session immediately
  mockGetSession().then(({ session }) => {
    callback('INITIAL', session);
  });

  // Return unsubscribe function
  return {
    subscription: {
      unsubscribe: () => {
        listeners = listeners.filter(listener => listener !== callback);
      },
    },
  };
};

// Mock google sign in (always succeeds with default user)
export const mockGoogleSignIn = async () => {
  const defaultUser = mockUsers[0];
  const session = createMockSession(defaultUser);

  await storeSession(session);
  await storeUser(defaultUser);

  // Notify listeners
  listeners.forEach(listener => {
    listener('SIGNED_IN', session);
  });

  return { data: { session }, error: null };
};
