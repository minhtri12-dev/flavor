"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ListChecks,
  Mic,
  MicOff,
  Timer,
  Volume2,
  X,
} from "lucide-react";
import { getIngredientName } from "@/data/ingredients";
import { DICTIONARY } from "@/lib/i18n";
import { EASE } from "@/lib/motion";
import { useLanguage } from "@/lib/storage";
import type { Language, Recipe } from "@/types";

interface CookingModeProps {
  recipe: Recipe;
}

interface SpeechResultEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  const scope = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

function pickVoice(
  voices: SpeechSynthesisVoice[],
  language: string,
): SpeechSynthesisVoice | null {
  const prefix = language.slice(0, 2).toLowerCase();
  const candidates = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith(prefix),
  );
  if (candidates.length === 0) return null;

  const score = (voice: SpeechSynthesisVoice): number =>
    (/google/i.test(voice.name) ? 3 : 0) +
    (/natural|online/i.test(voice.name) ? 2 : 0) +
    (voice.lang.toLowerCase() === language.toLowerCase() ? 1 : 0);

  return [...candidates].sort((a, b) => score(b) - score(a))[0];
}

const TIMER_OPTIONS = [1, 5, 10] as const;
const SPEECH_LANG: Record<Language, string> = { en: "en-US", vi: "vi-VN" };
const NEXT_WORDS = ["next", "tiep", "sang buoc"];
const PREVIOUS_WORDS = ["back", "previous", "quay lai", "truoc"];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const slide = {
  enter: (direction: number) => ({ opacity: 0, x: direction >= 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction >= 0 ? -60 : 60 }),
};

const ROUND_BUTTON =
  "grid size-16 place-items-center rounded-full border border-cream/30 transition-colors hover:bg-cream/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";

const PILL_BUTTON =
  "inline-flex items-center gap-2 rounded-full border border-cream/30 px-5 py-2.5 text-sm transition-colors hover:bg-cream/10";

