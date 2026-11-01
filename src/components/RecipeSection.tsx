"use client";

import RecipeCard from "@/components/RecipeCard";
import type { CardVariant } from "@/components/RecipeCard";
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
  mirrored?: boolean;
}

const BLOCK_SIZE = 4;
const GRID = "grid gap-x-8 gap-y-14";

function toBlocks(matches: RecipeMatch[]): RecipeMatch[][] {
  const blocks: RecipeMatch[][] = [];
  for (let i = 0; i < matches.length; i += BLOCK_SIZE) {
    blocks.push(matches.slice(i, i + BLOCK_SIZE));
  }
  return blocks;
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
  mirrored = false,
}: RecipeSectionProps) {
  const headingId = id ? `${id}-heading` : undefined;

  const renderCard = (
    match: RecipeMatch,
    variant: CardVariant,
    index: number,
    className?: string,
  ) => (
    <RecipeCard
      key={match.recipe.slug}
      lang={lang}
      match={match}
      hasSelection={hasSelection}
      isFavorite={favoriteSlugs.includes(match.recipe.slug)}
      onToggleFavorite={onToggleFavorite}
      variant={variant}
      index={index}
      className={className}
    />
  );

  let featureOrder = 0;

  const blocks = toBlocks(matches).map((block, blockIndex) => {
    const startIndex = blockIndex * BLOCK_SIZE;
    const key = block[0].recipe.slug;

    if (block.length >= 3) {
      const flipped = mirrored !== (featureOrder % 2 === 1);
      featureOrder += 1;
      const [feature, ...rest] = block;

      return (
        <div key={key} className={`${GRID} md:grid-cols-2 lg:grid-cols-12`}>
          {renderCard(
            feature,
            "feature",
            startIndex,
            `md:col-span-2 lg:col-span-7 ${flipped ? "lg:order-2" : ""}`,
          )}
          <div
            className={`${GRID} md:col-span-2 md:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:auto-rows-fr lg:gap-y-8 ${
              flipped ? "lg:order-1" : ""
            }`}
          >
            {rest.map((match, offset) =>
              renderCard(match, "stack", startIndex + 1 + offset),
            )}
          </div>
        </div>
      );
    }

    if (block.length === 2) {
      return (
        <div key={key} className={`${GRID} md:grid-cols-2`}>
          {block.map((match, offset) =>
            renderCard(match, "standard", startIndex + offset),
          )}
        </div>
      );
    }

    return (
      <div key={key} className={GRID}>
        {renderCard(block[0], "wide", startIndex)}
      </div>
    );
  });

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
          <div className="flex flex-col gap-y-16 md:gap-y-24">{blocks}</div>
        )}
      </div>
    </section>
  );
}