export const INGREDIENT_CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Meat",
  "Seafood",
  "Dairy",
  "Grains",
  "Spices",
] as const;

export type IngredientCategory = (typeof INGREDIENT_CATEGORIES)[number];

export type Language = "en" | "vi";

export type Localized = Record<Language, string>;

export interface Ingredient {
  id: string;
  name: Localized;
  category: IngredientCategory;
}

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface ImageCredit {
  photographer: string;
  profileUrl: string;
  photoUrl: string;
}

export interface RecipeImage {
  id?: string;
  src: string;
  alt: Localized;
  credit?: ImageCredit;
}

export interface RecipeIngredient {
  ingredientId: string;
  amount?: string;
  optional?: boolean;
}

export interface RecipeCredit {
  name: Localized;
  origin: Localized;
  isChef: boolean;
}

export interface Recipe {
  slug: string;
  name: Localized;
  description: Localized;
  image: RecipeImage;
  minutes: number;
  difficulty: Difficulty;
  servings: number;
  popular?: boolean;
  credit?: RecipeCredit;
  seasoning?: Localized[];
  ingredients: RecipeIngredient[];
  steps: Localized[];
}

export interface RecipeMatch {
  recipe: Recipe;
  matched: string[];
  missing: string[];
  score: number;
}