import Link from "next/link";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="min-h-screen px-5 py-5 font-sans text-ink sm:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="font-meta text-[13px] font-medium uppercase tracking-[0.22em] text-ink/82 transition hover:text-ink">
          HEARSPACE
        </Link>
        <div className="flex items-center gap-5 font-meta text-[13px] text-ink/58">
          <Link href="/capture" className="transition hover:text-ink">
            Capture
          </Link>
          <Link href="/archive" className="transition hover:text-ink">
            Archive
          </Link>
        </div>
      </nav>
      {children}
    </main>
  );
}
