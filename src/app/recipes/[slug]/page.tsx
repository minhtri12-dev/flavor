import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RecipeDetail from "@/components/RecipeDetail";
import { RECIPES } from "@/data/recipes";

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = RECIPES.find((item) => item.slug === slug);
  return { title: recipe ? `${recipe.name.en} | FLAVOR` : "FLAVOR" };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = RECIPES.find((item) => item.slug === slug);
  if (!recipe) notFound();
  return <RecipeDetail recipe={recipe} />;
}