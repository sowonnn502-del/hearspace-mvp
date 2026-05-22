import { PageShell } from "@/components/PageShell";

export default function ArchivePage() {
  return (
    <PageShell>
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl flex-col justify-center py-24">
        <p className="font-meta text-[11px] uppercase tracking-[0.28em] text-ink/42">
          MEMORY ARCHIVE
        </p>
        <h1 className="mt-8 max-w-3xl font-sans text-[clamp(3.2rem,10vw,7rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-ink">
          记忆会在这里慢慢归档。
        </h1>
        <p className="mt-8 max-w-xl font-sans text-lg font-normal leading-[1.7] tracking-[-0.02em] text-ink/58">
          Archive is reserved for saved atmosphere memories. For now, begin with
          one space and let HearSpace listen.
        </p>
      </section>
    </PageShell>
  );
}
