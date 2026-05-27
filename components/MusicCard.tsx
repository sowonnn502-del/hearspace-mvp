"use client";

import { motion } from "framer-motion";
import { hearspaceEase } from "@/components/MotionPrimitives";
import { createNeteaseMusicLink } from "@/lib/netease-link";
import type { CuratedMusicTrack } from "@/lib/music-library";

type FlexibleMusicTrack = CuratedMusicTrack & {
  albumCover?: unknown;
  atmosphere?: unknown;
  coverImage?: unknown;
  keywords?: unknown;
  memoryScenes?: unknown;
  mood?: unknown;
  tags?: unknown;
};

type MusicCardProps = {
  song: FlexibleMusicTrack;
  index: number;
  onUseTape?: () => void;
};

export function MusicCard({ song, index, onUseTape }: MusicCardProps) {
  const title = getText(song.title);
  const artist = getText(song.artist);
  const emotions = getLabels(song.emotions, song.tags, song.mood, song.keywords);
  const emotionMood = Array.isArray(song.emotions)
    ? song.emotions?.join(" / ") || ""
    : "";
  const atmosphere = getLabels(song.atmosphere);
  const memoryScenes = getLabels(song.memoryScenes);
  const neteaseKeyword =
    getText(song.neteaseKeyword) ||
    [title, artist].filter(Boolean).join(" ") ||
    emotions.join(" / ");
  const albumCover =
    getText(song.albumCover) || getText(song.coverImage) || getText(song.coverUrl);

  const neteaseLink = createNeteaseMusicLink({
    title,
    artist,
    mood: emotionMood || emotions.join(" / "),
    keywords: atmosphere,
    neteaseKeyword,
  });

  return (
    <motion.article
      className="group relative min-w-0 overflow-hidden rounded-[1.25rem] border border-paper/55 bg-paper/54 text-ink shadow-[0_18px_54px_rgba(17,17,19,0.07)] backdrop-blur-md transition duration-700 hover:-translate-y-0.5 hover:bg-paper/68 hover:shadow-[0_24px_80px_rgba(17,17,19,0.11)]"
      initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.38 }}
      transition={{
        duration: 1.2,
        ease: hearspaceEase,
        delay: index * 0.16,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(246,241,232,0.58),rgba(49,90,102,0.06),rgba(184,92,56,0.08))]" />
      <div className="absolute inset-0 opacity-0 backdrop-blur-sm transition duration-700 group-hover:opacity-100" />

      <div className="relative grid min-w-0 gap-0 sm:grid-cols-[12.5rem_1fr]">
        <div className="relative aspect-[4/3] min-h-0 overflow-hidden bg-ink sm:aspect-auto sm:min-h-[15rem]">
          {albumCover ? (
            <img
              src={albumCover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-[0.88] saturate-[0.86] transition duration-[1800ms] ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,17,19,0.95),rgba(49,90,102,0.72),rgba(184,92,56,0.58))]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,19,0.58),transparent_55%),radial-gradient(circle_at_50%_40%,transparent,rgba(17,17,19,0.42))]" />
          <p className="absolute bottom-4 left-4 font-meta text-[10px] uppercase tracking-[0.24em] text-paper/68">
            {String(index + 1).padStart(2, "0")}
          </p>
        </div>

        <div className="flex min-w-0 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="font-meta text-[10px] uppercase tracking-[0.28em] text-ink/34">
              Music Memory
            </p>
            <p className="font-meta text-[10px] uppercase tracking-[0.2em] text-ink/32">
              {emotions.slice(0, 2).join(" / ")}
            </p>
          </div>

          <h3 className="mt-5 break-words font-sans text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-ink/86 sm:text-4xl">
            {title}
          </h3>
          {artist ? <p className="mt-2 text-base text-ink/52">{artist}</p> : null}
          {song.album ? (
            <p className="mt-1 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/32">
              {song.album}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/34">
            {[...emotions, ...memoryScenes].slice(0, 5).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-ink/8 pt-5 sm:mt-auto sm:flex-row sm:items-end sm:justify-between">
            <button
              type="button"
              onClick={onUseTape}
              className="w-fit font-meta text-[10px] uppercase tracking-[0.2em] text-ink/38 transition duration-500 hover:text-tide"
            >
              Use this tape
            </button>
            <a
              href={neteaseLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/netease inline-flex max-w-full flex-col gap-1 text-left transition duration-500 hover:text-tide sm:text-right"
              aria-label={`在网易云继续聆听 ${neteaseKeyword || title || "这首歌"}`}
            >
              <span className="font-serif text-base leading-6 text-ink/74 transition duration-500 group-hover/netease:text-tide">
                在网易云继续聆听 →
              </span>
              <span className="truncate font-meta text-[9px] uppercase tracking-[0.18em] text-ink/30">
                {neteaseKeyword || neteaseLink.query}
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
