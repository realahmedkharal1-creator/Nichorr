import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md border-b border-line">
        <div className="max-w-[820px] mx-auto px-5 sm:px-7 h-[56px] flex items-center justify-between gap-3">
          <Link href="/" className="font-serif font-semibold text-[17px] tracking-tight text-ink">
            Nichorr<span className="text-citation">.</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to site
          </Link>
        </div>
      </header>

      <main className="max-w-[820px] mx-auto px-5 sm:px-7 py-12 sm:py-16">
        <div className="mb-10 pb-8 border-b border-line">
          <span className="font-mono text-[11.5px] tracking-wide uppercase text-citation font-bold block mb-2.5">
            Legal
          </span>
          <h1 className="font-sans font-extrabold tracking-tight text-[28px] sm:text-[36px] leading-tight text-ink">
            {title}
          </h1>
          <p className="text-[13px] text-muted-2 mt-3 font-mono">Last updated: {lastUpdated}</p>
        </div>

        <article
          className="
            text-[14.5px] leading-relaxed text-muted
            [&_h2]:font-sans [&_h2]:font-bold [&_h2]:text-ink [&_h2]:text-[19px] [&_h2]:sm:text-[21px] [&_h2]:leading-snug [&_h2]:mt-11 [&_h2]:mb-3 [&_h2]:tracking-tight
            [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:text-[15.5px] [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:mb-4
            [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1.5
            [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1.5
            [&_li]:leading-relaxed
            [&_a]:text-citation [&_a]:font-medium hover:[&_a]:underline
            [&_strong]:text-ink [&_strong]:font-semibold
            [&_table]:w-full [&_table]:my-5 [&_table]:text-[13.5px] [&_table]:border [&_table]:border-line
            [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink [&_th]:bg-card [&_th]:p-3 [&_th]:border [&_th]:border-line
            [&_td]:p-3 [&_td]:border [&_td]:border-line [&_td]:align-top
            [&_h2:first-child]:mt-0
          "
        >
          {children}
        </article>

        <div className="mt-14 pt-8 border-t border-line flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
          <Link href="/terms" className="text-muted hover:text-ink transition-colors font-medium">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-muted hover:text-ink transition-colors font-medium">
            Privacy Policy
          </Link>
          <Link href="/" className="text-muted hover:text-ink transition-colors font-medium">
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
