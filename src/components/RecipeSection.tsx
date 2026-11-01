"use client";

import RecipeCard from "@/components/RecipeCard";
import Reveal from "@/components/Reveal";
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
      className={tinted ? "bg-oat" : undefined}
    >
      <div className="page-container section-pad">
        <Reveal className="mb-12 grid gap-4 md:grid-cols-12 md:items-end">
          <h2
            id={headingId}
            className="font-display text-headline md:col-span-7"
          >
            {title}
          </h2>
          {note && (
            <p className="text-lead text-muted md:col-span-4 md:col-start-9">
              {note}
            </p>
          )}
        </Reveal>

        {matches.length === 0 ? (
          <p className="rounded-card border border-dashed border-charcoal/30 p-10 text-center text-muted">
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
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}