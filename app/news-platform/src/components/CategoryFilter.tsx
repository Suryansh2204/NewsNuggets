import { useState, useEffect } from 'react';
import type { NewsResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CategoryFilterProps {
  news: NewsResponse;
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

export const CategoryFilter = ({
  news,
  onCategorySelect,
  selectedCategory
}: CategoryFilterProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const { updatePreferences } = useAuth();

  useEffect(() => {
    if (news.items.length > 0) {
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(news.items.map(item => item.category))
      ).sort();

      setCategories(uniqueCategories);
    }
  }, [news]);

  const handleCategoryClick = (category: string | null) => {
    onCategorySelect(category);

    // Update preferences when user selects a category
    if (category) {
      updatePreferences(category);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Filter by Category</h2>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${!selectedCategory
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          onClick={() => handleCategoryClick(null)}
        >
          All
        </button>

        {categories.map(category => (
          <button
            key={category}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
