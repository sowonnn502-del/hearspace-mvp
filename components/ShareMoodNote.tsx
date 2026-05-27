"use client";

import { toPng } from "html-to-image";
import { forwardRef, useMemo, useRef, useState } from "react";
import { FilmGrain } from "@/components/MotionPrimitives";
import { matchMusicByMood } from "@/lib/music-library";
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
    () => matchMusicByMood(result).slice(0, 3),
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
          生成一张 9:16 竖版心情便签，适合保存到相册后分享到 Story、朋友圈或小红书。
        </div>
      )}
    </section>
  );
}

type MoodNoteCardProps = {
  result: MoodResult;
  imageUrl: string | null;
  musicRecommendations: ReturnType<typeof matchMusicByMood>;
};

const MoodNoteCard = forwardRef<HTMLDivElement, MoodNoteCardProps>(
  ({ result, imageUrl, musicRecommendations }, ref) => (
    <div
      ref={ref}
      className="relative aspect-[9/16] w-[min(86vw,420px)] shrink-0 overflow-hidden bg-paper text-ink shadow-[0_28px_90px_rgba(17,17,19,0.22)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(184,92,56,0.12),transparent_28%),linear-gradient(180deg,#f6f1e8,#ded7cb_72%,#c6cbc3)]" />
      <FilmGrain className="opacity-[0.14]" />

      <div className="relative grid h-full grid-rows-[58fr_42fr]">
        <div className="relative min-h-0 overflow-hidden bg-ink shadow-[0_18px_52px_rgba(17,17,19,0.22)]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(246,241,232,0.18),rgba(184,92,56,0.34),rgba(49,90,102,0.72))]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,19,0.52),transparent_48%),radial-gradient(circle_at_50%_38%,transparent_0%,rgba(17,17,19,0.12)_48%,rgba(17,17,19,0.58)_100%)]" />
          <FilmGrain className="opacity-[0.18]" />
          <p className="absolute bottom-5 left-5 right-5 font-meta text-[9px] uppercase tracking-[0.24em] text-paper/76">
            {result.time_label}
          </p>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden p-5">
          <div className="min-h-0">
            <p className="font-meta text-[8px] uppercase tracking-[0.28em] text-tide/58">
              Mood Note
            </p>
            <h3 className="mt-2 line-clamp-2 break-words font-serif text-[1.72rem] font-normal leading-[1.04] tracking-normal text-ink">
              {result.mood_title}
            </h3>
            <p className="mt-2 line-clamp-2 break-words font-serif text-[0.86rem] leading-[1.48] text-ink/68">
              {result.writing}
            </p>
          </div>

          <div className="mt-3 min-h-0">
            <p className="font-meta text-[8px] uppercase tracking-[0.28em] text-tide/62">
              Music Memory
            </p>
            <div className="mt-1.5 grid gap-0.5">
              {musicRecommendations.map((recommendation, index) => {
                const song = recommendation.song;

                return (
                  <div
                    key={`${song.title}-${index}`}
                    className="grid min-w-0 grid-cols-[1.5rem_1fr] items-baseline gap-2"
                  >
                    <span className="font-meta text-[8px] text-ink/32">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-sans text-[11px] font-medium leading-4 text-ink/78">
                        {song.title}
                      </p>
                      <p className="truncate font-meta text-[7px] uppercase leading-3 tracking-[0.14em] text-ink/34">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 font-meta text-[7px] uppercase tracking-[0.18em] text-ink/32">
              {result.visual_mood_tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-2">
              <p className="font-serif text-[11px] text-ink/42">来自 HearSpace</p>
              <p className="font-meta text-[8px] uppercase tracking-[0.22em] text-ink/28">
                Spatial Memory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
);

MoodNoteCard.displayName = "MoodNoteCard";
