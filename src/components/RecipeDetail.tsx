"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChefHat,
  Clock,
  Copy,
  Gauge,
  Heart,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getIngredientName } from "@/data/ingredients";
import { DICTIONARY } from "@/lib/i18n";
import { useFavorites, useLanguage } from "@/lib/storage";
import type { Recipe } from "@/types";

interface RecipeDetailProps {
  recipe: Recipe;
}

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 12;
const EASE = [0.22, 1, 0.36, 1] as const;

function scaleAmount(amount: string | undefined, factor: number): string {
  if (!amount) return "";
  const match = amount.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return amount;
  const value = parseFloat(match[1].replace(",", ".")) * factor;
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text}${match[2]}`;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const { lang, setLang } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites();
  const copy = DICTIONARY[lang];
  const [servings, setServings] = useState(recipe.servings);
  const [copied, setCopied] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const factor = servings / recipe.servings;
  const name = recipe.name[lang];
  const isFavorite = favorites.includes(recipe.slug);
  const credit = recipe.credit;

  const copyList = async () => {
    const lines = recipe.ingredients.map((item) => {
      const amount = scaleAmount(item.amount, factor);
      const label = getIngredientName(item.ingredientId, lang);
      return amount ? `- ${label}: ${amount}` : `- ${label}`;
    });
    const text = [copy.detail.listTitle(name), ...lines].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        favoritesCount={favorites.length}
      />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-10 md:pt-32">
        <Link
          href="/#discover"
          className="inline-flex items-center gap-2 text-sm hover:text-[#D9573B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9573B]"
        >
          <ArrowLeft size={16} aria-hidden />
          {copy.detail.back}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-6"
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-[#E8DFD1]">
            {!imageFailed && (
              <Image
                src={recipe.image.src}
                alt={recipe.image.alt[lang]}
                fill
                priority
                sizes="(min-width: 1152px) 1100px, 100vw"
                onError={() => setImageFailed(true)}
                className="object-cover"
              />
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              {credit && (
                <p className="mb-2 inline-flex items-center gap-1.5 text-sm text-[#5C6B52]">
                  <ChefHat size={14} aria-hidden />
                  {credit.isChef
                    ? copy.card.inspiredBy(credit.name[lang])
                    : credit.name[lang]}
                  <span className="text-[#30251F]/50">
                    · {credit.origin[lang]}
                  </span>
                </p>
              )}
              <h1 className="font-display text-4xl leading-tight md:text-6xl">
                {name}
              </h1>
              <p className="mt-3 max-w-xl text-lg text-[#30251F]/75">
                {recipe.description[lang]}
              </p>
            </div>

            <button
              type="button"
              aria-pressed={isFavorite}
              onClick={() => toggleFavorite(recipe.slug)}
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#30251F]/25 px-5 py-3 text-sm transition-colors hover:bg-[#30251F] hover:text-[#F7F3EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9573B] md:self-auto"
            >
              <Heart
                size={16}
                aria-hidden
                className={isFavorite ? "fill-[#D9573B] text-[#D9573B]" : ""}
              />
              {isFavorite ? copy.card.unsave(name) : copy.card.save(name)}
            </button>
          </div>

          <p className="mt-6 flex flex-wrap gap-6 text-sm">
            <span className="inline-flex items-center gap-2">
              <Clock size={16} aria-hidden />
              {copy.card.minutes(recipe.minutes)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Gauge size={16} aria-hidden />
              {copy.difficulty[recipe.difficulty]}
            </span>
          </p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <section
            aria-labelledby="ingredients-title"
            className="self-start rounded-2xl border border-[#30251F]/20 bg-[#E8DFD1]/50 p-6 lg:col-span-5 lg:sticky lg:top-6"
          >
            <h2 id="ingredients-title" className="font-display text-3xl">
              {copy.detail.ingredients}
            </h2>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-full border border-[#30251F]/20 bg-[#F7F3EA] px-3 py-2">
              <span className="inline-flex items-center gap-2 pl-2 text-sm">
                <Users size={16} aria-hidden />
                {copy.detail.servings}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={copy.detail.fewer}
                  disabled={servings <= MIN_SERVINGS}
                  onClick={() => setServings((value) => value - 1)}
                  className="grid size-9 place-items-center rounded-full border border-[#30251F]/25 transition-colors hover:bg-[#30251F] hover:text-[#F7F3EA] focus-visible:outline-2 focus-visible:outline-[#D9573B] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
                >
                  <Minus size={14} aria-hidden />
                </button>
                <span
                  aria-live="polite"
                  className="min-w-6 text-center font-display text-xl tabular-nums"
                >
                  {servings}
                </span>
                <button
                  type="button"
                  aria-label={copy.detail.more}
                  disabled={servings >= MAX_SERVINGS}
                  onClick={() => setServings((value) => value + 1)}
                  className="grid size-9 place-items-center rounded-full border border-[#30251F]/25 transition-colors hover:bg-[#30251F] hover:text-[#F7F3EA] focus-visible:outline-2 focus-visible:outline-[#D9573B] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
                >
                  <Plus size={14} aria-hidden />
                </button>
              </div>
            </div>

            <ul className="mt-5 divide-y divide-[#30251F]/15">
              {recipe.ingredients.map((item) => (
                <li
                  key={item.ingredientId}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <span>
                    {getIngredientName(item.ingredientId, lang)}
                    {item.optional && (
                      <span className="ml-2 text-sm text-[#30251F]/50">
                        ({copy.detail.optional})
                      </span>
                    )}
                  </span>
                  <span className="text-sm tabular-nums text-[#30251F]/70">
                    {scaleAmount(item.amount, factor)}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={copyList}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#30251F]/30 px-5 py-2.5 text-sm transition-colors hover:bg-[#30251F] hover:text-[#F7F3EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9573B]"
            >
              {copied ? (
                <Check size={14} aria-hidden />
              ) : (
                <Copy size={14} aria-hidden />
              )}
              {copied ? copy.detail.copied : copy.detail.copyList}
            </button>
          </section>

          <div className="lg:col-span-7">
            <section aria-labelledby="method-title">
              <h2 id="method-title" className="font-display text-3xl">
                {copy.detail.method}
              </h2>
              <ol className="mt-6 space-y-8">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-5">
                    <span
                      aria-hidden
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-[#30251F] font-display text-lg text-[#F7F3EA]"
                    >
                      {index + 1}
                    </span>
                    <p className="pt-1.5 text-lg leading-relaxed">
                      {step[lang]}
                    </p>
                  </li>
                ))}
              </ol>

              <Link
                href={`/cooking/${recipe.slug}`}
                className="mt-10 inline-flex rounded-full bg-[#D9573B] px-8 py-4 text-base font-medium text-[#F7F3EA] transition-colors hover:bg-[#30251F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9573B]"
              >
                {copy.detail.start}
              </Link>
            </section>

            {recipe.seasoning && recipe.seasoning.length > 0 && (
              <section aria-labelledby="seasoning-title" className="mt-14">
                <h2 id="seasoning-title" className="font-display text-3xl">
                  {copy.detail.seasoning}
                </h2>
                <ul className="mt-5 space-y-4">
                  {recipe.seasoning.map((note, index) => (
                    <li
                      key={index}
                      className="border-l-2 border-[#87977B] pl-4 leading-relaxed text-[#30251F]/85"
                    >
                      {note[lang]}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </MotionConfig>
  );
}