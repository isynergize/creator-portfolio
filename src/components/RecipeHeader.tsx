import type { RecipeFrontmatter } from '@/types/post';
import { formatDuration, getTotalTime } from '@/lib/posts';

interface RecipeHeaderProps {
  recipe: RecipeFrontmatter;
}

export function RecipeHeader({ recipe }: RecipeHeaderProps) {
  const totalTime = getTotalTime(recipe);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 mb-8">
      {/* Time and Yield Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {recipe.prepTime && (
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
              Prep Time
            </div>
            <div className="font-semibold">{formatDuration(recipe.prepTime)}</div>
          </div>
        )}
        {recipe.cookTime && (
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
              Cook Time
            </div>
            <div className="font-semibold">{formatDuration(recipe.cookTime)}</div>
          </div>
        )}
        {totalTime && (
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
              Total Time
            </div>
            <div className="font-semibold">{totalTime}</div>
          </div>
        )}
        {recipe.recipeYield && (
          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-1">
              Servings
            </div>
            <div className="font-semibold">{recipe.recipeYield}</div>
          </div>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
        {recipe.difficulty && (
          <span className="flex items-center gap-1">
            <DifficultyIcon difficulty={recipe.difficulty} />
            <span className="capitalize">{recipe.difficulty}</span>
          </span>
        )}
        {recipe.recipeCategory && (
          <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded">
            {recipe.recipeCategory}
          </span>
        )}
        {recipe.recipeCuisine && (
          <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded">
            {recipe.recipeCuisine}
          </span>
        )}
      </div>
    </div>
  );
}

function DifficultyIcon({ difficulty }: { difficulty: 'easy' | 'medium' | 'hard' }) {
  const colors = {
    easy: 'text-green-500',
    medium: 'text-yellow-500',
    hard: 'text-red-500',
  };

  return (
    <svg
      className={`w-4 h-4 ${colors[difficulty]}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}
