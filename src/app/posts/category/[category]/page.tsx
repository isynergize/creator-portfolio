import type { Metadata } from 'next';
import Link from 'next/link';
import { getPostsByCategory, getAllCategories } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { CATEGORIES, type ContentCategory } from '@/types/post';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map(({ category }) => ({
    category,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = CATEGORIES.find((c) => c.id === category);

  return {
    title: categoryInfo?.label || category,
    description: categoryInfo?.description || `Posts in ${category} category.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category as ContentCategory);
  const categoryInfo = CATEGORIES.find((c) => c.id === category);

  return (
    <div>
      <Link
        href="/posts"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        All posts
      </Link>

      <h1 className="text-3xl font-bold mb-2">
        {categoryInfo?.label || category}
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        {categoryInfo?.description || `Posts in ${category} category.`}
        {' '}({posts.length} {posts.length === 1 ? 'post' : 'posts'})
      </p>

      {posts.length > 0 ? (
        <div className="space-y-0">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            No posts in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
