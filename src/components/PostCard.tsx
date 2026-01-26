import Link from 'next/link';
import { formatDate, formatDuration } from '@/lib/posts';
import type { PostCard as PostCardType } from '@/types/post';

interface PostCardProps {
  post: PostCardType;
}

export function PostCard({ post }: PostCardProps) {
  const isRecipe = post.type === 'recipe';

  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="py-6 border-b border-neutral-200 dark:border-neutral-800 transition-colors group-hover:border-neutral-400 dark:group-hover:border-neutral-600">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {post.title}
                </h2>
                {isRecipe && (
                  <span className="px-1.5 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded font-medium">
                    Recipe
                  </span>
                )}
                {post.hasImages && !isRecipe && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    [gallery]
                  </span>
                )}
              </div>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {post.description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-500 flex-wrap">
                <time dateTime={post.date}>{formatDate(post.date)}</time>

                {isRecipe ? (
                  <>
                    {post.prepTime && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <ClockIcon />
                          {formatDuration(post.prepTime)} prep
                        </span>
                      </>
                    )}
                    {post.cookTime && (
                      <>
                        <span>·</span>
                        <span>{formatDuration(post.cookTime)} cook</span>
                      </>
                    )}
                    {post.difficulty && (
                      <>
                        <span>·</span>
                        <span className={`capitalize ${getDifficultyColor(post.difficulty)}`}>
                          {post.difficulty}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </>
                )}

                {post.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {post.featured && (
              <span className="shrink-0 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-xs font-medium rounded">
                Featured
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard') {
  switch (difficulty) {
    case 'easy':
      return 'text-green-600 dark:text-green-400';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'hard':
      return 'text-red-600 dark:text-red-400';
  }
}
