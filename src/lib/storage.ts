import { useCallback, useMemo, useSyncExternalStore } from "react";
import { DEFAULT_LANGUAGE, isLanguage } from "@/lib/i18n";
import type { Language } from "@/types";

const FAVORITES_KEY = "flavor:favorites";
const LANGUAGE_KEY = "flavor:language";
const CHECKED_KEY = "flavor:shopping-checked";

const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function useStoredString(
  key: string,
  fallback: string,
): [string, (value: string) => void] {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }, [key, fallback]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, () => fallback);

  const setRaw = useCallback(
    (value: string) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        return;
      } finally {
        listeners.forEach((listener) => listener());
      }
    },
    [key],
  );

  return [raw, setRaw];
}

function parseSlugs(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function useLanguage(): {
  lang: Language;
  setLang: (lang: Language) => void;
} {
  const [stored, setStored] = useStoredString(LANGUAGE_KEY, DEFAULT_LANGUAGE);
  const lang: Language = isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  return { lang, setLang: setStored };
}

function useStoredList(key: string): {
  items: string[];
  toggle: (id: string) => void;
  clear: () => void;
} {
  const [stored, setStored] = useStoredString(key, "[]");
  const items = useMemo(() => parseSlugs(stored), [stored]);

  const toggle = useCallback(
    (id: string) => {
      const next = items.includes(id)
        ? items.filter((item) => item !== id)
        : [...items, id];
      setStored(JSON.stringify(next));
    },
    [items, setStored],
  );

  const clear = useCallback(() => setStored("[]"), [setStored]);

  return { items, toggle, clear };
}

export function useFavorites(): {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
} {
  const { items, toggle } = useStoredList(FAVORITES_KEY);
  return { favorites: items, toggleFavorite: toggle };
}

export function useShoppingChecked(): {
  checked: string[];
  toggleChecked: (id: string) => void;
  clearChecked: () => void;
} {
  const { items, toggle, clear } = useStoredList(CHECKED_KEY);
  return { checked: items, toggleChecked: toggle, clearChecked: clear };
}