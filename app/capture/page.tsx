import { FadeIn } from "@/components/FadeIn";
import { ImageUploadMood } from "@/components/ImageUploadMood";
import { PageShell } from "@/components/PageShell";

export default function CapturePage() {
  return (
    <PageShell>
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl flex-col justify-center py-8 sm:py-12">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <h1 className="break-words text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
            上传一张空间照片
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/58 sm:text-xl">
            让 HearSpace 读一读画面里的光线、颜色和停顿，
            生成一段可以保存与分享的空间情绪。
          </p>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-10 sm:mt-12">
          <ImageUploadMood />
        </FadeIn>
      </section>
    </PageShell>
  );
}
