"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Rocket,
  ListChecks,
  Gauge,
  Workflow,
  LayoutDashboard,
  FileSearch,
  GitBranch,
  AlertTriangle,
  Video,
  MessagesSquare,
  HelpCircle,
  Lightbulb,
  Clapperboard,
  Bot,
  FileText,
  History,
  FolderTree,
  ShieldCheck,
  LifeBuoy,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const SECTIONS = [
  { id: "overview", label: "What Nichorr does", icon: BookOpen },
  { id: "quick-start", label: "Quick start", icon: Rocket },
  { id: "step-1-topic", label: "1. Start a run", icon: ListChecks },
  { id: "step-2-depth", label: "2. Choose depth", icon: Gauge },
  { id: "step-3-questions", label: "3. Question plan", icon: ListChecks },
  { id: "step-4-pipeline", label: "4. The pipeline", icon: Workflow },
  { id: "results", label: "Reading your results", icon: LayoutDashboard },
  { id: "history", label: "Finding past research", icon: History },
  { id: "sources", label: "Source trust list", icon: ShieldCheck },
  { id: "best-practices", label: "Confidence & conflicts", icon: AlertTriangle },
  { id: "account", label: "Account & sign-in", icon: ShieldCheck },
  { id: "troubleshooting", label: "Troubleshooting", icon: LifeBuoy },
];

