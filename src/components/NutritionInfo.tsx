import type { RecipeNutrition } from '@/types/post';

interface NutritionInfoProps {
  nutrition: RecipeNutrition;
  servings?: string;
}

const nutritionLabels: Record<keyof RecipeNutrition, string> = {
  calories: 'Calories',
  fatContent: 'Fat',
  saturatedFatContent: 'Saturated Fat',
  cholesterolContent: 'Cholesterol',
  sodiumContent: 'Sodium',
  carbohydrateContent: 'Carbs',
  fiberContent: 'Fiber',
  sugarContent: 'Sugar',
  proteinContent: 'Protein',
};

export function NutritionInfo({ nutrition, servings }: NutritionInfoProps) {
  const entries = Object.entries(nutrition).filter(([_, value]) => value);

  if (entries.length === 0) return null;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        Nutrition Facts
      </h2>
      {servings && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          Per serving ({servings})
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="bg-white dark:bg-neutral-800 rounded-lg p-3 text-center"
          >
            <div className="text-lg font-semibold">{value}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {nutritionLabels[key as keyof RecipeNutrition]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
