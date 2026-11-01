import Link from "next/link";
import Reveal from "@/components/Reveal";
import { DICTIONARY } from "@/lib/i18n";
import type { Language } from "@/types";

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const copy = DICTIONARY[lang].footer;

  const links = [
    { href: "/#ingredients", label: copy.ingredients },
    { href: "/#discover", label: copy.discover },
    { href: "/#cookbook", label: copy.cookbook },
  ];

  return (
    <footer className="overflow-hidden bg-charcoal text-cream">
      <div className="page-container pt-20 md:pt-28">
        <Reveal>
          <div className="grid gap-12 md:grid-cols-12 md:items-end">
            <p className="font-display text-headline italic text-oat md:col-span-7">
              {copy.tagline}
            </p>

            <nav
              aria-label={copy.label}
              className="flex flex-col gap-3 text-lg md:col-span-4 md:col-start-9"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit underline-offset-4 transition-colors hover:text-oat hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-16 flex flex-col gap-2 border-t border-cream/15 pt-6 text-sm text-cream/60 md:flex-row md:justify-between md:gap-10">
            <p>© {new Date().getFullYear()} FLAVOR</p>
            <p className="max-w-xl md:text-right">{copy.note}</p>
          </div>
        </Reveal>

        <p
          aria-hidden
          className="mt-10 select-none font-display text-[clamp(4rem,18vw,14rem)] leading-[0.8] tracking-[0.04em] text-cream/10"
        >
          FLAVOR
        </p>
      </div>
    </footer>
  );
}