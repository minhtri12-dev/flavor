"use client";

import RecipeCard from "@/components/RecipeCard";
import type { Language, RecipeMatch } from "@/types";

interface RecipeSectionProps {
  lang: Language;
  id?: string;
  title: string;
  note?: string;
  matches: RecipeMatch[];
  hasSelection: boolean;
  favoriteSlugs: string[];
  onToggleFavorite: (slug: string) => void;
  emptyMessage: string;
  tinted?: boolean;
  featuredFirst?: boolean;
}

export default function RecipeSection({
  lang,
  id,
  title,
  note,
  matches,
  hasSelection,
  favoriteSlugs,
  onToggleFavorite,
  emptyMessage,
  tinted = false,
  featuredFirst = false,
}: RecipeSectionProps) {
  const headingId = id ? `${id}-heading` : undefined;
  const hasFeatured = featuredFirst && matches.length >= 3;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={tinted ? "bg-[#E8DFD1]" : undefined}
    >
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2
            id={headingId}
            className="font-display text-4xl leading-tight md:text-5xl"
          >
            {title}
          </h2>
          {note && <p className="max-w-sm text-[#30251F]/70">{note}</p>}
        </div>

        {matches.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#30251F]/30 p-10 text-center text-[#30251F]/80">
            {emptyMessage}
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match, index) => (
              <RecipeCard
                key={match.recipe.slug}
                lang={lang}
                match={match}
                hasSelection={hasSelection}
                isFavorite={favoriteSlugs.includes(match.recipe.slug)}
                onToggleFavorite={onToggleFavorite}
                featured={hasFeatured && index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}