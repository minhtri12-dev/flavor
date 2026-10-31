"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChefHat, ChevronDown, Clock, Gauge, Heart } from "lucide-react";
import { getIngredientName } from "@/data/ingredients";
import { DICTIONARY } from "@/lib/i18n";
import type { Language, RecipeMatch } from "@/types";

interface RecipeCardProps {
  lang: Language;
  match: RecipeMatch;
  hasSelection: boolean;
  isFavorite: boolean;
  onToggleFavorite: (slug: string) => void;
  featured?: boolean;
}

const RING_RADIUS = 17;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

interface MatchRingProps {
  have: number;
  total: number;
  label: string;
}

function MatchRing({ have, total, label }: MatchRingProps) {
  const ratio = total === 0 ? 0 : have / total;

  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 48 48"
      role="img"
      aria-label={label}
      className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[#F7F3EA]"
    >
      <g transform="rotate(-90 24 24)">
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          stroke="#30251F"
          strokeOpacity="0.15"
          strokeWidth="4"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          stroke="#D9573B"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          initial={{ strokeDashoffset: RING_LENGTH }}
          animate={{ strokeDashoffset: RING_LENGTH * (1 - ratio) }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </g>
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#30251F"
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
  featured = false,
}: RecipeCardProps) {
  const copy = DICTIONARY[lang];
  const { recipe, matched, missing } = match;
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const notesId = useId();
  const requiredCount = matched.length + missing.length;
  const name = recipe.name[lang];
  const credit = recipe.credit;
  const href = `/recipes/${recipe.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col ${
        featured ? "lg:col-span-2 lg:flex-row lg:items-center lg:gap-10" : ""
      }`}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E8DFD1] transition-shadow duration-500 group-hover:shadow-[0_18px_40px_-18px_rgba(48,37,31,0.45)] ${
          featured ? "lg:w-[58%] lg:shrink-0" : ""
        }`}
      >
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 animate-pulse bg-[#DCCFBB]" />
        )}
        {imageFailed ? (
          <div className="absolute inset-0 grid place-items-center text-[#30251F]/25">
            <ChefHat size={56} aria-hidden />
          </div>
        ) : (
          <Image
            src={recipe.image.src}
            alt={recipe.image.alt[lang]}
            fill
            priority={featured}
            sizes={
              featured
                ? "(min-width: 1024px) 40vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
            className={`object-cover transition-[transform,opacity] duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <Link
          href={href}
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0"
        />
        <button
          type="button"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? copy.card.unsave(name) : copy.card.save(name)}
          onClick={() => onToggleFavorite(recipe.slug)}
          className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-[#F7F3EA] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#D9573B]"
        >
          <motion.span
            key={String(isFavorite)}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="grid place-items-center"
          >
            <Heart
              size={18}
              aria-hidden
              className={isFavorite ? "fill-[#D9573B] text-[#D9573B]" : ""}
            />
          </motion.span>
        </button>
        {hasSelection && (
          <MatchRing
            have={matched.length}
            total={requiredCount}
            label={copy.card.ring(matched.length, requiredCount)}
          />
        )}
      </div>

      <div className={`flex flex-col ${featured ? "lg:flex-1" : ""}`}>
        <h3
          className={`mt-4 font-display text-2xl leading-snug ${
            featured ? "lg:mt-0 lg:text-4xl" : ""
          }`}
        >
          <Link
            href={href}
            className="transition-colors hover:text-[#D9573B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9573B]"
          >
            {name}
          </Link>
        </h3>

        {credit && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#5C6B52]">
            <ChefHat size={14} aria-hidden />
            {credit.isChef
              ? copy.card.inspiredBy(credit.name[lang])
              : credit.name[lang]}
            <span className="text-[#30251F]/50">· {credit.origin[lang]}</span>
          </p>
        )}

        <p className="mt-2 text-[#30251F]/70">{recipe.description[lang]}</p>

        <p className="mt-3 flex gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden />
            {copy.card.minutes(recipe.minutes)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge size={14} aria-hidden />
            {copy.difficulty[recipe.difficulty]}
          </span>
        </p>

        <p className="mt-3 border-t border-[#30251F]/15 pt-3 text-sm">
          {hasSelection ? (
            <>
              <span className="text-[#5C6B52]">
                {copy.card.have(matched.length, requiredCount)}
              </span>{" "}
              <span className="text-[#30251F]/70">
                {missing.length > 0
                  ? copy.card.missing(
                      missing
                        .map((id) => getIngredientName(id, lang))
                        .join(", "),
                    )
                  : copy.card.ready}
              </span>
            </>
          ) : (
            <span className="text-[#30251F]/70">
              {copy.card.needs(requiredCount)}
            </span>
          )}
        </p>

        {recipe.seasoning && recipe.seasoning.length > 0 && (
          <div className="mt-3">
            <button
              type="button"
              aria-expanded={notesOpen}
              aria-controls={notesId}
              onClick={() => setNotesOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-[#30251F]/25 px-4 py-2 text-sm transition-colors hover:bg-[#30251F] hover:text-[#F7F3EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9573B]"
            >
              {copy.card.seasoning}
              <motion.span
                animate={{ rotate: notesOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="grid place-items-center"
              >
                <ChevronDown size={14} aria-hidden />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {notesOpen && (
                <motion.ul
                  id={notesId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  {recipe.seasoning.map((note, index) => (
                    <li
                      key={index}
                      className="mt-3 border-l-2 border-[#87977B] pl-3 text-sm leading-relaxed text-[#30251F]/80"
                    >
                      {note[lang]}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.article>
  );
}