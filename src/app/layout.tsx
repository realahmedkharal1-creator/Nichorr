import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-[#f5f5f7] text-[#1d1d1f] flex flex-col antialiased selection:bg-[#0071e3]/20 selection:text-[#0071e3]`} suppressHydrationWarning>
        <Header />
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-[#e5e5ea] bg-white/70 backdrop-blur-sm py-8 text-center text-xs text-[#6e6e73]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-medium">© 2026 VeritasTech AI. Never optimize for an answer that sounds convincing — optimize for an answer that can be defended.</p>
            <div className="flex items-center gap-3 font-mono text-[11px] font-bold text-[#8e8e93]">
              <span className="text-[#0071e3]">TRACED CLAIMS ONLY</span>
              <span>•</span>
              <span>ZERO FABRICATED CITATIONS</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

