import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all tags.',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Tags</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        Browse posts by topic.
      </p>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
              className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors group"
            >
              <span className="font-medium text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
                {tag}
              </span>
              <span className="ml-2 text-neutral-500 dark:text-neutral-400 text-sm">
                ({count})
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            No tags yet. Add tags to your posts.
          </p>
        </div>
      )}
    </div>
  );
}
