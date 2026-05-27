"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { hearspaceEase } from "@/components/MotionPrimitives";
import {
  getNeteaseUrl,
  MUSIC_COVER_PLACEHOLDER,
  type CuratedMusicTrack,
} from "@/lib/music-library";

type FlexibleMusicTrack = CuratedMusicTrack & {
  atmosphere?: unknown;
  keywords?: unknown;
  memoryScenes?: unknown;
  mood?: unknown;
  tags?: unknown;
};

type MusicCardProps = {
  song: FlexibleMusicTrack;
  index: number;
  reason?: string;
};

export function MusicCard({ song, index, reason }: MusicCardProps) {
  const title = getText(song.title);
  const artist = getText(song.artist);
  const emotions = getLabels(song.emotions, song.tags, song.mood, song.keywords);
  const memoryScenes = getLabels(song.memoryScenes);
  const neteaseKeyword =
    getText(song.neteaseKeyword) ||
    [title, artist].filter(Boolean).join(" ") ||
    emotions.join(" / ");
  const albumCover = getText(song.coverUrl) || MUSIC_COVER_PLACEHOLDER;
  const [imageSrc, setImageSrc] = useState(albumCover);
  const neteaseUrl = getNeteaseUrl(song);
  const displayLabels = Array.from(new Set([...emotions, ...memoryScenes]))
    .filter(Boolean)
    .slice(0, 4);

  useEffect(() => {
    setImageSrc(albumCover);
  }, [albumCover]);

  return (
    <motion.article
      className="group relative min-w-0 overflow-hidden border-t border-ink/10 py-6 text-ink transition duration-700 first:border-t-0 sm:py-7"
      initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.38 }}
      transition={{
        duration: 1.2,
        ease: hearspaceEase,
        delay: index * 0.16,
      }}
    >
      <div className="relative grid min-w-0 gap-5 md:grid-cols-[12.5rem_1fr] md:gap-7">
        <div className="relative aspect-[1/1] min-h-0 overflow-hidden rounded-[28px] bg-paper/70 shadow-[0_18px_48px_rgba(17,17,19,0.08)]">
          <img
            src={imageSrc}
            alt=""
            onError={() => setImageSrc(MUSIC_COVER_PLACEHOLDER)}
            className="absolute inset-0 h-full w-full object-cover opacity-[0.96] saturate-[0.92] transition duration-[1800ms] ease-out group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,19,0.38),transparent_48%)]" />
          <p className="absolute bottom-4 left-4 font-meta text-[10px] uppercase tracking-[0.24em] text-paper/78">
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>

        <div className="flex min-w-0 flex-col md:py-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="font-meta text-[10px] uppercase tracking-[0.28em] text-ink/34">
              Music Memory
            </p>
            <p className="font-meta text-[10px] uppercase tracking-[0.2em] text-ink/30">
              {emotions.slice(0, 2).join(" / ")}
            </p>
          </div>

          <h3 className="mt-4 break-words font-sans text-2xl font-semibold leading-[1.08] tracking-[-0.035em] text-ink/88 sm:text-3xl md:mt-5">
            {title}
          </h3>
          {artist ? <p className="mt-2 text-base leading-7 text-ink/56">{artist}</p> : null}
          {reason ? (
            <p className="mt-4 max-w-2xl break-words text-[15px] leading-[1.72] text-ink/62">
              {reason}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/32">
            {displayLabels.map((label, labelIndex) => (
              <span key={`${label}-${labelIndex}`}>{label}</span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:mt-auto sm:flex-row sm:items-end sm:justify-start">
            <a
              href={neteaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/netease inline-flex min-h-12 max-w-full flex-col justify-center gap-1 rounded-full bg-ink px-5 py-3 text-left text-paper transition duration-500 hover:bg-tide"
              aria-label={`在网易云继续聆听 ${neteaseKeyword || title || "这首歌"}`}
            >
              <span className="font-serif text-base leading-6 text-paper transition duration-500">
                在网易云继续聆听 →
              </span>
              <span className="truncate font-meta text-[9px] uppercase tracking-[0.18em] text-paper/48">
                {neteaseKeyword}
              </span>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function getLabels(...values: unknown[]) {
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

function getText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
