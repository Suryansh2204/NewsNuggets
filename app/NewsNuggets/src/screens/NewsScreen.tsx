import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';
import { useNews } from '../hooks/useNews';
import { useAuth } from '../contexts/AuthContext';
import { NewsArticle, NewsCategory } from '../types/news';
import NewsCard from '../components/NewsCard';
import CategoryFilter from '../components/CategoryFilter';
import Button from '../components/Button';
import { colors, spacing, fontSize } from '../utils/theme';

type NewsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'News'
>;

type ViewMode = 'all' | 'forYou';

const NewsScreen: React.FC = () => {
  const navigation = useNavigation<NewsScreenNavigationProp>();
  const { signOut, user, session } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const {
    news,
    forYouNews,
    loading,
    refreshing,
    error,
    hasMore,
    handleRefresh,
    handleLoadMore,
    category,
    categories,
    handleCategoryChange,
  } = useNews();

  const displayedNews = useMemo(() => {
    return viewMode === 'forYou' ? forYouNews : news;
  }, [viewMode, forYouNews, news]);

  const handleCardPress = (article: NewsArticle) => {
    navigation.navigate('NewsDetail', {
      article: article,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
      console.error(error);
    }
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    return null;
  };

  // Get user's name from the session if available
  const userName = useMemo(() => {
    if (session?.name) {
      return session.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Reader';
  }, [user, session]);

  const renderEmptyComponent = () => {
    if (loading && displayedNews.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={50} color={colors.error} />
          <Text style={styles.emptyText}>Failed to load news</Text>
          <Button
            title="Try Again"
            onPress={handleRefresh}
            variant="secondary"
            style={styles.retryButton}
          />
        </View>
      );
    }

    if (displayedNews.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="newspaper-outline" size={50} color={colors.textSecondary} />
          {viewMode === 'forYou' ? (
            <>
              <Text style={styles.emptyText}>No personalized news yet</Text>
              <Text style={styles.emptySubText}>
                Browse more news to personalize your feed
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.emptyText}>No news articles found</Text>
              {category !== 'all' && (
                <Text style={styles.emptySubText}>
                  Try selecting a different category
                </Text>
              )}
            </>
          )}
        </View>
      );
    }

    return null;
  };

  const renderViewToggle = () => (
    <View style={styles.viewToggle}>
      <TouchableOpacity
        style={[
          styles.viewToggleButton,
          viewMode === 'all' && styles.viewToggleButtonActive,
        ]}
        onPress={() => setViewMode('all')}
      >
        <Text
          style={[
            styles.viewToggleText,
            viewMode === 'all' && styles.viewToggleTextActive,
          ]}
        >
          All News
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.viewToggleButton,
          viewMode === 'forYou' && styles.viewToggleButtonActive,
        ]}
        onPress={() => setViewMode('forYou')}
      >
        <Text
          style={[
            styles.viewToggleText,
            viewMode === 'forYou' && styles.viewToggleTextActive,
          ]}
        >
          For You
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {userName}!
        </Text>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          size="small"
        />
      </View>

      {renderViewToggle()}

      {viewMode === 'all' && (
        <CategoryFilter
          categories={categories}
          selectedCategory={category}
          onSelectCategory={handleCategoryChange}
        />
      )}

      <FlatList
        data={displayedNews}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NewsCard article={item} onPress={handleCardPress} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: fontSize.l,
    fontWeight: '600',
    color: colors.text,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.m,
  },
  loaderContainer: {
    paddingVertical: spacing.m,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: spacing.s,
    fontSize: fontSize.s,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 300,
  },
  emptyText: {
    fontSize: fontSize.l,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.m,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: fontSize.m,
    color: colors.textSecondary,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.m,
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  viewToggleButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    marginHorizontal: spacing.s,
    borderRadius: 20,
  },
  viewToggleButtonActive: {
    backgroundColor: colors.primary,
  },
  viewToggleText: {
    fontSize: fontSize.m,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  viewToggleTextActive: {
    color: 'white',
  },
});

export default NewsScreen;
