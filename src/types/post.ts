// Image with orientation support
export type ImageOrientation = 'portrait' | 'landscape';

export interface ImageItem {
  src: string;
  orientation?: ImageOrientation;
}

// Support both string[] and ImageItem[] for backwards compatibility
export type ImageInput = string | ImageItem;

// Base frontmatter shared by all content types
export interface BaseFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
  images?: ImageInput[];
}

// Helper to normalize images to consistent format
export function normalizeImages(images?: ImageInput[]): ImageItem[] {
  if (!images) return [];
  return images.map((img) =>
    typeof img === 'string'
      ? { src: img, orientation: 'portrait' as ImageOrientation }
      : { src: img.src, orientation: img.orientation || 'portrait' }
  );
}

// Standard blog post frontmatter
export interface PostFrontmatter extends BaseFrontmatter {
  type?: 'post';
}

// Recipe nutrition information
export interface RecipeNutrition {
  calories?: string;
  fatContent?: string;
  saturatedFatContent?: string;
  cholesterolContent?: string;
  sodiumContent?: string;
  carbohydrateContent?: string;
  fiberContent?: string;
  sugarContent?: string;
  proteinContent?: string;
}

// Recipe frontmatter with structured data
export interface RecipeFrontmatter extends BaseFrontmatter {
  type: 'recipe';
  prepTime?: string;        // ISO 8601 duration e.g. "PT15M"
  cookTime?: string;        // ISO 8601 duration e.g. "PT30M"
  totalTime?: string;       // ISO 8601 duration e.g. "PT45M"
  recipeYield?: string;     // e.g. "4 servings" or "12 cookies"
  recipeCategory?: string;  // e.g. "dinner", "dessert", "appetizer"
  recipeCuisine?: string;   // e.g. "Italian", "Mexican", "American"
  ingredients: string[];    // Array of ingredient strings
  nutrition?: RecipeNutrition;
  difficulty?: 'easy' | 'medium' | 'hard';
  author?: string;
}

// Union type for all frontmatter
export type ContentFrontmatter = PostFrontmatter | RecipeFrontmatter;

// Generic content item
export interface Content {
  slug: string;
  frontmatter: ContentFrontmatter;
  content: string;
  readingTime: string;
}

// Backward compatible Post type
export interface Post extends Content {
  frontmatter: PostFrontmatter;
}

// Recipe type
export interface Recipe extends Content {
  frontmatter: RecipeFrontmatter;
}

// Content categories
export type ContentCategory = 'projects' | 'recipes' | 'notes' | 'reviews' | 'personal';

export const CATEGORIES: { id: ContentCategory; label: string; description: string }[] = [
  { id: 'projects', label: 'Projects', description: 'Things I\'ve built' },
  { id: 'recipes', label: 'Recipes', description: 'Food and cooking' },
  { id: 'notes', label: 'Notes', description: 'Quick thoughts and learnings' },
  { id: 'reviews', label: 'Reviews', description: 'Books, tools, and experiences' },
  { id: 'personal', label: 'Personal', description: 'Life and reflections' },
];

// Card for listing views
export interface PostCard {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  featured: boolean;
  readingTime: string;
  hasImages: boolean;
  type: 'post' | 'recipe';
  category?: ContentCategory;
  year?: number;
  // Recipe-specific fields for cards
  prepTime?: string;
  cookTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Helper type guards
export function isRecipe(content: Content): content is Recipe {
  return content.frontmatter.type === 'recipe';
}

export function isRecipeFrontmatter(
  frontmatter: ContentFrontmatter
): frontmatter is RecipeFrontmatter {
  return frontmatter.type === 'recipe';
}
