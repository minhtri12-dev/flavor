"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  ChevronDown,
  Clock,
  Gauge,
  Heart,
} from "lucide-react";
import PhotoCredit from "@/components/PhotoCredit";
import { getIngredientName } from "@/data/ingredients";
import { DICTIONARY } from "@/lib/i18n";
import { DURATION, EASE, SPRING, VIEWPORT_ONCE } from "@/lib/motion";
import type { Language, RecipeMatch } from "@/types";

export type CardVariant = "standard" | "feature" | "stack" | "wide";

interface RecipeCardProps {
  lang: Language;
  match: RecipeMatch;
  hasSelection: boolean;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
  variant?: CardVariant;
  index?: number;
  className?: string;
}

interface VariantStyle {
  article: string;
  media: string;
  body: string;
  title: string;
  description: string;
  sizes: string;
}

const VARIANTS: Record<CardVariant, VariantStyle> = {
  standard: {
    article: "flex flex-col",
    media: "aspect-[4/3]",
    body: "pt-5",
    title: "text-title min-h-[2.4em] line-clamp-2",
    description: "line-clamp-2 min-h-[3.3em]",
    sizes: "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw",
  },
  feature: {
    article: "flex flex-col",
    media:
      "aspect-[4/3] md:aspect-[16/9] lg:aspect-auto lg:min-h-[26rem] lg:flex-1",
    body: "pt-6",
    title: "text-title lg:text-4xl",
    description: "line-clamp-3",
    sizes: "(min-width: 1024px) 58vw, 100vw",
  },
  stack: {
    article: "flex flex-col lg:flex-row lg:gap-5",
    media: "aspect-[4/3] lg:aspect-[4/5] lg:w-[44%] lg:shrink-0 lg:self-start",
    body: "pt-5 lg:pt-0",
    title: "text-title min-h-[2.4em] line-clamp-2 lg:text-xl",
    description: "line-clamp-2 min-h-[3.3em] lg:hidden",
    sizes: "(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw",
  },
  wide: {
    article: "flex flex-col lg:flex-row lg:items-center lg:gap-10",
    media: "aspect-[4/3] lg:aspect-[16/10] lg:w-[58%] lg:shrink-0",
    body: "pt-5 lg:flex-1 lg:pt-0",
    title: "text-title lg:text-4xl",
    description: "line-clamp-3",
    sizes: "(min-width: 1024px) 58vw, 100vw",
  },
};

const LABELS: Record<Language, { explore: string }> = {
  en: { explore: "Explore recipe" },
  vi: { explore: "Xem công thức" },
};

const RING_RADIUS = 17;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

interface MatchRingProps {
  have: number;
  total: number;
  label: string;
  className: string;
}

function MatchRing({ have, total, label, className }: MatchRingProps) {
  const ratio = total === 0 ? 0 : have / total;

  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 48 48"
      role="img"
      aria-label={label}
      className={`pointer-events-none absolute z-10 rounded-full bg-cream ${className}`}
    >
      <g transform="rotate(-90 24 24)">
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="4"
          className="stroke-charcoal/15"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          className="stroke-terracotta"
          initial={{ strokeDashoffset: RING_LENGTH }}
          animate={{ strokeDashoffset: RING_LENGTH * (1 - ratio) }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </g>
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        className="fill-charcoal"
      >
        {have}/{total}
      </text>
    </svg>
  );
}

