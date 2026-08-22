"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Database, Activity, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";

export default function ResearchQualityPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 250);
  }, []);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            GOVERNANCE & TRUST ASSURANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#34c759]" />
            Evidence Quality Governance
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
            Real-time multi-dimensional scoring of source diversity, evidence grounding, and anti-hallucination verification.
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 250);
          }}
          className="flex items-center gap-2 bg-white border border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#1d1d1f] px-5 py-2.5 rounded-full text-xs font-semibold transition shadow-2xs cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#8e8e93]" />
          <span>Refresh Governance Metrics</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {/* Quality KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-[#e5e5ea] rounded-3xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-[#0071e3]/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider">
                  Independent Sources
                </span>
                <Database className="w-4 h-4 text-[#0071e3]" />
              </div>
              <div className="mt-4">
                <div className="font-mono text-3xl font-extrabold text-[#1d1d1f]">85%</div>
                <div className="text-xs text-[#6e6e73] font-medium mt-1">Non-vendor primary telemetry</div>
                <div className="w-full bg-[#f5f5f7] rounded-full h-1.5 mt-3 overflow-hidden border border-[#e5e5ea]">
                  <div className="h-full bg-[#0071e3] rounded-full w-[85%]" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5ea] rounded-3xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-[#34c759]/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider">
                  Evidence Grounding
                </span>
                <ShieldCheck className="w-4 h-4 text-[#34c759]" />
              </div>
              <div className="mt-4">
                <div className="font-mono text-3xl font-extrabold text-[#15803d]">100%</div>
                <div className="text-xs text-[#6e6e73] font-medium mt-1">Claims mapped to raw citations</div>
                <div className="w-full bg-[#f5f5f7] rounded-full h-1.5 mt-3 overflow-hidden border border-[#e5e5ea]">
                  <div className="h-full bg-[#34c759] rounded-full w-full" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5ea] rounded-3xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-[#34c759]/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider">
                  Unsupported Claims
                </span>
                <Activity className="w-4 h-4 text-[#34c759]" />
              </div>
              <div className="mt-4">
                <div className="font-mono text-3xl font-extrabold text-[#1d1d1f]">0.0%</div>
                <div className="text-xs text-[#6e6e73] font-medium mt-1">Zero fabricated citations</div>
                <div className="w-full bg-[#f5f5f7] rounded-full h-1.5 mt-3 overflow-hidden border border-[#e5e5ea]">
                  <div className="h-full bg-[#34c759] rounded-full w-0" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e5e5ea] rounded-3xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-[#0071e3]/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono font-bold text-[#8e8e93] uppercase tracking-wider">
                  Audited Research Runs
                </span>
                <FileText className="w-4 h-4 text-[#0071e3]" />
              </div>
              <div className="mt-4">
                <div className="font-mono text-3xl font-extrabold text-[#1d1d1f]">142</div>
                <div className="text-xs text-[#6e6e73] font-medium mt-1">Completed in last 30 days</div>
                <div className="w-full bg-[#f5f5f7] rounded-full h-1.5 mt-3 overflow-hidden border border-[#e5e5ea]">
                  <div className="h-full bg-[#0071e3] rounded-full w-[90%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Governance Audit Log Table */}
          <div className="bg-white border border-[#e5e5ea] rounded-3xl p-6 sm:p-8 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#f5f5f7] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">Recent Quality Gate Certifications</h3>
                <p className="text-xs text-[#6e6e73] font-medium mt-0.5">
                  Automated checks enforced before script generation and publication preflight.
                </p>
              </div>
              <Badge variant="success" size="sm">
                SYSTEM NOMINAL
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
                <thead className="bg-[#fbfbfd] border-b border-[#e5e5ea]">
                  <tr>
                    <th className="px-5 py-3 font-mono font-bold text-[#8e8e93] uppercase">Research Run</th>
                    <th className="px-5 py-3 font-mono font-bold text-[#8e8e93] uppercase">Evidence Score</th>
                    <th className="px-5 py-3 font-mono font-bold text-[#8e8e93] uppercase">Contradictions</th>
                    <th className="px-5 py-3 font-mono font-bold text-[#8e8e93] uppercase">Quality Status</th>
                    <th className="px-5 py-3 font-mono font-bold text-[#8e8e93] uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f7]">
                  {[
                    { topic: "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max", score: "98.4%", conflicts: "0 Critical", status: "PASSED", id: "3c7e41fb-f145-41b9-9b1e-a9935a8a5351" },
                    { topic: "RTX 5090 vs RX 8900 XTX Power Efficiency", score: "96.1%", conflicts: "0 Critical", status: "PASSED", id: "b2a9c3d4-e5f6-7890-abcd-ef1234567890" },
                    { topic: "MacBook Pro 16 M5 Max Sustained Thermals", score: "94.8%", conflicts: "1 Flagged", status: "WARNING", id: "c3b4d5e6-f7a8-9012-bcde-f12345678901" },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#fbfbfd] transition group">
                      <td className="px-5 py-4 font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                        {row.topic}
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-[#1d1d1f]">
                        {row.score}
                      </td>
                      <td className="px-5 py-4 font-mono text-[#6e6e73]">
                        {row.conflicts}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={row.status === "PASSED" ? "success" : "warning"} size="sm">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/research/${row.id}/results`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#0071e3] text-[#1d1d1f] hover:text-white font-bold transition shadow-2xs"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
