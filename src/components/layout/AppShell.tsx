"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Nichorr. Never optimize for an answer that sounds convincing — optimize for an answer that can be defended.</p>
          <div className="flex gap-4 font-mono text-[11px] text-slate-500">
            <span>TRACED CLAIMS ONLY</span>
            <span>•</span>
            <span>ZERO FABRICATED CITATIONS</span>
          </div>
        </div>
      </footer>
    </>
  );
}
