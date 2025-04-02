import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import NewsScreen from '../screens/NewsScreen';
import NewsDetailScreen from '../screens/NewsDetailScreen';

// Define the types for our navigation parameters
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  News: undefined;
  NewsDetail: { articleUrl: string; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
  const { user, loading } = useAuth();

  // If still loading authentication state, you might want to show a loading screen
  if (loading) {
    return null; // or a loading component
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2c3e50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          // User is signed in
          <>
            <Stack.Screen name="News" component={NewsScreen} options={{ title: 'Daily News' }} />
            <Stack.Screen
              name="NewsDetail"
              component={NewsDetailScreen}
              options={({ route }) => ({ title: route.params.title })}
            />
          </>
        ) : (
          // User is not signed in
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
