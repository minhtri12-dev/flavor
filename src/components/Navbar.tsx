"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { DICTIONARY, LANGUAGES } from "@/lib/i18n";
import { DURATION, EASE, SPRING, fadeUp, stagger } from "@/lib/motion";
import type { Language } from "@/types";

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  favoritesCount: number;
}

interface LanguageSwitchProps {
  lang: Language;
  label: string;
  onChange: (lang: Language) => void;
}

function LanguageSwitch({ lang, label, onChange }: LanguageSwitchProps) {
  const id = useId();

  return (
    <div
      role="group"
      aria-label={label}
      className="flex rounded-full border border-charcoal/20 p-1"
    >
      {LANGUAGES.map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            onClick={() => onChange(code)}
            className="relative rounded-full px-3 py-1.5 text-xs font-medium"
          >
            {active && (
              <motion.span
                layoutId={`lang-pill-${id}`}
                transition={SPRING}
                className="absolute inset-0 rounded-full bg-charcoal"
              />
            )}
            <span
              className={`relative transition-colors ${
                active ? "text-cream" : "text-charcoal"
              }`}
            >
              {code.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const LINK_UNDERLINE =
  "relative text-sm after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-terracotta after:transition-transform after:duration-300 hover:after:scale-x-100";

export default function Navbar({
  lang,
  onLanguageChange,
  favoritesCount,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dictionary = DICTIONARY[lang];
  const copy = dictionary.nav;
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "/#discover", label: copy.discover, badge: false },
    { href: "/#cookbook", label: copy.cookbook, badge: true },
    { href: "/#shopping", label: dictionary.shopping.title, badge: false },
  ];

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,box-shadow] duration-300 ${
        solid
          ? "bg-cream shadow-[0_1px_0_rgb(37_39_32/0.12)]"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label={copy.main}
        className={`page-container flex items-center justify-between transition-[padding] duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          href="/#top"
          className="font-display text-2xl tracking-[0.18em]"
        >
          FLAVOR
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={LINK_UNDERLINE}>
              {link.label}
              {link.badge && favoritesCount > 0 && (
                <span className="ml-2 rounded-full bg-terracotta px-2 py-0.5 text-xs text-cream">
                  {favoritesCount}
                </span>
              )}
            </Link>
          ))}
          <LanguageSwitch
            lang={lang}
            label={copy.language}
            onChange={onLanguageChange}
          />
          <Link href="/#ingredients" className="btn btn-primary">
            {copy.pick}
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitch
            lang={lang}
            label={copy.language}
            onChange={onLanguageChange}
          />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-charcoal/20"
            aria-label={open ? copy.closeMenu : copy.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE }}
            className="overflow-hidden lg:hidden"
          >
            <motion.ul
              variants={stagger(0.06)}
              initial="hidden"
              animate="show"
              className="page-container flex flex-col pb-6"
            >
              {links.map((link) => (
                <motion.li key={link.href} variants={fadeUp}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-charcoal/10 py-4 font-display text-title"
                  >
                    {link.label}
                    {link.badge && favoritesCount > 0 && (
                      <span className="rounded-full bg-terracotta px-2.5 py-0.5 font-sans text-sm text-cream">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={fadeUp} className="pt-5">
                <Link
                  href="/#ingredients"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary btn-lg w-full"
                >
                  {copy.pick}
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}