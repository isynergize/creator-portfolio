'use client';

import { ShowcaseCard } from '@/components/ShowcaseCard';
import type { PostCard } from '@/types/post';

interface ThingsToReadProps {
  posts: PostCard[];
}

export function ThingsToRead({ posts }: ThingsToReadProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-2xl">
        <p className="text-neutral-500 dark:text-neutral-400">
          No evergreen reads curated yet.
        </p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
          Tag reviews with <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-xs">2025-read-evergreen</code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
      {posts.slice(0, 5).map((post, index) => (
        <ShowcaseCard
          key={post.slug}
          post={post}
          variant="evergreen"
          index={index}
        />
      ))}
    </div>
  );
}
