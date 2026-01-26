import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all posts chronologically.',
};

export default function ArchivePage() {
  const posts = getAllPosts();

  // Group posts by year
  const postsByYear = posts.reduce(
    (acc, post) => {
      const year = new Date(post.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {} as Record<number, typeof posts>
  );

  const years = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Archive</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
      </p>

      {years.length > 0 ? (
        <div className="space-y-10">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 sticky top-20 bg-white dark:bg-neutral-950 py-2 -mx-4 px-4">
                {year}
                <span className="ml-2 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                  ({postsByYear[year].length})
                </span>
              </h2>
              <ul className="space-y-3">
                {postsByYear[year].map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="group flex items-baseline gap-4"
                    >
                      <time
                        dateTime={post.date}
                        className="text-sm text-neutral-500 dark:text-neutral-400 tabular-nums shrink-0"
                      >
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <span className="font-medium text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                        {post.title}
                      </span>
                      {post.type === 'recipe' && (
                        <span className="px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded shrink-0">
                          Recipe
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            No posts yet.
          </p>
        </div>
      )}
    </div>
  );
}
