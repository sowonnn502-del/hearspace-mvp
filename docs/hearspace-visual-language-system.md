# HearSpace Visual Language System

HearSpace should feel like an emotional archive rather than a productivity tool. The visual language sits between Apple minimal, old film, Wong Kar Wai warmth, and quiet archival memory. Every screen should give the image and writing room to breathe.

## 1. Font System

Current project fonts:

- Sans: `Geist`, used for navigation, small UI, labels, metadata, and supporting copy.
- Mono: `Geist Mono`, used for archive labels, timestamps, tape IDs, and technical memory markers.
- Serif: browser/system serif via `font-serif`, used for cinematic titles and long emotional writing.

Recommended usage:

- `font-serif`: mood titles, writing, section titles such as `Tape fragments`.
- `font-sans`: body text, navigation, action labels.
- `font-mono`: time labels, archive labels, memory IDs, keywords.

Do not use many font families. The contrast should come from pacing, weight, size, and spacing.

## 2. Font Weight Hierarchy

- Hero title: `font-normal`, serif, large scale.
- Writing: `font-normal`, serif, relaxed line height.
- Section heading: `font-normal`, serif or `font-medium` sans only when functional.
- Body: `font-normal`, sans.
- Metadata: `font-normal`, mono, uppercase.
- Buttons/links: `font-normal` or `font-medium`, never heavy.

Avoid pure bold UI feeling. HearSpace should not look like a dashboard or admin panel.

## 3. Page Whitespace Rules

- Use generous vertical whitespace between narrative beats: `64px-112px`.
- Keep content max width controlled:
  - Main page width: `max-w-6xl`.
  - Reading width: `max-w-3xl`.
  - Supporting text: `max-w-2xl`.
- Let the first viewport feel open. Avoid filling every corner with controls.
- Navigation should be quiet and small.
- Result pages should allow image, title, writing, and music memory to arrive as separate moments.

## 4. Spacing System

Use Tailwind spacing with a slow, editorial rhythm:

- Tiny metadata gap: `mt-2`, `gap-2`.
- Label to heading: `mt-4` or `mt-6`.
- Paragraph rhythm: `mt-5`, `space-y-5`.
- Section rhythm: `mt-16`, `mt-20`, `mt-24`, `mt-28`.
- Page vertical padding: `pt-10 sm:pt-16`, `pb-24`.
- Inner hero padding: `px-6 pb-10`, `sm:px-10 sm:pb-14`, `lg:px-16`.

Avoid dense `gap-3` dashboard stacks unless the content is truly compact.

## 5. Color Tokens

Current Tailwind tokens:

- `ink`: `#111113` for primary text and deep film black.
- `paper`: `#f6f1e8` for warm page background and soft light.
- `mist`: `#d8d1c5` for secondary warm neutral.
- `ember`: `#b85c38` for film warmth and memory accents.
- `tide`: `#315a66` for cool shadow and cinematic contrast.
- `moss`: `#66735b` for muted archival green.

Recommended ratios:

- Background: mostly `paper`, `mist`, low-opacity `tide`.
- Text: mostly `ink`, with opacity variants `text-ink/72`, `text-ink/66`, `text-ink/42`.
- Image overlays: `ink/24` to `ink/82`.
- Accent: use `ember` and `tide` sparingly, never as large saturated UI blocks.

## 6. Shadow Rules

Use shadows as atmosphere, not as card chrome.

Allowed:

- Large soft image shadow: `shadow-film`.
- Low-opacity cassette/tape shadow: `shadow-[0_20px_70px_rgba(17,17,19,0.18)]`.
- Inner analog detail: `shadow-inner`.

Avoid:

- Default Tailwind card shadows everywhere.
- Hover lift shadows.
- Neumorphism.
- Multiple nested shadows.

## 7. Radius Rules

HearSpace should avoid generic rounded SaaS cards.

Recommended:

- Full cinematic image frame: square or very subtle radius.
- Repeated tape blocks: `0` to `8px`.
- Small controls: `999px` only for pills or circular details.
- Cards, if unavoidable: max `8px` radius.

Avoid large rounded panels like `rounded-[2rem]` for content cards unless the image itself is being treated as a soft physical object.

## 8. Card Rules

Cards are not the default layout unit.

Use cards only for:

- Individual repeated memories.
- Tape/cassette fragments.
- Modals or contained tools.

Avoid:

- A large report card wrapping the entire Result page.
- Nested cards.
- Border-heavy sections.
- Form-like panels for emotional writing.

Prefer:

- Full-width bands.
- Unframed text columns.
- Image-led compositions.
- Archive/tape rows rather than recommendation cards.

## 9. Film Grain Implementation

Use a lightweight CSS overlay:

```css
.film-grain {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  opacity: 0.18-0.28;
  mix-blend-mode: soft-light;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.34) 0 1px, transparent 1px),
    radial-gradient(circle at 80% 30%, rgba(0,0,0,0.2) 0 1px, transparent 1px);
  background-size: 13px 13px, 19px 19px;
  animation: film-grain-shift 8s steps(7) infinite;
}
```

Keep it subtle. It should be felt before it is noticed.

## 10. Vignette Implementation

Use radial or gradient overlays over imagery:

```tsx
<div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,transparent_0%,rgba(17,17,19,0.08)_45%,rgba(17,17,19,0.72)_100%)]" />
<div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/82 via-ink/28 to-transparent" />
```

Rules:

- Use vignette to protect typography legibility.
- Keep center readable and edges emotional.
- Do not blur the image heavily.

## 11. Typography Rhythm

Hero title:

- Serif.
- Normal weight.
- `leading-[0.88]`.
- Large clamp sizing.
- Wide empty space around it.

Writing:

- Serif.
- `leading-[1.08]` for large quote style.
- `leading-8` or `leading-9` for body paragraphs.
- Max width `max-w-3xl`.

Metadata:

- Mono.
- Uppercase.
- `tracking-[0.24em]` to `tracking-[0.34em]`.
- Small size: `text-[10px]` or `text-xs`.

Body:

- Sans.
- `text-ink/66` to `text-ink/72`.
- Avoid large blocks of pure black text.

## 12. Result Page Layout Principles

Result page should unfold like a spatial memory:

1. Image first, full and immersive.
2. Time label appears as archive marker.
3. Mood title behaves like a film poster.
4. Writing appears as literature, not analysis.
5. Space personality becomes an archive note.
6. Music memory appears as tape fragments.
7. Keywords become quiet metadata at the end.

Never structure Result as:

- Left image, right report card.
- Field label followed by field value repeatedly.
- Recommendation cards.
- Debug or schema-like presentation.

## 13. Unsuitable Design Elements

Avoid:

- Bright gradient blobs.
- Decorative orbs.
- SaaS dashboard cards.
- Heavy borders.
- Many pills and tags.
- Bright blue links as a dominant UI style.
- Button-heavy layouts.
- Floating glassmorphism panels everywhere.
- Fast hover effects.
- Dense tables.
- Emoji-led labels.
- Overly rounded rectangles.
- Marketing hero split layouts.
- Loud CTA sections.

HearSpace should look like a memory system, not a product analytics page.

## Implementation Reminder

When in doubt, choose:

- Less border.
- More image.
- Slower motion.
- Softer text contrast.
- Wider spacing.
- Fewer UI labels.
- More archival restraint.
