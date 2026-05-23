"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AtmospherePlayer } from "@/components/AtmospherePlayer";
import {
  FilmGrain,
  MotionText,
  VignetteLayer,
  hearspaceEase,
} from "@/components/MotionPrimitives";
import { getAtmosphereAudioById } from "@/lib/audio-library";
import { mockFeedMoods } from "@/lib/mock-feed";

export function HomeMoodFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const activeMood = mockFeedMoods[activeIndex];
  const activeAudioTrack = getAtmosphereAudioById(activeMood.audio_id);

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
    <section
      className="mx-auto min-h-[calc(100vh-88px)] max-w-7xl overflow-hidden pb-10 pt-8 sm:pb-14 sm:pt-12"
      onTouchStart={(event) => {
        touchStartY.current = event.touches[0]?.clientY ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartY.current === null) return;
        const endY = event.changedTouches[0]?.clientY ?? touchStartY.current;
        const deltaY = touchStartY.current - endY;
        if (Math.abs(deltaY) > 42) {
          if (deltaY > 0) showNext();
          else showPrevious();
        }
        touchStartY.current = null;
      }}
    >
      <div className="grid min-h-[calc(100vh-138px)] items-center gap-9 lg:grid-cols-[minmax(0,58fr)_minmax(360px,42fr)] lg:gap-16">
        <motion.div
          className="relative h-[min(62vh,680px)] min-h-[480px] overflow-hidden bg-ink shadow-[0_34px_110px_rgba(17,17,19,0.28),0_0_120px_rgba(49,90,102,0.12)] sm:h-[min(70vh,780px)] lg:h-[min(72vh,860px)]"
          whileHover={{ y: -4 }}
          transition={{ duration: 1.2, ease: hearspaceEase }}
        >
          <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(circle_at_42%_42%,rgba(246,241,232,0.12),transparent_30%),radial-gradient(circle_at_68%_72%,rgba(49,90,102,0.25),transparent_46%)] blur-3xl" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMood.mood_title}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 28, scale: 1.018, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, scale: 1.012, filter: "blur(8px)" }}
              transition={{ duration: 1.55, ease: hearspaceEase }}
            >
              <motion.img
                src={activeMood.image}
                alt={activeMood.mood_title}
                className="ken-burns-image absolute inset-0 h-full w-full object-cover opacity-95"
                style={{ objectPosition: activeMood.image_position ?? "center" }}
                whileHover={{ scale: 1.04, opacity: 1 }}
                transition={{ duration: 2.2, ease: hearspaceEase }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.16),transparent_44%,rgba(17,17,19,0.18))]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.58),transparent_42%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(246,241,232,0.12),transparent_34%)] mix-blend-screen" />
              <VignetteLayer />
              <FilmGrain className="opacity-[0.28]" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 sm:px-12 sm:pb-12 lg:px-14 lg:pb-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeMood.mood_title}-copy`}
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(7px)" }}
                transition={{ duration: 1.35, ease: hearspaceEase, delay: 0.1 }}
              >
                <p className="font-meta text-[11px] uppercase tracking-[0.28em] text-paper/58 [text-shadow:0_2px_18px_rgba(0,0,0,0.72)]">
                  {activeMood.time_label}
                </p>
                <h1 className="mt-5 max-w-3xl break-words text-balance font-sans text-[clamp(42px,14vw,72px)] font-semibold leading-[0.94] tracking-[-0.04em] text-paper [text-shadow:0_10px_42px_rgba(0,0,0,0.5)] sm:mt-6 lg:text-[clamp(56px,7vw,96px)]">
                  {activeMood.mood_title}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <aside className="relative min-w-0 py-2 lg:py-8">
          <MotionText delay={0.35} className="max-w-[520px]">
            <p className="font-meta text-[11px] uppercase tracking-[0.28em] text-ink/58">
              SPACE MEMORY RADIO
            </p>
            <p className="mt-7 break-words font-sans text-[clamp(28px,9vw,40px)] font-semibold leading-[1.12] tracking-[-0.035em] text-ink lg:text-[clamp(32px,3.2vw,44px)]">
              把这一瞬间，
              <br />
              留在记忆里
            </p>
            <p className="mt-7 font-meta text-[18px] font-normal leading-[1.5] tracking-[-0.02em] text-ink/[0.72]">
              Turn atmosphere into memory.
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${activeMood.mood_title}-writing`}
                className="mt-10 max-w-[520px] break-words font-sans text-[18px] font-normal leading-[1.75] tracking-[-0.02em] text-[rgba(20,20,20,0.68)]"
                initial={{ opacity: 0, y: 16, filter: "blur(7px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(7px)" }}
                transition={{ duration: 1.25, ease: hearspaceEase }}
              >
                {activeMood.writing}
              </motion.p>
            </AnimatePresence>
            <p className="mt-8 font-meta text-[11px] uppercase tracking-[0.28em] text-ink/34">
              {activeMood.source}
            </p>
          </MotionText>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeMood.mood_title}-tape`}
              className="mt-10 sm:mt-12"
              initial={{ opacity: 0, y: 22, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: 1.18, ease: hearspaceEase, delay: 0.18 }}
            >
              <AtmospherePlayer
                track={activeAudioTrack}
                compact
                className="max-w-[520px]"
              />
              <p className="mt-4 max-w-[520px] break-words font-sans text-sm leading-7 tracking-[-0.01em] text-ink/48">
                {activeMood.music_memory}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-9 flex flex-wrap gap-x-4 gap-y-3 font-meta text-[11px] uppercase tracking-[0.22em] text-ink/34">
            {activeMood.visual_mood_tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3 sm:mt-12">
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/[0.04] text-lg text-ink/52 transition hover:bg-ink/[0.08] hover:text-ink"
              aria-label="Previous mood"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/[0.04] text-lg text-ink/52 transition hover:bg-ink/[0.08] hover:text-ink"
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
            className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 font-meta text-sm text-paper shadow-[0_18px_54px_rgba(17,17,19,0.14)] transition duration-500 hover:bg-tide sm:mt-12 sm:w-auto"
          >
            Capture a Space
          </Link>
        </aside>
      </div>
    </section>
  );
}
