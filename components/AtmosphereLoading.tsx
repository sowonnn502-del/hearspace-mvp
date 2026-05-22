"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { FilmGrain, VignetteLayer, hearspaceEase } from "@/components/MotionPrimitives";

const mainMessages = [
  "Listening to the silence...",
  "Developing the memory...",
  "Tuning the midnight radio...",
  "The space is beginning to speak...",
  "Translating the atmosphere...",
];

const subMessages = [
  "matching atmosphere",
  "restoring emotional grain",
  "finding music memory",
  "building cinematic trace",
];

type AtmosphereLoadingProps = {
  imageSrc?: string | null;
  isDissolving?: boolean;
};

export function AtmosphereLoading({
  imageSrc,
  isDissolving = false,
}: AtmosphereLoadingProps) {
  const reduceMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);
  const [subMessageIndex, setSubMessageIndex] = useState(0);

  useEffect(() => {
    setMessageIndex(Math.floor(Math.random() * mainMessages.length));
    setSubMessageIndex(Math.floor(Math.random() * subMessages.length));
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % mainMessages.length);
    }, 3400);

    const subMessageTimer = window.setInterval(() => {
      setSubMessageIndex((current) => (current + 1) % subMessages.length);
    }, 4600);

    return () => {
      window.clearInterval(messageTimer);
      window.clearInterval(subMessageTimer);
    };
  }, [reduceMotion]);

  return (
    <motion.section
      className="fixed inset-0 z-50 isolate flex min-h-dvh items-center justify-center overflow-hidden bg-ink px-6 text-center text-paper"
      initial={reduceMotion ? false : { opacity: 0, filter: "blur(10px)" }}
      animate={
        isDissolving
          ? { opacity: 0, scale: 1.015, filter: "blur(18px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      exit={{ opacity: 0, scale: 1.015, filter: "blur(18px)" }}
      transition={{ duration: reduceMotion ? 0 : 1.15, ease: hearspaceEase }}
      aria-live="polite"
      aria-busy="true"
    >
      {imageSrc ? (
        <motion.img
          src={imageSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.58] blur-2xl saturate-[0.72]"
          initial={reduceMotion ? false : { scale: 1.04 }}
          animate={{ scale: reduceMotion ? 1 : 1.18 }}
          transition={{ duration: 24, ease: "easeInOut" }}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_38%,rgba(49,90,102,0.42),transparent_32%),linear-gradient(145deg,#06090e,#111b27_48%,#05070a)]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,14,0.38),rgba(6,9,14,0.82)),radial-gradient(circle_at_50%_48%,rgba(246,241,232,0.13),transparent_28%),radial-gradient(circle_at_50%_50%,transparent_0%,rgba(6,9,14,0.82)_78%)]" />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(139,168,190,0.22),transparent_58%)]" />
      <VignetteLayer className="opacity-[0.88]" />
      <FilmGrain className="opacity-[0.32]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(246,241,232,0.14),rgba(139,168,190,0.08)_36%,transparent_66%)] blur-xl sm:h-[30rem] sm:w-[30rem]" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <motion.div
          className="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36"
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.045, 1],
                  opacity: [0.78, 1, 0.82],
                }
          }
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 rounded-full border border-paper/8 bg-paper/[0.035] shadow-[0_0_90px_rgba(139,168,190,0.3)]" />
          <motion.div
            className="absolute inset-4 rounded-full border border-paper/12"
            animate={reduceMotion ? undefined : { scale: [0.94, 1.1, 0.94], opacity: [0.32, 0.78, 0.32] }}
            transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-9 rounded-full bg-paper/10 shadow-[0_0_52px_rgba(246,241,232,0.34)]"
            animate={reduceMotion ? undefined : { opacity: [0.44, 0.9, 0.44] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute h-px w-32 bg-gradient-to-r from-transparent via-paper/34 to-transparent sm:w-44" />
          <div className="absolute h-32 w-px bg-gradient-to-b from-transparent via-paper/18 to-transparent sm:h-44" />
        </motion.div>

        <motion.p
          key={mainMessages[messageIndex]}
          className="mt-11 max-w-xl font-serif text-[clamp(2rem,9vw,4.6rem)] font-normal leading-[1.05] tracking-normal text-paper"
          initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
          transition={{ duration: reduceMotion ? 0 : 1.25, ease: hearspaceEase }}
        >
          {mainMessages[messageIndex]}
        </motion.p>

        <motion.p
          key={subMessages[subMessageIndex]}
          className="mt-6 font-meta text-[10px] uppercase tracking-[0.32em] text-paper/48 sm:text-xs"
          initial={reduceMotion ? false : { opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: hearspaceEase, delay: 0.18 }}
        >
          {subMessages[subMessageIndex]}
        </motion.p>
      </div>
    </motion.section>
  );
}
