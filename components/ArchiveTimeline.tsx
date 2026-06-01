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

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未知日期";

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
