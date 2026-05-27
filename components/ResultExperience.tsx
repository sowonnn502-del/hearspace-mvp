"use client";

import { useEffect, useState } from "react";
import { FilmFrame, MotionText, ScrollReveal } from "@/components/MotionPrimitives";
import { MoodResultPanel } from "@/components/MoodResultPanel";
import { ShareMoodNote } from "@/components/ShareMoodNote";
import { mockMoodResult } from "@/lib/mockMood";
import {
  matchMusicByMood,
  type MusicMemoryRecommendation,
} from "@/lib/music-library";
import { isMoodResult, type MoodResult } from "@/lib/mood-schema";

export function ResultExperience() {
  const [result, setResult] = useState<MoodResult>(mockMoodResult);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const [musicRecommendations, setMusicRecommendations] = useState<
    MusicMemoryRecommendation[]
  >(() => matchMusicByMood(mockMoodResult));

  useEffect(() => {
    const storedResult = sessionStorage.getItem("hearspace:mood-result");
    const storedImage = sessionStorage.getItem("hearspace:mood-image");

    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        if (isMoodResult(parsed)) setResult(parsed);
      } catch {
        setResult(mockMoodResult);
      }
    }

    if (storedImage) setImageUrl(storedImage);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const fallbackRecommendations = matchMusicByMood(result);

    setMusicRecommendations(fallbackRecommendations);
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
          setMusicRecommendations(data.recommendations);
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
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.18)_46%,transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 sm:px-10 sm:pb-12 lg:px-16">
          <MotionText
            delay={0.78}
            duration={1.45}
            y={14}
            blur={4}
            className="font-meta text-[9px] uppercase tracking-[0.34em] text-paper/68 [text-shadow:0_2px_18px_rgba(0,0,0,0.72)] sm:text-[10px]"
          >
            {result.time_label}
          </MotionText>
          <MotionText
            delay={1.18}
            duration={2}
            y={20}
            blur={7}
            className="mt-4 max-w-4xl break-words text-balance font-serif text-[clamp(2.5rem,12vw,5.25rem)] font-medium leading-[1] tracking-normal text-paper [text-shadow:0_12px_42px_rgba(0,0,0,0.58)] sm:text-[clamp(3.75rem,7vw,6.6rem)]"
          >
            {result.mood_title}
          </MotionText>
          {result.mood_subtitle ? (
            <MotionText
              delay={1.36}
              duration={1.8}
              y={16}
              blur={6}
              className="mt-5 max-w-xl break-words font-serif text-lg leading-8 tracking-normal text-paper/84 [text-shadow:0_8px_28px_rgba(0,0,0,0.58)] sm:text-2xl"
            >
              {result.mood_subtitle}
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
          />
        </ScrollReveal>
        <ScrollReveal delay={0.1} y={28} duration={1.4} amount={0.16}>
          <ShareMoodNote
            result={result}
            imageUrl={imageUrl}
            musicRecommendations={musicRecommendations}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
