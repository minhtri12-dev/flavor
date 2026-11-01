"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { DICTIONARY } from "@/lib/i18n";
import { EASE, fadeUp, stagger } from "@/lib/motion";
import type { Language } from "@/types";

interface HeroProps {
  lang: Language;
}

function splitTitle(title: string): { lead: string; accent: string } {
  const index = title.lastIndexOf(" ");
  if (index === -1) return { lead: "", accent: title };
  return { lead: title.slice(0, index + 1), accent: title.slice(index + 1) };
}

export default function Hero({ lang }: HeroProps) {
  const dictionary = DICTIONARY[lang];
  const copy = dictionary.hero;
  const { lead, accent } = splitTitle(copy.title);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [imageReady, setImageReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 90],
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -45],
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream pt-28 md:pt-36"
    >
      <div className="page-container grid items-start gap-12 pb-20 md:grid-cols-12 md:gap-8 md:pb-28">
        <motion.div style={{ y: textY }} className="md:col-span-7 md:pt-6">
          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={fadeUp} className="eyebrow">
              {dictionary.footer.tagline}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-6 font-display text-display tracking-tight"
            >
              {lead}
              <em className="italic text-terracotta">{accent}</em>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-md text-lead text-muted"
            >
              {copy.body}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
              <a href="#ingredients" className="btn btn-primary btn-lg">
                {copy.primary}
              </a>
              <a href="#discover" className="btn btn-secondary btn-lg">
                {copy.secondary}
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: imageY }} className="md:col-span-5 md:mt-16">
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            className="media-frame aspect-[4/5]"
          >
            {!imageReady && <div className="media-skeleton" />}
            <Image
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
              alt={copy.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              onLoad={() => setImageReady(true)}
              onError={() => setImageReady(true)}
              className={`object-cover transition-opacity duration-700 ${
                imageReady ? "opacity-100" : "opacity-0"
              }`}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1 }}
            className="relative -mt-6 ml-4 inline-block rounded-full bg-cream px-5 py-2.5 font-display text-base shadow-lift md:-ml-8"
          >
            {copy.caption}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}