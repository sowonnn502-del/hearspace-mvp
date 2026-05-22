"use client";

import { useEffect, useRef, useState } from "react";
import type { AtmosphereAudioTrack } from "@/lib/audio-library";

type AtmospherePlayerProps = {
  track: AtmosphereAudioTrack;
};

export function AtmospherePlayer({ track }: AtmospherePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.load();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [track.file]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
    setProgress((audio.currentTime / audio.duration) * 100);
  }

  function handleSeek(value: number) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const nextTime = (value / 100) * audio.duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
    setProgress(value);
  }

  return (
    <section className="mx-auto mt-20 max-w-5xl sm:mt-28">
      <div className="relative overflow-hidden bg-[linear-gradient(115deg,rgba(17,17,19,0.96),rgba(37,60,70,0.92)_54%,rgba(122,80,64,0.72))] px-5 py-5 text-paper shadow-[0_24px_80px_rgba(17,17,19,0.22)] sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(246,241,232,0.07)_1px,transparent_1px)] bg-[length:28px_100%] opacity-35" />
        <audio
          ref={audioRef}
          src={track.file}
          loop
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />

        <div className="relative grid gap-5 sm:grid-cols-[5.5rem_1fr] sm:items-center">
          <button
            type="button"
            onClick={togglePlayback}
            className="flex h-20 w-20 items-center justify-center rounded-full border border-paper/22 bg-paper/8 text-paper shadow-inner transition duration-500 hover:border-paper/40 hover:bg-paper/12"
            aria-label={isPlaying ? "Pause atmosphere audio" : "Play atmosphere audio"}
          >
            <span className="font-meta text-[10px] uppercase tracking-[0.22em]">
              {isPlaying ? "Pause" : "Tap"}
            </span>
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-meta text-[10px] uppercase tracking-[0.3em] text-paper/46">
                Midnight Radio / Atmosphere
              </p>
              <p className="font-meta text-[10px] uppercase tracking-[0.2em] text-paper/34">
                Loop on
              </p>
            </div>
            <h3 className="mt-3 break-words font-serif text-3xl font-normal leading-tight text-paper">
              {track.title}
            </h3>
            <p className="mt-2 font-meta text-xs uppercase tracking-[0.22em] text-paper/42">
              {isPlaying ? "Now playing" : "Tap to listen"}
            </p>

            <div className="mt-6">
              <input
                type="range"
                min={0}
                max={100}
                value={Number.isFinite(progress) ? progress : 0}
                onChange={(event) => handleSeek(Number(event.target.value))}
                className="h-1 w-full cursor-pointer appearance-none bg-paper/16 accent-paper"
                aria-label="Audio progress"
              />
              <div className="mt-3 flex justify-between font-meta text-[10px] uppercase tracking-[0.18em] text-paper/34">
                <span>{formatTime(currentTime)}</span>
                <span>{duration ? formatTime(duration) : "--:--"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
