"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FilmGrain,
  MotionText,
  VignetteLayer,
  hearspaceEase,
} from "@/components/MotionPrimitives";
import { mockFeedMoods } from "@/lib/mock-feed";

export function HomeMoodFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMood = mockFeedMoods[activeIndex];

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % mockFeedMoods.length);
  };

  const showPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + mockFeedMoods.length) % mockFeedMoods.length,
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") showNext();
      if (event.key === "ArrowUp") showPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="mx-auto min-h-[calc(100vh-88px)] max-w-7xl pb-12 pt-8 sm:pt-12">
      <div className="grid min-h-[calc(100vh-140px)] items-center gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(360px,0.42fr)] lg:gap-14">
        <div className="relative min-h-[66vh] overflow-hidden bg-ink shadow-[0_34px_110px_rgba(17,17,19,0.28),0_0_100px_rgba(49,90,102,0.12)] sm:min-h-[74vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMood.mood_title}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 26, scale: 1.025, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, scale: 1.015, filter: "blur(8px)" }}
              transition={{ duration: 1.45, ease: hearspaceEase }}
            >
              <div
                className="ken-burns-image absolute inset-0"
                style={{ backgroundImage: activeMood.image }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.2),transparent_38%,rgba(17,17,19,0.18))]" />
              <VignetteLayer />
              <FilmGrain />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:px-12 sm:pb-14 lg:px-16 lg:pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeMood.mood_title}-copy`}
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(7px)" }}
                transition={{ duration: 1.35, ease: hearspaceEase, delay: 0.1 }}
              >
                <p className="font-meta text-[10px] uppercase tracking-[0.34em] text-paper/76 [text-shadow:0_2px_18px_rgba(0,0,0,0.72)] sm:text-xs">
                  {activeMood.time_label}
                </p>
                <h1 className="mt-7 max-w-4xl text-balance font-serif text-[clamp(3rem,7vw,7rem)] font-medium leading-[0.98] tracking-normal text-paper [text-shadow:0_10px_42px_rgba(0,0,0,0.48)]">
                  {activeMood.mood_title}
                </h1>
                <p className="mt-9 max-w-2xl font-serif text-xl leading-[1.85] text-paper/84 [text-shadow:0_2px_20px_rgba(0,0,0,0.66)] sm:text-2xl">
                  {activeMood.writing}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <aside className="relative">
          <MotionText delay={0.35} className="max-w-md">
            <p className="font-meta text-[10px] uppercase tracking-[0.34em] text-tide/66">
              Midnight Space Radio
            </p>
            <p className="mt-5 font-serif text-3xl font-normal leading-[1.35] text-ink sm:text-4xl">
              一屏一段空间记忆，像翻阅人生胶片。
            </p>
          </MotionText>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeMood.mood_title}-tape`}
              className="mt-12 overflow-hidden bg-[linear-gradient(115deg,rgba(17,17,19,0.94),rgba(49,90,102,0.84)_54%,rgba(184,92,56,0.68))] px-5 py-5 text-paper shadow-[0_22px_70px_rgba(17,17,19,0.16)]"
              initial={{ opacity: 0, y: 22, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: 1.18, ease: hearspaceEase, delay: 0.18 }}
            >
              <div className="flex items-start gap-5">
                <div className="mt-1 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-paper/24 bg-ink/28 shadow-inner">
                  <div className="h-7 w-7 rounded-full border border-paper/18 bg-paper/10" />
                </div>
                <div>
                  <p className="font-meta text-[10px] uppercase tracking-[0.28em] text-paper/48">
                    Tape memory
                  </p>
                  <p className="mt-3 text-sm leading-7 text-paper/72">
                    {activeMood.music_memory}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-9 flex flex-wrap gap-x-4 gap-y-3 font-meta text-[10px] uppercase tracking-[0.24em] text-ink/34">
            {activeMood.visual_mood_tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-3">
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-lg text-ink/52 transition hover:border-ink/24 hover:text-ink"
              aria-label="Previous mood"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 text-lg text-ink/52 transition hover:border-ink/24 hover:text-ink"
              aria-label="Next mood"
            >
              ↓
            </button>
            <div className="ml-2 font-meta text-[10px] uppercase tracking-[0.24em] text-ink/34">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(mockFeedMoods.length).padStart(2, "0")}
            </div>
          </div>

          <Link
            href="/capture"
            className="mt-12 inline-flex items-center justify-center bg-ink px-6 py-3 font-meta text-sm text-paper shadow-[0_18px_54px_rgba(17,17,19,0.16)] transition duration-500 hover:bg-tide"
          >
            Capture a Space
          </Link>
        </aside>
      </div>
    </section>
  );
}
