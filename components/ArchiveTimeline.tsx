"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  deleteArchiveItem,
  readArchiveItems,
  type SpaceMemoryArchiveItem,
} from "@/lib/space-memory-archive";

export function ArchiveTimeline() {
  const [items, setItems] = useState<SpaceMemoryArchiveItem[]>([]);

  useEffect(() => {
    setItems(readArchiveItems());
  }, []);

  const groups = useMemo(() => groupItemsByDate(items), [items]);
  const reviews = useMemo(() => createArchiveReviews(items), [items]);

  function handleDelete(id: string) {
    if (!window.confirm("确定删除这段空间记忆吗？")) return;
    setItems(deleteArchiveItem(id));
  }

  return (
    <section className="mx-auto max-w-6xl pb-24 pt-14 sm:pb-32 sm:pt-20">
      <div className="max-w-3xl">
        <p className="font-meta text-[11px] uppercase tracking-[0.28em] text-ink/42">
          SPACE MEMORY ARCHIVE
        </p>
        <h1 className="mt-7 break-words font-serif text-[clamp(3rem,12vw,6.4rem)] font-normal leading-[0.96] tracking-normal text-ink">
          我的空间记忆
        </h1>
        <p className="mt-6 max-w-xl font-serif text-lg leading-8 text-ink/56 sm:text-xl">
          那些被音乐保存下来的时刻。
        </p>
      </div>

      {items.length ? (
        <div className="mt-12 sm:mt-16">
          <ArchiveReviewStrip reviews={reviews} />
        </div>
      ) : null}

      {items.length ? (
        <div className="mt-14 space-y-14 sm:mt-20 sm:space-y-20">
          {groups.map((group) => (
            <section key={group.dateLabel}>
              <p className="sticky top-4 z-10 inline-flex rounded-full border border-white/60 bg-paper/70 px-4 py-2 font-meta text-[10px] uppercase tracking-[0.24em] text-ink/38 shadow-[0_12px_42px_rgba(17,17,19,0.08)] backdrop-blur-xl">
                {group.dateLabel}
              </p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[28px] bg-white/36 shadow-[0_22px_70px_rgba(17,17,19,0.08)] ring-1 ring-ink/[0.06] backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(17,17,19,0.12)]"
                  >
                    <Link href={`/archive/${item.id}`} className="block">
                      <MemoryImage item={item} className="aspect-[4/5]" />
                      <div className="px-5 pb-5 pt-5">
                        <p className="font-meta text-[10px] uppercase tracking-[0.22em] text-ink/34">
                          {formatTime(item.createdAt)}
                        </p>
                        <h2 className="mt-3 break-words font-serif text-3xl leading-tight text-ink">
                          {item.moodTitle}
                        </h2>
                        <p className="mt-3 line-clamp-3 break-words text-sm leading-7 text-ink/58">
                          {item.memoryText}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {item.songs.slice(0, 3).map((song) => (
                            <span
                              key={song.trackId}
                              className="rounded-full bg-ink/[0.04] px-3 py-1.5 font-meta text-[9px] uppercase tracking-[0.16em] text-ink/42"
                            >
                              {song.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                    <div className="px-5 pb-5">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-full border border-ink/10 px-4 py-2 font-meta text-[10px] uppercase tracking-[0.18em] text-ink/42 transition hover:border-ink/22 hover:text-ink"
                      >
                        删除
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-16 flex min-h-[42vh] flex-col items-start justify-center rounded-[28px] border border-ink/[0.06] bg-white/28 px-6 py-12 shadow-[0_22px_70px_rgba(17,17,19,0.06)] sm:px-10">
          <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
            还没有保存任何空间记忆。
          </p>
          <Link
            href="/capture"
            className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 font-meta text-sm text-paper transition duration-500 hover:-translate-y-0.5 hover:bg-tide"
          >
            创建第一段记忆
          </Link>
        </div>
      )}
    </section>
  );
}

function ArchiveReviewStrip({ reviews }: { reviews: ArchiveReview[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="min-w-0 rounded-[8px] border border-ink/[0.06] bg-white/30 p-5 shadow-[0_18px_64px_rgba(17,17,19,0.06)] backdrop-blur-xl sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-meta text-[10px] uppercase tracking-[0.24em] text-tide/52">
                {review.label}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-normal leading-tight text-ink">
                {review.count ? `${review.count} 段记忆` : "还在等待"}
              </h2>
            </div>
            <span className="shrink-0 rounded-full bg-ink/[0.04] px-3 py-1.5 font-meta text-[10px] uppercase tracking-[0.16em] text-ink/36">
              {review.rangeLabel}
            </span>
          </div>
          <p className="mt-5 min-h-[56px] break-words font-serif text-lg leading-7 text-ink/58">
            {review.summary}
          </p>
          {review.topSignals.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ReviewStatGroup label="空间" values={review.topSpaces} />
              <ReviewStatGroup label="情绪" values={review.topEmotions} />
              <ReviewStatGroup label="歌曲" values={review.topSongs} />
              <ReviewStatGroup label="视觉" values={review.topVisuals} />
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function ReviewStatGroup({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  if (!values.length) return null;

  return (
    <div className="min-w-0">
      <p className="font-meta text-[9px] uppercase tracking-[0.18em] text-ink/28">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={`${label}-${value}`}
            className="rounded-full bg-paper/60 px-3 py-1.5 font-meta text-[9px] uppercase tracking-[0.16em] text-ink/38"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MemoryImage({
  item,
  className = "",
}: {
  item: SpaceMemoryArchiveItem;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[linear-gradient(135deg,rgba(246,241,232,0.82),rgba(184,92,56,0.36),rgba(49,90,102,0.72))] ${className}`}
    >
      {item.image ? (
        <img
          src={item.image}
          alt={item.moodTitle}
          className="h-full w-full object-cover transition duration-[1600ms] group-hover:scale-[1.025]"
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,19,0.48),transparent_48%)]" />
    </div>
  );
}

function groupItemsByDate(items: SpaceMemoryArchiveItem[]) {
  const groups = new Map<string, SpaceMemoryArchiveItem[]>();

  for (const item of items) {
    const dateLabel = formatDate(item.createdAt);
    groups.set(dateLabel, [...(groups.get(dateLabel) ?? []), item]);
  }

  return Array.from(groups.entries()).map(([dateLabel, groupItems]) => ({
    dateLabel,
    items: groupItems,
  }));
}

function formatDate(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未知日期";

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

type ArchiveReview = {
  id: string;
  label: string;
  rangeLabel: string;
  count: number;
  summary: string;
  topSignals: string[];
  topSpaces: string[];
  topEmotions: string[];
  topSongs: string[];
  topVisuals: string[];
};

function createArchiveReviews(items: SpaceMemoryArchiveItem[]): ArchiveReview[] {
  const now = new Date();
  const weekStart = getStartOfWeek(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return [
    createArchiveReview({
      id: "week",
      label: "本周回顾",
      rangeLabel: `${formatDate(weekStart)} 起`,
      items: filterSince(items, weekStart),
      emptySummary: "这一周还没有新的空间记忆。等下一束光、下一段路，慢慢来。",
    }),
    createArchiveReview({
      id: "month",
      label: "本月回顾",
      rangeLabel: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}`,
      items: filterSince(items, monthStart),
      emptySummary: "这个月的记忆还在形成。先把最近被你留意到的空间收进来。",
    }),
  ];
}

function createArchiveReview({
  id,
  label,
  rangeLabel,
  items,
  emptySummary,
}: {
  id: string;
  label: string;
  rangeLabel: string;
  items: SpaceMemoryArchiveItem[];
  emptySummary: string;
}): ArchiveReview {
  const topSignals = getTopSignals(items);
  const stats = getArchiveStats(items);
  const latest = items[0];
  const leadingSignal = topSignals[0] ?? latest?.moodTitle;
  const secondarySignal = topSignals[1];
  const summary = items.length
    ? secondarySignal
      ? `最近的空间反复出现${leadingSignal}和${secondarySignal}。这些记忆像一条很轻的线，把不同时间里的你串在一起。`
      : `最近的空间都在靠近${leadingSignal}。它们不急着说明什么，只是把你停下来的瞬间保存住。`
    : emptySummary;

  return {
    id,
    label,
    rangeLabel,
    count: items.length,
    summary,
    topSignals,
    ...stats,
  };
}

function filterSince(items: SpaceMemoryArchiveItem[], start: Date) {
  const startTime = start.getTime();

  return items.filter((item) => Date.parse(item.createdAt) >= startTime);
}

function getStartOfWeek(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);

  return start;
}

function getTopSignals(items: SpaceMemoryArchiveItem[]) {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const tone of item.visualTone.slice(0, 6)) {
      counts.set(tone, (counts.get(tone) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .slice(0, 5)
    .map(([signal]) => signal);
}

function getArchiveStats(items: SpaceMemoryArchiveItem[]) {
  return {
    topSpaces: topValues(items.flatMap((item) => item.spaceTags ?? item.visualTone)),
    topEmotions: topValues(items.flatMap((item) => item.emotionTags ?? item.visualTone)),
    topSongs: topValues(items.flatMap((item) => item.songs.map((song) => song.title))),
    topVisuals: topValues(items.flatMap((item) => item.visualTags ?? item.visualTone)),
  };
}

function topValues(values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    const cleaned = value.trim();
    if (!cleaned) continue;
    counts.set(cleaned, (counts.get(cleaned) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
    .slice(0, 3)
    .map(([value]) => value);
}
