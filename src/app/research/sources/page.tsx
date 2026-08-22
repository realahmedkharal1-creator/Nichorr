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
      <Link href="/research/history" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition bg-white border border-slate-200/90 shadow-sm shadow-slate-200/70 px-4 py-2 rounded-full">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Research History
      </Link>

      {/* Header */}
      <div className="pb-4 pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-mono font-semibold tracking-tight text-slate-900 flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-slate-200/70">
               <Globe className="w-5 h-5" />
            </div>
            Source Trust Intelligence Center
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Audit primary source authority scores, historical reliability, and citation frequency across all active research projects.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-slate-200/70 transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Custom Source
        </button>
      </div>

      {/* Table Card (Bento Style) */}
      <div className="bg-white border border-slate-200/90 shadow-sm shadow-slate-200/70 rounded-[24px] relative">
        <div className="overflow-x-auto sm:overflow-x-visible">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-slate-50/50 border-b border-slate-200/90">
              <tr>
                <th className="px-8 py-5 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest rounded-tl-[24px]">Source Domain / Name</th>
                <th className="px-6 py-5 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest">Primary Proximity</th>
                <th className="px-6 py-5 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest">Trust Score</th>
                <th className="px-6 py-5 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest">Citations</th>
                <th className="px-8 py-5 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right rounded-tr-[24px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {/* Avatar Bubble */}
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-extrabold text-slate-500 text-lg uppercase shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors shadow-sm">
                        {s.name.charAt(0)}
                      </div>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex flex-col cursor-pointer">
                        <span className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition truncate max-w-[250px] sm:max-w-sm">{s.name}</span>
                        <span className="text-[11px] font-mono font-medium text-slate-500 mt-0.5 group-hover:text-indigo-600">{s.url.replace('https://www.', '').replace('https://', '')}</span>
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="relative group/tooltip inline-block cursor-help">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase transition-colors ${
                        s.primaryProximity === 'PRIMARY' 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100' 
                          : s.primaryProximity === 'SECONDARY'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      }`}>
                        {s.primaryProximity} <Info className={`w-3 h-3 opacity-70 inline-block ml-1 -mt-0.5 ${
                          s.primaryProximity === 'PRIMARY' ? 'text-indigo-500' : s.primaryProximity === 'SECONDARY' ? 'text-blue-500' : 'text-amber-500'
                        }`} />
                      </span>

                      {/* Tooltip Content Container */}
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 z-[100] animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <div className="bg-white text-slate-900 text-[11px] font-medium p-3 rounded-xl shadow-xl border border-slate-200 leading-relaxed whitespace-normal relative">
                          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45"></div>
                          {getTooltip(s.primaryProximity)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${s.trustScore >= 90 ? 'text-emerald-500' : s.trustScore >= 70 ? 'text-blue-500' : 'text-amber-500'}`} />
                      <span className="font-mono font-bold text-slate-700">{s.trustScore} <span className="text-slate-500 text-[10px] font-semibold">/ 100</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-slate-800 font-extrabold">{s.totalCitations} <span className="text-slate-500 text-xs font-sans font-medium">citations</span></span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <a 
                      href={s.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Open source link in new tab"
                      className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm bg-white"
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
          <div className="bg-white rounded-[24px] shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-extrabold text-slate-900">Add Custom Source</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSource} className="p-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Source Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. AnandTech" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border-2 border-indigo-200/80 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Domain URL *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. anandtech.com" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full border-2 border-indigo-200/80 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Proximity</label>
                    <select 
                      value={newProximity}
                      onChange={(e) => setNewProximity(e.target.value)}
                      className="w-full border-2 border-indigo-200/80 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-white"
                    >
                      <option value="PRIMARY">PRIMARY</option>
                      <option value="SECONDARY">SECONDARY</option>
                      <option value="TERTIARY">TERTIARY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Trust Score (0-100)</label>
                    <input 
                      type="number" 
                      min="0" max="100"
                      placeholder="e.g. 95" 
                      value={newTrustScore}
                      onChange={(e) => setNewTrustScore(e.target.value)}
                      className="w-full border-2 border-indigo-200/80 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Initial Citations Count</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="e.g. 42" 
                    value={newCitations}
                    onChange={(e) => setNewCitations(e.target.value)}
                    className="w-full border-2 border-indigo-200/80 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors active:scale-95 flex items-center gap-2"
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
