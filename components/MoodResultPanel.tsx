"use client";

import { motion } from "framer-motion";
import { AtmospherePlayer } from "@/components/AtmospherePlayer";
import { MusicCard } from "@/components/MusicCard";
import {
  MotionText,
  ScrollReveal,
  hearspaceEase,
} from "@/components/MotionPrimitives";
import { matchAtmosphereAudio, type AtmosphereAudioTrack } from "@/lib/audio-library";
import { matchMusicByMood } from "@/lib/music-library";
import type { MoodResult } from "@/lib/mood-schema";

type MoodResultPanelProps = {
  result: MoodResult;
  audioTrack: AtmosphereAudioTrack;
  isMusicMemoryReady?: boolean;
  onSelectAudioTrack?: (track: AtmosphereAudioTrack) => void;
};

export function MoodResultPanel({
  result,
  audioTrack,
  isMusicMemoryReady = true,
  onSelectAudioTrack,
}: MoodResultPanelProps) {
  const musicRecommendations = matchMusicByMood(result);

  return (
    <div className="relative">
      <MotionText
        delay={0.35}
        duration={1.8}
        y={26}
        blur={7}
        className="mx-auto max-w-5xl"
      >
        <blockquote className="break-words text-balance font-serif text-[clamp(1.8rem,7vw,4rem)] font-normal leading-[1.34] tracking-normal text-ink sm:leading-[1.3]">
          {result.writing}
        </blockquote>
      </MotionText>

      <div className="mx-auto mt-14 max-w-3xl sm:mt-20">
        <ScrollReveal delay={0.15}>
          <p className="break-words font-serif text-xl font-normal leading-[1.85] text-ink/58 sm:text-2xl">
            {result.space_personality}
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.16} className="mt-24 sm:mt-36">
        <div className="mx-auto flex max-w-5xl items-end gap-5">
          <div>
            <p className="font-meta text-[10px] uppercase tracking-[0.34em] text-tide/58">
              Now Playing / Music Memory
            </p>
            <h2 className="mt-5 break-words font-serif text-4xl font-normal tracking-normal text-ink sm:text-5xl">
              Atmosphere Tape
            </h2>
          </div>
          <div className="mb-3 hidden h-px flex-1 bg-gradient-to-r from-ink/16 to-transparent sm:block" />
        </div>

        {isMusicMemoryReady ? (
          <motion.div
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.25, ease: hearspaceEase }}
          >
            <div className="mx-auto mt-10 max-w-5xl">
              <AtmospherePlayer track={audioTrack} />
            </div>

            <div className="mx-auto mt-12 max-w-5xl">
              <p className="font-meta text-[10px] uppercase tracking-[0.28em] text-ink/30">
                Related memories
              </p>
            </div>
            <div className="mx-auto mt-5 grid max-w-5xl gap-3">
              {musicRecommendations.map((recommendation, index) => {
                const song = recommendation.song;
                const emotions = getRecommendationLabels(
                  song.emotions,
                  getRecommendationField(song, "tags"),
                  getRecommendationField(song, "mood"),
                  getRecommendationField(song, "keywords"),
                );
                const atmosphere = getRecommendationLabels(
                  getRecommendationField(song, "atmosphere"),
                  recommendation.matchedSignals,
                );

                return (
                  <MusicCard
                    key={`${song.neteaseKeyword || song.title || "song"}-${index}`}
                    song={{
                      ...song,
                      atmosphere,
                      memoryScenes: recommendation.matchedSignals,
                    }}
                    index={index}
                    onUseTape={() =>
                      onSelectAudioTrack?.(
                        matchAtmosphereAudio(result, {
                          title: song.title || "",
                          artist: song.artist || "",
                          mood: emotions.join(" / "),
                          reason: recommendation.reason || atmosphere.join(" / "),
                        }),
                      )
                    }
                  />
                );
              })}
            </div>
          </motion.div>
        ) : (
          <MusicMemoryLoading />
        )}
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

function MusicMemoryLoading() {
  return (
    <motion.div
      className="mx-auto mt-10 max-w-5xl overflow-hidden bg-ink/[0.055] px-5 py-7 shadow-[0_18px_54px_rgba(17,17,19,0.08)] sm:px-7 sm:py-8"
      initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, ease: hearspaceEase }}
      aria-live="polite"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink/[0.07] shadow-inner">
          <motion.div
            className="h-8 w-8 rounded-full border border-ink/14 bg-paper/50"
            animate={{ opacity: [0.34, 0.9, 0.34], scale: [0.96, 1.08, 0.96] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="min-w-0">
          <p className="font-meta text-[10px] uppercase tracking-[0.28em] text-ink/32">
            Finding your atmosphere tape...
          </p>
          <p className="mt-4 break-words font-sans text-2xl font-semibold leading-[1.2] tracking-[-0.035em] text-ink/76">
            正在为这段空间寻找合适的声音…
          </p>
          <p className="mt-3 text-sm leading-7 text-ink/48">
            你的专属空间声轨即将抵达。
          </p>
        </div>
      </div>
    </motion.div>
  );
}
