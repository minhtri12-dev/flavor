"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { DICTIONARY, LANGUAGES } from "@/lib/i18n";
import type { Language } from "@/types";

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  favoritesCount: number;
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9573B]";

interface LanguageSwitchProps {
  lang: Language;
  label: string;
  onChange: (lang: Language) => void;
}

function LanguageSwitch({ lang, label, onChange }: LanguageSwitchProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex rounded-full border border-[#30251F]/20 p-1"
    >
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          onClick={() => onChange(code)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#D9573B] ${
            lang === code
              ? "bg-[#30251F] text-[#F7F3EA]"
              : "hover:bg-[#30251F]/10"
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default function Navbar({
  lang,
  onLanguageChange,
  favoritesCount,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const copy = DICTIONARY[lang].nav;
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  const links = [
    { href: "/#discover", label: copy.discover, badge: false },
    { href: "/#cookbook", label: copy.cookbook, badge: true },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? "bg-[#F7F3EA] shadow-[0_1px_0_rgba(48,37,31,0.12)]"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label={copy.main}
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[padding] duration-300 md:px-10 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          href="/#top"
          className={`font-display text-2xl tracking-[0.18em] ${FOCUS}`}
        >
          FLAVOR
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-[#D9573B] ${FOCUS}`}
            >
              {link.label}
              {link.badge && favoritesCount > 0 && (
                <span className="ml-1.5 rounded-full bg-[#D9573B] px-2 py-0.5 text-xs text-[#F7F3EA]">
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
          <Link
            href="/#ingredients"
            className="rounded-full bg-[#D9573B] px-6 py-3 text-sm font-medium text-[#F7F3EA] transition-colors hover:bg-[#30251F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9573B]"
          >
            {copy.pick}
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitch
            lang={lang}
            label={copy.language}
            onChange={onLanguageChange}
          />
          <button
            type="button"
            className={`rounded-full p-2 ${FOCUS}`}
            aria-label={open ? copy.closeMenu : copy.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-5 mb-4 flex flex-col gap-5 rounded-2xl border border-[#30251F]/15 bg-[#F7F3EA] p-6 md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl"
              >
                {link.label}
                {link.badge && favoritesCount > 0 && (
                  <span className="ml-2 rounded-full bg-[#D9573B] px-2.5 py-0.5 text-sm text-[#F7F3EA]">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/#ingredients"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#D9573B] px-6 py-3 text-center text-sm font-medium text-[#F7F3EA]"
            >
              {copy.pick}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}