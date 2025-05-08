import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewsArticle } from '../types/news';
import { colors, spacing, fontSize, borderRadius, shadow } from '../utils/theme';

interface NewsCardProps {
  article: NewsArticle;
  onPress: (article: NewsArticle) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
};

const screenWidth = Dimensions.get('window').width;

const NewsCard: React.FC<NewsCardProps> = ({ article, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(article)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {article.imageUrl ? (
          <Image source={{ uri: article.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="newspaper-outline" size={40} color={colors.textSecondary} />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.category}>{article.category.toUpperCase()}</Text>
          <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
          <Text style={styles.summary} numberOfLines={3}>{article.summary}</Text>

          <View style={styles.footer}>
            <Text style={styles.source}>{article.source}</Text>
            <Text style={styles.time}>{formatDate(article.publishedAt)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    marginVertical: spacing.s,
    marginHorizontal: spacing.m,
    ...shadow.light,
  },
  cardContent: {
    flexDirection: 'column',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: borderRadius.m,
    borderTopRightRadius: borderRadius.m,
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: borderRadius.m,
    borderTopRightRadius: borderRadius.m,
  },
  textContainer: {
    padding: spacing.m,
  },
  category: {
    fontSize: fontSize.xs,
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.l,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.s,
  },
  summary: {
    fontSize: fontSize.m,
    color: colors.textSecondary,
    marginBottom: spacing.m,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  source: {
    fontSize: fontSize.s,
    color: colors.text,
    fontWeight: '500',
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});

export default NewsCard;
