"use client";

import { useEffect, useRef, useState } from "react";
import type { AtmosphereAudioTrack } from "@/lib/audio-library";

type AtmospherePlayerProps = {
  track: AtmosphereAudioTrack;
  compact?: boolean;
  className?: string;
};

const waveformBars = [38, 62, 48, 76, 44, 68, 52, 82, 46, 64, 40, 72, 50, 60];

export function AtmospherePlayer({
  track,
  compact = false,
  className = "",
}: AtmospherePlayerProps) {
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
    setDuration(0);
  }, [track.file]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;

    const nextDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
    setCurrentTime(audio.currentTime);
    setDuration(nextDuration);
    setProgress(nextDuration ? (audio.currentTime / nextDuration) * 100 : 0);
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
    <section
      className={`relative min-w-0 overflow-hidden bg-[linear-gradient(115deg,rgba(17,17,19,0.96),rgba(37,60,70,0.9)_55%,rgba(122,80,64,0.7))] text-paper shadow-[0_24px_80px_rgba(17,17,19,0.2)] ${
        compact ? "px-5 py-5" : "px-5 py-6 sm:px-7 sm:py-7"
      } ${className}`}
    >
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

      <img
        src={track.cover}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-[0.14] blur-xl saturate-[0.72]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(246,241,232,0.07)_1px,transparent_1px)] bg-[length:28px_100%] opacity-35" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_46%,rgba(246,241,232,0.14),transparent_20%),radial-gradient(circle_at_78%_22%,rgba(139,168,190,0.14),transparent_28%)]" />

      <div className={`relative grid min-w-0 gap-5 ${compact ? "" : "sm:grid-cols-[5.75rem_1fr] sm:items-center"}`}>
        <button
          type="button"
          onClick={togglePlayback}
          className={`flex shrink-0 items-center justify-center rounded-full border border-paper/22 bg-paper/8 text-paper shadow-inner transition duration-500 hover:border-paper/40 hover:bg-paper/12 ${
            compact ? "h-16 w-16" : "h-20 w-20"
          }`}
          aria-label={isPlaying ? "Pause atmosphere audio" : "Play atmosphere audio"}
        >
          <span className="font-meta text-[10px] uppercase tracking-[0.22em]">
            {isPlaying ? "Pause" : "Tap"}
          </span>
        </button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-meta text-[10px] uppercase tracking-[0.3em] text-paper/46">
              Atmosphere Tape
            </p>
            <p className="font-meta text-[10px] uppercase tracking-[0.2em] text-paper/34">
              Loop on
            </p>
          </div>

          <h3 className={`mt-3 break-words font-sans font-semibold leading-tight tracking-[-0.03em] text-paper ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
            {track.title}
          </h3>
          <p className="mt-2 font-meta text-[10px] uppercase tracking-[0.22em] text-paper/42">
            {isPlaying ? "Now playing" : "Tap to listen"} / {track.subtitle}
          </p>

          <div className="mt-5 flex h-10 items-end gap-1.5 overflow-hidden" aria-hidden="true">
            {waveformBars.map((height, index) => (
              <span
                key={`${track.id}-${index}`}
                className={`w-1.5 rounded-full bg-paper/28 transition-opacity duration-500 ${
                  isPlaying ? "opacity-90" : "opacity-[0.38]"
                }`}
                style={{
                  height: `${Math.max(9, height * (compact ? 0.36 : 0.46))}px`,
                  animation: isPlaying
                    ? `image-breath ${2.2 + index * 0.12}s ease-in-out infinite`
                    : undefined,
                }}
              />
            ))}
          </div>

          <div className="mt-5">
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

          {!compact ? (
            <>
              <p className="mt-5 break-words text-sm leading-7 text-paper/62">
                {track.reason}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 font-meta text-[10px] uppercase tracking-[0.18em] text-paper/36">
                {track.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </>
          ) : null}
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
