import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
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

const NewsScreen: React.FC = () => {
  const navigation = useNavigation<NewsScreenNavigationProp>();
  const { signOut, user } = useAuth();

  const {
    news,
    loading,
    refreshing,
    error,
    hasMore,
    handleRefresh,
    handleLoadMore,
    category,
    handleCategoryChange,
  } = useNews();

  const categories: NewsCategory[] = useMemo(
    () => [
      'all',
      'business',
      'entertainment',
      'general',
      'health',
      'science',
      'sports',
      'technology',
    ],
    []
  );

  const handleCardPress = (article: NewsArticle) => {
    navigation.navigate('NewsDetail', {
      articleUrl: article.url,
      title: article.title,
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
    if (!hasMore) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading && news.length === 0) {
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

    if (news.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="newspaper-outline" size={50} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No news articles found</Text>
          {category !== 'all' && (
            <Text style={styles.emptySubText}>
              Try selecting a different category
            </Text>
          )}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.email?.split('@')[0] || 'Reader'}!
        </Text>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          size="small"
        />
      </View>

      <CategoryFilter
        categories={categories}
        selectedCategory={category}
        onSelectCategory={handleCategoryChange}
      />

      <FlatList
        data={news}
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
});

export default NewsScreen;
