"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import IngredientPicker from "../components/IngredientPicker";
import RecipeSection from "../components/RecipeSection";
import ShoppingList from "../components/ShoppingList";
import Reveal from "../components/Reveal";
import Footer from "../components/Footer";
import { RECIPES } from "@/data/recipes";
import { DICTIONARY } from "@/lib/i18n";
import { matchRecipes } from "@/lib/recipeMatcher";
import { useFavorites, useLanguage } from "@/lib/storage";

const QUICK_MINUTES = 20;

export default function HomePage() {
  const { lang, setLang } = useLanguage();
  const { favorites: favoriteSlugs, toggleFavorite } = useFavorites();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const copy = DICTIONARY[lang].home;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleIngredient = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const clearIngredients = useCallback(() => setSelectedIds([]), []);

  const hasSelection = selectedIds.length > 0;

  const suggested = useMemo(
    () => matchRecipes(RECIPES, selectedIds),
    [selectedIds],
  );
  const popular = useMemo(
    () => matchRecipes(RECIPES.filter((recipe) => recipe.popular), []),
    [],
  );
  const quick = useMemo(
    () =>
      matchRecipes(
        RECIPES.filter((recipe) => recipe.minutes <= QUICK_MINUTES),
        [],
      ),
    [],
  );
  const savedRecipes = useMemo(
    () => RECIPES.filter((recipe) => favoriteSlugs.includes(recipe.slug)),
    [favoriteSlugs],
  );
  const saved = useMemo(() => matchRecipes(savedRecipes, []), [savedRecipes]);

  const shared = { lang, favoriteSlugs, onToggleFavorite: toggleFavorite };

  return (
    <MotionConfig reducedMotion="user">
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        favoritesCount={favoriteSlugs.length}
      />
      <main>
        <Hero lang={lang} />

        <Reveal>
          <IngredientPicker
            lang={lang}
            selectedIds={selectedIds}
            onToggle={toggleIngredient}
            onClear={clearIngredients}
          />
        </Reveal>

        <RecipeSection
          id="discover"
          title={
            hasSelection ? copy.discoverTitleSelected : copy.discoverTitleDefault
          }
          note={
            hasSelection ? copy.discoverNoteSelected : copy.discoverNoteDefault
          }
          matches={suggested}
          hasSelection={hasSelection}
          emptyMessage={copy.discoverEmpty}
          featuredFirst
          {...shared}
        />

        <RecipeSection
          title={copy.popularTitle}
          matches={popular}
          hasSelection={false}
          emptyMessage={copy.popularEmpty}
          tinted
          {...shared}
        />

        <RecipeSection
          title={copy.quickTitle(QUICK_MINUTES)}
          note={copy.quickNote}
          matches={quick}
          hasSelection={false}
          emptyMessage={copy.quickEmpty}
          {...shared}
        />

        <Reveal>
          <section className="bg-forest text-cream">
            <div className="page-container section-pad grid gap-10 md:grid-cols-12">
              <h2 className="font-display text-headline md:col-span-6">
                {copy.aboutTitle}
              </h2>
              <p className="text-lead text-cream/85 md:col-span-5 md:col-start-8">
                {copy.aboutBody}
              </p>
            </div>
          </section>
        </Reveal>

        <RecipeSection
          id="cookbook"
          title={copy.cookbookTitle}
          note={copy.saved(favoriteSlugs.length)}
          matches={saved}
          hasSelection={false}
          emptyMessage={copy.cookbookEmpty}
          {...shared}
        />

        <Reveal>
          <ShoppingList lang={lang} recipes={savedRecipes} />
        </Reveal>
      </main>
      <Footer lang={lang} />
    </MotionConfig>
  );
}