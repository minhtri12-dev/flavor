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
import Reveal from "@/components/Reveal";
import { getIngredientName } from "@/data/ingredients";
import { DICTIONARY } from "@/lib/i18n";
import { DURATION, EASE, VIEWPORT_ONCE } from "@/lib/motion";
import { useFavorites, useLanguage } from "@/lib/storage";
import type { Recipe } from "@/types";

interface RecipeDetailProps {
  recipe: Recipe;
}

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 12;

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
  const [imageLoaded, setImageLoaded] = useState(false);

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

      <main className="page-container pb-24 pt-28 md:pt-36">
        <Link
          href="/#discover"
          className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:text-terracotta hover:underline"
        >
          <ArrowLeft size={16} aria-hidden />
          {copy.detail.back}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE }}
          className="mt-6"
        >
          <div className="media-frame aspect-[4/3] sm:aspect-[16/9]">
            {!imageLoaded && !imageFailed && <div className="media-skeleton" />}
            {imageFailed ? (
              <div className="absolute inset-0 grid place-items-center text-charcoal/25">
                <ChefHat size={72} aria-hidden />
              </div>
            ) : (
              <Image
                src={recipe.image.src}
                alt={recipe.image.alt[lang]}
                fill
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageFailed(true)}
                className={`object-cover transition-opacity duration-700 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              {credit && (
                <p className="mb-3 inline-flex items-center gap-1.5 text-sm text-forest">
                  <ChefHat size={14} aria-hidden />
                  {credit.isChef
                    ? copy.card.inspiredBy(credit.name[lang])
                    : credit.name[lang]}
                  <span className="text-charcoal/50">
                    · {credit.origin[lang]}
                  </span>
                </p>
              )}
              <h1 className="font-display text-headline">{name}</h1>
              <p className="mt-4 max-w-xl text-lead text-muted">
                {recipe.description[lang]}
              </p>
            </div>

            <div className="md:col-span-4 md:justify-self-end">
              <button
                type="button"
                aria-pressed={isFavorite}
                onClick={() => toggleFavorite(recipe.slug)}
                className="btn btn-secondary"
              >
                <Heart
                  size={16}
                  aria-hidden
                  className={isFavorite ? "fill-terracotta text-terracotta" : ""}
                />
                {isFavorite ? copy.card.unsave(name) : copy.card.save(name)}
              </button>
            </div>
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

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <section
              aria-labelledby="ingredients-title"
              className="surface-oat self-start p-6 lg:sticky lg:top-24"
            >
              <h2 id="ingredients-title" className="font-display text-title">
                {copy.detail.ingredients}
              </h2>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-full border border-charcoal/20 bg-cream px-3 py-2">
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
                    className="btn btn-secondary size-9 !p-0"
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
                    className="btn btn-secondary size-9 !p-0"
                  >
                    <Plus size={14} aria-hidden />
                  </button>
                </div>
              </div>

              <ul className="mt-5 divide-y divide-charcoal/15">
                {recipe.ingredients.map((item) => (
                  <li
                    key={item.ingredientId}
                    className="flex items-baseline justify-between gap-4 py-3"
                  >
                    <span>
                      {getIngredientName(item.ingredientId, lang)}
                      {item.optional && (
                        <span className="ml-2 text-sm text-charcoal/50">
                          ({copy.detail.optional})
                        </span>
                      )}
                    </span>
                    <span className="text-sm tabular-nums text-muted">
                      {scaleAmount(item.amount, factor)}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={copyList}
                className="btn btn-secondary mt-5"
              >
                {copied ? (
                  <Check size={14} aria-hidden />
                ) : (
                  <Copy size={14} aria-hidden />
                )}
                {copied ? copy.detail.copied : copy.detail.copyList}
              </button>
            </section>
          </Reveal>

          <div className="lg:col-span-7">
            <section aria-labelledby="method-title">
              <h2 id="method-title" className="font-display text-title">
                {copy.detail.method}
              </h2>
              <ol className="mt-6 space-y-8">
                {recipe.steps.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT_ONCE}
                    transition={{ duration: DURATION.slow, ease: EASE }}
                    className="flex gap-5"
                  >
                    <span
                      aria-hidden
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-forest font-display text-lg text-cream"
                    >
                      {index + 1}
                    </span>
                    <p className="pt-1.5 text-lead">{step[lang]}</p>
                  </motion.li>
                ))}
              </ol>

              <Link
                href={`/cooking/${recipe.slug}`}
                className="btn btn-primary btn-lg mt-10"
              >
                {copy.detail.start}
              </Link>
            </section>

            {recipe.seasoning && recipe.seasoning.length > 0 && (
              <Reveal className="mt-16">
                <section aria-labelledby="seasoning-title">
                  <h2 id="seasoning-title" className="font-display text-title">
                    {copy.detail.seasoning}
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {recipe.seasoning.map((note, index) => (
                      <li
                        key={index}
                        className="border-l-2 border-forest pl-4 leading-relaxed text-charcoal/85"
                      >
                        {note[lang]}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </MotionConfig>
  );
}