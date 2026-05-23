"use client";

import { motion } from "framer-motion";
import { AtmospherePlayer } from "@/components/AtmospherePlayer";
import {
  MotionText,
  ScrollReveal,
  hearspaceEase,
} from "@/components/MotionPrimitives";
import { matchAtmosphereAudio, type AtmosphereAudioTrack } from "@/lib/audio-library";
import {
  getMusicMemoryRecommendations,
  type MusicMemoryMatch,
} from "@/lib/music-matcher";
import { createMusicSearchLinks } from "@/lib/music-search";
import type { MoodResult } from "@/lib/mood-schema";

type MoodResultPanelProps = {
  result: MoodResult;
  audioTrack: AtmosphereAudioTrack;
  isMusicMemoryReady?: boolean;
  onSelectAudioTrack?: (track: AtmosphereAudioTrack) => void;
};

type MusicMemoryCardProps = {
  recommendation: MusicMemoryMatch;
  index: number;
  result: MoodResult;
  onSelectAudioTrack?: (track: AtmosphereAudioTrack) => void;
};

export function MoodResultPanel({
  result,
  audioTrack,
  isMusicMemoryReady = true,
  onSelectAudioTrack,
}: MoodResultPanelProps) {
  const musicRecommendations = getMusicMemoryRecommendations(result);

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
              {musicRecommendations.map((recommendation, index) => (
                <MusicMemoryCard
                  key={`${recommendation.title}-${index}`}
                  recommendation={recommendation}
                  index={index}
                  result={result}
                  onSelectAudioTrack={onSelectAudioTrack}
                />
              ))}
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

export function MusicMemoryCard({
  recommendation,
  index,
  result,
  onSelectAudioTrack,
}: MusicMemoryCardProps) {
  const matchedTrack = matchAtmosphereAudio(result, recommendation);
  const searchLinks = createMusicSearchLinks({
    title: recommendation.title,
    artist: recommendation.artist,
    source: recommendation.source,
    mood: recommendation.mood,
    keywords: recommendation.keywords,
  });

  return (
    <motion.article
      className="group relative min-w-0 overflow-hidden bg-ink/[0.055] px-5 py-5 text-ink shadow-[0_16px_48px_rgba(17,17,19,0.06)] sm:px-6 sm:py-6"
      initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.42 }}
      transition={{
        duration: 1.2,
        ease: hearspaceEase,
        delay: index * 0.16,
      }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-ink/16" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,19,0.035)_1px,transparent_1px)] bg-[length:26px_100%] opacity-50" />

      <div className="relative grid min-w-0 items-center gap-6 sm:grid-cols-[5rem_1fr]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/[0.07] shadow-inner">
          <div className="h-7 w-7 rounded-full border border-ink/12 bg-paper/40" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-meta text-[10px] uppercase tracking-[0.28em] text-ink/36">
              Memory {String(index + 1).padStart(2, "0")}
            </p>
            <p className="font-meta text-[10px] uppercase tracking-[0.22em] text-ink/34">
              {recommendation.mood}
            </p>
          </div>
          <h3 className="mt-3 break-words font-sans text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink/82">
            {recommendation.title}
          </h3>
          {recommendation.artist ? (
            <p className="mt-1 text-sm text-ink/48">{recommendation.artist}</p>
          ) : null}
          {recommendation.source ? (
            <p className="mt-2 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/34">
              {recommendation.source}
            </p>
          ) : null}
          <p className="mt-4 max-w-3xl break-words text-sm leading-7 text-ink/58">
            {recommendation.reason}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/32">
            {recommendation.scene_tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectAudioTrack?.(matchedTrack)}
              className="rounded-full bg-ink px-3 py-2 font-meta text-[10px] uppercase tracking-[0.18em] text-paper transition duration-500 hover:bg-tide"
            >
              Use tape
            </button>
            <MusicSearchLink href={searchLinks.youtubeUrl}>YouTube</MusicSearchLink>
            <MusicSearchLink href={searchLinks.neteaseUrl}>网易云</MusicSearchLink>
            <MusicSearchLink href={searchLinks.spotifyUrl}>Spotify</MusicSearchLink>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MusicSearchLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full bg-ink/[0.06] px-3 py-2 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/48 transition duration-500 hover:bg-ink/[0.1] hover:text-ink"
    >
      {children}
    </a>
  );
}
