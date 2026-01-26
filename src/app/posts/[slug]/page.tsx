import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { getPostBySlug, getPostSlugs, formatDate } from '@/lib/posts';
import { getCardContent } from '@/lib/cardstack';
import { CardStack } from '@/components/CardStack';
import { RecipeSchema } from '@/components/RecipeSchema';
import { RecipeHeader } from '@/components/RecipeHeader';
import { IngredientsList } from '@/components/IngredientsList';
import { NutritionInfo } from '@/components/NutritionInfo';
import { JsonLd, generateArticleSchema } from '@/components/JsonLd';
import { normalizeImages, type RecipeFrontmatter } from '@/types/post';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: 'article',
      publishedTime: post.frontmatter.date,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.frontmatter.draft) {
    notFound();
  }

  const { frontmatter, content, readingTime } = post;
  const images = normalizeImages(frontmatter.images);
  const cardContent = getCardContent(slug);
  const isRecipe = frontmatter.type === 'recipe';
  const recipeFm = isRecipe ? (frontmatter as RecipeFrontmatter) : null;

  return (
    <article>
      {/* Schema.org markup for SEO */}
      {isRecipe && recipeFm ? (
        <RecipeSchema
          recipe={recipeFm}
          slug={slug}
          url={`/posts/${slug}`}
        />
      ) : (
        <JsonLd
          data={generateArticleSchema({
            title: frontmatter.title,
            description: frontmatter.description,
            slug,
            date: frontmatter.date,
            tags: frontmatter.tags,
          })}
        />
      )}

      {/* Back link */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-8"
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
        Back to posts
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {frontmatter.title}
          </h1>
          {isRecipe && (
            <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded font-medium">
              Recipe
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
          <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
          {!isRecipe && (
            <>
              <span>·</span>
              <span>{readingTime}</span>
            </>
          )}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex gap-2 flex-wrap">
                {frontmatter.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                    className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded text-xs transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Recipe Header with times and metadata */}
      {isRecipe && recipeFm && <RecipeHeader recipe={recipeFm} />}

      {/* Card Stack for images */}
      {images.length > 0 && (
        <CardStack images={images} alt={frontmatter.title} cardContent={cardContent} />
      )}

      {/* Recipe Ingredients */}
      {isRecipe && recipeFm && recipeFm.ingredients && (
        <IngredientsList ingredients={recipeFm.ingredients} />
      )}

      {/* Content / Instructions */}
      <div className="prose dark:prose-invert max-w-none">
        {isRecipe && (
          <h2 className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            Instructions
          </h2>
        )}
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </div>

      {/* Nutrition Info */}
      {isRecipe && recipeFm && recipeFm.nutrition && (
        <NutritionInfo
          nutrition={recipeFm.nutrition}
          servings={recipeFm.recipeYield}
        />
      )}
    </article>
  );
}