export default function RecipeCard({
  lang,
  match,
  hasSelection,
  isFavorite,
  onToggleFavorite,
  variant = "standard",
  index = 0,
  className = "",
}: RecipeCardProps) {
  const copy = DICTIONARY[lang];
  const label = LABELS[lang];
  const style = VARIANTS[variant];
  const isStack = variant === "stack";
  const { recipe, matched, missing } = match;
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const notesId = useId();
  const requiredCount = matched.length + missing.length;
  const name = recipe.name[lang];
  const credit = recipe.credit;
  const photoCredit = recipe.image.credit;
  const href = `/recipes/${recipe.slug}`;

  const haveText = copy.card.have(matched.length, requiredCount);
  const restText =
    missing.length > 0
      ? copy.card.missing(
          missing.map((id) => getIngredientName(id, lang)).join(", "),
        )
      : copy.card.ready;
  const matchTitle = hasSelection
    ? `${haveText} ${restText}`
    : copy.card.needs(requiredCount);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{
        duration: DURATION.slow,
        ease: EASE,
        delay: (index % 4) * 0.07,
      }}
      className={`group ${style.article} ${className}`}
    >
      <div
        className={`media-frame transition-[transform,box-shadow] duration-500 ease-soft group-hover:-translate-y-1 group-hover:shadow-lift ${style.media}`}
      >
        {!imageLoaded && !imageFailed && <div className="media-skeleton" />}
        {imageFailed ? (
          <div className="absolute inset-0 grid place-items-center text-charcoal/25">
            <ChefHat size={56} aria-hidden />
          </div>
        ) : (
          <Image
            src={recipe.image.src}
            alt={recipe.image.alt[lang]}
            fill
            sizes={style.sizes}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
            className={`object-cover transition-[transform,opacity] duration-[900ms] ease-soft group-hover:scale-[1.06] ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/45 via-charcoal/0 to-charcoal/10 opacity-0 transition-opacity duration-500 ease-soft group-hover:opacity-100"
        />

        <Link
          href={href}
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0"
        />

        <span
          aria-hidden
          className={`pointer-events-none absolute left-3 top-3 z-10 inline-flex -translate-y-1 items-center gap-1.5 rounded-full bg-cream px-3.5 py-2 text-xs font-medium opacity-0 transition-[opacity,transform] duration-500 ease-soft group-hover:translate-y-0 group-hover:opacity-100 ${
            isStack ? "lg:hidden" : ""
          }`}
        >
          {label.explore}
          <ArrowUpRight size={14} />
        </span>

        <button
          type="button"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? copy.card.unsave(name) : copy.card.save(name)}
          onClick={() => onToggleFavorite(recipe.slug)}
          className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-cream transition-transform hover:scale-105"
        >
          <AnimatePresence>
            {isFavorite && (
              <motion.span
                key="burst"
                aria-hidden
                initial={{ scale: 0.7, opacity: 0.8 }}
                animate={{ scale: 1.9, opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="absolute inset-0 rounded-full border-2 border-terracotta"
              />
            )}
          </AnimatePresence>
          <motion.span
            key={String(isFavorite)}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={SPRING}
            className="grid place-items-center"
          >
            <Heart
              size={18}
              aria-hidden
              className={isFavorite ? "fill-terracotta text-terracotta" : ""}
            />
          </motion.span>
        </button>

        {hasSelection && (
          <MatchRing
            have={matched.length}
            total={requiredCount}
            label={copy.card.ring(matched.length, requiredCount)}
            className={
              isStack
                ? "bottom-3 left-3 lg:bottom-auto lg:top-3"
                : "bottom-3 left-3"
            }
          />
        )}

        {photoCredit && !imageFailed && (
          <PhotoCredit
            credit={photoCredit}
            lang={lang}
            className={`absolute bottom-3 right-3 z-10 max-w-[58%] truncate rounded-full bg-cream/90 px-3 py-1 text-[11px] text-charcoal ${
              isStack ? "lg:left-3 lg:right-3 lg:max-w-none" : ""
            }`}
          />
        )}
      </div>

      <div className={`flex min-w-0 flex-1 flex-col ${style.body}`}>
        <h3 className={`font-display ${style.title}`}>
          <Link href={href} className="transition-colors hover:text-terracotta">
            {name}
          </Link>
        </h3>

        <div className="mt-2 h-5">
          {credit && (
            <p className="flex h-5 items-center gap-1.5 overflow-hidden whitespace-nowrap text-sm text-forest">
              <ChefHat size={14} aria-hidden className="shrink-0" />
              <span className="min-w-0 truncate">
                {credit.isChef
                  ? copy.card.inspiredBy(credit.name[lang])
                  : credit.name[lang]}
                <span className="text-charcoal/50">
                  {" "}
                  · {credit.origin[lang]}
                </span>
              </span>
            </p>
          )}
        </div>

        <p className={`mt-2 text-muted ${style.description}`}>
          {recipe.description[lang]}
        </p>

        <div className="mt-auto pt-4">
          <p className="flex gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} aria-hidden />
              {copy.card.minutes(recipe.minutes)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Gauge size={14} aria-hidden />
              {copy.difficulty[recipe.difficulty]}
            </span>
          </p>

          <div className="mt-3 border-t border-charcoal/15 pt-3">
            <p
              title={matchTitle}
              className="line-clamp-2 min-h-[3.3em] text-sm"
            >
              {hasSelection ? (
                <>
                  <span className="font-medium text-forest">{haveText}</span>{" "}
                  <span className="text-muted">{restText}</span>
                </>
              ) : (
                <span className="text-muted">{matchTitle}</span>
              )}
            </p>
          </div>

          <div className="mt-2 flex min-h-11 items-center justify-between gap-3">
            {recipe.seasoning && recipe.seasoning.length > 0 ? (
              <button
                type="button"
                aria-expanded={notesOpen}
                aria-controls={notesId}
                onClick={() => setNotesOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-charcoal/70 px-4 py-2 text-xs font-medium transition-colors duration-200 hover:bg-charcoal hover:text-cream"
              >
                {copy.card.seasoning}
                <motion.span
                  animate={{ rotate: notesOpen ? 180 : 0 }}
                  transition={{ duration: DURATION.fast }}
                  className="grid place-items-center"
                >
                  <ChevronDown size={14} aria-hidden />
                </motion.span>
              </button>
            ) : (
              <span aria-hidden />
            )}

            <Link
              href={href}
              className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 transition-colors hover:text-terracotta hover:underline"
            >
              <span className={isStack ? "lg:sr-only" : ""}>
                {label.explore}
              </span>
              <ArrowRight
                size={14}
                aria-hidden
                className="transition-transform duration-300 ease-soft group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {recipe.seasoning && recipe.seasoning.length > 0 && (
            <AnimatePresence initial={false}>
              {notesOpen && (
                <motion.ul
                  id={notesId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  {recipe.seasoning.map((note, noteIndex) => (
                    <li
                      key={noteIndex}
                      className="mt-3 border-l-2 border-forest pl-3 text-sm leading-relaxed text-charcoal/80"
                    >
                      {note[lang]}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.article>
  );
}