"use client";

import { useEffect, useState } from "react";
import { FilmFrame, MotionText, ScrollReveal } from "@/components/MotionPrimitives";
import { MoodResultPanel } from "@/components/MoodResultPanel";
import { ShareMoodNote } from "@/components/ShareMoodNote";
import { mockMoodResult } from "@/lib/mockMood";
import {
  getEmbeddedMusicRecommendations,
  getMusicRecommendationPool,
  matchMusicByMood,
  type MusicMemoryRecommendation,
} from "@/lib/music-library";
import { isMoodResult, type MoodResult } from "@/lib/mood-schema";
import {
  createArchiveItem,
  saveArchiveItem,
} from "@/lib/space-memory-archive";

export function ResultExperience() {
  const [result, setResult] = useState<MoodResult>(mockMoodResult);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const [musicRecommendations, setMusicRecommendations] = useState<
    MusicMemoryRecommendation[]
  >(() => getInitialMusicRecommendations(mockMoodResult));
  const [musicPool, setMusicPool] = useState<MusicMemoryRecommendation[]>(() =>
    getMusicRecommendationPool(mockMoodResult),
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [userNote, setUserNote] = useState("");

  useEffect(() => {
    const storedResult = sessionStorage.getItem("hearspace:mood-result");
    const storedImage = sessionStorage.getItem("hearspace:mood-image");
    const storedUserNote = sessionStorage.getItem("hearspace:user-note");

    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        if (isMoodResult(parsed)) setResult(parsed);
      } catch {
        setResult(mockMoodResult);
      }
    }

    if (storedImage) setImageUrl(storedImage);
    if (storedUserNote) setUserNote(storedUserNote);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const fallbackRecommendations = getInitialMusicRecommendations(result);
    const fallbackPool = getMusicRecommendationPool(result);

    setMusicRecommendations(fallbackRecommendations);
    setMusicPool(mergeMusicRecommendations(fallbackRecommendations, fallbackPool));
    setIsMusicLoading(true);

    async function enrichMusicRecommendations() {
      try {
        const response = await fetch("/api/music/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });

        if (!response.ok) return;

        const data = (await response.json()) as {
          recommendations?: MusicMemoryRecommendation[];
        };

        if (!isCancelled && data.recommendations?.length) {
          const enrichedRecommendations = data.recommendations.slice(0, 3);
          setMusicRecommendations(enrichedRecommendations);
          setMusicPool(
            mergeMusicRecommendations(enrichedRecommendations, fallbackPool),
          );
        }
      } catch (error) {
        console.warn("[HearSpace Music] Recommendation enrichment failed:", error);
      } finally {
        if (!isCancelled) setIsMusicLoading(false);
      }
    }

    void enrichMusicRecommendations();

    return () => {
      isCancelled = true;
    };
  }, [result]);

  return (
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
            {result.time_label}
          </MotionText>
          <MotionText
            delay={1.18}
            duration={2}
            y={20}
            blur={7}
            className="mt-3 max-w-4xl break-words text-balance font-serif text-[clamp(2rem,9.5vw,4rem)] font-medium leading-[1.02] tracking-normal !text-white [text-shadow:0_12px_42px_rgba(0,0,0,0.86)] sm:mt-4 sm:text-[clamp(3rem,5.6vw,5.2rem)]"
          >
            {result.mood_title}
          </MotionText>
          {result.mood_subtitle ? (
            <MotionText
              delay={1.36}
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
        <ScrollReveal delay={0.25} y={34} duration={1.8} amount={0.14}>
          <MoodResultPanel
            result={result}
            musicRecommendations={musicRecommendations}
            isMusicLoading={isMusicLoading}
            onReplaceTrack={handleReplaceTrack}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.1} y={28} duration={1.4} amount={0.16}>
          <ShareMoodNote
            result={result}
            imageUrl={imageUrl}
            musicRecommendations={musicRecommendations}
          />
        </ScrollReveal>
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
      </div>
    </section>
  );

  function handleSaveMemory() {
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

function getInitialMusicRecommendations(result: MoodResult) {
  const embeddedRecommendations = getEmbeddedMusicRecommendations(result);
  if (embeddedRecommendations.length >= 3) return embeddedRecommendations;

  const seen = new Set(
    embeddedRecommendations.map((item) =>
      `${item.song.title}:${item.song.artist}`.toLowerCase(),
    ),
  );
  const fallback = matchMusicByMood(result).filter((item) => {
    const key = `${item.song.title}:${item.song.artist}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return [...embeddedRecommendations, ...fallback].slice(0, 3);
}

function mergeMusicRecommendations(
  ...groups: MusicMemoryRecommendation[][]
): MusicMemoryRecommendation[] {
  const merged: MusicMemoryRecommendation[] = [];
  const seen = new Set<string>();

  for (const group of groups) {
    for (const recommendation of group) {
      const key = getRecommendationKey(recommendation);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(recommendation);
    }
  }

  return merged;
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
