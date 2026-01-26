import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type {
  Content,
  ContentFrontmatter,
  PostCard,
  RecipeFrontmatter,
  ContentCategory,
} from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

interface PostFile {
  slug: string;
  filePath: string;
  year?: number;
  category?: ContentCategory;
}

// Recursively find all markdown files in the posts directory
function findPostFiles(dir: string, basePath: string = ''): PostFile[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: PostFile[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      files.push(...findPostFiles(fullPath, relativePath));
    } else if (entry.name.endsWith('.md')) {
      // Parse path: could be flat, year/category/file, or year/file
      const pathParts = basePath.split('/').filter(Boolean);
      let year: number | undefined;
      let category: ContentCategory | undefined;

      if (pathParts.length >= 1 && /^\d{4}$/.test(pathParts[0])) {
        year = parseInt(pathParts[0]);
        if (pathParts.length >= 2) {
          category = pathParts[1] as ContentCategory;
        }
      } else if (pathParts.length >= 1) {
        // Just category, no year
        category = pathParts[0] as ContentCategory;
      }

      // Slug is the filename without .md
      const slug = entry.name.replace(/\.md$/, '');

      files.push({
        slug,
        filePath: fullPath,
        year,
        category,
      });
    }
  }

  return files;
}

export function getPostSlugs(): string[] {
  return findPostFiles(postsDirectory).map((f) => f.slug);
}

export function getPostBySlug(slug: string): Content | null {
  const files = findPostFiles(postsDirectory);
  const file = files.find((f) => f.slug === slug);

  if (!file || !fs.existsSync(file.filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(file.filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug: file.slug,
    frontmatter: data as ContentFrontmatter,
    content,
    readingTime: stats.text,
  };
}

export function getAllPosts(): PostCard[] {
  const files = findPostFiles(postsDirectory);
  const posts = files
    .map((file) => {
      const fileContents = fs.readFileSync(file.filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const fm = data as ContentFrontmatter;

      if (fm.draft) return null;

      const stats = readingTime(content);
      const isRecipe = fm.type === 'recipe';

      const card: PostCard = {
        slug: file.slug,
        title: fm.title,
        date: fm.date,
        description: fm.description,
        tags: fm.tags || [],
        featured: fm.featured || false,
        readingTime: stats.text,
        hasImages: (fm.images?.length || 0) > 0,
        type: isRecipe ? 'recipe' : 'post',
        category: file.category,
        year: file.year || new Date(fm.date).getFullYear(),
      };

      // Add recipe-specific fields
      if (isRecipe) {
        const recipeFm = fm as RecipeFrontmatter;
        card.prepTime = recipeFm.prepTime;
        card.cookTime = recipeFm.cookTime;
        card.difficulty = recipeFm.difficulty;
      }

      return card;
    })
    .filter((post): post is PostCard => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getFeaturedPosts(): PostCard[] {
  return getAllPosts().filter((post) => post.featured);
}

export function getPostsByType(type: 'post' | 'recipe'): PostCard[] {
  return getAllPosts().filter((post) => post.type === type);
}

export function getRecipes(): PostCard[] {
  return getPostsByType('recipe');
}

export function getPostsByCategory(category: ContentCategory): PostCard[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllCategories(): { category: ContentCategory; count: number }[] {
  const posts = getAllPosts();
  const categoryCounts = new Map<ContentCategory, number>();

  posts.forEach((post) => {
    if (post.category) {
      categoryCounts.set(post.category, (categoryCounts.get(post.category) || 0) + 1);
    }
  });

  return Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

// Tags functionality
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostCard[] {
  return getAllPosts().filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

// Search functionality
export function searchPosts(query: string): PostCard[] {
  const lowercaseQuery = query.toLowerCase().trim();
  if (!lowercaseQuery) return [];

  return getAllPosts().filter((post) => {
    const searchableText = [
      post.title,
      post.description,
      ...post.tags,
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(lowercaseQuery);
  });
}

// Date formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ISO 8601 duration parsing (e.g., "PT15M" -> "15 min")
export function formatDuration(isoDuration?: string): string {
  if (!isoDuration) return '';

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else if (minutes) {
    return `${minutes} min`;
  }

  return isoDuration;
}

// Get total time from prep + cook if totalTime not provided
export function getTotalTime(recipe: RecipeFrontmatter): string {
  if (recipe.totalTime) {
    return formatDuration(recipe.totalTime);
  }

  const prepMatch = recipe.prepTime?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const cookMatch = recipe.cookTime?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

  let totalMinutes = 0;

  if (prepMatch) {
    totalMinutes += (parseInt(prepMatch[1] || '0') * 60) + parseInt(prepMatch[2] || '0');
  }
  if (cookMatch) {
    totalMinutes += (parseInt(cookMatch[1] || '0') * 60) + parseInt(cookMatch[2] || '0');
  }

  if (totalMinutes === 0) return '';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else {
    return `${minutes} min`;
  }
}

// RSS feed data
export function getRSSFeedData() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    title: post.title,
    description: post.description,
    link: `/posts/${post.slug}`,
    pubDate: new Date(post.date).toUTCString(),
    categories: post.tags,
  }));
}

// Homepage showcase helpers

/**
 * Get projects for "Things Made" section
 * Returns posts tagged with modal-product-{1,2,3} sorted by number
 */
export function getProjectsForShowcase(): PostCard[] {
  const posts = getAllPosts();
  const showcaseProjects: { post: PostCard; order: number }[] = [];

  posts.forEach((post) => {
    const modalTag = post.tags.find((tag) => /^modal-product-\d+$/.test(tag));
    if (modalTag) {
      const order = parseInt(modalTag.replace('modal-product-', ''));
      showcaseProjects.push({ post, order });
    }
  });

  return showcaseProjects
    .sort((a, b) => a.order - b.order)
    .map((item) => item.post);
}

/**
 * Get posts for "Things You Need To Read" section
 * Returns posts tagged with {year}-read-evergreen
 */
export function getEvergreenReads(year?: number): PostCard[] {
  const targetYear = year || new Date().getFullYear() - 1; // Default to previous year
  const tagPattern = `${targetYear}-read-evergreen`;

  return getAllPosts().filter((post) =>
    post.tags.some((tag) => tag.toLowerCase() === tagPattern.toLowerCase())
  );
}

/**
 * Get posts for "What I'm Reading" section
 * Returns posts tagged with currently-reading
 */
export function getCurrentlyReading(): PostCard[] {
  return getAllPosts().filter((post) =>
    post.tags.some((tag) => tag.toLowerCase() === 'currently-reading')
  );
}
