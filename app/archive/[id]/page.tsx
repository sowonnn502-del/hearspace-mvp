import { ArchiveMemoryDetail } from "@/components/ArchiveMemoryDetail";
import { PageShell } from "@/components/PageShell";

type ArchiveDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ArchiveDetailPage({ params }: ArchiveDetailPageProps) {
  const { id } = await params;

  return (
    <PageShell>
      <ArchiveMemoryDetail id={id} />
    </PageShell>
  );
}
