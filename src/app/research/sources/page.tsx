"use client";

import Link from "next/link";
import { ShieldCheck, Globe, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function SourceTrustIntelligencePage() {
  const sources = [
    { name: "AnandTech Hardware Reviews", trustScore: 98, primaryProximity: "PRIMARY", totalCitations: 42 },
    { name: "Geekbench Benchmark Database", trustScore: 95, primaryProximity: "PRIMARY", totalCitations: 88 },
    { name: "Qualcomm Official Press Room", trustScore: 99, primaryProximity: "PRIMARY", totalCitations: 104 },
    { name: "TechPowerUp Tech Specs", trustScore: 92, primaryProximity: "SECONDARY", totalCitations: 19 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 font-sans">
      {/* Back Link */}
      <Link href="/research/history" className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Research History
      </Link>

      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">EXPLAINABLE PRIMARY SOURCE AUTHORITY & CITATION STABILITY</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <Globe className="w-7 h-7 text-indigo-400" />
          Source Trust Intelligence Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Audit primary source authority scores, historical reliability, and citation frequency.</p>
      </div>

      <div className="slate-card overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs font-sans text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-850 uppercase">
            <tr>
              <th className="p-3">Source Domain / Name</th>
              <th className="p-3">Primary Proximity</th>
              <th className="p-3">Trust Score</th>
              <th className="p-3">Citations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {sources.map((s, i) => (
              <tr key={i} className="hover:bg-slate-900/50">
                <td className="p-3 font-semibold text-slate-100 font-mono">{s.name}</td>
                <td className="p-3 font-mono text-indigo-300">{s.primaryProximity}</td>
                <td className="p-3 font-mono text-emerald-400 font-bold">{s.trustScore} / 100</td>
                <td className="p-3 font-mono text-slate-400">{s.totalCitations} citations</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
