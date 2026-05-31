"use client";

import { toPng } from "html-to-image";
import { forwardRef, useEffect, useRef, useState } from "react";
import { FilmGrain } from "@/components/MotionPrimitives";
import type { MusicMemoryRecommendation } from "@/lib/music-library";
import type { MoodResult } from "@/lib/mood-schema";

type ShareMoodNoteProps = {
  result: MoodResult;
  imageUrl: string | null;
  musicRecommendations: MusicMemoryRecommendation[];
};

export function ShareMoodNote({
  result,
  imageUrl,
  musicRecommendations,
}: ShareMoodNoteProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  async function downloadImage() {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const node = exportRef.current;
      if (!node) return;

      await waitForExportAssets(node);

      const dataUrl = await toPng(node, {
        cacheBust: true,
        backgroundColor: "#f6f1e8",
        canvasWidth: EXPORT_WIDTH,
        canvasHeight: EXPORT_HEIGHT,
        pixelRatio: 2,
        style: {
          width: `${EXPORT_WIDTH}px`,
          height: `${EXPORT_HEIGHT}px`,
          transform: "none",
        },
      });
      const link = document.createElement("a");
      link.download = "hearspace-mood-note.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="mt-24 max-w-5xl sm:mt-32">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="font-meta text-[10px] uppercase tracking-[0.34em] text-tide/58">
            分享情绪便签
          </p>
          <h2 className="mt-4 font-serif text-3xl font-normal leading-tight tracking-normal text-ink sm:text-5xl">
            情绪便签
          </h2>
          <p className="mt-4 text-base leading-7 text-ink/48">
            把这段空间记忆保存成一张适合手机分享的竖版卡片。
          </p>
        </div>
        <div className="flex flex-wrap gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => setIsPreviewOpen((current) => !current)}
            className="min-h-12 rounded-full bg-ink px-5 py-3 font-meta text-sm text-paper transition duration-500 hover:bg-tide"
          >
            预览便签
          </button>
          <button
            type="button"
            onClick={downloadImage}
            disabled={isExporting}
            className="min-h-12 rounded-full border border-ink/16 px-5 py-3 font-meta text-sm text-ink/70 transition duration-500 hover:border-ink/34 hover:text-ink disabled:cursor-wait disabled:opacity-50"
          >
            {isExporting ? "正在生成..." : "下载图片"}
          </button>
        </div>
      </div>

      {isPreviewOpen ? (
        <div className="mt-10 flex justify-center overflow-x-auto pb-4">
          <PreviewMoodNoteCard
            result={result}
            imageUrl={imageUrl}
            musicRecommendations={musicRecommendations}
          />
        </div>
      ) : (
        <div className="mt-8 border-t border-ink/8 pt-5 text-sm leading-7 text-ink/46">
          生成一张 9:16 竖版心情便签，适合保存到相册后分享到 Story、朋友圈或小红书。
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 h-[960px] w-[540px] -translate-x-[120vw] overflow-hidden"
      >
        <MoodNoteCard
          ref={exportRef}
          result={result}
          imageUrl={imageUrl}
          musicRecommendations={musicRecommendations}
          mode="export"
        />
      </div>
    </section>
  );
}

const EXPORT_WIDTH = 540;
const EXPORT_HEIGHT = 960;

type MoodNoteCardProps = {
  result: MoodResult;
  imageUrl: string | null;
  musicRecommendations: MusicMemoryRecommendation[];
  mode?: "preview" | "export";
};

function PreviewMoodNoteCard(props: MoodNoteCardProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(420 / EXPORT_WIDTH);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      setScale(frame.getBoundingClientRect().width / EXPORT_WIDTH);
    };
    const resizeObserver = new ResizeObserver(updateScale);

    updateScale();
    resizeObserver.observe(frame);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="relative aspect-[9/16] w-[min(86vw,420px)] shrink-0 overflow-hidden shadow-[0_28px_90px_rgba(17,17,19,0.18)]"
    >
      <div
        className="absolute left-0 top-0 h-[960px] w-[540px]"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <MoodNoteCard {...props} mode="export" />
      </div>
    </div>
  );
}

