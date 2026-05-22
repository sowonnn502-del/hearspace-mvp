"use client";

import { motion } from "framer-motion";
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
  onSelectAudioTrack?: (track: AtmosphereAudioTrack) => void;
};

type MusicMemoryCardProps = {
  recommendation: MusicMemoryMatch;
  index: number;
  result: MoodResult;
  onSelectAudioTrack?: (track: AtmosphereAudioTrack) => void;
};

export function MoodResultPanel({ result, onSelectAudioTrack }: MoodResultPanelProps) {
  const musicRecommendations = getMusicMemoryRecommendations(result);

  return (
    <div className="relative">
      <MotionText
        delay={0.35}
        duration={1.8}
        y={26}
        blur={7}
        className="mx-auto max-w-4xl text-center"
      >
        <p className="font-meta text-[10px] uppercase tracking-[0.34em] text-tide/62">
          Space Memory
        </p>
        <blockquote className="mt-8 break-words text-balance font-serif text-[clamp(1.9rem,9vw,4.85rem)] font-normal leading-[1.28] tracking-normal text-ink sm:leading-[1.24]">
          {result.writing}
        </blockquote>
      </MotionText>

      <div className="mx-auto mt-16 grid max-w-5xl gap-12 sm:mt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <ScrollReveal delay={0.15}>
          <p className="font-meta text-[10px] uppercase tracking-[0.3em] text-ember/62">
            Voice Over
          </p>
          <p className="mt-6 max-w-2xl break-words font-serif text-xl font-normal leading-[1.75] text-ink/70 sm:text-2xl">
            {result.space_personality}
          </p>
        </ScrollReveal>

        <ScrollReveal
          delay={0.1}
          y={22}
          className="self-end text-sm leading-8 text-ink/38"
        >
          <p className="font-meta text-[10px] uppercase tracking-[0.28em] text-ink/26">
            Scene Trace
          </p>
          <p className="mt-5">
            {result.scene_observation.human_activity ||
              result.scene_observation.primary_scene}
          </p>
          <p className="mt-4">
            {result.scene_observation.camera_style}.{" "}
            {result.scene_observation.atmosphere_evidence.join(" / ")}
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
              Tape liner notes
            </h2>
          </div>
          <div className="mb-3 hidden h-px flex-1 bg-gradient-to-r from-ink/16 to-transparent sm:block" />
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4">
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
      </ScrollReveal>

      <ScrollReveal
        y={18}
        className="mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-x-5 gap-y-3 text-center font-meta text-[10px] uppercase tracking-[0.24em] text-ink/30"
      >
        {result.music_keywords.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
        {result.visual_mood_tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </ScrollReveal>

      {process.env.NODE_ENV === "development" ? (
        <p className="mt-14 text-center font-meta text-[9px] uppercase tracking-[0.24em] text-ink/18">
          Debug: {result.debug_source}
        </p>
      ) : null}
    </div>
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
      className="group relative min-w-0 overflow-hidden bg-[linear-gradient(115deg,rgba(17,17,19,0.94),rgba(39,62,71,0.9)_52%,rgba(135,85,64,0.72))] px-5 py-5 text-paper shadow-[0_22px_70px_rgba(17,17,19,0.16)] sm:px-7 sm:py-7"
      initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.42 }}
      transition={{
        duration: 1.2,
        ease: hearspaceEase,
        delay: index * 0.16,
      }}
    >
      <div className="absolute inset-y-0 left-0 w-2 bg-paper/66" />
      <div className="absolute inset-y-0 right-0 w-2 bg-paper/10" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(246,241,232,0.08)_1px,transparent_1px)] bg-[length:26px_100%] opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,rgba(246,241,232,0.08),transparent_17%)]" />

      <div className="relative grid min-w-0 items-center gap-6 sm:grid-cols-[5rem_1fr]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-paper/26 bg-ink/28 shadow-inner">
          <div className="h-7 w-7 rounded-full border border-paper/18 bg-paper/10" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-meta text-[10px] uppercase tracking-[0.28em] text-paper/48">
              Tape {String(index + 1).padStart(2, "0")}
            </p>
            <p className="font-meta text-[10px] uppercase tracking-[0.22em] text-paper/46">
              {recommendation.mood}
            </p>
          </div>
          <h3 className="mt-3 break-words font-serif text-2xl font-normal leading-tight text-paper">
            {recommendation.title}
          </h3>
          {recommendation.artist ? (
            <p className="mt-1 text-sm text-paper/52">{recommendation.artist}</p>
          ) : null}
          {recommendation.source ? (
            <p className="mt-2 font-meta text-[10px] uppercase tracking-[0.18em] text-paper/38">
              {recommendation.source}
            </p>
          ) : null}
          <p className="mt-4 max-w-3xl break-words text-sm leading-7 text-paper/68">
            {recommendation.reason}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-meta text-[10px] uppercase tracking-[0.18em] text-paper/38">
            {recommendation.scene_tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectAudioTrack?.(matchedTrack)}
              className="border border-paper/14 px-3 py-2 font-meta text-[10px] uppercase tracking-[0.18em] text-paper/58 transition duration-500 hover:border-paper/34 hover:text-paper"
            >
              Listen
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
      className="border border-paper/14 px-3 py-2 font-meta text-[10px] uppercase tracking-[0.18em] text-paper/58 transition duration-500 hover:border-paper/34 hover:text-paper"
    >
      {children}
    </a>
  );
}
