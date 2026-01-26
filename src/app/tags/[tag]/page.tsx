import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({
    tag: tag.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `Posts tagged "${decodedTag}"`,
    description: `All posts tagged with ${decodedTag}.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <div>
      <Link
        href="/tags"
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
        All tags
      </Link>

      <h1 className="text-3xl font-bold mb-2">
        <span className="text-neutral-500 dark:text-neutral-400">#</span>
        {decodedTag}
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        {posts.length} {posts.length === 1 ? 'post' : 'posts'} with this tag.
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
            No posts found with this tag.
          </p>
        </div>
      )}
    </div>
  );
}
