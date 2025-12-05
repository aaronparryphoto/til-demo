// Category badge with color coding

import { QuizCategory } from '@/lib/types';

interface CategoryBadgeProps {
  category: QuizCategory;
  className?: string;
}

const categoryColors: Record<QuizCategory, string> = {
  History: 'bg-category-history',
  Science: 'bg-category-science',
  Geography: 'bg-category-geography',
  'Pop Culture': 'bg-category-popculture',
  Politics: 'bg-category-politics',
};

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const colorClass = categoryColors[category];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${colorClass} ${className}`}
    >
      {category}
    </span>
  );
}
