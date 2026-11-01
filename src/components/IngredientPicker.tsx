"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Search, X } from "lucide-react";
import { INGREDIENTS, getIngredientName } from "@/data/ingredients";
import { DICTIONARY } from "@/lib/i18n";
import { DURATION, EASE, PRESS, SPRING } from "@/lib/motion";
import { INGREDIENT_CATEGORIES } from "@/types";
import type { IngredientCategory, Language } from "@/types";

interface IngredientPickerProps {
  lang: Language;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

type CategoryFilter = IngredientCategory | "All";

const FILTERS: readonly CategoryFilter[] = ["All", ...INGREDIENT_CATEGORIES];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export default function IngredientPicker({
  lang,
  selectedIds,
  onToggle,
  onClear,
}: IngredientPickerProps) {
  const copy = DICTIONARY[lang];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const visible = useMemo(() => {
    const needle = normalize(query.trim());
    return INGREDIENTS.filter(
      (item) =>
        (category === "All" || item.category === category) &&
        (normalize(item.name.en).includes(needle) ||
          normalize(item.name.vi).includes(needle)),
    );
  }, [query, category]);

  return (
    <section
      id="ingredients"
      aria-labelledby="ingredients-heading"
      className="bg-oat"
    >
      <div className="page-container section-pad">
        <div className="mb-12 grid gap-4 md:grid-cols-12 md:items-end">
          <h2
            id="ingredients-heading"
            className="font-display text-headline md:col-span-7"
          >
            {copy.picker.title}
          </h2>
          <p className="text-lead text-muted md:col-span-4 md:col-start-9">
            {copy.picker.note}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <label className="flex items-center gap-3 rounded-full border border-charcoal/25 bg-cream px-6 py-4 transition-shadow focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/30">
              <Search size={20} aria-hidden />
              <span className="sr-only">{copy.picker.search}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.picker.search}
                className="w-full bg-transparent text-lg outline-none placeholder:text-charcoal/40"
              />
            </label>

            <div
              role="group"
              aria-label={copy.picker.filter}
              className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0"
            >
              {FILTERS.map((filter) => {
                const active = category === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(filter)}
                    className="relative shrink-0 rounded-full px-4 py-2 text-sm"
                  >
                    {active && (
                      <motion.span
                        layoutId="filter-pill"
                        transition={SPRING}
                        className="absolute inset-0 rounded-full bg-charcoal"
                      />
                    )}
                    {!active && (
                      <span className="absolute inset-0 rounded-full bg-cream/60 transition-colors hover:bg-cream" />
                    )}
                    <span
                      className={`relative ${
                        active ? "text-cream" : "text-charcoal"
                      }`}
                    >
                      {filter === "All"
                        ? copy.picker.all
                        : copy.categories[filter]}
                    </span>
                  </button>
                );
              })}
            </div>

            <motion.div
              layout
              className="mt-8 flex min-h-32 flex-wrap content-start gap-2"
            >
              {visible.map((item) => {
                const selected = selectedIds.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    layout
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onToggle(item.id)}
                    whileTap={PRESS}
                    transition={SPRING}
                    className={`chip ${selected ? "chip-active" : ""}`}
                  >
                    {selected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={SPRING}
                        className="grid place-items-center"
                      >
                        <Check size={14} aria-hidden />
                      </motion.span>
                    )}
                    {item.name[lang]}
                  </motion.button>
                );
              })}
              {visible.length === 0 && (
                <p className="text-muted">{copy.picker.noMatch(query)}</p>
              )}
            </motion.div>
          </div>

          <aside
            aria-label={copy.picker.pantryLabel}
            className="surface self-start p-6 lg:sticky lg:top-24 lg:col-span-4"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-title">{copy.picker.pantry}</h3>
              <motion.span
                key={selectedIds.length}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.base, ease: EASE }}
                className="font-display text-5xl leading-none tabular-nums text-terracotta"
              >
                {selectedIds.length}
              </motion.span>
            </div>
            <p aria-live="polite" className="mt-1 text-sm text-muted">
              {copy.picker.selected(selectedIds.length)}
            </p>

            <ul className="mt-5 flex min-h-20 flex-wrap content-start gap-2">
              <AnimatePresence>
                {selectedIds.map((id) => {
                  const name = getIngredientName(id, lang);
                  return (
                    <motion.li
                      key={id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: DURATION.fast }}
                    >
                      <button
                        type="button"
                        onClick={() => onToggle(id)}
                        aria-label={copy.picker.remove(name)}
                        className="chip chip-active"
                      >
                        {name}
                        <X size={14} aria-hidden />
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            {selectedIds.length === 0 && (
              <p className="text-muted">{copy.picker.emptyPantry}</p>
            )}

            <button
              type="button"
              onClick={onClear}
              disabled={selectedIds.length === 0}
              className="btn btn-secondary mt-5"
            >
              {copy.picker.clear}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}