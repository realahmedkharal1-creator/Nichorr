import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "VeritasTech AI — Evidence-First Tech Research Platform",
  description: "Structured, traceable, and evidence-first technical research intelligence for technology creators and independent researchers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 VeritasTech AI. Never optimize for an answer that sounds convincing — optimize for an answer that can be defended.</p>
            <div className="flex gap-4 font-mono text-[11px] text-slate-400">
              <span>TRACED CLAIMS ONLY</span>
              <span>•</span>
              <span>ZERO FABRICATED CITATIONS</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
