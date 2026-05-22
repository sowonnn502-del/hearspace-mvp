import Link from "next/link";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="min-h-screen px-5 py-5 text-ink sm:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="font-mono text-sm uppercase tracking-[0.18em]">
          HearSpace
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/capture" className="opacity-75 transition hover:opacity-100">
            Capture
          </Link>
          <Link href="/result" className="opacity-75 transition hover:opacity-100">
            Result
          </Link>
        </div>
      </nav>
      {children}
    </main>
  );
}
