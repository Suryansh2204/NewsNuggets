# News App with Mock Authentication

This mobile application allows users to browse and read news articles categorized by different topics. It includes features like authentication, news listing, category filtering, and article details.

## Demo Mode

This application is configured to run in **Demo Mode** without requiring a real Supabase backend. It uses the following features:

### Mock Authentication

Instead of connecting to Supabase, the app uses a local mock authentication system:

- **Demo Credentials**:
  - Email: `user@example.com`
  - Password: `password123`

- You can also create new accounts with any email and password (these will only be stored in memory during the app session)

### Mock News Data

The app displays demo news data with:

- 50 mock news articles
- 7 different categories (business, entertainment, general, health, science, sports, technology)
- Pagination support (10 articles per page)
- Random images for some articles

## Application Structure

- **Authentication**: Sign in, sign up, and sign out functionality
- **News Feed**: Browse news articles with infinite scrolling
- **Category Filtering**: Filter news by category
- **News Details**: View full article details

## Key Features

- User authentication flow
- Responsive design for different screen sizes
- Category-based news filtering
- Article previews with images
- Detailed article view
- Loading state indicators

## Technical Details

This app is built with:

- React Native
- Expo
- React Navigation
- AsyncStorage for local persistence
- Custom UI components

## Getting Started

1. Install dependencies:
   ```
   bun install
   ```

2. Start the development server:
   ```
   bun start
   ```

3. Use the Expo Go app on your mobile device or an emulator to run the application

No additional configuration is needed since the app is configured to run with mock data and authentication.
