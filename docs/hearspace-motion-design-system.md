# HearSpace Motion Design Skill System

HearSpace motion should feel like a remembered space slowly coming into focus: Apple-level restraint, old film texture, and a Wong Kar Wai sense of suspended time. Motion is not decoration here. It is pacing, memory, and attention.

## 1. Framer Motion Core Abilities

- `initial`, `animate`, `exit`: page and element entrance/exit states.
- `transition`: duration, delay, easing, spring/tween behavior.
- `variants`: reusable animation states shared by parent and children.
- `staggerChildren`: cinematic sequence timing.
- `whileInView`: scroll reveal without manual intersection observers.
- `viewport`: reveal thresholds such as `{ once: true, amount: 0.32 }`.
- `AnimatePresence`: transitions when content mounts/unmounts.
- `layout`: small layout morphs, use sparingly in HearSpace.
- `useReducedMotion`: respect users who prefer less motion.

## 2. HearSpace Animation Types

- Slow image reveal: opacity plus very subtle scale.
- Ken Burns image drift: long-running image scale and tiny translation.
- Slow fade typography: opacity, slight `y`, optional blur.
- Sequential page entrance: image first, title second, writing third, music last.
- Scroll reveal: archive notes and tape memories appear as they enter view.
- Ambient overlays: film grain, vignette, breathing light.
- Tape memory reveal: horizontal cassette blocks fade in with small upward motion.

## 3. Animations To Avoid

- Bouncy springs.
- Fast hover scaling.
- Confetti, badges, pulsing CTAs, gamified reward motion.
- Dashboard-style card hover lifts everywhere.
- Snappy SaaS transitions below `300ms`.
- Rotating icons, loading spinners as visual decoration.
- Parallax that moves faster than the reader can settle.
- Elastic drawer/menu motion.

## 4. Page Entrance Rhythm

Use a four-beat sequence:

1. Image appears: `0.0s`, `1.6-2.0s`
2. Time label/title fades in: `0.9-1.4s` delay, `1.4-1.9s`
3. Writing appears: `2.0-2.6s` delay, `1.6-2.0s`
4. Music memory appears: `2.6-3.2s` delay, `1.4-1.8s`

The page should never feel like it is “loading widgets.” It should feel like subtitles finding the screen.

## 5. Ken Burns Effect

Use CSS keyframes for long image movement rather than Framer Motion for every frame. It is cheaper and smoother.

```css
.ken-burns-image {
  transform-origin: 48% 44%;
  animation: ken-burns 28s ease-in-out infinite alternate;
}

@keyframes ken-burns {
  0% { transform: scale(1) translate3d(0, 0, 0); }
  45% { transform: scale(1.055) translate3d(-1.4%, -0.8%, 0); }
  100% { transform: scale(1.105) translate3d(1.2%, 0.9%, 0); }
}
```

## 6. Film Grain

Use an absolutely positioned overlay with tiny radial gradients and `steps()` movement. Keep opacity low.

```css
.film-grain {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.18-0.28;
  mix-blend-mode: soft-light;
  animation: film-grain-shift 8s steps(7) infinite;
}
```

## 7. Slow Fade Typography

For titles and writing:

- `opacity: 0 -> 1`
- `y: 14-24 -> 0`
- optional `filter: blur(6px) -> blur(0)`
- duration `1.4-2.0s`
- easing `[0.22, 1, 0.36, 1]`

Use serif display type, normal weight, generous line height, and controlled max width.

## 8. Scroll Reveal

Use `whileInView` and `viewport`. Reveal once for memory-like pacing.

```tsx
<motion.div
  initial={{ opacity: 0, y: 28 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.32 }}
  transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
/>
```

## 9. HearSpace Timing Tokens

- Primary ease: `[0.22, 1, 0.36, 1]`
- Soft ease: `[0.16, 1, 0.3, 1]`
- Entrance duration: `1.6-2.0s`
- Text duration: `1.4-1.9s`
- Scroll reveal duration: `1.1-1.5s`
- Stagger: `0.18-0.36s`
- Ken Burns: `24-36s`
- Breathing overlay: `10-16s`
- Grain shift: `6-10s steps()`

## 10. Reusable Components

Use `components/MotionPrimitives.tsx` for:

- `CinematicSequence`
- `CinematicItem`
- `PageMemoryEnter`
- `SlowFadeText`
- `ScrollReveal`
- `KenBurnsFrame`
- `FilmGrainOverlay`

These are the default motion vocabulary for HearSpace. Add new motion only when a page needs a new narrative beat.
