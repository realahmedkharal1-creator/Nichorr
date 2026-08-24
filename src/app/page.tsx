"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import styles from "./landing.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export default function LandingPage() {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleEvidence = () => {
    setEvidenceOpen((prev) => !prev);
  };

  const scrollToWaitlist = () => {
    const el = document.getElementById("waitlist");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!trimmedEmail || !emailPattern.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to join the waitlist. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${styles.landingRoot} ${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      {/* HEADER */}
      <header className={styles.header}>
        <nav className={`${styles.wrap} ${styles.navWrap}`}>
          <Link href="/" className={styles.wordmark}>
            <Image src="/nichorr-logo.svg" alt="Nichorr Logo" width={120} height={32} style={{ height: "32px", width: "auto" }} priority />
          </Link>
          <div className={styles.navActions}>
            <Link href="/login" className={styles.signInLink}>
              Sign In
            </Link>
            <button className={styles.navCta} onClick={scrollToWaitlist}>
              Join waitlist
            </button>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div>
            <div className={styles.eyebrow}>
              <span className={styles.dot}></span> Evidence-first research, built for tech creators
            </div>
            <h1>
              Before you say it<br />
              on camera, <em>prove it.</em>
            </h1>
            <p className={styles.sub}>
              Nichorr researches your next video the way a fact-checker would — every claim traced to a real source, every disagreement between sources flagged, every number confidence-scored. Nothing fabricated. Ever.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary} onClick={scrollToWaitlist}>
                Join the waitlist
              </button>
              <span className={styles.heroNote}>
                Early access opening in batches — no spam, one email when it&apos;s your turn.
              </span>
            </div>
          </div>

          <div className={styles.claimCard}>
            <span className={styles.tag}>Live example — from a real research run</span>
            <p className={styles.claimText}>
              The A19 Pro outperforms the Snapdragon 8 Gen 5 in sustained multi-core workloads
              <button
                className={styles.cite}
                onClick={toggleEvidence}
                aria-expanded={evidenceOpen}
                aria-controls="evidence-1"
                type="button"
              >
                1
              </button>
              .
            </p>
            {evidenceOpen && (
              <div className={styles.evidencePanel} id="evidence-1">
                <div className={styles.src}>
                  <span className={`${styles.badge} ${styles.mono}`}>SRC A</span>
                  <p>
                    <b>AnandTech, Aug 2026</b> — A19 Pro leads by 12% after 15 minutes of sustained load, attributed to the new vapor chamber.
                  </p>
                </div>
                <div className={styles.src}>
                  <span className={`${styles.badge} ${styles.mono}`}>SRC B</span>
                  <p>
                    <b>Notebookcheck, Aug 2026</b> — Snapdragon 8 Gen 5 pulls ahead past the 10-minute mark as A19 Pro throttles under thermal load.
                  </p>
                </div>
                <div className={styles.verdict}>
                  <span className={styles.dot}></span> CONFLICTING SOURCES — flagged, not averaged away
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className={styles.problem}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>The problem</span>
            <h2>Your comments section is the fact-checker right now.</h2>
            <p>
              Specs get misquoted, benchmark methodology gets glossed over, and by the time you&apos;ve manually cross-checked five sources, you&apos;ve spent longer researching than editing.
            </p>
          </div>
          <div className={styles.problemGrid}>
            <div className={styles.problemItem}>
              <span className={`${styles.num} ${styles.mono}`}>01</span>
              <h3>Sources disagree, quietly</h3>
              <p>
                Two benchmark sites give different numbers for the same chip. Most tools average it away. Viewers just see you pick one — and get it &quot;wrong.&quot;
              </p>
            </div>
            <div className={styles.problemItem}>
              <span className={`${styles.num} ${styles.mono}`}>02</span>
              <h3>Claims outlive their accuracy</h3>
              <p>
                A spec you cited in March gets revised in June. Nobody tells you. The video&apos;s still live, still wrong.
              </p>
            </div>
            <div className={styles.problemItem}>
              <span className={`${styles.num} ${styles.mono}`}>03</span>
              <h3>Research doesn&apos;t scale with upload schedule</h3>
              <p>
                Weekly uploads need weekly research depth. Manually, that math doesn&apos;t work past a certain point.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>What&apos;s inside</span>
            <h2>Everything between &quot;I think&quot; and &quot;I can defend this.&quot;</h2>
            <p>
              Every feature exists to answer one question before you hit publish: could I show my working, if someone asked?
            </p>
          </div>

          <div className={styles.featureGroup}>
            <div className={styles.groupLabel}>Research engine</div>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>1</span>
                <div>
                  <h4>Evidence-first claims</h4>
                  <p>Every fact in your brief is traced to a live, real source — never an invented citation.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>2</span>
                <div>
                  <h4>Conflict detection</h4>
                  <p>When sources disagree, Nichorr shows you both sides and why — it doesn&apos;t quietly pick one.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>3</span>
                <div>
                  <h4>Confidence scoring</h4>
                  <p>Every claim is marked solid, contested, or insufficient-data — so you know what to double-check.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>4</span>
                <div>
                  <h4>Zero-fabrication policy</h4>
                  <p>If Nichorr can&apos;t find a source for something, it says so. It does not invent one to fill the gap.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.featureGroup}>
            <div className={styles.groupLabel}>Built for tech video creators</div>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>5</span>
                <div>
                  <h4>Timestamped transcript quotes</h4>
                  <p>Pull exact moments from competitor reviews with the timestamp attached, ready to reference.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>6</span>
                <div>
                  <h4>Cross-video conflict comparison</h4>
                  <p>See where other creators&apos; takes on the same product disagree with each other, and why.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>7</span>
                <div>
                  <h4>Viewer question gaps</h4>
                  <p>Surfaces what your audience is actually asking in comments that no video has answered yet.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>8</span>
                <div>
                  <h4>Script-ready research brief</h4>
                  <p>Findings arrive structured enough to read straight into a script — not a wall of links to sort through.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.featureGroup}>
            <div className={styles.groupLabel}>Stay accurate after you publish</div>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>9</span>
                <div>
                  <h4>Publication integrity tracking</h4>
                  <p>Get notified when a spec you cited changes after your video is already live.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>10</span>
                <div>
                  <h4>Source quality telemetry</h4>
                  <p>See which sources have actually held up reliably over time, not just which ones rank well.</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.citeNum}>11</span>
                <div>
                  <h4>One pipeline, not five tabs</h4>
                  <p>Research, drafting, and publish status live in a single project workflow per video.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.how}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>How it works</span>
            <h2>From question to defensible brief, in one run.</h2>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <div>
                <h4>Ask your research question</h4>
                <p>&quot;Is the S25 Ultra&apos;s camera actually better than the S24&apos;s in low light?&quot; — plain language, no special syntax.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <div>
                <h4>Nichorr gathers evidence, live</h4>
                <p>Pulls from benchmarks, reviews, spec sheets, and forums as they exist right now — not a cached guess.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <div>
                <h4>Conflicts get flagged, not hidden</h4>
                <p>Where sources disagree, you see both claims, both sources, and a confidence read on each.</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>4</span>
              <div>
                <h4>You get a defensible brief</h4>
                <p>Cited, confidence-scored, and structured — ready to become a script, not more homework.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className={styles.waitlist} id="waitlist">
        <div className={styles.wrap}>
          <div className={styles.waitlistCard}>
            {!submitted ? (
              <div id="wl-form-state">
                <h2>Get early access</h2>
                <p>
                  We&apos;re letting creators in gradually to keep research quality high. Drop your email and we&apos;ll reach out when it&apos;s your turn.
                </p>
                <form className={styles.wlForm} onSubmit={handleWaitlistSubmit}>
                  <input
                    type="text"
                    id="wl-name"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    className={styles.wlInput}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    id="wl-email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={styles.wlInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errorMessage && (
                    <span className={styles.wlError} id="wl-error">
                      {errorMessage}
                    </span>
                  )}
                  <button type="submit" className={styles.wlBtn} disabled={loading}>
                    {loading ? "Joining..." : "Join the waitlist"}
                  </button>
                </form>
              </div>
            ) : (
              <div className={styles.wlSuccess} id="wl-success">
                <div className={styles.check}>✓</div>
                <h3>You&apos;re on the list.</h3>
                <p>We&apos;ll email you when your access opens. No spam in the meantime.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footerRow}`}>
          <p className={styles.tagline}>
            &quot;Never optimize for an answer that sounds convincing — optimize for an answer that can be defended.&quot;
          </p>
          <span className={styles.footerMark}>NICHORR © 2026</span>
        </div>
      </footer>
    </div>
  );
}
