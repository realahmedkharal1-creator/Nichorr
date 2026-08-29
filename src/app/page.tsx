"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ShieldCheck, GitBranch, Gauge, Ban, Clock, Users, FileCheck,
  TrendingUp, Sparkles, ChevronDown, Quote, PlayCircle,
} from "lucide-react";

const VIDEO_SHOWCASE: { id: string; title: string; channel: string }[] = [
  { id: "F7mimRduemY", title: "Samsung Galaxy M vs F vs A vs S Series: Animations & Smoothness Comparison", channel: "Mr Android FHD" },
  { id: "pHpbTnWGA-8", title: "New Mobile Phone Launches in September 2026 — Upcoming Smartphones", channel: "MASTECH" },
  { id: "87IU-B6K4Ac", title: "HONOR's First Matte Display Tablet Is Finally Here — HONOR Pad 20 Pro", channel: "Lim Reviews" },
  { id: "Ai19e3Sq1vY", title: "Why Your Content Isn't Dead Yet", channel: "Jordan Pulmano" },
  { id: "0ZX8S5C1154", title: "$200 Budget Laptop Option for Students — Asus CX15 Honest Review", channel: "BeebNG" },
  { id: "pwggweS-zmw", title: "Best Way to Customize Your Google Pixel in Under 10 Minutes", channel: "HowToMen" },
  { id: "E-7PXgpjWMQ", title: "Best Budget Phone Under $400 That Lasts 4 Years", channel: "TukEmperial" },
];

