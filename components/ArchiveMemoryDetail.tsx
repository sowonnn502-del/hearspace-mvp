"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AtmospherePlayer } from "@/components/AtmospherePlayer";
import { MemoryImage } from "@/components/ArchiveTimeline";
import { matchAtmosphereAudio } from "@/lib/audio-library";
import type { MoodResult } from "@/lib/mood-schema";
import {
  deleteArchiveItem,
  findArchiveItem,
  type SpaceMemoryArchiveItem,
} from "@/lib/space-memory-archive";

type ArchiveMemoryDetailProps = {
  id: string;
};

export function ArchiveMemoryDetail({ id }: ArchiveMemoryDetailProps) {
  const router = useRouter();
  const [item, setItem] = useState<SpaceMemoryArchiveItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItem(findArchiveItem(id));
    setIsLoaded(true);
  }, [id]);

  if (!isLoaded) {
    return (
      <section className="mx-auto min-h-[calc(100vh-88px)] max-w-5xl py-16">
        <p className="font-serif text-xl text-ink/50">正在打开这段记忆…</p>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl flex-col justify-center py-20">
        <p className="font-serif text-3xl text-ink">没有找到这段空间记忆。</p>
        <Link
          href="/archive"
          className="mt-8 inline-flex w-fit rounded-full bg-ink px-6 py-3 font-meta text-sm text-paper transition hover:bg-tide"
        >
          回到我的空间记忆
        </Link>
      </section>
    );
  }

  const atmosphereTrack = matchAtmosphereAudio(toMoodResult(item), {
    title: item.songs[0]?.title,
    artist: item.songs[0]?.artist,
    reason: item.songs[0]?.reason,
    keywords: item.visualTone,
  });

  return (
    <article className="mx-auto max-w-6xl pb-24 pt-8 sm:pb-32 sm:pt-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/archive"
          className="font-meta text-[11px] uppercase tracking-[0.22em] text-ink/42 transition hover:text-ink"
        >
          ← 我的空间记忆
        </Link>
        <button
          type="button"
          onClick={() => {
            if (!window.confirm("确定删除这段空间记忆吗？")) return;
            deleteArchiveItem(item.id);
            router.push("/archive");
          }}
          className="rounded-full border border-ink/10 px-4 py-2 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/42 transition hover:border-ink/22 hover:text-ink"
        >
          删除
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-[32px] shadow-[0_30px_100px_rgba(17,17,19,0.12)] ring-1 ring-ink/[0.06]">
        <MemoryImage item={item} className="aspect-[4/5] sm:aspect-[16/9]" />
      </div>

      <div className="mx-auto mt-10 max-w-4xl sm:mt-14">
        <p className="font-meta text-[10px] uppercase tracking-[0.28em] text-ink/36">
          {formatDateTime(item.createdAt)}
        </p>
        <h1 className="mt-5 break-words font-serif text-[clamp(3rem,13vw,7rem)] font-normal leading-[0.96] text-ink">
          {item.moodTitle}
        </h1>
        {item.moodSubtitle ? (
          <p className="mt-5 break-words font-serif text-xl leading-8 text-ink/58 sm:text-2xl sm:leading-9">
            {item.moodSubtitle}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-2">
          {item.visualTone.map((tone) => (
            <span
              key={tone}
              className="rounded-full bg-ink/[0.04] px-3 py-1.5 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/40"
            >
              {tone}
            </span>
          ))}
        </div>

        <p className="mt-12 break-words font-serif text-2xl leading-[1.5] text-ink sm:text-4xl sm:leading-[1.35]">
          {item.memoryText}
        </p>

        <div className="mt-14">
          <AtmospherePlayer track={atmosphereTrack} />
        </div>

        <section className="mt-16">
          <p className="font-meta text-[10px] uppercase tracking-[0.3em] text-tide/58">
            Music Recommendations
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-ink sm:text-5xl">
            这段记忆里的歌
          </h2>
          <div className="mt-8 grid gap-4">
            {item.songs.map((song, index) => (
              <div
                key={`${song.trackId}-${index}`}
                className="grid gap-4 rounded-[24px] bg-white/34 p-4 shadow-[0_16px_54px_rgba(17,17,19,0.06)] ring-1 ring-ink/[0.05] sm:grid-cols-[6rem_1fr] sm:p-5"
              >
                <div className="aspect-square overflow-hidden rounded-[18px] bg-paper/80">
                  {song.coverUrl ? (
                    <img
                      src={song.coverUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="font-meta text-[10px] uppercase tracking-[0.22em] text-ink/32">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 break-words font-sans text-2xl font-semibold tracking-[-0.03em] text-ink/86">
                    {song.title}
                  </h3>
                  {song.artist ? (
                    <p className="mt-1 text-sm leading-6 text-ink/52">{song.artist}</p>
                  ) : null}
                  <p className="mt-3 break-words text-sm leading-7 text-ink/58">
                    {song.reason}
                  </p>
                  {song.songUrl ? (
                    <a
                      href={song.songUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex font-meta text-[10px] uppercase tracking-[0.2em] text-tide/70 transition hover:text-tide"
                    >
                      在网易云继续聆听 →
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

function toMoodResult(item: SpaceMemoryArchiveItem): MoodResult {
  return {
    scene_observation: {
      primary_scene: item.visualTone.join(" "),
      visible_objects: item.visualTone,
      human_activity: item.memoryText,
      lighting: item.moodSubtitle,
      color_tone: item.visualTone.join(" "),
      camera_style: "saved memory",
      atmosphere_evidence: item.visualTone,
    },
    mood_title: item.moodTitle,
    mood_subtitle: item.moodSubtitle,
    time_label: "",
    space_memory_text: item.memoryText,
    writing: item.memoryText,
    space_personality: item.moodSubtitle,
    visual_tone: item.visualTone,
    music_query: item.visualTone.join(" "),
    music_keywords: item.visualTone,
    music_memories: [],
    music_recommendations: [],
    share_card_text: item.memoryText,
    visual_mood_tags: item.visualTone,
    debug_source: "mock_no_key",
  };
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} / ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
