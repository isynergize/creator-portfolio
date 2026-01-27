import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getFeaturedPosts, getAllCategories } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { Accordion } from '@/components/Accordion';
import { CATEGORIES } from '@/types/post';
import { JsonLd, generateBlogSchema } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'All blog posts and articles.',
};

export default function PostsPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const recentPosts = allPosts.slice(0, 5);
  const categories = getAllCategories();

  return (
    <>
      <JsonLd data={generateBlogSchema()} />

      <div className="space-y-12">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold mb-2">Posts</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'} across{' '}
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}.
          </p>
        </header>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </h2>
            <div className="space-y-0">
              {featuredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Recent</h2>
            <div className="space-y-0">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Summary and Exploration - Collapsed by default */}
        <Accordion title="Summary and Exploration">
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                <div className="text-3xl font-bold">{allPosts.length}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Posts written
                </div>
              </div>
              <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                <div className="text-3xl font-bold">{CATEGORIES.length}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Categories
                </div>
              </div>
              <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl col-span-2 sm:col-span-1">
                <div className="text-3xl font-bold">
                  {new Set(allPosts.flatMap((p) => p.tags)).size}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Topics covered
                </div>
              </div>
            </div>

            {/* Explore by Category */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Explore by Category</h3>
              <div className="grid gap-2">
                {CATEGORIES.map((cat) => {
                  const count = allPosts.filter((p) => p.category === cat.id).length;
                  return (
                    <Link
                      key={cat.id}
                      href={`/posts/category/${cat.id}`}
                      className="flex items-center justify-between p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors group"
                    >
                      <div>
                        <div className="font-medium group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                          {cat.label}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {cat.description}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 transition-colors">
                        {count}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </Accordion>

        {/* Empty State */}
        {allPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400">
              No posts yet. Add markdown files to{' '}
              <code className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">
                src/content/posts/
              </code>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
