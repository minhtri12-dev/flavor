import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CookingMode from "@/components/CookingMode";
import { RECIPES } from "@/data/recipes";

interface CookingPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return RECIPES.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: CookingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = RECIPES.find((item) => item.slug === slug);
  return { title: recipe ? `${recipe.name.en} · Cook | FLAVOR` : "FLAVOR" };
}

export default async function CookingPage({ params }: CookingPageProps) {
  const { slug } = await params;
  const recipe = RECIPES.find((item) => item.slug === slug);
  if (!recipe) notFound();
  return <CookingMode recipe={recipe} />;
}