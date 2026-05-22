"use client";

import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

type Ease = [number, number, number, number];

export const hearspaceEase: Ease = [0.22, 1, 0.36, 1];
export const hearspaceSoftEase: Ease = [0.16, 1, 0.3, 1];

export const hearspaceDurations = {
  imageEnter: 1.8,
  titleEnter: 1.9,
  textEnter: 1.6,
  scrollReveal: 1.35,
  stagger: 0.26,
};

const slowTransition: Transition = {
  duration: hearspaceDurations.textEnter,
  ease: hearspaceEase,
};

const sequenceVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: hearspaceDurations.stagger,
      delayChildren: 0.18,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(7px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: slowTransition,
  },
};

type MotionBaseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function CinematicSequence({ children, className, delay = 0 }: MotionBaseProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={sequenceVariants}
      initial="hidden"
      animate="show"
      transition={reduceMotion ? { duration: 0 } : { delay }}
    >
      {children}
    </motion.div>
  );
}

export function CinematicItem({ children, className, delay = 0 }: MotionBaseProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={itemVariants}
      transition={reduceMotion ? { duration: 0, delay: 0 } : { ...slowTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

type PageMemoryEnterProps = MotionBaseProps & {
  scaleFrom?: number;
};

export function PageMemoryEnter({
  children,
  className,
  delay = 0,
  scaleFrom = 0.985,
}: PageMemoryEnterProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, scale: scaleFrom }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : hearspaceDurations.imageEnter, ease: hearspaceEase, delay }}
    >
      {children}
    </motion.div>
  );
}

type SlowFadeTextProps = MotionBaseProps & {
  blur?: number;
  y?: number;
  duration?: number;
};

export function SlowFadeText({
  children,
  className,
  delay = 0,
  blur = 6,
  y = 18,
  duration = hearspaceDurations.textEnter,
}: SlowFadeTextProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y, filter: `blur(${blur}px)` }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: reduceMotion ? 0 : duration, ease: hearspaceEase, delay }}
    >
      {children}
    </motion.div>
  );
}

export const MotionText = SlowFadeText;

type ScrollRevealProps = MotionBaseProps & {
  amount?: number;
  duration?: number;
  y?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  amount = 0.32,
  duration = hearspaceDurations.scrollReveal,
  y = 28,
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduceMotion ? 0 : duration, ease: hearspaceEase, delay }}
    >
      {children}
    </motion.div>
  );
}

type KenBurnsFrameProps = {
  src?: string | null;
  alt?: string;
  children?: ReactNode;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
};

export function KenBurnsFrame({
  src,
  alt = "",
  children,
  className,
  imageClassName,
  fallbackClassName = "bg-[linear-gradient(135deg,rgba(246,241,232,0.78),rgba(184,92,56,0.46)_34%,rgba(49,90,102,0.88))]",
}: KenBurnsFrameProps) {
  return (
    <div className={className}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`ken-burns-image absolute inset-0 h-full w-full object-cover ${imageClassName ?? ""}`}
        />
      ) : (
        <div className={`ken-burns-image absolute inset-0 ${fallbackClassName}`} />
      )}
      {children}
    </div>
  );
}

export function FilmGrainOverlay({ className = "" }: { className?: string }) {
  return <div className={`film-grain ${className}`} />;
}

export function FilmGrain({ className = "" }: { className?: string }) {
  return <FilmGrainOverlay className={className} />;
}

export function VignetteLayer({ className = "" }: { className?: string }) {
  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(17,17,19,0.1)_46%,rgba(17,17,19,0.76)_100%)] ${className}`}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-ink/92 via-ink/48 to-transparent" />
    </>
  );
}

type FilmFrameProps = {
  src?: string | null;
  alt?: string;
  children?: ReactNode;
  className?: string;
};

export function FilmFrame({ src, alt = "", children, className }: FilmFrameProps) {
  return (
    <PageMemoryEnter
      className={`relative overflow-hidden bg-ink shadow-[0_34px_110px_rgba(17,17,19,0.34),0_0_90px_rgba(184,92,56,0.15)] ${className ?? ""}`}
    >
      <KenBurnsFrame src={src} alt={alt} className="absolute inset-0" />
      <div className="image-breath absolute inset-0 bg-[radial-gradient(circle_at_42%_35%,rgba(246,241,232,0.08),transparent_36%)]" />
      <VignetteLayer />
      <FilmGrain />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-paper/10" />
      {children}
    </PageMemoryEnter>
  );
}