export default function DocsPage() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const onScroll = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActive(s.id);
          return;
        }
      }
      setActive(SECTIONS[0].id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md border-b border-line">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-7 h-[56px] flex items-center justify-between gap-3">
          <Link href="/" className="font-serif font-semibold text-[17px] tracking-tight text-ink shrink-0">
            Nichorr<span className="text-citation">.</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to site
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 bg-ink text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-ink/85 transition-colors whitespace-nowrap"
            >
              Open app <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1180px] mx-auto px-4 sm:px-7 py-10 sm:py-14 flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Sidebar */}
        <aside className="lg:w-[240px] shrink-0 hidden lg:block">
          <nav className="sticky top-[88px] flex flex-col gap-0.5">
            <span className="font-mono text-[10px] tracking-[0.5px] uppercase text-muted-2 mb-2 pl-3">
              On this page
            </span>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-semibold transition-colors ${
                  active === s.id
                    ? "bg-citation-bg text-citation"
                    : "text-muted hover:text-ink hover:bg-card"
                }`}
              >
                <s.icon className="w-[15px] h-[15px] shrink-0" />
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-[760px] min-w-0">
          <div className="mb-12">
            <span className="font-mono text-[11.5px] tracking-wide uppercase text-citation font-bold block mb-2.5">
              Documentation
            </span>
            <h1 className="font-sans font-extrabold tracking-tight text-[30px] sm:text-[40px] leading-tight text-ink">
              How to use Nichorr
            </h1>
            <p className="text-[15.5px] text-muted mt-3 leading-relaxed">
              A full walkthrough &mdash; from typing a topic to a script-ready brief with every claim traced
              to a real source.
            </p>
          </div>

          <Article>
            {/* OVERVIEW */}
            <Section id="overview" icon={BookOpen} title="What Nichorr does">
              <p>
                Nichorr researches your next tech video the way a fact-checker would. You give it a topic; it
                finds real sources, pulls out every factual claim, checks each claim against other sources,
                scores how solid it is, flags where sources disagree, and hands you a structured brief you can
                read straight into a script.
              </p>
              <Callout tone="verified" title="The one rule">
                Nichorr only states something if it found a real source for it at research time, and shows you
                that source. When the evidence is thin, it says <em>insufficient data</em> instead of guessing.
                Nothing is fabricated.
              </Callout>
              <h3>What you get at the end of a run</h3>
              <ul>
                <li>A list of key claims, each traced to a live source and marked solid / contested / insufficient-data.</li>
                <li>A conflict matrix showing where credible sources disagree, and why.</li>
                <li>YouTube intelligence: transcript quotes, reviewer disagreements, and viewer questions no video has answered.</li>
                <li>A final brief, organised to script from &mdash; not a pile of tabs to sort.</li>
              </ul>
            </Section>

            {/* QUICK START */}
            <Section id="quick-start" icon={Rocket} title="Quick start (2 minutes)">
              <ol>
                <li>
                  From the <strong>Dashboard</strong>, click <strong>+ New Research</strong> (or type a topic
                  into the explore box) &mdash; or pick a quick-start template.
                </li>
                <li>
                  <strong>Step 1 &mdash; Topic &amp; Goal:</strong> enter your topic, add an objective, pick a
                  content type and audience, then <strong>Continue to Plan</strong>.
                </li>
                <li>
                  <strong>Step 2 &mdash; Configuration:</strong> choose a research depth (Quick / Standard /
                  Deep).
                </li>
                <li>
                  <strong>Step 3 &mdash; Question Plan:</strong> review the auto-generated research questions,
                  add or remove any, then <strong>Start Research Execution</strong>.
                </li>
                <li>
                  <strong>Step 4 &mdash; Execute:</strong> watch the pipeline run (about 10&ndash;90 seconds
                  depending on depth). When it finishes, click <strong>View Results</strong>.
                </li>
              </ol>
              <p>
                Every run is saved under <a href="#history">Research History</a>, so you can reopen it any
                time.
              </p>
            </Section>

            {/* STEP 1 */}
            <Section id="step-1-topic" icon={ListChecks} title="Step 1 — Start a research run">
              <p>Open <strong>New Research</strong> and fill in the form:</p>
              <ul>
                <li>
                  <strong>Primary Tech Topic</strong> (required) &mdash; the core subject or claim, e.g.
                  &ldquo;Apple M4 iPad Pro OLED display calibration&rdquo;.
                </li>
                <li>
                  <strong>Specific Content Objective</strong> &mdash; what exactly you want answered. The more
                  concrete, the better the questions Nichorr generates. e.g. &ldquo;Does the tandem OLED
                  flicker (PWM) at low brightness, and how does it compare to the M2 model?&rdquo;
                </li>
                <li>
                  <strong>Content Type</strong> &mdash; Comparison, Deep Dive, Buying Guide, or News Analysis.
                  This shapes the structure of the outputs.
                </li>
                <li>
                  <strong>Target Audience</strong> &mdash; Technology Content Creators, Enthusiast / Prosumer,
                  or General Consumer. This adjusts tone and technical depth.
                </li>
                <li>
                  <strong>Output Language</strong> &mdash; the language of the generated brief and scripts.
                </li>
              </ul>
              <Callout tone="neutral" title="Tip">
                The quick-start template cards on the create screen pre-fill a good topic + objective for
                common formats (phone comparison, GPU efficiency, laptop thermals). Use one as a starting
                point and edit.
              </Callout>
            </Section>

            {/* STEP 2 */}
            <Section id="step-2-depth" icon={Gauge} title="Step 2 — Choose a research depth">
              <p>
                Depth controls how many searches Nichorr runs and how hard it looks for disagreement. Pick
                based on how much is riding on the video.
              </p>
              <div className="not-prose overflow-x-auto my-5">
                <table className="w-full text-[13.5px] border border-line">
                  <thead>
                    <tr>
                      <Th>Tier</Th>
                      <Th>What it does</Th>
                      <Th>Time</Th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <Td><strong>Quick</strong></Td>
                      <Td>3&ndash;5 focused queries, ~10 primary sources. Good for news synthesis and fast fact-checks.</Td>
                      <Td>~10s</Td>
                    </tr>
                    <tr>
                      <Td><strong>Standard</strong></Td>
                      <Td>8&ndash;12 queries, multi-angle search and synthesis. The everyday default.</Td>
                      <Td>~25s</Td>
                    </tr>
                    <tr>
                      <Td><strong>Deep</strong></Td>
                      <Td>Full audit: contrarian queries, community-forum signals, deeper spec extraction.</Td>
                      <Td>~45s+</Td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* STEP 3 */}
            <Section id="step-3-questions" icon={ListChecks} title="Step 3 — Review the question plan">
              <p>
                Nichorr breaks your topic into concrete research questions (measurements, comparisons, facts).
                On the <strong>Question Plan</strong> screen you can:
              </p>
              <ul>
                <li>read each generated question and its type;</li>
                <li>remove any that are off-target;</li>
                <li>add your own &mdash; type it in and press Enter or the add button.</li>
              </ul>
              <p>
                Good questions are specific and testable (&ldquo;What is the measured peak brightness in
                nits?&rdquo;) rather than broad (&ldquo;Is the screen good?&rdquo;). When the list looks right,
                click <strong>Start Research Execution</strong>.
              </p>
            </Section>

            {/* STEP 4 */}
            <Section id="step-4-pipeline" icon={Workflow} title="Step 4 — Watch the pipeline run">
              <p>
                The <strong>Research Execution Pipeline</strong> screen shows each stage as it runs: planning,
                discovering sources, retrieving pages, extracting claims, verifying them, correlating conflicts
                and community/audience signals, checking quality, and generating the brief.
              </p>
              <ul>
                <li>
                  <strong>It is resumable.</strong> The pipeline advances one stage per request, so it keeps
                  going even if you close the tab &mdash; reopen the run from History to check progress.
                </li>
                <li>
                  <strong>Every run costs API calls.</strong> Don&rsquo;t spam re-runs; let a run finish or
                  cancel it before starting another on the same topic.
                </li>
                <li>
                  When the status reads <strong>Completed &amp; Audited</strong>, click{" "}
                  <strong>View Results</strong>.
                </li>
              </ul>
            </Section>

            {/* RESULTS */}
            <Section id="results" icon={LayoutDashboard} title="Reading your results">
              <p>
                The results view has a tab bar. Here is what each tab is for.
              </p>

              <TabDoc icon={LayoutDashboard} name="Overview">
                The executive summary: headline findings, key stats (sources, claims, conflicts), and the
                dominant confidence read. Start here, then drill into a tab.
              </TabDoc>

              <TabDoc icon={FileSearch} name="Evidence Explorer">
                Every extracted claim as a card, with a green/red number chip for its confidence and a{" "}
                <em>Show excerpt</em> toggle that reveals the exact source text it came from. Filter by
                category (performance, camera, battery&hellip;) to jump to the claims you need. If a claim is
                marked insufficient-data, treat it as unconfirmed.
              </TabDoc>

              <TabDoc icon={AlertTriangle} name="Conflict Matrix">
                Where two credible sources report different results for the same thing &mdash; different
                benchmark numbers, opposite conclusions, or tests run under incompatible conditions or on
                different hardware variants. Nichorr lists each as-is with the reason, instead of averaging
                them. Naming the disagreement in your video is what earns trust with a technical audience.
              </TabDoc>

              <TabDoc icon={GitBranch} name="Provenance &amp; Lineage">
                The trail behind a finding: which questions led to which searches, which sources were
                retrieved, and how a claim was derived. Use it when you need to defend where a number came
                from.
              </TabDoc>

              <TabDoc icon={Video} name="YouTube Intelligence">
                What other creators said. Shows transcript coverage (how many analysed videos had a usable
                transcript), per-video status, timestamped quotes, points where reviewers disagree, and
                recurring viewer questions with no good answer yet. Transcripts that YouTube blocks are marked
                honestly rather than filled in.
              </TabDoc>

              <TabDoc icon={MessagesSquare} name="Community Signals">
                Recurring complaints, praise, and themes pulled from forum and comment discussion about the
                product &mdash; counted, not invented.
              </TabDoc>

              <TabDoc icon={HelpCircle} name="Audience Questions">
                Questions real viewers keep asking that existing videos don&rsquo;t answer &mdash; a shortlist
                of things worth covering.
              </TabDoc>

              <TabDoc icon={Lightbulb} name="Opportunities">
                Angles for your video suggested from the disagreements, unanswered questions, and problems
                found during the run, each with a rough score.
              </TabDoc>

              <TabDoc icon={Clapperboard} name="Creator Studio">
                Turns the research into draft production assets: script sections, hook variations, and shot /
                B-roll lists, plus a distraction-free teleprompter view and timeline-marker export (EDL /
                FCPXML) for your editor. This area is the newest part of the tool &mdash; treat its output as a
                first draft to edit, not a finished script.
              </TabDoc>

              <TabDoc icon={Bot} name="Ask AI">
                Ask a follow-up question about this run. Answers are grounded in the run&rsquo;s own evidence,
                so you can interrogate the findings without leaving the page.
              </TabDoc>

              <TabDoc icon={FileText} name="Final Brief">
                The consolidated, script-ready document: summary, findings, conflicts, caveats. Export it and
                write from it. Empty sections are shown as &ldquo;none&rdquo; rather than padded.
              </TabDoc>
            </Section>

            {/* HISTORY */}
            <Section id="history" icon={History} title="Finding past research">
              <ul>
                <li>
                  <strong>Research History</strong> (in the top nav) lists every run you&rsquo;ve started,
                  searchable by topic. Open any run to re-read its brief, re-check sources, or export again.
                </li>
                <li>
                  <strong>Dashboard &rarr; Recent Research</strong> shows your last few runs with a link
                  straight to each result.
                </li>
                <li>
                  <strong>Projects</strong> let you group related runs (e.g. every video in a comparison
                  series) so findings stay together over time.
                </li>
              </ul>
            </Section>

            {/* SOURCES */}
            <Section id="sources" icon={ShieldCheck} title="Source trust list">
              <p>
                The <strong>Sources</strong> page is a personal reference list: add the outlets, benchmark
                databases, and official press rooms you rely on, and tag how close each sits to primary
                evidence (Primary / Secondary / Tertiary). It&rsquo;s a scoring guide for your own review; it
                doesn&rsquo;t change what a run retrieves.
              </p>
            </Section>

            {/* BEST PRACTICES */}
            <Section id="best-practices" icon={AlertTriangle} title="How to read confidence & conflicts">
              <ul>
                <li>
                  <strong>Solid</strong> &mdash; corroborated across sources. Safe to state plainly, but still
                  open the excerpt and check the primary source for any spec, price, or safety claim.
                </li>
                <li>
                  <strong>Contested</strong> &mdash; sources disagree. Don&rsquo;t pick a side silently; say
                  what the disagreement is and why (e.g. a 21&deg;C vs 25&deg;C test room, or an Exynos vs
                  Snapdragon unit).
                </li>
                <li>
                  <strong>Insufficient data</strong> &mdash; not enough evidence. Either leave it out or say
                  it&rsquo;s unconfirmed on camera.
                </li>
              </ul>
              <Callout tone="neutral" title="Before you publish">
                Nichorr reduces research errors; it doesn&rsquo;t eliminate them. Verify the load-bearing
                claims against their cited primary source. You are responsible for what you say on camera.
              </Callout>
            </Section>

            {/* ACCOUNT */}
            <Section id="account" icon={ShieldCheck} title="Account & sign-in">
              <ul>
                <li>Sign up with an email and password, or <strong>Continue with Google</strong>.</li>
                <li>Your research runs are private to your account.</li>
                <li>
                  What we collect and how it&rsquo;s handled is in the{" "}
                  <Link href="/privacy">Privacy Policy</Link>; usage terms are in the{" "}
                  <Link href="/terms">Terms of Service</Link>. To delete your account and its data, contact
                  the address listed in the Privacy Policy.
                </li>
              </ul>
            </Section>

            {/* TROUBLESHOOTING */}
            <Section id="troubleshooting" icon={LifeBuoy} title="Troubleshooting">
              <h3>A run failed or got stuck</h3>
              <p>
                Reopen it from History &mdash; the pipeline resumes on its own where it can. If it stays
                failed, start a fresh run; transient provider errors (rate limits, timeouts) usually clear on
                a retry.
              </p>
              <h3>&ldquo;Zero claims extracted&rdquo;</h3>
              <p>
                Usually means the sources found were thin or hard to parse. Try a more specific objective, add
                a couple of concrete questions in Step 3, or raise the depth to Standard/Deep.
              </p>
              <h3>A YouTube transcript shows as blocked / unavailable</h3>
              <p>
                YouTube blocks automated transcript access for some videos. Nichorr marks those honestly
                instead of inventing quotes &mdash; the rest of the run is unaffected.
              </p>
              <h3>Results look sparse</h3>
              <p>
                Low-depth runs on a niche topic can return little. Re-run at a higher depth, or sharpen the
                topic and objective.
              </p>
            </Section>

            <div className="mt-14 pt-8 border-t border-line flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
              <Link href="/dashboard" className="text-citation font-semibold hover:underline">
                Open the app &rarr;
              </Link>
              <Link href="/terms" className="text-muted hover:text-ink font-medium">Terms</Link>
              <Link href="/privacy" className="text-muted hover:text-ink font-medium">Privacy</Link>
              <Link href="/" className="text-muted hover:text-ink font-medium">Home</Link>
            </div>
          </Article>
        </main>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Article({ children }: { children: React.ReactNode }) {
  return (
    <article
      className="
        text-[14.5px] leading-relaxed text-muted
        [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:text-[15.5px] [&_h3]:mt-7 [&_h3]:mb-2
        [&_p]:mb-4
        [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2
        [&_ol]:mb-4 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2.5
        [&_li]:leading-relaxed
        [&_a]:text-citation [&_a]:font-medium hover:[&_a]:underline
        [&_strong]:text-ink [&_strong]:font-semibold
        [&_em]:text-ink [&_em]:not-italic [&_em]:font-medium
        [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink [&_th]:bg-card [&_th]:p-3 [&_th]:border [&_th]:border-line
        [&_td]:p-3 [&_td]:border [&_td]:border-line [&_td]:align-top
      "
    >
      {children}
    </article>
  );
}

function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-[88px] mb-14">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-line">
        <span className="w-9 h-9 rounded-xl bg-card border border-line flex items-center justify-center shrink-0">
          <Icon className="w-[18px] h-[18px] text-citation" />
        </span>
        <h2
          className="font-sans font-bold tracking-tight text-[20px] sm:text-[23px] text-ink m-0"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      {children}
    </section>
  );
}

function Callout({
  tone,
  title,
  children,
}: {
  tone: "verified" | "neutral";
  title: string;
  children: React.ReactNode;
}) {
  const cls =
    tone === "verified"
      ? "bg-verified-bg border-verified/25"
      : "bg-card border-line";
  return (
    <div className={`not-prose my-5 rounded-2xl border ${cls} p-4 sm:p-5`}>
      <div className="flex items-start gap-3">
        <CheckCircle2
          className={`w-[18px] h-[18px] shrink-0 mt-0.5 ${
            tone === "verified" ? "text-verified" : "text-muted-2"
          }`}
        />
        <div>
          <p className="font-semibold text-ink text-[14px] mb-1">{title}</p>
          <p className="text-[13.5px] text-muted leading-relaxed m-0">{children}</p>
        </div>
      </div>
    </div>
  );
}

function TabDoc({
  icon: Icon,
  name,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="not-prose my-4 rounded-2xl border border-line bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-1.5">
        <Icon className="w-[17px] h-[17px] text-citation shrink-0" />
        <h4
          className="font-sans font-bold text-[14.5px] text-ink m-0"
          dangerouslySetInnerHTML={{ __html: name }}
        />
      </div>
      <p className="text-[13.5px] text-muted leading-relaxed m-0">{children}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-semibold text-ink bg-card p-3 border border-line">{children}</th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="p-3 border border-line align-top text-muted">{children}</td>;
}