export default function CookingMode({ recipe }: CookingModeProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const copy = DICTIONARY[lang].cook;
  const total = recipe.steps.length;
  const detailHref = `/recipes/${recipe.slug}`;

  const [[step, direction], setPage] = useState<[number, number]>([0, 0]);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [listening, setListening] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  const voiceSupported = useSyncExternalStore(
    () => () => {},
    () => getRecognitionCtor() !== null,
    () => false,
  );

  const remaining =
    endAt === null ? null : Math.max(0, Math.ceil((endAt - now) / 1000));
  const isLast = step === total - 1;
  const text = recipe.steps[step][lang];

  const move = useCallback(
    (delta: number) => {
      setPage(([current]) => {
        const next = Math.min(Math.max(current + delta, 0), total - 1);
        return [next, delta];
      });
      setEndAt(null);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [total],
  );

  const startTimer = (minutes: number) => {
    const current = Date.now();
    setNow(current);
    setEndAt(current + minutes * 60000);
  };

  const readAloud = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const language = SPEECH_LANG[lang];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.95;

    const voice = pickVoice(window.speechSynthesis.getVoices(), language);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (endAt === null) return;
    const id = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= endAt) {
        window.clearInterval(id);
        if ("vibrate" in navigator) navigator.vibrate([250, 120, 250]);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [endAt]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") move(1);
      else if (event.key === "ArrowLeft") move(-1);
      else if (event.key === "Escape") router.push(detailHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, router, detailHref]);

  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        const sentinel = await navigator.wakeLock.request("screen");
        if (cancelled) {
          await sentinel.release();
          return;
        }
        lock = sentinel;
      } catch {
        lock = null;
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void acquire();
    };

    void acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release();
    };
  }, []);

  useEffect(() => {
    if (!listening) return;
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = SPEECH_LANG[lang];
    recognition.continuous = true;
    recognition.interimResults = false;
    let active = true;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result.isFinal) continue;
        const heard = normalize(result[0].transcript);
        if (NEXT_WORDS.some((word) => heard.includes(word))) move(1);
        else if (PREVIOUS_WORDS.some((word) => heard.includes(word))) move(-1);
      }
    };
    recognition.onend = () => {
      if (!active) return;
      try {
        recognition.start();
      } catch {
        active = false;
        setListening(false);
      }
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        active = false;
        setListening(false);
      }
    };

    try {
      recognition.start();
    } catch {
      active = false;
    }

    return () => {
      active = false;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.stop();
    };
  }, [listening, lang, move]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.getVoices();
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-charcoal text-cream">
        <header className="flex items-center gap-4 px-5 py-5 md:px-10">
          <Link
            href={detailHref}
            aria-label={copy.exit}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-cream/30 transition-colors hover:bg-cream/10"
          >
            <X size={18} aria-hidden />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg">
              {recipe.name[lang]}
            </p>
            <div
              role="progressbar"
              aria-label={copy.progress}
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={step + 1}
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/15"
            >
              <motion.div
                className="h-full rounded-full bg-terracotta"
                animate={{ width: `${((step + 1) / total) * 100}%` }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </div>
          </div>

          <button
            type="button"
            aria-pressed={listening}
            disabled={!voiceSupported}
            title={voiceSupported ? copy.voice : copy.voiceUnsupported}
            onClick={() => setListening((value) => !value)}
            className={`${PILL_BUTTON} shrink-0 disabled:cursor-not-allowed disabled:opacity-40 ${
              listening ? "border-terracotta bg-terracotta" : ""
            }`}
          >
            {listening ? (
              <Mic size={16} aria-hidden />
            ) : (
              <MicOff size={16} aria-hidden />
            )}
            <span className="hidden sm:inline">
              {listening ? copy.voiceListening : copy.voice}
            </span>
          </button>
        </header>

        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-5 py-8 md:px-10">
          <p className="text-oat/70">{copy.step(step + 1, total)}</p>

          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.p
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: EASE }}
              aria-live="polite"
              className="mt-4 font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.1]"
            >
              {text}
            </motion.p>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {remaining === null ? (
              <>
                <span className="inline-flex items-center gap-2 text-oat/70">
                  <Timer size={16} aria-hidden />
                  {copy.timer}
                </span>
                {TIMER_OPTIONS.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => startTimer(minutes)}
                    className={PILL_BUTTON}
                  >
                    {copy.minutes(minutes)}
                  </button>
                ))}
              </>
            ) : (
              <div
                role="timer"
                className={`flex items-center gap-4 rounded-full border border-cream/30 py-2 pl-6 pr-2 ${
                  remaining === 0 ? "animate-pulse border-cream" : ""
                }`}
              >
                <span className="font-display text-3xl tabular-nums">
                  {formatClock(remaining)}
                </span>
                {remaining === 0 && (
                  <span className="font-medium text-cream">{copy.timeUp}</span>
                )}
                <button
                  type="button"
                  onClick={() => setEndAt(null)}
                  className={PILL_BUTTON}
                >
                  {copy.cancel}
                </button>
              </div>
            )}

            <button type="button" onClick={readAloud} className={PILL_BUTTON}>
              <Volume2 size={16} aria-hidden />
              {copy.readAloud}
            </button>

            <button
              type="button"
              aria-expanded={showIngredients}
              aria-controls="cook-ingredients"
              onClick={() => setShowIngredients((value) => !value)}
              className={`${PILL_BUTTON} ${
                showIngredients ? "border-cream bg-cream/10" : ""
              }`}
            >
              <ListChecks size={16} aria-hidden />
              {copy.ingredients}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showIngredients && (
              <motion.section
                id="cook-ingredients"
                aria-label={copy.ingredients}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="mt-6 rounded-card border border-cream/20 bg-cream/5 p-5">
                  <p className="text-sm text-oat/60">
                    {copy.servingsNote(recipe.servings)}
                  </p>
                  <ul className="mt-3 grid gap-x-10 sm:grid-cols-2">
                    {recipe.ingredients.map((item) => (
                      <li
                        key={item.ingredientId}
                        className="flex items-baseline justify-between gap-4 border-b border-cream/10 py-2 text-sm"
                      >
                        <span>{getIngredientName(item.ingredientId, lang)}</span>
                        <span className="tabular-nums text-oat/70">
                          {item.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {listening && (
            <p className="mt-4 text-sm text-oat/60">{copy.voiceHint}</p>
          )}
        </main>

        <footer className="flex items-center justify-between px-5 py-6 md:px-10">
          <button
            type="button"
            aria-label={copy.previous}
            disabled={step === 0}
            onClick={() => move(-1)}
            className={ROUND_BUTTON}
          >
            <ArrowLeft aria-hidden />
          </button>

          {isLast ? (
            <Link
              href={detailHref}
              className="inline-flex h-16 items-center gap-2 rounded-full bg-terracotta px-8 text-base font-medium transition-colors hover:bg-cream hover:text-charcoal"
            >
              <Check size={18} aria-hidden />
              {copy.finish}
            </Link>
          ) : (
            <button
              type="button"
              aria-label={copy.next}
              onClick={() => move(1)}
              className="grid size-16 place-items-center rounded-full bg-terracotta transition-colors hover:bg-cream hover:text-charcoal"
            >
              <ArrowRight aria-hidden />
            </button>
          )}
        </footer>
      </div>
    </MotionConfig>
  );
}