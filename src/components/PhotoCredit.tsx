import type { ImageCredit, Language } from "@/types";

interface PhotoCreditProps {
  credit: ImageCredit;
  lang: Language;
  className?: string;
}

const UNSPLASH_URL = "https://unsplash.com/?utm_source=flavor&utm_medium=referral";

const LABELS: Record<Language, { by: string; on: string }> = {
  en: { by: "Photo by", on: "on" },
  vi: { by: "Ảnh:", on: "trên" },
};

const LINK_CLASS = "underline underline-offset-2 hover:text-terracotta";

export default function PhotoCredit({
  credit,
  lang,
  className = "",
}: PhotoCreditProps) {
  const label = LABELS[lang];

  return (
    <p className={className}>
      {label.by}{" "}
      <a
        href={credit.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        {credit.photographer}
      </a>{" "}
      {label.on}{" "}
      <a
        href={UNSPLASH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        Unsplash
      </a>
    </p>
  );
}