const FEATURE_GROUPS: {
  label: string;
  items: { icon: typeof ShieldCheck; title: string; body: string }[];
}[] = [
  {
    label: "Research engine",
    items: [
      { icon: FileCheck, title: "Evidence-first claims", body: "Every fact in your brief is traced to a live, real source — never an invented citation." },
      { icon: GitBranch, title: "Conflict detection", body: "When sources disagree, Nichorr shows you both sides and why — it doesn't quietly pick one." },
      { icon: Gauge, title: "Confidence scoring", body: "Every claim is marked solid, contested, or insufficient-data — so you know what to double-check." },
      { icon: Ban, title: "Zero-fabrication policy", body: "If Nichorr can't find a source for something, it says so. It does not invent one to fill the gap." },
    ],
  },
  {
    label: "Built for tech video creators",
    items: [
      { icon: Quote, title: "Timestamped transcript quotes", body: "Pull exact moments from competitor reviews with the timestamp attached, ready to reference." },
      { icon: GitBranch, title: "Cross-video conflict comparison", body: "See where other creators' takes on the same product disagree with each other, and why." },
      { icon: Users, title: "Viewer question gaps", body: "Surfaces what your audience is actually asking in comments that no video has answered yet." },
      { icon: FileCheck, title: "Script-ready research brief", body: "Findings arrive structured enough to read straight into a script — not a wall of links to sort through." },
    ],
  },
  {
    label: "Stay accurate after you publish",
    items: [
      { icon: Clock, title: "Publication integrity tracking", body: "Get notified when a spec you cited changes after your video is already live." },
      { icon: TrendingUp, title: "Source quality telemetry", body: "See which sources have actually held up reliably over time, not just which ones rank well." },
      { icon: Sparkles, title: "One pipeline, not five tabs", body: "Research, drafting, and publish status live in a single project workflow per video." },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "What does Nichorr actually do?",
    a: "You give it a topic for your next video — a phone comparison, a GPU review, a \"is X worth it\" explainer. It researches that topic the way a fact-checker would: it finds real sources, pulls out every factual claim, checks each one against other sources, scores how solid it is, and flags where sources disagree. You get back a structured brief you can read straight into a script.",
  },
  {
    q: "Who is it for?",
    a: "Tech video creators who make review, comparison, and explainer content — phones, laptops, GPUs, wearables, and the like. If your audience will call out a wrong spec or a shaky benchmark in the comments, Nichorr is built to catch it before you record.",
  },
  {
    q: "What do I get at the end of a research run?",
    a: "A research brief: the key claims on your topic, each traced to a live source, each marked solid / contested / insufficient-data, plus a list of where sources conflict and why, viewer questions no existing video has answered, and timestamped quotes from other creators' videos. It's organized to script from, not a pile of tabs to sort.",
  },
  {
    q: "How is this different from searching myself or asking ChatGPT?",
    a: "A chatbot will give you a confident paragraph with no way to check it, and it will invent a citation if it has to. Nichorr only states something if it found a real source for it at research time, shows you that source, tells you how confident it is, and says \"no solid evidence\" when that's the honest answer.",
  },
  {
    q: "Does it analyze other creators' videos too?",
    a: "Yes. It reads competitor video transcripts and comment sections, pulls exact quotes with timestamps, compares where different creators' takes on the same product disagree, and surfaces the questions viewers keep asking that nobody has answered yet.",
  },
  {
    q: "How long does a research run take?",
    a: "Roughly 10–45 seconds on the Quick tier for a focused question, up to a few minutes on the Deep tier when it's cross-checking many sources and video transcripts. You can watch each stage run live.",
  },
  {
    q: "What happens when sources disagree?",
    a: "Nichorr surfaces both claims side by side with their sources and a confidence read on each, instead of silently averaging or picking one for you. Naming the disagreement in your video is what earns trust with a technical audience.",
  },
  {
    q: "Where does the evidence actually come from?",
    a: "Live benchmarks, reviews, spec sheets, forums, and video transcripts pulled at research time — not a cached or pre-baked answer.",
  },
  {
    q: "What if there's no solid evidence for a claim?",
    a: "It's marked insufficient-data and the brief says so plainly. Nichorr will never invent a source or round a shaky number up to sound certain — that's the whole point of the tool.",
  },
  {
    q: "Can I find my past research later?",
    a: "Every run is saved under Research History, searchable by topic. Open any past run to re-read its brief, re-check its sources, or export it again.",
  },
  {
    q: "Can I trust the numbers in my brief?",
    a: "Every number is traced to its source and confidence-scored. If evidence is thin, the brief says so instead of rounding up to sound certain.",
  },
  {
    q: "Is Nichorr free to use right now?",
    a: "Nichorr is in early access. Create an account to start running research — there's no waitlist or approval step required.",
  },
];

const CLAIM_EXAMPLES: {
  claim: string;
  sources: { tag: string; source: string; text: string }[];
  flag: string;
  tone: "conflict" | "verified" | "warning";
}[] = [
  {
    claim: "The A19 Pro outperforms the Snapdragon 8 Gen 5 in sustained multi-core workloads",
    sources: [
      { tag: "SRC A", source: "AnandTech, Aug 2026", text: "A19 Pro leads by 12% after 15 minutes of sustained load, attributed to the new vapor chamber." },
      { tag: "SRC B", source: "Notebookcheck, Aug 2026", text: "Snapdragon 8 Gen 5 pulls ahead past the 10-minute mark as A19 Pro throttles under thermal load." },
    ],
    flag: "CONFLICTING SOURCES — flagged, not averaged away",
    tone: "conflict",
  },
  {
    claim: "The Galaxy S26 Ultra's battery life beats last year's model by roughly 15%",
    sources: [
      { tag: "SRC A", source: "GSMArena, Jul 2026", text: "Measured 15% longer screen-on time in the standardized battery test versus the S25 Ultra." },
      { tag: "SRC B", source: "Manufacturer spec sheet", text: "Cell capacity rated at 5,400 mAh, up from 5,000 mAh — an 8% capacity gain." },
    ],
    flag: "CLAIM VERIFIED — consistent across independent and official sources",
    tone: "verified",
  },
  {
    claim: "Wi-Fi 7 on mid-range phones is still mostly marketing, not a real-world gain",
    sources: [
      { tag: "SRC A", source: "RTINGS, Jun 2026", text: "No measurable throughput difference versus Wi-Fi 6E on current mid-range routers in real households." },
      { tag: "SRC B", source: "r/Android megathread", text: "217 users report no noticeable change after upgrading — gains only appear on routers above $400." },
    ],
    flag: "INSUFFICIENT DATA — real-world benefit unconfirmed at this price tier",
    tone: "warning",
  },
];

const CLAIM_TONE_CLASSES: Record<string, { flag: string; dot: string }> = {
  conflict: { flag: "bg-conflict-bg text-conflict", dot: "bg-conflict" },
  verified: { flag: "bg-verified-bg text-verified", dot: "bg-verified" },
  warning: { flag: "bg-warning-bg text-warning", dot: "bg-warning" },
};

export default function LandingPage() {
  const [openClaim, setOpenClaim] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <div className="bg-paper text-ink min-h-screen">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-line">
        <nav className="max-w-[1180px] mx-auto px-3 sm:px-7 h-[56px] sm:h-[68px] flex flex-nowrap items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <Image src="/nichorr-logo.svg" alt="Nichorr Logo" width={120} height={32} className="h-6 sm:h-10 w-auto" priority />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/docs" className="hidden sm:inline-flex text-[14.5px] font-semibold text-muted hover:text-ink py-2 px-3 rounded-lg hover:bg-ink/5 transition-colors whitespace-nowrap">
              Docs
            </Link>
            <Link href="/login" className="text-[13px] sm:text-[14.5px] font-semibold text-muted hover:text-ink py-2 sm:px-3 sm:rounded-lg sm:hover:bg-ink/5 transition-colors whitespace-nowrap">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 bg-ink text-white text-[13px] sm:text-[14.5px] font-semibold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-ink/85 transition-colors whitespace-nowrap"
            >
              Get Started <ArrowRight className="hidden sm:block w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="max-w-[1180px] mx-auto px-7 grid md:grid-cols-2 gap-12 md:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[12.5px] tracking-wide uppercase text-muted mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-citation" /> Evidence-first research, built for tech creators
            </div>
            <h1 className="font-sans font-extrabold tracking-tight text-ink text-[36px] md:text-[52px] leading-[1.06] mb-6">
              Before you say it<br />
              on camera, <span className="text-citation">prove it.</span>
            </h1>
            <p className="text-[18px] text-muted max-w-[46ch] mb-8 leading-relaxed">
              Nichorr researches your next video the way a fact-checker would — every claim traced to a real source, every disagreement between sources flagged, every number confidence-scored. Nothing fabricated. Ever.
            </p>
            <div className="flex items-center gap-5 flex-wrap">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-ink text-white font-semibold text-[15.5px] px-7 py-3.5 rounded-full hover:bg-ink/85 hover:-translate-y-0.5 transition-all"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-[13.5px] text-muted-2">
                No waitlist. No card required to try it.
              </span>
            </div>
          </div>

          <div className="bg-card border border-line rounded-3xl p-7 shadow-[0_1px_2px_rgba(18,18,20,0.04),0_20px_40px_rgba(18,18,20,0.06)]">
            <span className="font-mono text-[11.5px] tracking-wide uppercase text-muted mb-4 block">
              Live examples — from a real research run
            </span>
            {CLAIM_EXAMPLES.map((example, i) => {
              const tone = CLAIM_TONE_CLASSES[example.tone];
              const isOpen = openClaim === i;
              const evidenceId = `evidence-${i + 1}`;
              return (
                <div key={evidenceId} className={i > 0 ? "mt-5 pt-5 border-t border-line" : undefined}>
                  <p className="text-[19px] leading-[1.55] font-semibold text-ink">
                    {example.claim}
                    <button
                      onClick={() => setOpenClaim((v) => (v === i ? null : i))}
                      aria-expanded={isOpen}
                      aria-controls={evidenceId}
                      type="button"
                      className="inline-flex items-center justify-center align-super font-mono text-[12px] font-bold w-5 h-5 rounded-full bg-citation-bg text-citation ml-0.5 border-none cursor-pointer hover:bg-citation hover:text-white transition-colors"
                    >
                      {i + 1}
                    </button>
                    .
                  </p>
                  {isOpen && (
                    <div id={evidenceId} className="mt-5 pt-4 border-t border-dashed border-line">
                      {example.sources.map((src, j) => (
                        <div
                          key={src.tag}
                          className={`flex gap-3 py-2.5 ${j < example.sources.length - 1 ? "border-b border-line" : ""}`}
                        >
                          <span className="font-mono text-[11px] font-semibold shrink-0 h-fit mt-0.5 px-2 py-0.5 rounded-full bg-citation-bg text-citation">{src.tag}</span>
                          <p className="text-[14px] text-ink"><b className="font-semibold">{src.source}</b> — {src.text}</p>
                        </div>
                      ))}
                      <div className={`mt-4 flex items-center gap-2.5 font-mono text-[12.5px] font-semibold px-3.5 py-2.5 rounded-lg ${tone.flag}`}>
                        <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${tone.dot}`} /> {example.flag}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10 md:py-12 border-y border-line bg-card">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-7 flex flex-col divide-y divide-line sm:grid sm:grid-cols-3 sm:divide-y-0 sm:gap-6 md:gap-10">
          {[
            { stat: "10–45s", label: "Full run time, Quick to Deep tier" },
            { stat: "0", label: "Fabricated citations, ever" },
            { stat: "100%", label: "Claims traced to a live source" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 sm:block sm:py-0 sm:text-left"
            >
              <div className="font-sans font-extrabold text-citation leading-none whitespace-nowrap shrink-0 w-[86px] sm:w-auto text-[26px] sm:text-[30px] md:text-[42px] sm:mb-2">
                {s.stat}
              </div>
              <div className="text-[13px] sm:text-[12.5px] md:text-[13.5px] text-muted leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARKET FACTS */}
      <section className="py-16 md:py-20 border-b border-line">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-7">
          <div className="max-w-[640px] mb-10 md:mb-12">
            <span className="font-mono text-[12.5px] tracking-wide uppercase text-citation mb-3 block">The stakes</span>
            <h2 className="font-sans font-extrabold tracking-tight text-[26px] md:text-[34px] leading-tight text-ink">
              Your audience already treats you like a news source.
            </h2>
          </div>
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
            {[
              {
                stat: "1B+ hrs/day",
                body: "of YouTube is watched on TV screens — where a viewer can't tap a link in your description to check a claim you made on camera.",
              },
              {
                stat: "$100B+",
                body: "paid out to YouTube creators over the last four years. Sponsors back the channels their audience trusts to get the facts right.",
              },
              {
                stat: "1 in 5",
                body: "U.S. adults now regularly get news from online creators — most of whom have no newsroom or fact-checking desk behind them.",
              },
            ].map((f) => (
              <div key={f.stat} className="bg-card border border-line rounded-2xl p-6 sm:p-7">
                <div className="font-sans font-extrabold text-ink leading-none text-[30px] sm:text-[32px] md:text-[38px] mb-3">
                  {f.stat}
                </div>
                <p className="text-[13.5px] text-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
          <p className="text-[11.5px] text-muted-2 mt-5 leading-relaxed">
            Sources: Nielsen &amp; YouTube (connected-TV watch time, 2025); YouTube / CNBC (creator payouts, Sept 2025); Pew Research Center (news influencers, Nov 2024).
          </p>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="border-b border-line py-16 md:py-20">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="max-w-[640px] mb-11">
            <span className="font-mono text-[12.5px] tracking-wide uppercase text-citation mb-3 block">Why Nichorr exists</span>
            <h2 className="font-sans font-extrabold tracking-tight text-[26px] md:text-[34px] leading-tight mb-3 text-ink">
              Your comments section is the fact-checker right now.
            </h2>
            <p className="text-[16.5px] text-muted">
              Specs get misquoted, benchmark methodology gets glossed over, and by the time you&apos;ve manually cross-checked five sources, you&apos;ve spent longer researching than editing.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <span className="font-mono text-[11.5px] tracking-wide uppercase text-conflict mb-5 block">The problem</span>
              <div className="flex flex-col gap-7">
                {[
                  { n: "01", title: "Sources disagree, quietly", body: "Two benchmark sites give different numbers for the same chip. Most tools average it away. Viewers just see you pick one — and get it “wrong.”" },
                  { n: "02", title: "Claims outlive their accuracy", body: "A spec you cited in March gets revised in June. Nobody tells you. The video's still live, still wrong." },
                  { n: "03", title: "Research doesn't scale with upload schedule", body: "Weekly uploads need weekly research depth. Manually, that math doesn't work past a certain point." },
                ].map((item) => (
                  <div key={item.n}>
                    <span className="font-mono text-[12.5px] text-conflict block mb-2.5">{item.n}</span>
                    <h3 className="text-[17px] font-bold mb-2 text-ink">{item.title}</h3>
                    <p className="text-[14px] text-muted leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-[11.5px] tracking-wide uppercase text-verified mb-5 block">The Nichorr way</span>
              <div className="flex flex-col gap-4">
                {[
                  "Disagreeing sources are shown side by side, each with its own confidence score — never quietly averaged away.",
                  "Claims get re-checked against source changes after you publish, so a video doesn't stay wrong after the internet moves on.",
                  "Depth scales from a 10-second gut check to a full contrarian-query audit — same workflow, no extra manual cross-checking.",
                ].map((text) => (
                  <div key={text} className="flex gap-3 items-start bg-verified-bg/50 rounded-xl p-4">
                    <ShieldCheck className="w-[18px] h-[18px] text-verified mt-0.5 shrink-0" />
                    <span className="text-[14px] text-ink leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YOUTUBE INTELLIGENCE / VIDEO SHOWCASE */}
      <section id="videos" className="border-b border-line py-16 md:py-20">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <div>
              <span className="font-mono text-[12.5px] tracking-wide uppercase text-citation mb-3 block">YouTube Intelligence</span>
              <h2 className="font-sans font-extrabold tracking-tight text-[26px] md:text-[34px] leading-tight mb-4 text-ink">
                Point it at a stack of tech reviews. Get back what they actually said.
              </h2>
              <p className="text-[16.5px] text-muted mb-7 leading-relaxed max-w-[50ch]">
                Nichorr watches the review videos your audience already trusts — pulling timestamped quotes straight from the transcript, flagging where reviewers contradict each other, and surfacing the complaints and questions viewers keep leaving in the comments.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  { icon: Quote, text: "Timestamped quotes pulled straight from the transcript, never paraphrased" },
                  { icon: GitBranch, text: "Reviewer disagreements flagged across channels, methodology included" },
                  { icon: Users, text: "Recurring complaints and unanswered viewer questions, surfaced automatically" },
                ].map((row) => (
                  <li key={row.text} className="flex gap-3 items-start">
                    <row.icon className="w-[18px] h-[18px] text-citation mt-0.5 shrink-0" />
                    <span className="text-[14.5px] text-ink leading-relaxed">{row.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-line rounded-3xl p-6 shadow-[0_1px_2px_rgba(18,18,20,0.04),0_20px_40px_rgba(18,18,20,0.06)]">
              <span className="font-mono text-[11px] tracking-wide uppercase text-muted mb-4 block">3 reviewer videos analyzed for this run</span>
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                {[
                  { label: "Reviewer A", grad: "from-citation to-ink" },
                  { label: "Reviewer B", grad: "from-ink to-conflict" },
                  { label: "Reviewer C", grad: "from-ink to-verified" },
                ].map((v) => (
                  <div key={v.label} className="space-y-1.5">
                    <div className={`relative aspect-video rounded-xl bg-gradient-to-br ${v.grad} overflow-hidden flex items-center justify-center`}>
                      <PlayCircle className="w-6 h-6 text-white/85" />
                    </div>
                    <span className="block font-mono text-[10px] text-muted text-center">{v.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 py-2.5 border-t border-line">
                <span className="font-mono text-[11px] font-semibold shrink-0 h-fit mt-0.5 px-2 py-0.5 rounded-full bg-citation-bg text-citation">12:47</span>
                <p className="text-[13.5px] text-ink">&ldquo;Battery life dropped almost 20% versus the last model in our loop test.&rdquo; — Reviewer B transcript</p>
              </div>
              <div className="mt-3 flex items-center gap-2.5 font-mono text-[12px] font-semibold bg-conflict-bg text-conflict px-3.5 py-2.5 rounded-lg">
                <span className="w-[7px] h-[7px] rounded-full bg-conflict shrink-0" /> Reviewer A reports no measurable drop — flagged
              </div>
            </div>
          </div>

          <div className="max-w-[640px] mb-9">
            <span className="font-mono text-[12px] tracking-wide uppercase text-muted mb-3 block">Seen on real tech channels</span>
            <h3 className="font-sans font-bold text-[20px] md:text-[24px] leading-tight text-ink">
              Here&apos;s the kind of video Nichorr is built to run against.
            </h3>
          </div>

          <div className="bg-ink rounded-3xl p-3 md:p-4 grid lg:grid-cols-[280px_1fr] gap-3">
            <div className="order-1 lg:order-2 aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe
                key={VIDEO_SHOWCASE[activeVideo].id}
                src={`https://www.youtube.com/embed/${VIDEO_SHOWCASE[activeVideo].id}`}
                title={VIDEO_SHOWCASE[activeVideo].title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            <div className="order-2 lg:order-1 flex flex-col gap-0.5 sm:gap-1 max-h-[420px] lg:max-h-none overflow-y-auto lg:overflow-visible">
              {VIDEO_SHOWCASE.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVideo(i)}
                  type="button"
                  className={`w-full text-left flex items-center gap-2.5 sm:gap-3 px-2 py-1 sm:p-2 rounded-lg sm:rounded-xl transition-colors ${
                    i === activeVideo ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                    alt={v.channel}
                    className="w-[52px] h-[32px] sm:w-16 sm:h-11 rounded-md sm:rounded-lg object-cover shrink-0"
                    loading="lazy"
                  />
                  <span className={`text-[12px] sm:text-[13px] leading-snug ${i === activeVideo ? "font-semibold text-white" : "font-medium text-white/55"}`}>
                    {v.channel}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-20">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="max-w-[680px] mb-12 md:mb-14">
            <span className="font-mono text-[12.5px] tracking-wide uppercase text-citation mb-3 block">What&apos;s inside</span>
            <h2 className="font-sans font-extrabold tracking-tight text-[26px] md:text-[34px] leading-tight mb-3 text-ink">
              Everything between &quot;I think&quot; and &quot;I can defend this.&quot;
            </h2>
            <p className="text-[16.5px] text-muted leading-relaxed">
              Every feature exists to answer one question before you hit publish: could I show my working, if someone asked?
            </p>
          </div>

          <div className="space-y-10 md:space-y-14">
            {FEATURE_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-[12px] tracking-wide uppercase text-muted whitespace-nowrap">
                    {group.label}
                  </span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <div
                  className={`grid gap-4 sm:grid-cols-2 ${
                    group.items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
                  }`}
                >
                  {group.items.map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-2xl border border-line bg-card p-5 transition-colors hover:border-citation/40"
                    >
                      <div className="w-10 h-10 rounded-xl bg-citation-bg text-citation flex items-center justify-center shrink-0">
                        <item.icon className="w-[18px] h-[18px]" />
                      </div>
                      <div>
                        <h4 className="text-[15.5px] font-bold mb-1 text-ink leading-snug">{item.title}</h4>
                        <p className="text-[14px] text-muted leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-card border-y border-line py-16 md:py-20">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="max-w-[640px] mb-11">
            <span className="font-mono text-[12.5px] tracking-wide uppercase text-citation mb-3 block">How it works</span>
            <h2 className="font-sans font-extrabold tracking-tight text-[26px] md:text-[34px] leading-tight text-ink">
              From question to defensible brief, in one run.
            </h2>
          </div>
          <div className="flex flex-col">
            {[
              { n: "1", title: "Ask your research question", body: "“Is the S25 Ultra's camera actually better than the S24's in low light?” — plain language, no special syntax." },
              { n: "2", title: "Nichorr gathers evidence, live", body: "Pulls from benchmarks, reviews, spec sheets, and forums as they exist right now — not a cached guess." },
              { n: "3", title: "Conflicts get flagged, not hidden", body: "Where sources disagree, you see both claims, both sources, and a confidence read on each." },
              { n: "4", title: "You get a defensible brief", body: "Cited, confidence-scored, and structured — ready to become a script, not more homework." },
            ].map((step, i, arr) => (
              <div key={step.n} className={`grid grid-cols-[52px_1fr] md:grid-cols-[64px_1fr] gap-6 py-6 ${i < arr.length - 1 ? "border-b border-line" : ""}`}>
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-citation text-white flex items-center justify-center font-sans font-bold text-[17px]">
                  {step.n}
                </div>
                <div>
                  <h4 className="text-[18px] font-bold mb-1.5 text-ink">{step.title}</h4>
                  <p className="text-[15px] text-muted max-w-[56ch] leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA PANEL */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="relative bg-ink rounded-[28px] px-8 py-14 md:px-16 md:py-16 overflow-hidden">
            <div className="max-w-[560px] relative z-10">
              <span className="inline-flex items-center gap-2 font-mono text-[12px] tracking-wide uppercase text-white/60 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-citation" /> Early access is open
              </span>
              <h2 className="font-sans font-extrabold tracking-tight text-[28px] md:text-[38px] leading-[1.1] text-white mb-5">
                Stop defending claims you can&apos;t source.
              </h2>
              <p className="text-white/65 text-[16px] mb-8 max-w-[46ch] leading-relaxed">
                Create your first research run and see the evidence trail for yourself — every citation, every conflict, every confidence score.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-citation text-white font-semibold text-[15.5px] px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="hidden md:block absolute right-14 top-1/2 -translate-y-1/2 w-[280px] bg-white rounded-2xl shadow-2xl p-6 z-10">
              <span className="font-mono text-[11px] tracking-wide uppercase text-muted mb-4 block">Sample run summary</span>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] text-muted">Sources cross-checked</span>
                  <span className="font-sans font-extrabold text-[20px] text-ink">6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] text-muted">Conflicts flagged</span>
                  <span className="font-sans font-extrabold text-[20px] text-conflict">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] text-muted">Claims verified</span>
                  <span className="font-sans font-extrabold text-[20px] text-verified">14</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-20 border-t border-line">
        <div className="max-w-[760px] mx-auto px-7">
          <div className="mb-11">
            <span className="font-mono text-[12.5px] tracking-wide uppercase text-citation mb-3 block">FAQ</span>
            <h2 className="font-sans font-extrabold tracking-tight text-[26px] md:text-[32px] leading-tight text-ink">
              Common questions
            </h2>
          </div>
          <div className="flex flex-col">
            {FAQ_ITEMS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left bg-transparent border-none cursor-pointer"
                  >
                    <span className="text-[16px] font-semibold text-ink">{item.q}</span>
                    <span className={`w-8 h-8 rounded-full border border-line flex items-center justify-center shrink-0 transition-transform ${open ? "rotate-180 bg-citation-bg border-citation-bg" : ""}`}>
                      <ChevronDown className={`w-4 h-4 ${open ? "text-citation" : "text-muted"}`} />
                    </span>
                  </button>
                  {open && (
                    <p className="text-[14.5px] text-muted leading-relaxed pb-5 pr-14">{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line pt-14 pb-10 bg-paper">
        <div className="max-w-[1180px] mx-auto px-7">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-10">
            <div className="max-w-[360px]">
              <Image src="/nichorr-logo.svg" alt="Nichorr Logo" width={112} height={30} style={{ height: "34px", width: "auto" }} />
              <p className="text-[13.5px] text-muted mt-3.5 leading-relaxed">
                Evidence-first research for tech YouTubers. Every claim traced, every conflict flagged, nothing fabricated.
              </p>
            </div>
            <div className="flex gap-14 flex-wrap">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted-2 mb-3 block">Product</span>
                <div className="flex flex-col gap-2.5 text-[13.5px]">
                  <a href="#features" className="text-muted hover:text-ink transition-colors">Features</a>
                  <a href="#videos" className="text-muted hover:text-ink transition-colors">Video intelligence</a>
                  <a href="#how-it-works" className="text-muted hover:text-ink transition-colors">How it works</a>
                  <Link href="/docs" className="text-muted hover:text-ink transition-colors">Documentation</Link>
                  <a href="#faq" className="text-muted hover:text-ink transition-colors">FAQ</a>
                </div>
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted-2 mb-3 block">Account</span>
                <div className="flex flex-col gap-2.5 text-[13.5px]">
                  <Link href="/login" className="text-muted hover:text-ink transition-colors">Sign in</Link>
                  <Link href="/signup" className="text-muted hover:text-ink transition-colors">Get started</Link>
                </div>
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted-2 mb-3 block">Legal</span>
                <div className="flex flex-col gap-2.5 text-[13.5px]">
                  <Link href="/terms" className="text-muted hover:text-ink transition-colors">Terms of Service</Link>
                  <Link href="/privacy" className="text-muted hover:text-ink transition-colors">Privacy Policy</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4 pt-8 border-t border-line">
            <p className="italic text-[14px] text-muted max-w-[52ch]">
              &quot;Never optimize for an answer that sounds convincing — optimize for an answer that can be defended.&quot;
            </p>
            <span className="font-mono text-[12.5px] text-muted">NICHORR © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
