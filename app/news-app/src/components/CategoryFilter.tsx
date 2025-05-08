import { Button } from '@/components/ui/button';
import { getCategories } from '@/services/newsService';
import { useAuth } from '@/contexts/AuthContext';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const categories = getCategories();
  const { updatePreferences, isAuthenticated } = useAuth();

  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);

    // Track category selection if user is authenticated
    if (isAuthenticated) {
      updatePreferences(category);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        key="all"
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelectCategory('all')}
      >
        All
      </Button>

      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryClick(category)}
          className="capitalize"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
