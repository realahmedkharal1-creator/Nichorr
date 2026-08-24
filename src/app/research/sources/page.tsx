"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Globe, ArrowLeft, ExternalLink, Info, Plus, X } from "lucide-react";

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
      name: newName,
      url: newUrl.startsWith("http") ? newUrl : `https://${newUrl}`,
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
    <div className="space-y-6 max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Back Link */}
      <Link href="/research/history" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-2 hover:text-slate-900 transition bg-card border border-line-soft   px-4 py-2 rounded-full">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Research History
      </Link>

      {/* Header */}
      <div className="pb-4 pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-mono font-semibold tracking-tight text-ink flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-citation text-white flex items-center justify-center  ">
               <Globe className="w-5 h-5" />
            </div>
            Source Trust Intelligence Center
          </h1>
          <p className="text-sm text-muted-2 font-medium max-w-2xl leading-relaxed">
            Audit primary source authority scores, historical reliability, and citation frequency across all active research projects.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-citation hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2   transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Custom Source
        </button>
      </div>

      {/* Table Card (Bento Style) */}
      <div className="bg-card border border-line-soft   rounded-[24px] relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-paper border-b border-line-soft">
              <tr>
                <th className="px-8 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest rounded-tl-[24px]">Source Domain / Name</th>
                <th className="px-6 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest">Primary Proximity</th>
                <th className="px-6 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest">Trust Score</th>
                <th className="px-6 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest">Citations</th>
                <th className="px-8 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest text-right rounded-tr-[24px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {/* Avatar Bubble */}
                      <div className="w-10 h-10 rounded-[9px] bg-paper border border-line-soft flex items-center justify-center font-extrabold text-muted-2 text-lg uppercase shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors ">
                        {s.name.charAt(0)}
                      </div>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex flex-col cursor-pointer">
                        <span className="font-extrabold text-ink group-hover:text-indigo-600 transition truncate max-w-[250px] sm:max-w-sm">{s.name}</span>
                        <span className="text-[11px] font-mono font-medium text-muted-2 mt-0.5 group-hover:text-indigo-600">{s.url.replace('https://www.', '').replace('https://', '')}</span>
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="relative group/tooltip inline-block cursor-help">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase transition-colors ${
                        s.primaryProximity === 'PRIMARY' 
                          ? 'bg-citation-bg text-indigo-700 border border-citation hover:bg-indigo-100' 
                          : s.primaryProximity === 'SECONDARY'
                          ? 'bg-citation-bg text-citation border border-citation hover:bg-blue-100'
                          : 'bg-warning-bg text-amber-700 border border-warning hover:bg-amber-100'
                      }`}>
                        {s.primaryProximity} <Info className={`w-3 h-3 opacity-70 inline-block ml-1 -mt-0.5 ${
                          s.primaryProximity === 'PRIMARY' ? 'text-citation' : s.primaryProximity === 'SECONDARY' ? 'text-citation' : 'text-warning'
                        }`} />
                      </span>

                      {/* Tooltip Content Container */}
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 z-[100] animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <div className="bg-card text-ink text-[11px] font-medium p-3 rounded-[9px] shadow-xl border border-line-soft leading-relaxed whitespace-normal relative">
                          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-card border-b border-r border-line-soft rotate-45"></div>
                          {getTooltip(s.primaryProximity)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${s.trustScore >= 90 ? 'text-verified' : s.trustScore >= 70 ? 'text-citation' : 'text-warning'}`} />
                      <span className="font-mono font-bold text-ink">{s.trustScore} <span className="text-muted-2 text-[10px] font-semibold">/ 100</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-ink font-extrabold">{s.totalCitations} <span className="text-muted-2 text-xs font-sans font-medium">citations</span></span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <a 
                      href={s.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Open source link in new tab"
                      className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-line-soft text-muted-2 hover:text-slate-900 hover:bg-slate-100 transition-colors  bg-card"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-[24px]  border border-line-soft w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-line-soft flex items-center justify-between bg-paper">
              <h2 className="text-lg font-extrabold text-ink">Add Custom Source</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-2 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSource} className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">Source Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. AnandTech" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border-2 border-citation rounded-[9px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">Domain URL *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. anandtech.com" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full border-2 border-citation rounded-[9px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">Primary Proximity</label>
                    <select 
                      value={newProximity}
                      onChange={(e) => setNewProximity(e.target.value)}
                      className="w-full border-2 border-citation rounded-[9px] px-4 py-2.5 text-sm font-bold text-ink focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-card"
                    >
                      <option value="PRIMARY">PRIMARY</option>
                      <option value="SECONDARY">SECONDARY</option>
                      <option value="TERTIARY">TERTIARY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">Trust Score (0-100)</label>
                    <input 
                      type="number" 
                      min="0" max="100"
                      placeholder="e.g. 95" 
                      value={newTrustScore}
                      onChange={(e) => setNewTrustScore(e.target.value)}
                      className="w-full border-2 border-citation rounded-[9px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5">Initial Citations Count</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="e.g. 42" 
                    value={newCitations}
                    onChange={(e) => setNewCitations(e.target.value)}
                    className="w-full border-2 border-citation rounded-[9px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-[9px] text-sm font-bold text-conflict bg-conflict-bg hover:bg-rose-100 border border-conflict transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-[9px] text-sm font-bold text-white bg-citation hover:bg-indigo-700   transition-colors active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
