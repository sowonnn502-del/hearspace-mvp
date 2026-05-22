"use client";

import { toPng } from "html-to-image";
import { forwardRef, useMemo, useRef, useState } from "react";
import { FilmGrain } from "@/components/MotionPrimitives";
import { getMusicMemoryRecommendations } from "@/lib/music-matcher";
import type { MoodResult } from "@/lib/mood-schema";

type ShareMoodNoteProps = {
  result: MoodResult;
  imageUrl: string | null;
};

export function ShareMoodNote({ result, imageUrl }: ShareMoodNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const musicRecommendations = useMemo(
    () => getMusicMemoryRecommendations(result).slice(0, 3),
    [result],
  );

  async function downloadImage() {
    if (isExporting) return;

    setIsPreviewOpen(true);
    setIsExporting(true);

    try {
      if (!noteRef.current) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      }

      if (!noteRef.current) return;

      const dataUrl = await toPng(noteRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#f6f1e8",
      });
      const link = document.createElement("a");
      link.download = "hearspace-mood-note.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="mx-auto mt-24 max-w-5xl sm:mt-32">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-meta text-[10px] uppercase tracking-[0.34em] text-tide/58">
            Share Mood Note
          </p>
          <h2 className="mt-4 font-serif text-4xl font-normal tracking-normal text-ink sm:text-5xl">
            情绪便签
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewOpen((current) => !current)}
            className="bg-ink px-5 py-3 font-meta text-sm text-paper transition duration-500 hover:bg-tide"
          >
            Preview Mood Note
          </button>
          <button
            type="button"
            onClick={downloadImage}
            disabled={isExporting}
            className="border border-ink/16 px-5 py-3 font-meta text-sm text-ink/70 transition duration-500 hover:border-ink/34 hover:text-ink disabled:cursor-wait disabled:opacity-50"
          >
            {isExporting ? "Rendering..." : "Download Image"}
          </button>
        </div>
      </div>

      {isPreviewOpen ? (
        <div className="mt-10 flex justify-center overflow-x-auto pb-4">
          <MoodNoteCard
            ref={noteRef}
            result={result}
            imageUrl={imageUrl}
            musicRecommendations={musicRecommendations}
          />
        </div>
      ) : (
        <div className="mt-8 border-t border-ink/8 pt-5 font-meta text-sm leading-7 text-ink/42">
          生成一张 3:4 竖版心情便签，适合保存到相册后分享到小红书、朋友圈或 Instagram Story。
        </div>
      )}
    </section>
  );
}

type MoodNoteCardProps = {
  result: MoodResult;
  imageUrl: string | null;
  musicRecommendations: ReturnType<typeof getMusicMemoryRecommendations>;
};

const MoodNoteCard = forwardRef<HTMLDivElement, MoodNoteCardProps>(
  ({ result, imageUrl, musicRecommendations }, ref) => (
    <div
      ref={ref}
      className="relative aspect-[3/4] w-[min(86vw,420px)] shrink-0 overflow-hidden bg-paper text-ink shadow-[0_28px_90px_rgba(17,17,19,0.22)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(184,92,56,0.12),transparent_28%),linear-gradient(145deg,#f6f1e8,#d8d1c5_72%,#c6cbc3)]" />
      <FilmGrain className="opacity-[0.14]" />

      <div className="relative flex h-full flex-col p-7">
        <div className="relative h-[42%] overflow-hidden bg-ink shadow-[0_18px_52px_rgba(17,17,19,0.22)]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(246,241,232,0.18),rgba(184,92,56,0.34),rgba(49,90,102,0.72))]" />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0%,rgba(17,17,19,0.14)_48%,rgba(17,17,19,0.68)_100%)]" />
          <FilmGrain className="opacity-[0.18]" />
          <p className="absolute bottom-4 left-4 right-4 font-meta text-[9px] uppercase tracking-[0.24em] text-paper/76">
            {result.time_label}
          </p>
        </div>

        <div className="mt-7">
          <h3 className="break-words font-serif text-[2.25rem] font-medium leading-[1.02] text-ink">
            {result.mood_title}
          </h3>
          <p className="mt-5 break-words font-serif text-[1.05rem] leading-[1.7] text-ink/70">
            {result.writing}
          </p>
        </div>

        <div className="mt-auto pt-6">
          <p className="font-meta text-[9px] uppercase tracking-[0.28em] text-tide/62">
            Music Memory
          </p>
          <div className="mt-3 space-y-2">
            {musicRecommendations.map((recommendation, index) => (
              <div key={`${recommendation.title}-${index}`} className="flex gap-3">
                <span className="font-meta text-[10px] text-ink/32">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-serif text-sm text-ink/78">
                    {recommendation.title}
                  </p>
                  <p className="truncate font-meta text-[9px] uppercase tracking-[0.16em] text-ink/34">
                    {recommendation.mood}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-meta text-[8px] uppercase tracking-[0.2em] text-ink/32">
            {result.visual_mood_tags.slice(0, 4).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
            <p className="font-serif text-xs text-ink/42">来自 HearSpace</p>
            <p className="font-meta text-[8px] uppercase tracking-[0.22em] text-ink/28">
              Spatial Memory
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
);

MoodNoteCard.displayName = "MoodNoteCard";
