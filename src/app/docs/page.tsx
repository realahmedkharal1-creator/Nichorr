"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  BookOpen, 
  Search, 
  Activity, 
  ShieldCheck, 
  Share2, 
  Terminal,
  Zap,
  CheckCircle2,
  Cpu,
  MonitorPlay,
  Layers,
  ArrowRight
} from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");

  // Simple scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["getting-started", "core-research", "creator-studio", "quality-gates", "publishing"];
      
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto pt-[28px] px-[20px] pb-[80px] flex flex-col lg:flex-row gap-[40px]">
      
      {/* Sidebar Navigation */}
      <aside className="lg:w-[260px] flex-shrink-0 relative hidden md:block">
        <div className="sticky top-[100px]">
          <div className="mb-[24px]">
            <div className="relative">
              <Search className="w-[14px] h-[14px] absolute left-[12px] top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder="Search guides..."
                className="w-full bg-card border border-line rounded-[9px] pl-[34px] pr-[12px] py-[9px] text-[13px] font-sans text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg transition-shadow placeholder:text-muted-2"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[4px]">
            <div className="font-mono text-[10px] tracking-[0.5px] uppercase text-muted-2 mb-[8px] pl-[12px] mt-[12px]">Platform Guides</div>
            
            <SidebarLink 
              icon={<BookOpen size={16} />} 
              label="Getting Started" 
              isActive={activeSection === "getting-started"} 
              onClick={() => scrollTo("getting-started")}
            />
            <SidebarLink 
              icon={<Cpu size={16} />} 
              label="Core Research" 
              isActive={activeSection === "core-research"} 
              onClick={() => scrollTo("core-research")}
            />
            <SidebarLink 
              icon={<MonitorPlay size={16} />} 
              label="Creator Studio" 
              isActive={activeSection === "creator-studio"} 
              onClick={() => scrollTo("creator-studio")}
            />
            <SidebarLink 
              icon={<ShieldCheck size={16} />} 
              label="Quality Gates" 
              isActive={activeSection === "quality-gates"} 
              onClick={() => scrollTo("quality-gates")}
            />
            <SidebarLink 
              icon={<Share2 size={16} />} 
              label="Publishing Engine" 
              isActive={activeSection === "publishing"} 
              onClick={() => scrollTo("publishing")}
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[800px]">
        
        <div className="mb-[40px]">
          <h1 className="font-serif font-semibold text-[38px] leading-tight mb-[16px]">Platform Documentation</h1>
          <p className="text-[15.5px] text-muted leading-relaxed max-w-[600px]">
            Master the complete workflow from raw topic research to verified scripts and multi-channel publishing. Learn how to leverage the AI engines effectively.
          </p>
        </div>

        {/* SECTION 1: Getting Started */}
        <section id="getting-started" className="mb-[60px] scroll-mt-[100px]">
          <SectionHeader icon={<Activity className="text-citation" />} title="Getting Started & Dashboard" />
          
          <div className="prose prose-sm max-w-none text-ink font-sans mb-[24px]">
            <p className="text-[14.5px] leading-relaxed text-muted mb-4">
              The Dashboard is your command center. It provides an overview of your entire research ecosystem, including your <b>Research Velocity</b> (how many runs you complete over time) and active quick-start templates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] my-[24px]">
              <InfoCard 
                title="Starting a New Run"
                desc="Click the '+ New Research' button or enter a topic directly into the explore bar. The engine will instantly begin drafting an initial outline."
                icon={<Zap size={18} className="text-warning" />}
              />
              <InfoCard 
                title="Quick Templates"
                desc="Use the pre-filled chips (e.g. 'RTX 5090 thermals') to instantly spin up common tech review structures without typing a prompt."
                icon={<Layers size={18} className="text-verified" />}
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Core Research */}
        <section id="core-research" className="mb-[60px] scroll-mt-[100px]">
          <SectionHeader icon={<Cpu className="text-citation" />} title="Core Research Engine" />
          
          <div className="prose prose-sm max-w-none text-ink font-sans mb-[24px]">
            <p className="text-[14.5px] leading-relaxed text-muted mb-4">
              Once a topic is submitted, the engine enters the configuration phase. You can define the depth, audience, and output language. 
            </p>

            <div className="bg-card border border-line rounded-[12px] p-[20px] mb-[24px]">
              <h4 className="font-semibold text-[15px] mb-[12px] flex items-center gap-[8px]">
                <Terminal size={16} className="text-muted-2" /> Research Depth Tiers
              </h4>
              <ul className="flex flex-col gap-[12px] text-[13.5px]">
                <li className="flex items-start gap-[10px]">
                  <CheckCircle2 size={16} className="text-verified mt-[2px] shrink-0" />
                  <div><strong className="text-ink">Quick (3–5 queries):</strong> Best for news synthesis and rapid fact-checking. Takes ~10 seconds.</div>
                </li>
                <li className="flex items-start gap-[10px]">
                  <CheckCircle2 size={16} className="text-verified mt-[2px] shrink-0" />
                  <div><strong className="text-ink">Standard (8–12 queries):</strong> Multi-vector search with competing hypothesis generation. Takes ~25 seconds.</div>
                </li>
                <li className="flex items-start gap-[10px]">
                  <CheckCircle2 size={16} className="text-verified mt-[2px] shrink-0" />
                  <div><strong className="text-ink">Deep (Full Audit):</strong> Includes contrarian queries, community forum signals, and deep tech-spec extraction. Takes ~45 seconds.</div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: Creator Studio */}
        <section id="creator-studio" className="mb-[60px] scroll-mt-[100px]">
          <SectionHeader icon={<MonitorPlay className="text-citation" />} title="Creator Studio & Production" />
          
          <div className="prose prose-sm max-w-none text-ink font-sans mb-[24px]">
            <p className="text-[14.5px] leading-relaxed text-muted mb-4">
              The Creator Studio translates raw research into production-ready assets. It generates scripts, storyboards, and B-Roll shot lists optimized for retention.
            </p>
            
            <Card className="mb-[20px] p-5">
              <div className="font-mono text-[10.5px] tracking-[0.5px] uppercase text-muted-2 mb-[10px]">Key Features</div>
              <div className="space-y-[16px]">
                <div>
                  <h5 className="font-semibold text-[14px] text-ink mb-[4px]">Dynamic Matrices</h5>
                  <p className="text-[13px] text-muted leading-relaxed">Generate variations of your hook and content tailored for YouTube Long Form, Shorts, or Podcasts instantly.</p>
                </div>
                <hr className="border-line-soft" />
                <div>
                  <h5 className="font-semibold text-[14px] text-ink mb-[4px]">Integrated Teleprompter</h5>
                  <p className="text-[13px] text-muted leading-relaxed">Click the "🎙 Teleprompter" button on any script to open a distraction-free, scrolling view optimized for recording.</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* SECTION 4: Quality Gates */}
        <section id="quality-gates" className="mb-[60px] scroll-mt-[100px]">
          <SectionHeader icon={<ShieldCheck className="text-citation" />} title="Quality Gates & Fact Checking" />
          
          <div className="prose prose-sm max-w-none text-ink font-sans mb-[24px]">
            <p className="text-[14.5px] leading-relaxed text-muted mb-4">
              We never let hallucinated claims reach your audience. The Quality Gate system runs a multi-pass audit on every generated claim against the underlying verified evidence sources.
            </p>

            <div className="flex flex-col gap-[12px]">
              <div className="flex gap-[16px] p-[16px] bg-verified-bg/40 border border-verified/20 rounded-[12px]">
                <div className="w-[36px] h-[36px] bg-verified text-white rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h5 className="font-semibold text-[14.5px] text-ink mb-[4px]">Multi-Source Verification</h5>
                  <p className="text-[13px] text-muted">Claims must be corroborated by at least 2 independent primary sources before being marked as Verified.</p>
                </div>
              </div>

              <div className="flex gap-[16px] p-[16px] bg-warning-bg/40 border border-warning/20 rounded-[12px]">
                <div className="w-[36px] h-[36px] bg-warning text-white rounded-full flex items-center justify-center shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <h5 className="font-semibold text-[14.5px] text-ink mb-[4px]">Contradiction Detection</h5>
                  <p className="text-[13px] text-muted">If a spec sheet says 120Hz but a reviewer says 60Hz, the system flags a "Critical Contradiction" for manual review.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Publishing */}
        <section id="publishing" className="mb-[80px] scroll-mt-[100px]">
          <SectionHeader icon={<Share2 className="text-citation" />} title="Publishing Engine" />
          
          <div className="prose prose-sm max-w-none text-ink font-sans mb-[24px]">
            <p className="text-[14.5px] leading-relaxed text-muted mb-4">
              Once content passes the Quality Gate, it can be staged and distributed. The orchestration engine handles packaging for specific platforms.
            </p>

            <div className="bg-ink text-paper rounded-[16px] p-[24px] mb-[24px] relative overflow-hidden group">
              <div className="relative z-10">
                <div className="font-mono text-[11px] text-white/50 tracking-[0.5px] mb-1.5 uppercase">
                  End-to-End Delivery
                </div>
                <h3 className="font-serif font-semibold text-[22px] mb-[12px]">From Script to Schedule</h3>
                <p className="text-[13.5px] text-white/65 mb-[20px] max-w-[400px] leading-relaxed">
                  Export timelines directly to Final Cut Pro (FCPXML) or schedule descriptions and chapters straight to the YouTube Data API.
                </p>
                <Button variant="light">
                  View Publishing Integrations <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-1/4 translate-y-1/4">
                <Share2 size={180} />
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

// Subcomponents

function SidebarLink({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-[12px] px-[12px] py-[8px] rounded-[8px] text-[13.5px] font-semibold transition-all duration-150 cursor-pointer w-full text-left
        ${isActive ? 'bg-citation-bg text-citation' : 'text-muted hover:bg-card hover:text-ink'}`}
    >
      <span className={isActive ? 'text-citation' : 'text-muted-2'}>{icon}</span>
      {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-[14px] mb-[24px] border-b border-line pb-[16px]">
      <div className="w-[38px] h-[38px] rounded-[10px] bg-card border border-line flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h2 className="font-serif font-semibold text-[26px] m-0 text-ink">{title}</h2>
    </div>
  );
}

function InfoCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-line-soft rounded-[12px] p-[20px] shadow-sm hover:border-line hover:shadow-md transition-all duration-200">
      <div className="w-[32px] h-[32px] rounded-[8px] bg-paper border border-line flex items-center justify-center mb-[14px]">
        {icon}
      </div>
      <h4 className="font-semibold text-[14.5px] text-ink mb-[6px]">{title}</h4>
      <p className="text-[13px] text-muted leading-relaxed m-0">{desc}</p>
    </div>
  );
}
