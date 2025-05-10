import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NewsCategory } from '../types/news';
import { colors, spacing, fontSize, borderRadius } from '../utils/theme';

interface CategoryFilterProps {
  categories: NewsCategory[];
  selectedCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const formatCategoryName = (category: string): string => {
    if (category === 'all') return 'All';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => onSelectCategory(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {formatCategoryName(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
  },
  scrollContent: {
    paddingHorizontal: spacing.m,
  },
  categoryButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: borderRadius.l,
    marginRight: spacing.s,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: fontSize.s,
    color: colors.text,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
});

export default CategoryFilter;
