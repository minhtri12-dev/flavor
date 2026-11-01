"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { INGREDIENTS, getIngredientName } from "@/data/ingredients";
import { DICTIONARY } from "@/lib/i18n";
import { DURATION, EASE, SPRING } from "@/lib/motion";
import { useShoppingChecked } from "@/lib/storage";
import { INGREDIENT_CATEGORIES } from "@/types";
import type { IngredientCategory, Language, Recipe } from "@/types";

interface ShoppingListProps {
  lang: Language;
  recipes: Recipe[];
}

interface ShoppingItem {
  id: string;
  category: IngredientCategory;
  amount: string;
}

function parseAmount(
  amount: string | undefined,
): { value: number; unit: string } | null {
  if (!amount) return null;
  const match = amount.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!match) return null;
  return { value: parseFloat(match[1].replace(",", ".")), unit: match[2].trim() };
}

function formatNumber(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function buildItems(recipes: Recipe[]): ShoppingItem[] {
  const categoryById = new Map(
    INGREDIENTS.map((ingredient) => [ingredient.id, ingredient.category]),
  );
  const totals = new Map<string, Map<string, number>>();

  for (const recipe of recipes) {
    for (const item of recipe.ingredients) {
      if (item.optional) continue;
      const units = totals.get(item.ingredientId) ?? new Map<string, number>();
      const parsed = parseAmount(item.amount);
      if (parsed) {
        units.set(parsed.unit, (units.get(parsed.unit) ?? 0) + parsed.value);
      }
      totals.set(item.ingredientId, units);
    }
  }

  return [...totals.entries()].map(([id, units]) => ({
    id,
    category: categoryById.get(id) ?? "Spices",
    amount: [...units.entries()]
      .map(([unit, value]) =>
        unit ? `${formatNumber(value)} ${unit}` : formatNumber(value),
      )
      .join(" + "),
  }));
}

export default function ShoppingList({ lang, recipes }: ShoppingListProps) {
  const copy = DICTIONARY[lang];
  const { checked, toggleChecked, clearChecked } = useShoppingChecked();
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => buildItems(recipes), [recipes]);

  const groups = useMemo(
    () =>
      INGREDIENT_CATEGORIES.map((category) => ({
        category,
        entries: items
          .filter((item) => item.category === category)
          .sort((a, b) =>
            getIngredientName(a.id, lang).localeCompare(
              getIngredientName(b.id, lang),
              lang,
            ),
          ),
      })).filter((group) => group.entries.length > 0),
    [items, lang],
  );

  const doneCount = items.filter((item) => checked.includes(item.id)).length;
  const total = items.length;
  const ratio = total === 0 ? 0 : doneCount / total;

  const copyList = async () => {
    const lines = items
      .filter((item) => !checked.includes(item.id))
      .map((item) => {
        const label = getIngredientName(item.id, lang);
        return item.amount ? `- ${label}: ${item.amount}` : `- ${label}`;
      });
    const text = [copy.shopping.listTitle, ...lines].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      id="shopping"
      aria-labelledby="shopping-heading"
      className="bg-oat"
    >
      <div className="page-container section-pad">
        <div className="mb-12 grid gap-4 md:grid-cols-12 md:items-end">
          <h2
            id="shopping-heading"
            className="font-display text-headline md:col-span-7"
          >
            {copy.shopping.title}
          </h2>
          <p className="text-lead text-muted md:col-span-4 md:col-start-9">
            {copy.shopping.note}
          </p>
        </div>

        {total === 0 ? (
          <p className="rounded-card border border-dashed border-charcoal/30 p-10 text-center text-muted">
            {copy.shopping.empty}
          </p>
        ) : (
          <div className="surface p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <p className="flex flex-wrap items-baseline gap-x-4">
                  <span
                    aria-live="polite"
                    className="font-display text-title tabular-nums"
                  >
                    {copy.shopping.progress(doneCount, total)}
                  </span>
                  <span className="text-sm text-muted">
                    {copy.shopping.fromRecipes(recipes.length)}
                  </span>
                </p>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-valuenow={doneCount}
                  aria-label={copy.shopping.title}
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-charcoal/10"
                >
                  <motion.div
                    className="h-full rounded-full bg-forest"
                    animate={{ width: `${ratio * 100}%` }}
                    transition={{ duration: DURATION.base, ease: EASE }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyList}
                  className="btn btn-secondary"
                >
                  {copied ? (
                    <Check size={14} aria-hidden />
                  ) : (
                    <Copy size={14} aria-hidden />
                  )}
                  {copied ? copy.shopping.copied : copy.shopping.copy}
                </button>
                <button
                  type="button"
                  onClick={clearChecked}
                  disabled={doneCount === 0}
                  className="btn btn-secondary"
                >
                  {copy.shopping.reset}
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {groups.map((group) => (
                <section
                  key={group.category}
                  aria-label={copy.categories[group.category]}
                >
                  <h3 className="font-display text-xl">
                    {copy.categories[group.category]}
                  </h3>
                  <ul className="mt-2 divide-y divide-charcoal/10">
                    <AnimatePresence initial={false}>
                      {group.entries.map((item) => {
                        const isChecked = checked.includes(item.id);
                        return (
                          <motion.li
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            transition={{ duration: DURATION.base, ease: EASE }}
                          >
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={isChecked}
                              onClick={() => toggleChecked(item.id)}
                              className="flex w-full items-center gap-3 py-3 text-left"
                            >
                              <span
                                aria-hidden
                                className={`grid size-6 shrink-0 place-items-center rounded-full border transition-colors ${
                                  isChecked
                                    ? "border-forest bg-forest text-cream"
                                    : "border-charcoal/30"
                                }`}
                              >
                                {isChecked && (
                                  <motion.span
                                    initial={{ scale: 0.4 }}
                                    animate={{ scale: 1 }}
                                    transition={SPRING}
                                    className="grid place-items-center"
                                  >
                                    <Check size={14} />
                                  </motion.span>
                                )}
                              </span>
                              <span
                                className={`flex-1 transition-opacity ${
                                  isChecked ? "line-through opacity-50" : ""
                                }`}
                              >
                                {getIngredientName(item.id, lang)}
                              </span>
                              <span
                                className={`text-sm tabular-nums text-muted ${
                                  isChecked ? "opacity-50" : ""
                                }`}
                              >
                                {item.amount}
                              </span>
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}