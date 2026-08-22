"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Globe, ArrowLeft, ExternalLink, Info, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const initialSources = [
  { name: "AnandTech Hardware Reviews", trustScore: 98, primaryProximity: "PRIMARY", totalCitations: 42, url: "https://www.anandtech.com" },
  { name: "Geekbench Benchmark Database", trustScore: 95, primaryProximity: "PRIMARY", totalCitations: 88, url: "https://browser.geekbench.com" },
  { name: "Qualcomm Official Press Room", trustScore: 99, primaryProximity: "PRIMARY", totalCitations: 104, url: "https://www.qualcomm.com/news" },
  { name: "TechPowerUp Tech Specs", trustScore: 92, primaryProximity: "SECONDARY", totalCitations: 19, url: "https://www.techpowerup.com" },
  { name: "Tom's Hardware Lab Tests", trustScore: 94, primaryProximity: "PRIMARY", totalCitations: 67, url: "https://www.tomshardware.com" },
  { name: "Reddit (r/hardware)", trustScore: 45, primaryProximity: "TERTIARY", totalCitations: 12, url: "https://www.reddit.com/r/hardware" },
];

export default function SourceTrustIntelligencePage() {
  const [sources, setSources] = useState(initialSources);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal Form State
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newProximity, setNewProximity] = useState("PRIMARY");
  const [newTrustScore, setNewTrustScore] = useState("");
  const [newCitations, setNewCitations] = useState("");

  const getTooltip = (proximity: string) => {
    switch(proximity) {
      case "PRIMARY": return "Direct first-hand evidence, official OEM documentation, or verified lab benchmarks.";
      case "SECONDARY": return "Aggregated tech reports, reputable news articles, or secondary analysis of primary sources.";
      case "TERTIARY": return "Community discussions, forums, social media, or unverified user claims.";
      default: return "";
    }
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const newSource = {
      name: newName.trim(),
      url: newUrl.startsWith("http") ? newUrl.trim() : `https://${newUrl.trim()}`,
      primaryProximity: newProximity,
      trustScore: parseInt(newTrustScore) || 50,
      totalCitations: parseInt(newCitations) || 0
    };

    setSources([...sources, newSource]);
    setIsModalOpen(false);
    
    // Reset Form
    setNewName("");
    setNewUrl("");
    setNewProximity("PRIMARY");
    setNewTrustScore("");
    setNewCitations("");
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto py-2 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            SOURCE GOVERNANCE & AUTHORITY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-[#0071e3]" />
            Source Trust Intelligence Center
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
            Audit primary source authority scores, historical reliability, and citation frequency across all active research projects.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold px-5 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-sm shadow-[#0071e3]/20 transition-all shrink-0 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> <span>Add Custom Source</span>
        </button>
      </div>

      {/* Table Card (Bento Style) */}
      <div className="bg-white border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap min-w-[800px]">
            <thead className="bg-[#fbfbfd] border-b border-[#e5e5ea]">
              <tr>
                <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-[#8e8e93] tracking-wider">Source Domain / Name</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-[#8e8e93] tracking-wider">Primary Proximity</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-[#8e8e93] tracking-wider">Trust Score</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-[#8e8e93] tracking-wider">Citations</th>
                <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-[#8e8e93] tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f5f7]">
              {sources.map((s, i) => (
                <tr key={i} className="hover:bg-[#fbfbfd] transition group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center font-bold text-[#1d1d1f] text-sm uppercase shrink-0 group-hover:border-[#0071e3]/40 group-hover:text-[#0071e3] transition-colors shadow-2xs">
                        {s.name.charAt(0)}
                      </div>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex flex-col cursor-pointer">
                        <span className="font-bold text-sm text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors truncate max-w-[280px]">{s.name}</span>
                        <span className="text-[11px] font-mono font-medium text-[#8e8e93] mt-0.5">{s.url.replace('https://www.', '').replace('https://', '')}</span>
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative group/tooltip inline-block cursor-help">
                      <Badge 
                        variant={s.primaryProximity === "PRIMARY" ? "default" : s.primaryProximity === "SECONDARY" ? "info" : "warning"}
                        size="sm"
                      >
                        {s.primaryProximity} <Info className="w-3 h-3 opacity-70 ml-1 inline" />
                      </Badge>

                      {/* Tooltip Content */}
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 z-[100] animate-in fade-in slide-in-from-bottom-1 duration-150">
                        <div className="bg-[#1d1d1f] text-white text-[11px] font-medium p-3 rounded-2xl shadow-xl border border-[#3a3a3c] leading-relaxed whitespace-normal relative">
                          {getTooltip(s.primaryProximity)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
                      <ShieldCheck className={`w-4 h-4 ${s.trustScore >= 90 ? 'text-[#34c759]' : s.trustScore >= 70 ? 'text-[#0071e3]' : 'text-[#ff9500]'}`} />
                      <span className="text-[#1d1d1f]">{s.trustScore}</span>
                      <span className="text-[#8e8e93] text-[10px]">/ 100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[#1d1d1f] font-bold text-xs">{s.totalCitations} <span className="text-[#8e8e93] text-[11px] font-sans font-medium">citations</span></span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={s.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Open source link in new tab"
                      className="w-7 h-7 inline-flex items-center justify-center rounded-full border border-[#e5e5ea] text-[#6e6e73] hover:text-[#0071e3] hover:bg-[#f5f5f7] transition-all shadow-2xs bg-white cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Source Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-[#e5e5ea] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#e5e5ea] flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1d1d1f]">Add Custom Source</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-7 h-7 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#8e8e93] hover:text-[#1d1d1f]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddSource} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Source Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. AnandTech" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Domain URL *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. anandtech.com" 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Primary Proximity</label>
                  <select 
                    value={newProximity}
                    onChange={(e) => setNewProximity(e.target.value)}
                    className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-3 py-2 text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] cursor-pointer"
                  >
                    <option value="PRIMARY">PRIMARY</option>
                    <option value="SECONDARY">SECONDARY</option>
                    <option value="TERTIARY">TERTIARY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Trust Score (0-100)</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    placeholder="e.g. 95" 
                    value={newTrustScore}
                    onChange={(e) => setNewTrustScore(e.target.value)}
                    className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-3 py-2 text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1">Initial Citations Count</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="e.g. 42" 
                  value={newCitations}
                  onChange={(e) => setNewCitations(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-4 py-2 text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#e5e5ea]">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#6e6e73] hover:bg-[#f5f5f7]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] shadow-sm transition active:scale-95"
                >
                  Add Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
