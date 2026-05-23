"use client";

import { useEffect, useMemo, useState } from "react";
import { FilmFrame, MotionText, ScrollReveal } from "@/components/MotionPrimitives";
import { MoodResultPanel } from "@/components/MoodResultPanel";
import { ShareMoodNote } from "@/components/ShareMoodNote";
import { matchAtmosphereAudio, type AtmosphereAudioTrack } from "@/lib/audio-library";
import { mockMoodResult } from "@/lib/mockMood";
import { isMoodResult, type MoodResult } from "@/lib/mood-schema";

export function ResultExperience() {
  const [result, setResult] = useState<MoodResult>(mockMoodResult);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMusicMemoryReady, setIsMusicMemoryReady] = useState(false);
  const defaultAudioTrack = useMemo(() => matchAtmosphereAudio(result), [result]);
  const [audioTrack, setAudioTrack] =
    useState<AtmosphereAudioTrack>(defaultAudioTrack);

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
    setAudioTrack(defaultAudioTrack);
    setIsMusicMemoryReady(false);
    const timer = window.setTimeout(() => setIsMusicMemoryReady(true), 1400);
    return () => window.clearTimeout(timer);
  }, [defaultAudioTrack]);

  return (
    <section className="mx-auto max-w-7xl overflow-hidden pb-28 pt-10 sm:pb-32 sm:pt-16">
      <FilmFrame
        src={imageUrl}
        alt="Uploaded atmosphere"
        className="mx-auto aspect-[4/5] max-h-[780px] min-h-[560px] max-w-6xl sm:aspect-[16/7] sm:min-h-[540px] lg:aspect-[16/6.5] lg:min-h-[600px]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.18)_46%,transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 sm:px-12 sm:pb-12 lg:px-20 lg:pb-16">
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
            className="mt-5 max-w-4xl break-words text-balance font-serif text-[clamp(2.75rem,14vw,5.6rem)] font-medium leading-[0.96] tracking-normal text-paper [text-shadow:0_12px_42px_rgba(0,0,0,0.58)] sm:text-[clamp(4rem,8vw,7.2rem)]"
          >
            {result.mood_title}
          </MotionText>
        </div>
      </FilmFrame>

      <div className="mx-auto mt-20 max-w-6xl sm:mt-32 lg:mt-36">
        <ScrollReveal delay={0.25} y={34} duration={1.8} amount={0.14}>
          <MoodResultPanel
            result={result}
            audioTrack={audioTrack}
            isMusicMemoryReady={isMusicMemoryReady}
            onSelectAudioTrack={setAudioTrack}
          />
        </ScrollReveal>
        <ScrollReveal delay={0.1} y={28} duration={1.4} amount={0.16}>
          <ShareMoodNote result={result} imageUrl={imageUrl} />
        </ScrollReveal>
      </div>
    </section>
  );
}