const MoodNoteCard = forwardRef<HTMLDivElement, MoodNoteCardProps>(
  ({ result, imageUrl, musicRecommendations, mode = "preview" }, ref) => {
    const isExport = mode === "export";

    return (
    <div
      ref={ref}
      className={[
        "relative shrink-0 overflow-hidden bg-paper text-ink",
        isExport
          ? "h-[960px] w-[540px]"
          : "aspect-[9/16] w-[min(86vw,420px)] shadow-[0_28px_90px_rgba(17,17,19,0.18)]",
      ].join(" ")}
      style={isExport ? { width: EXPORT_WIDTH, height: EXPORT_HEIGHT } : undefined}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f6f1e8,#ded7cb_72%,#c6cbc3)]" />
      <FilmGrain className="opacity-[0.14]" />

      <div className="relative grid h-full grid-rows-[56fr_44fr]">
        <div className="relative m-[4.2%] mb-0 min-h-0 overflow-hidden rounded-[6.5%] bg-[linear-gradient(135deg,#ece4d7,#b8a99a_44%,#6d766f)] shadow-[0_18px_52px_rgba(17,17,19,0.18)]">
          <ExportSafeMoodImage imageUrl={imageUrl} />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,19,0.52),transparent_48%),radial-gradient(circle_at_50%_38%,transparent_0%,rgba(17,17,19,0.12)_48%,rgba(17,17,19,0.58)_100%)]" />
          <FilmGrain className="opacity-[0.18]" />
          <p className="absolute bottom-[5.5%] left-[5.5%] right-[5.5%] break-words font-meta text-[11px] uppercase leading-[1.35] tracking-[0.24em] text-paper/76">
            {result.time_label}
          </p>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden px-[6.2%] pb-[6.2%] pt-[5%]">
          <div className="min-h-0">
            <p className="font-meta text-[10px] uppercase leading-none tracking-[0.28em] text-tide/58">
              情绪便签
            </p>
            <h3 className="mt-[3.2%] line-clamp-2 break-words font-serif text-[38px] font-normal leading-[1.06] tracking-normal text-ink">
              {result.mood_title}
            </h3>
            <p className="mt-[3.2%] line-clamp-3 break-words font-serif text-[18px] leading-[1.58] text-ink/68">
              {result.share_card_text || result.space_memory_text || result.writing}
            </p>
          </div>

          <div className="mt-[5%] min-h-0">
            <p className="font-meta text-[10px] uppercase leading-none tracking-[0.28em] text-tide/62">
              音乐记忆
            </p>
            <div className="mt-[3%] grid gap-[7px]">
              {musicRecommendations.slice(0, 3).map((recommendation, index) => {
                const song = recommendation.song;

                return (
                  <div
                    key={`${song.title}-${index}`}
                    className="grid min-w-0 grid-cols-[34px_1fr] items-baseline gap-[10px]"
                  >
                    <span className="font-meta text-[10px] leading-[18px] text-ink/32">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-sans text-[14px] font-medium leading-[18px] text-ink/78">
                        {song.title}
                      </p>
                      <p className="truncate font-meta text-[9px] uppercase leading-[14px] tracking-[0.14em] text-ink/34">
                        {song.artist}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-[3%] flex max-h-[42px] flex-wrap overflow-hidden gap-x-[12px] gap-y-[6px] font-meta text-[9px] uppercase leading-[12px] tracking-[0.18em] text-ink/32">
              {(result.visual_tone.length > 0 ? result.visual_tone : result.visual_mood_tags)
                .slice(0, 3)
                .map((tag, tagIndex) => (
                <span key={`${tag}-${tagIndex}`}>{tag}</span>
              ))}
            </div>

            <div className="mt-[4%] flex items-center justify-between gap-4 border-t border-ink/10 pt-[4%]">
              <p className="shrink-0 font-serif text-[14px] leading-none text-ink/42">来自 HearSpace</p>
              <p className="truncate font-meta text-[10px] uppercase leading-none tracking-[0.22em] text-ink/28">
                空间记忆
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  },
);

MoodNoteCard.displayName = "MoodNoteCard";

function ExportSafeMoodImage({ imageUrl }: { imageUrl: string | null }) {
  const [hasImageError, setHasImageError] = useState(false);
  const safeImageUrl = imageUrl && !hasImageError ? imageUrl : null;

  return (
    <>
      {safeImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${safeImageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(246,241,232,0.34),rgba(184,92,56,0.28),rgba(49,90,102,0.64))]" />
      )}
      {safeImageUrl ? (
        <img
          src={safeImageUrl}
          alt=""
          onError={() => setHasImageError(true)}
          className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
        />
      ) : null}
    </>
  );
}

async function waitForExportAssets(node: HTMLElement) {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  if ("fonts" in document) {
    await document.fonts.ready;
  }

  await Promise.all(
    Array.from(node.querySelectorAll("img")).map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();
      return image.decode().catch(() => {
        image.dispatchEvent(new Event("error"));
      });
    }),
  );
}
