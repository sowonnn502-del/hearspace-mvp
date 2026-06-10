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
  onReplace?: () => void;
};

type LikedTrackRecord = {
  trackId: string;
  title: string;
  artist: string;
  timestamp: string;
};

const LIKED_TRACKS_STORAGE_KEY = "likedTracks";

export function MusicCard({ song, index, reason, onReplace }: MusicCardProps) {
  const title = getText(song.title);
  const artist = getText(song.artist);
  const trackId = getTrackId(song, title, artist);
  const emotions = getLabels(song.emotions, song.tags, song.mood, song.keywords);
  const memoryScenes = getLabels(song.memoryScenes);
  const neteaseKeyword =
    getText(song.neteaseKeyword) ||
    [title, artist].filter(Boolean).join(" ") ||
    emotions.join(" / ");
  const albumCover = getText(song.coverUrl) || MUSIC_COVER_PLACEHOLDER;
  const [imageSrc, setImageSrc] = useState(albumCover);
  const [imageFailed, setImageFailed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const neteaseUrl = getNeteaseUrl(song);
  const displayLabels = Array.from(new Set([...emotions, ...memoryScenes]))
    .filter(Boolean)
    .slice(0, 4);
  const similarSpaces = getLabels(song.similarSpaces).slice(0, 4);

  useEffect(() => {
    setImageSrc(albumCover);
    setImageFailed(false);
  }, [albumCover]);

  useEffect(() => {
    setIsLiked(readLikedTracks().some((track) => track.trackId === trackId));
  }, [trackId]);

  return (
    <motion.article
      className="group relative min-w-0 overflow-hidden border-t border-ink/10 py-6 text-ink transition duration-700 first:border-t-0 sm:py-7"
      initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
      viewport={{ once: true, amount: 0.38 }}
      transition={{
        duration: 1.2,
        ease: hearspaceEase,
        delay: index * 0.5,
      }}
    >
      <div className="relative grid min-w-0 gap-5 md:grid-cols-[12.5rem_1fr] md:gap-7">
        <div
          className="relative aspect-[1/1] min-h-0 overflow-hidden rounded-[28px] bg-paper/70 bg-cover bg-center shadow-[0_18px_48px_rgba(17,17,19,0.08)]"
          style={{ backgroundImage: `url(${MUSIC_COVER_PLACEHOLDER})` }}
        >
          {!imageFailed ? (
            <img
              key={imageSrc}
              src={imageSrc}
              alt=""
              onError={() => {
                if (imageSrc !== MUSIC_COVER_PLACEHOLDER) {
                  setImageSrc(MUSIC_COVER_PLACEHOLDER);
                  return;
                }

                setImageFailed(true);
              }}
              className="absolute inset-0 h-full w-full object-cover opacity-[0.96] saturate-[0.92] transition duration-[1800ms] ease-out group-hover:scale-[1.025]"
            />
          ) : null}
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
            <div className="mt-4 max-w-2xl">
              <p className="font-meta text-[10px] uppercase tracking-[0.22em] text-tide/50">
                为什么推荐给你
              </p>
              <p className="mt-2 break-words text-[15px] leading-[1.72] text-ink/62">
                {reason}
              </p>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/32">
            {displayLabels.map((label, labelIndex) => (
              <span key={`${label}-${labelIndex}`}>{label}</span>
            ))}
          </div>

          {similarSpaces.length ? (
            <div className="mt-5 max-w-2xl border-t border-ink/8 pt-4">
              <p className="font-meta text-[10px] uppercase tracking-[0.22em] text-tide/50">
                也常出现在这些空间记忆里
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {similarSpaces.map((space) => (
                  <span
                    key={space}
                    className="rounded-full bg-ink/[0.04] px-3 py-1.5 font-meta text-[9px] uppercase tracking-[0.16em] text-ink/38"
                  >
                    {space}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-4 md:mt-auto md:items-end">
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row md:self-end">
              <button
                type="button"
                onClick={() => {
                  const nextLikedTracks = upsertLikedTrack({
                    trackId,
                    title,
                    artist,
                    timestamp: new Date().toISOString(),
                  });
                  window.localStorage.setItem(
                    LIKED_TRACKS_STORAGE_KEY,
                    JSON.stringify(nextLikedTracks),
                  );
                  setIsLiked(true);
                }}
                className={`min-h-11 rounded-full border px-5 py-2.5 font-meta text-[11px] uppercase tracking-[0.18em] transition duration-300 ${
                  isLiked
                    ? "border-tide/30 bg-tide/12 text-tide"
                    : "border-ink/12 bg-white/28 text-ink/56 hover:border-ink/24 hover:bg-white/44 hover:text-ink"
                }`}
                aria-pressed={isLiked}
              >
                {isLiked ? "已喜欢" : "喜欢"}
              </button>
              <button
                type="button"
                onClick={onReplace}
                disabled={!onReplace}
                className="min-h-11 rounded-full border border-ink/12 bg-white/28 px-5 py-2.5 font-meta text-[11px] uppercase tracking-[0.18em] text-ink/56 transition duration-300 hover:border-ink/24 hover:bg-white/44 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                换一首
              </button>
            </div>
            {isLiked ? (
              <p className="w-full font-serif text-sm leading-6 text-tide/70 sm:w-auto md:text-right">
                已记录你的偏好
              </p>
            ) : null}
            <a
              href={neteaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/netease inline-flex min-h-12 max-w-full flex-col justify-center gap-1 self-start rounded-full border border-white/45 bg-white/28 px-5 py-3 text-left text-ink/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.64),0_14px_40px_rgba(17,17,19,0.08)] backdrop-blur-2xl transition duration-500 hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/42 hover:text-ink md:self-end md:text-right"
              aria-label={`在网易云继续聆听 ${neteaseKeyword || title || "这首歌"}`}
            >
              <span className="font-serif text-base leading-6 text-ink/82 transition duration-500 group-hover/netease:text-ink">
                在网易云继续聆听 →
              </span>
              <span className="truncate font-meta text-[9px] uppercase tracking-[0.18em] text-ink/40">
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

function getTrackId(song: FlexibleMusicTrack, title: string, artist: string) {
  return (
    getText(song.songId) ||
    getText(song.neteaseSongId) ||
    getText(song.id) ||
    [title, artist].filter(Boolean).join(":").toLowerCase()
  );
}

function readLikedTracks(): LikedTrackRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(LIKED_TRACKS_STORAGE_KEY) || "[]",
    );

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isLikedTrackRecord);
  } catch {
    return [];
  }
}

function upsertLikedTrack(track: LikedTrackRecord) {
  const existing = readLikedTracks();
  const withoutCurrent = existing.filter((item) => item.trackId !== track.trackId);

  return [track, ...withoutCurrent];
}

function isLikedTrackRecord(value: unknown): value is LikedTrackRecord {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;

  return (
    typeof record.trackId === "string" &&
    typeof record.title === "string" &&
    typeof record.artist === "string" &&
    typeof record.timestamp === "string"
  );
}
