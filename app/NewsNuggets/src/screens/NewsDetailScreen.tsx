import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation';
import { colors, spacing, fontSize, borderRadius, shadow } from '../utils/theme';

type NewsDetailScreenRouteProp = RouteProp<RootStackParamList, 'NewsDetail'>;

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const NewsDetailScreen: React.FC = () => {
  const route = useRoute<NewsDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { article } = route.params;

  const handleOpenInBrowser = async () => {
    try {
      const supported = await Linking.canOpenURL(article.source);

      if (supported) {
        await Linking.openURL(article.source);
      } else {
        Alert.alert('Error', 'Cannot open this URL in browser');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
      console.error(error);
    }
  };

  const renderRightHeader = () => {
    return (
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleOpenInBrowser}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Ionicons name="open-outline" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  // Set header right button
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderRightHeader,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Article Image */}
        {article.imageUrl ? (
          <Image source={{ uri: article.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="newspaper-outline" size={60} color={colors.textSecondary} />
          </View>
        )}

        <View style={styles.contentContainer}>
          {/* Category Badge */}
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{article.category.toUpperCase()}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Source and Date */}
          <View style={styles.metaContainer}>
            <Text style={styles.source}>Source: Bangkok Post</Text>
            <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
          </View>

          {/* Description */}
          {article.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{article.description}</Text>
            </View>
          )}

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summary}>{article.summary}</Text>
          </View>

          {/* Content */}
          {article.content && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Content</Text>
              <Text style={styles.content}>{article.content}</Text>
            </View>
          )}

          {/* Open in Browser Button */}
          <TouchableOpacity
            style={styles.openBrowserButton}
            onPress={handleOpenInBrowser}
          >
            <Ionicons name="globe-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.openBrowserButtonText}>Read Original Article</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: spacing.l,
  },
  categoryContainer: {
    backgroundColor: colors.secondary + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.s,
    marginBottom: spacing.m,
  },
  category: {
    fontSize: fontSize.xs,
    color: colors.secondary,
    fontWeight: '700',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.m,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.l,
  },
  source: {
    fontSize: fontSize.s,
    color: colors.textSecondary,
  },
  date: {
    fontSize: fontSize.s,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: fontSize.m,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.s,
  },
  description: {
    fontSize: fontSize.m,
    color: colors.text,
    lineHeight: 24,
  },
  summary: {
    fontSize: fontSize.m,
    color: colors.text,
    lineHeight: 24,
  },
  content: {
    fontSize: fontSize.m,
    color: colors.text,
    lineHeight: 24,
  },
  openBrowserButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.m,
    marginTop: spacing.l,
    ...shadow.medium,
  },
  buttonIcon: {
    marginRight: spacing.s,
  },
  openBrowserButtonText: {
    color: 'white',
    fontSize: fontSize.m,
    fontWeight: '600',
  },
  headerButton: {
    padding: spacing.xs,
  },
});

export default NewsDetailScreen;
