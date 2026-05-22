import { FadeIn } from "@/components/FadeIn";
import { ImageUploadMood } from "@/components/ImageUploadMood";
import { PageShell } from "@/components/PageShell";

export default function CapturePage() {
  return (
    <PageShell>
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-4xl flex-col justify-center py-10">
        <FadeIn>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-tide">
            Capture
          </p>
          <h1 className="mt-4 break-words text-4xl font-semibold sm:text-6xl">
            Upload the atmosphere.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
            Drop in a photo of a place. HearSpace will pause with it for a moment,
            then shape a cinematic mood result.
          </p>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-10">
          <ImageUploadMood />
        </FadeIn>
      </section>
    </PageShell>
  );
}
