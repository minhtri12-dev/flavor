"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { DICTIONARY } from "@/lib/i18n";
import type { Language } from "@/types";

interface HeroProps {
  lang: Language;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function rise(delay: number) {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  };
}

export default function Hero({ lang }: HeroProps) {
  const copy = DICTIONARY[lang].hero;
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

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
      className="relative overflow-hidden bg-[#F7F3EA] pt-28 md:pt-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 md:grid-cols-12 md:px-10 md:pb-24">
        <motion.div style={{ y: textY }} className="md:col-span-7">
          <motion.h1
            {...rise(0.1)}
            className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] tracking-tight"
          >
            {copy.title}
          </motion.h1>

          <motion.p
            {...rise(0.3)}
            className="mt-6 max-w-md text-lg text-[#30251F]/75"
          >
            {copy.body}
          </motion.p>

          <motion.div {...rise(0.45)} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#ingredients"
              className="rounded-full bg-[#D9573B] px-7 py-3.5 text-sm font-medium text-[#F7F3EA] transition-colors hover:bg-[#30251F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9573B]"
            >
              {copy.primary}
            </a>
            <a
              href="#discover"
              className="rounded-full border border-[#30251F] px-7 py-3.5 text-sm font-medium text-[#30251F] transition-colors hover:bg-[#30251F] hover:text-[#F7F3EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9573B]"
            >
              {copy.secondary}
            </a>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: imageY }} className="md:col-span-5">
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#E8DFD1]"
          >
            <Image
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
              alt={copy.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
            <p className="absolute bottom-4 left-4 rounded-full bg-[#F7F3EA] px-5 py-2.5 font-display text-base">
              {copy.caption}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}