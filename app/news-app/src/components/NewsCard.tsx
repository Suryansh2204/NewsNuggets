import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NewsArticle } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { updatePreferences, isAuthenticated } = useAuth();

  const {
    title,
    description,
    summary,
    content,
    publishedAt,
    category,
    source,
    image_url,
  } = article;

  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSourceClick = () => {
    // Track interaction when user clicks source link
    if (isAuthenticated) {
      updatePreferences(category);
    }

    // Open source in new tab
    window.open(source, '_blank', 'noopener,noreferrer');
  };

  const handleExpand = () => {
    setExpanded(!expanded);

    // Track interaction when user expands to read full article
    if (isAuthenticated && !expanded) {
      updatePreferences(category);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video overflow-hidden">
        {image_url && (
          <img
            src={image_url}
            alt={title}
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {category}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <div className="text-sm text-muted-foreground">{formattedDate}</div>
      </CardHeader>

      <CardContent className="flex-grow">
        {expanded ? (
          <div className="space-y-4">
            <p className="font-medium">{summary}</p>
            <p>{content}</p>
          </div>
        ) : (
          <p className="line-clamp-3">{description}</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handleExpand}>
          {expanded ? 'Show Less' : 'Read More'}
        </Button>

        <Button variant="link" size="sm" onClick={handleSourceClick}>
          Source
        </Button>
      </CardFooter>
    </Card>
  );
}
