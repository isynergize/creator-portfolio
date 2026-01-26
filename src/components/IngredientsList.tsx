'use client';

import { useState } from 'react';

interface IngredientsListProps {
  ingredients: string[];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggleIngredient = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        Ingredients
      </h2>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checked.has(index)}
                onChange={() => toggleIngredient(index)}
                className="mt-1 w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white focus:ring-neutral-500"
              />
              <span
                className={`transition-colors ${
                  checked.has(index)
                    ? 'text-neutral-400 dark:text-neutral-500 line-through'
                    : 'text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white'
                }`}
              >
                {ingredient}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {checked.size > 0 && (
        <button
          onClick={() => setChecked(new Set())}
          className="mt-4 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          Clear all ({checked.size}/{ingredients.length})
        </button>
      )}
    </div>
  );
}
