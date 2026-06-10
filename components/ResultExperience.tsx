"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FilmFrame, MotionText, ScrollReveal } from "@/components/MotionPrimitives";
import { MoodResultPanel } from "@/components/MoodResultPanel";
import { mockMoodResult } from "@/lib/mockMood";
import {
  getMusicRecommendationPool,
  type MusicMemoryRecommendation,
} from "@/lib/music-library";
import { isMoodResult, type MoodResult } from "@/lib/mood-schema";
import {
  createArchiveItem,
  saveArchiveItem,
} from "@/lib/space-memory-archive";
import {
  ResultProgressProvider,
  type ResultProgressStage,
} from "@/components/ResultProgressContext";

const ShareMoodNote = dynamic(
  () => import("@/components/ShareMoodNote").then((module) => module.ShareMoodNote),
  {
    ssr: false,
    loading: () => (
      <div className="mt-24 max-w-5xl border-t border-ink/8 pt-8 font-serif text-xl leading-8 text-ink/46 sm:mt-32">
        正在整理这段记忆...
      </div>
    ),
  },
);

export function ResultExperience() {
  const [stage, setStage] = useState<ResultProgressStage>("IMAGE_READY");
  const [result, setResult] = useState<Partial<MoodResult> | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const [musicRecommendations, setMusicRecommendations] = useState<
    MusicMemoryRecommendation[]
  >([]);
  const [musicPool, setMusicPool] = useState<MusicMemoryRecommendation[]>([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [userNote, setUserNote] = useState("");
  const [generationError, setGenerationError] = useState("");

  useEffect(() => {
    const storedResult = sessionStorage.getItem("hearspace:mood-result");
    const storedImage = sessionStorage.getItem("hearspace:mood-image");
    const storedUserNote = sessionStorage.getItem("hearspace:user-note");
    const urlTaskId = new URLSearchParams(window.location.search).get("id");
    const storedTaskId = sessionStorage.getItem("hearspace:generation-task-id");
    const taskId = urlTaskId || storedTaskId;
    let isCancelled = false;

    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        if (isMoodResult(parsed)) {
          setResult(parsed);
          setStage("SHARE_READY");
        }
      } catch {
        setResult(null);
      }
    }

    if (storedImage) setImageUrl(storedImage);
    if (storedUserNote) setUserNote(storedUserNote);

    if (taskId && !storedResult) {
      sessionStorage.setItem("hearspace:generation-task-id", taskId);
      pollGenerationTask(taskId);
    } else if (!storedImage && !storedResult) {
      setResult(mockMoodResult);
      setStage("SHARE_READY");
    }

    return () => {
      isCancelled = true;
    };

    async function pollGenerationTask(taskId: string) {
      setIsMusicLoading(true);

      while (!isCancelled) {
        try {
          const response = await fetch(`/api/generate/${encodeURIComponent(taskId)}`, {
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error("空间记忆任务暂时无法读取。");
          }

          const snapshot = (await response.json()) as {
            stage?: ResultProgressStage;
            partialResult?: Partial<MoodResult>;
            musicRecommendations?: MusicMemoryRecommendation[];
            error?: string;
          };

          if (snapshot.stage) setStage(snapshot.stage);
          if (snapshot.partialResult) {
            setResult((current) => ({
              ...(current ?? {}),
              ...snapshot.partialResult,
            }));
            if (isMoodResult(snapshot.partialResult)) {
              sessionStorage.setItem(
                "hearspace:mood-result",
                JSON.stringify(snapshot.partialResult),
              );
              setMusicPool(getMusicRecommendationPool(snapshot.partialResult));
            }
          }
          if (snapshot.musicRecommendations?.length) {
            setMusicRecommendations(snapshot.musicRecommendations.slice(0, 3));
            setIsMusicLoading(false);
          } else if (snapshot.stage === "MUSIC_READY" || snapshot.stage === "SHARE_READY") {
            setIsMusicLoading(false);
          }
          if (snapshot.error) {
            setGenerationError(snapshot.error);
            setIsMusicLoading(false);
            break;
          }
          if (snapshot.stage === "SHARE_READY") {
            sessionStorage.removeItem("hearspace:mood-pending");
            break;
          }
        } catch (error) {
          setGenerationError(
            error instanceof Error
              ? error.message
              : "空间记忆任务暂时无法读取。",
          );
          setIsMusicLoading(false);
          break;
        }

        await sleep(900);
      }
    }
  }, []);

  return (
    <ResultProgressProvider stage={stage}>
    <section className="mx-auto max-w-7xl overflow-hidden pb-24 pt-6 sm:pb-32 sm:pt-12">
      <FilmFrame
        src={imageUrl}
        alt="Uploaded atmosphere"
        className="mx-auto aspect-[4/5] max-h-[740px] min-h-[500px] max-w-6xl sm:aspect-[16/8] sm:min-h-[500px] lg:aspect-[16/7] lg:min-h-[560px]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.44)_42%,rgba(0,0,0,0.12)_70%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] h-[44%] bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.32)_58%,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-7 sm:px-10 sm:pb-11 lg:px-16">
          <MotionText
            delay={0.78}
            duration={1.45}
            y={14}
            blur={4}
            className="font-meta text-[8px] uppercase tracking-[0.32em] !text-white/72 [text-shadow:0_2px_18px_rgba(0,0,0,0.92)] sm:text-[9px]"
          >
            {result?.time_label || "正在聆听这个空间..."}
          </MotionText>
          {isStageAtLeast(stage, "TITLE_READY") && result ? (
            <MotionText
              delay={0.16}
              duration={2}
              y={20}
              blur={7}
              className="mt-3 max-w-4xl break-words text-balance font-serif text-[clamp(2rem,9.5vw,4rem)] font-medium leading-[1.02] tracking-normal !text-white [text-shadow:0_12px_42px_rgba(0,0,0,0.86)] sm:mt-4 sm:text-[clamp(3rem,5.6vw,5.2rem)]"
            >
              {result.mood_title}
            </MotionText>
          ) : (
            <MotionText
              delay={0.22}
              duration={1.6}
              y={18}
              blur={6}
              className="mt-3 max-w-4xl break-words text-balance font-serif text-[clamp(2rem,9.5vw,4rem)] font-medium leading-[1.02] tracking-normal !text-white/86 [text-shadow:0_12px_42px_rgba(0,0,0,0.86)] sm:mt-4 sm:text-[clamp(3rem,5.6vw,5.2rem)]"
            >
              正在感受光线与停顿...
            </MotionText>
          )}
          {isStageAtLeast(stage, "TITLE_READY") && result?.mood_subtitle ? (
            <MotionText
              delay={0.38}
              duration={1.8}
              y={16}
              blur={6}
              className="mt-3 max-w-xl break-words font-serif text-sm leading-6 tracking-normal !text-white [text-shadow:0_8px_28px_rgba(0,0,0,0.9)] sm:mt-4 sm:text-lg sm:leading-7"
            >
              <span className="!text-white">{result.mood_subtitle}</span>
            </MotionText>
          ) : null}
        </div>
      </FilmFrame>

      <div className="mx-auto mt-16 max-w-6xl px-5 sm:mt-28 sm:px-8 lg:mt-32">
        {generationError ? (
          <div className="mx-auto max-w-3xl border-l border-ember/34 pl-5 font-serif text-lg leading-8 text-ember/80">
            {generationError}
          </div>
        ) : null}

        {isStageAtLeast(stage, "MEMORY_READY") && isMoodResult(result) ? (
          <ScrollReveal delay={0.08} y={34} duration={1.8} amount={0.14}>
          <MoodResultPanel
            result={result}
            musicRecommendations={musicRecommendations}
            isMusicLoading={isMusicLoading}
            onReplaceTrack={handleReplaceTrack}
          />
          </ScrollReveal>
        ) : (
          <MemoryComingIntoView />
        )}

        {isStageAtLeast(stage, "SHARE_READY") && isMoodResult(result) ? (
          <ScrollReveal delay={0.1} y={28} duration={1.4} amount={0.16}>
          <ShareMoodNote
            result={result}
            imageUrl={imageUrl}
            musicRecommendations={musicRecommendations}
          />
          </ScrollReveal>
        ) : null}

        {isStageAtLeast(stage, "MEMORY_READY") && isMoodResult(result) ? (
          <ScrollReveal delay={0.08} y={24} duration={1.2} amount={0.18}>
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 text-center sm:mt-14">
            <button
              type="button"
              onClick={handleSaveMemory}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-7 py-3 font-meta text-sm text-paper shadow-[0_18px_54px_rgba(17,17,19,0.14)] transition duration-500 hover:-translate-y-0.5 hover:bg-tide sm:w-auto"
            >
              保存这段记忆
            </button>
            {saveMessage ? (
              <p className="font-serif text-sm leading-6 text-ink/52">{saveMessage}</p>
            ) : null}
          </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
    </ResultProgressProvider>
  );

  function handleSaveMemory() {
    if (!isMoodResult(result)) return;
    const item = createArchiveItem(result, imageUrl, musicRecommendations, userNote);
    saveArchiveItem(item);
    setSaveMessage("已保存到我的空间记忆。");
  }

  function handleReplaceTrack(index: number) {
    setMusicRecommendations((currentRecommendations) => {
      const currentKeys = new Set(currentRecommendations.map(getRecommendationKey));
      const replacement = musicPool.find(
        (recommendation) => !currentKeys.has(getRecommendationKey(recommendation)),
      );

      if (!replacement) return currentRecommendations;

      return currentRecommendations.map((recommendation, recommendationIndex) =>
        recommendationIndex === index ? replacement : recommendation,
      );
    });
  }
}

function MemoryComingIntoView() {
  return (
    <div className="mx-auto max-w-4xl">
      <MotionText
        delay={0.15}
        duration={1.6}
        y={22}
        blur={7}
        className="font-serif text-[clamp(1.8rem,7vw,3.4rem)] leading-[1.3] text-ink/72"
      >
        一些情绪正在浮现...
      </MotionText>
      <MotionText
        delay={0.65}
        duration={1.4}
        y={16}
        blur={5}
        className="mt-6 max-w-2xl text-base leading-8 text-ink/46 sm:text-lg"
      >
        先停在这张照片里。标题、记忆和音乐会按自己的速度慢慢靠近。
      </MotionText>
    </div>
  );
}

function isStageAtLeast(current: ResultProgressStage, target: ResultProgressStage) {
  const order: ResultProgressStage[] = [
    "IMAGE_READY",
    "TITLE_READY",
    "MEMORY_READY",
    "MUSIC_READY",
    "SHARE_READY",
  ];

  return order.indexOf(current) >= order.indexOf(target);
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getRecommendationKey(recommendation: MusicMemoryRecommendation) {
  const song = recommendation.song;
  return [
    song.songId || song.neteaseSongId || song.id,
    song.title.toLowerCase().replace(/\s+/g, ""),
    song.artist.toLowerCase().replace(/\s+/g, ""),
  ]
    .filter(Boolean)
    .join(":");
}
