"use client";

import { useEffect, useState } from "react";
import { FilmFrame, MotionText, ScrollReveal } from "@/components/MotionPrimitives";
import { MoodResultPanel } from "@/components/MoodResultPanel";
import { mockMoodResult } from "@/lib/mockMood";
import { isMoodResult, type MoodResult } from "@/lib/mood-schema";

export function ResultExperience() {
  const [result, setResult] = useState<MoodResult>(mockMoodResult);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

  return (
    <section className="mx-auto max-w-7xl overflow-hidden pb-28 pt-10 sm:pb-32 sm:pt-16">
      <FilmFrame
        src={imageUrl}
        alt="Uploaded atmosphere"
        className="mx-auto min-h-[66vh] max-w-6xl sm:min-h-[78vh]"
      >
        <div className="absolute inset-x-0 bottom-0 px-5 pb-9 sm:px-12 sm:pb-16 lg:px-20 lg:pb-20">
          <div className="max-w-4xl">
            <MotionText
              delay={0.75}
              duration={1.5}
              y={14}
              blur={4}
              className="font-meta text-[10px] uppercase tracking-[0.34em] text-paper/86 [text-shadow:0_2px_18px_rgba(0,0,0,0.72)] sm:text-xs"
            >
            {result.time_label}
            </MotionText>
            <MotionText
              delay={1.25}
              duration={2.1}
              y={22}
              blur={8}
              className="mt-7 break-words text-balance font-serif text-[clamp(2.45rem,12vw,6.8rem)] font-medium leading-[1] tracking-normal text-paper [text-shadow:0_8px_34px_rgba(0,0,0,0.42)] sm:mt-8"
            >
            {result.mood_title}
            </MotionText>
            <MotionText
              delay={2}
              duration={1.8}
              y={18}
              blur={5}
              className="mt-8 max-w-2xl font-meta text-sm leading-7 text-paper/82 [text-shadow:0_2px_18px_rgba(0,0,0,0.68)] sm:mt-10 sm:text-base sm:leading-8"
            >
            {result.scene_observation.primary_scene} ·{" "}
            {result.scene_observation.lighting} ·{" "}
            {result.scene_observation.color_tone}
            </MotionText>
          </div>
        </div>
      </FilmFrame>

      <div className="mx-auto mt-20 max-w-6xl sm:mt-32 lg:mt-36">
        <ScrollReveal delay={0.25} y={34} duration={1.8} amount={0.14}>
          <MoodResultPanel result={result} />
        </ScrollReveal>
      </div>
    </section>
  );
}
