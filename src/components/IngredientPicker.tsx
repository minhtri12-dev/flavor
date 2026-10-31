"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Search, X } from "lucide-react";
import { INGREDIENTS, getIngredientName } from "@/data/ingredients";
import { DICTIONARY } from "@/lib/i18n";
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

const CHIP_BASE =
  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9573B]";

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
      className="bg-[#E8DFD1] px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2
            id="ingredients-heading"
            className="font-display text-4xl leading-tight md:text-5xl"
          >
            {copy.picker.title}
          </h2>
          <p className="max-w-sm text-[#30251F]/70">{copy.picker.note}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <label className="flex items-center gap-3 rounded-full border border-[#30251F]/25 bg-[#F7F3EA] px-5 py-3 focus-within:border-[#D9573B]">
              <Search size={20} aria-hidden />
              <span className="sr-only">{copy.picker.search}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.picker.search}
                className="w-full bg-transparent text-lg outline-none placeholder:text-[#30251F]/40"
              />
            </label>

            <div
              role="group"
              aria-label={copy.picker.filter}
              className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0"
            >
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={category === filter}
                  onClick={() => setCategory(filter)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#D9573B] ${
                    category === filter
                      ? "bg-[#30251F] text-[#F7F3EA]"
                      : "bg-[#F7F3EA]/60 hover:bg-[#F7F3EA]"
                  }`}
                >
                  {filter === "All"
                    ? copy.picker.all
                    : copy.categories[filter]}
                </button>
              ))}
            </div>

            <div className="mt-6 flex min-h-32 flex-wrap content-start gap-2">
              {visible.map((item) => {
                const selected = selectedIds.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    layout
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onToggle(item.id)}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    className={`${CHIP_BASE} ${
                      selected
                        ? "border-[#D9573B] bg-[#D9573B] text-[#F7F3EA]"
                        : "border-[#30251F]/20 bg-[#F7F3EA]/60 hover:border-[#30251F]"
                    }`}
                  >
                    {selected && <Check size={14} aria-hidden />}
                    {item.name[lang]}
                  </motion.button>
                );
              })}
              {visible.length === 0 && (
                <p className="text-[#30251F]/70">
                  {copy.picker.noMatch(query)}
                </p>
              )}
            </div>
          </div>

          <aside
            aria-label={copy.picker.pantryLabel}
            className="self-start rounded-2xl border border-[#30251F]/20 bg-[#F7F3EA] p-6 lg:col-span-4"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-2xl">{copy.picker.pantry}</h3>
              <span aria-live="polite" className="text-sm text-[#30251F]/70">
                {copy.picker.selected(selectedIds.length)}
              </span>
            </div>

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
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        type="button"
                        onClick={() => onToggle(id)}
                        aria-label={copy.picker.remove(name)}
                        className={`${CHIP_BASE} border-[#D9573B] bg-[#D9573B] text-[#F7F3EA] hover:border-[#30251F] hover:bg-[#30251F]`}
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
              <p className="text-[#30251F]/60">{copy.picker.emptyPantry}</p>
            )}

            <button
              type="button"
              onClick={onClear}
              disabled={selectedIds.length === 0}
              className="mt-5 rounded-full border border-[#30251F]/30 px-4 py-2 text-sm transition-colors hover:bg-[#30251F] hover:text-[#F7F3EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9573B] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              {copy.picker.clear}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}