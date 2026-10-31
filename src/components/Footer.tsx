import Link from "next/link";
import { DICTIONARY } from "@/lib/i18n";
import type { Language } from "@/types";

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const copy = DICTIONARY[lang].footer;

  return (
    <footer className="bg-[#30251F] px-5 py-14 text-[#F7F3EA] md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-end">
        <div>
          <p className="font-display text-4xl tracking-[0.18em]">FLAVOR</p>
          <p className="mt-2 text-[#E8DFD1]/70">{copy.tagline}</p>
        </div>

        <nav aria-label={copy.label} className="flex gap-8 text-sm">
          <Link href="/#ingredients" className="hover:text-[#D9573B]">
            {copy.ingredients}
          </Link>
          <Link href="/#discover" className="hover:text-[#D9573B]">
            {copy.discover}
          </Link>
          <Link href="/#cookbook" className="hover:text-[#D9573B]">
            {copy.cookbook}
          </Link>
        </nav>

        <p className="max-w-sm text-sm text-[#E8DFD1]/60">
          © {new Date().getFullYear()} FLAVOR. {copy.note}
        </p>
      </div>
    </footer>
  );
}