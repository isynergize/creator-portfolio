import type { RecipeFrontmatter } from '@/types/post';

interface RecipeSchemaProps {
  recipe: RecipeFrontmatter;
  slug: string;
  url: string;
}

export function RecipeSchema({ recipe, slug, url }: RecipeSchemaProps) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    datePublished: recipe.date,
    ...(recipe.author && { author: { '@type': 'Person', name: recipe.author } }),
    ...(recipe.prepTime && { prepTime: recipe.prepTime }),
    ...(recipe.cookTime && { cookTime: recipe.cookTime }),
    ...(recipe.totalTime && { totalTime: recipe.totalTime }),
    ...(recipe.recipeYield && { recipeYield: recipe.recipeYield }),
    ...(recipe.recipeCategory && { recipeCategory: recipe.recipeCategory }),
    ...(recipe.recipeCuisine && { recipeCuisine: recipe.recipeCuisine }),
    recipeIngredient: recipe.ingredients,
    ...(recipe.images &&
      recipe.images.length > 0 && {
        image: recipe.images,
      }),
    ...(recipe.nutrition && {
      nutrition: {
        '@type': 'NutritionInformation',
        ...(recipe.nutrition.calories && { calories: recipe.nutrition.calories }),
        ...(recipe.nutrition.fatContent && { fatContent: recipe.nutrition.fatContent }),
        ...(recipe.nutrition.saturatedFatContent && {
          saturatedFatContent: recipe.nutrition.saturatedFatContent,
        }),
        ...(recipe.nutrition.cholesterolContent && {
          cholesterolContent: recipe.nutrition.cholesterolContent,
        }),
        ...(recipe.nutrition.sodiumContent && { sodiumContent: recipe.nutrition.sodiumContent }),
        ...(recipe.nutrition.carbohydrateContent && {
          carbohydrateContent: recipe.nutrition.carbohydrateContent,
        }),
        ...(recipe.nutrition.fiberContent && { fiberContent: recipe.nutrition.fiberContent }),
        ...(recipe.nutrition.sugarContent && { sugarContent: recipe.nutrition.sugarContent }),
        ...(recipe.nutrition.proteinContent && { proteinContent: recipe.nutrition.proteinContent }),
      },
    }),
    ...(recipe.tags &&
      recipe.tags.length > 0 && {
        keywords: recipe.tags.join(', '),
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
