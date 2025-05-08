import { useState } from "react";
import type { NewsArticle } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = ({ article }: NewsCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { updatePreferences } = useAuth();

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const toggleExpanded = () => {
    setExpanded(!expanded);

    // Update preferences when user opens an article
    if (!expanded) {
      updatePreferences(article.category);
    }
  };

  return (
    <div
      className="bg-white dark:bg-dark-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      onClick={() => window.open(article.source, "_blank")}
    >
      {article.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              // Fallback image if the image fails to load
              (e.target as HTMLImageElement).src =
                "https://placehold.co/600x400?text=News";
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between i</div>tems-start mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
            {article.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formattedDate}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {article.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          {article.description}
        </p>

        {!expanded && (
          <div className="text-sm text-gray-600 dark:text-gray-400 italic mb-4">
            {article.summary}
          </div>
        )}

        {/* {expanded && (
          <div className="mt-4 space-y-4">
            <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">{article.content}</div>

            <a
              href={article.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Read Original <ExternalLink size={16} />
            </a>
          </div>
        )}

        <button
          onClick={toggleExpanded}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} className="mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" /> Read More
            </>
          )}
        </button> */}
      </div>
    </div>
  );
};
