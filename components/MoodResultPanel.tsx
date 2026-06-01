"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MusicCard } from "@/components/MusicCard";
import {
  MotionText,
  ScrollReveal,
  hearspaceEase,
} from "@/components/MotionPrimitives";
import type { MusicMemoryRecommendation } from "@/lib/music-library";
import type { MoodResult } from "@/lib/mood-schema";

type MoodResultPanelProps = {
  result: MoodResult;
  musicRecommendations: MusicMemoryRecommendation[];
  isMusicLoading?: boolean;
  onReplaceTrack?: (index: number) => void;
};

export function MoodResultPanel({
  result,
  musicRecommendations,
  isMusicLoading = false,
  onReplaceTrack,
}: MoodResultPanelProps) {
  return (
    <div className="relative">
      <MotionText
        delay={0.35}
        duration={1.8}
        y={26}
        blur={7}
        className="max-w-4xl"
      >
        <blockquote className="break-words font-serif text-[clamp(1.7rem,7vw,3.4rem)] font-normal leading-[1.36] tracking-normal text-ink sm:leading-[1.28]">
          {result.space_memory_text || result.writing}
        </blockquote>
      </MotionText>

      <div className="mt-10 max-w-2xl sm:mt-14">
        <ScrollReveal delay={0.15}>
          <p className="break-words font-serif text-lg font-normal leading-[1.72] text-ink/58 sm:text-xl">
            {result.space_personality || result.mood_subtitle}
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.16} className="mt-20 sm:mt-28">
        <div className="flex max-w-5xl items-end gap-5">
          <div>
            <p className="font-meta text-[10px] uppercase tracking-[0.34em] text-tide/58">
              Music Memory / NetEase
            </p>
            <h2 className="mt-4 break-words font-serif text-3xl font-normal leading-tight tracking-normal text-ink sm:text-5xl">
              空间电台推荐带
            </h2>
          </div>
          <div className="mb-3 hidden h-px flex-1 bg-gradient-to-r from-ink/16 to-transparent sm:block" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.25, ease: hearspaceEase }}
        >
          <div className="mt-6 max-w-5xl">
            <p className="max-w-2xl break-words font-serif text-base leading-8 text-ink/52 sm:text-lg">
              根据画面里的真实线索，为这段空间挑出三首可以继续听下去的中文音乐记忆。
            </p>
            {isMusicLoading ? (
              <p className="mt-4 font-meta text-[10px] uppercase tracking-[0.24em] text-ink/28">
                音乐记忆正在靠近…
              </p>
            ) : null}
          </div>
          <div className="mt-6 grid max-w-5xl gap-6 sm:gap-7">
            <AnimatePresence initial={false} mode="sync">
              {musicRecommendations.slice(0, 3).map((recommendation, index) => {
                const song = recommendation.song;
                const atmosphere = getRecommendationLabels(
                  getRecommendationField(song, "atmosphere"),
                  recommendation.matchedSignals,
                );

                return (
                  <MusicCard
                    key={`${getRecommendationIdentity(recommendation)}-${index}`}
                    song={{
                      ...song,
                      atmosphere,
                      memoryScenes: recommendation.matchedSignals,
                    }}
                    index={index}
                    reason={recommendation.reason}
                    onReplace={onReplaceTrack ? () => onReplaceTrack(index) : undefined}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </ScrollReveal>

      {process.env.NODE_ENV === "development" ? (
        <p className="mt-14 text-center font-meta text-[9px] uppercase tracking-[0.24em] text-ink/18">
          Debug: {result.debug_source}
        </p>
      ) : null}
    </div>
  );
}

function getRecommendationLabels(...values: unknown[]) {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      return [value.trim()];
    }
  }

  return [];
}

function getRecommendationField(value: unknown, key: string) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)[key]
    : undefined;
}

function getRecommendationIdentity(recommendation: MusicMemoryRecommendation) {
  const song = recommendation.song;
  return [
    song.songId || song.neteaseSongId || song.id,
    song.title.toLowerCase().replace(/\s+/g, ""),
    song.artist.toLowerCase().replace(/\s+/g, ""),
  ]
    .filter(Boolean)
    .join(":");
}
