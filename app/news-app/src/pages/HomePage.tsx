import { useState } from 'react';
import { NewsCard } from '@/components/NewsCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { useNews } from '@/hooks/useNews';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { articles, personalizedArticles, isLoading, isError } = useNews(selectedCategory);
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Latest News</h1>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {isLoading && (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-2">Loading news...</p>
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-red-500">
          <p>Failed to load news. Please try again later.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Personalized "For You" section */}
          {isAuthenticated && personalizedArticles.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedArticles.map((article) => (
                  <NewsCard key={article.article_id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Main news section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.map((article) => (
                <NewsCard key={article.article_id} article={article} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p>No articles found for this category.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
