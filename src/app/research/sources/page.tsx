"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Globe, ArrowLeft, ExternalLink, Info, Plus, X } from "lucide-react";

type Source = {
  name: string;
  trustScore: number;
  primaryProximity: string;
  totalCitations: number;
  url: string;
};

export default function SourceTrustIntelligencePage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newProximity, setNewProximity] = useState("PRIMARY");
  const [newTrustScore, setNewTrustScore] = useState("");
  const [newCitations, setNewCitations] = useState("");

  const getTooltip = (proximity: string) => {
    switch (proximity) {
      case "PRIMARY":
        return "Direct first-hand evidence, official OEM documentation, or verified lab benchmarks.";
      case "SECONDARY":
        return "Aggregated tech reports, reputable news articles, or secondary analysis of primary sources.";
      case "TERTIARY":
        return "Community discussions, forums, social media, or unverified user claims.";
      default:
        return "";
    }
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const newSource: Source = {
      name: newName,
      url: newUrl.startsWith("http") ? newUrl : `https://${newUrl}`,
      primaryProximity: newProximity,
      trustScore: parseInt(newTrustScore) || 50,
      totalCitations: parseInt(newCitations) || 0,
    };

    setSources([...sources, newSource]);
    setIsModalOpen(false);

    setNewName("");
    setNewUrl("");
    setNewProximity("PRIMARY");
    setNewTrustScore("");
    setNewCitations("");
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-sans">
      {/* Back Link */}
      <Link
        href="/research/history"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-2 hover:text-ink transition bg-card border border-line-soft px-4 py-2 rounded-full"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Research History
      </Link>

      {/* Header */}
      <div className="pb-4 pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-citation text-white flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            Source Trust Reference
          </h1>
          <p className="text-sm text-muted font-medium max-w-2xl leading-relaxed">
            Keep a personal reference list of sources you trust and how close each one sits to primary
            evidence. This list is a scoring guide for your own review — it does not change what a
            research run retrieves.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-citation hover:opacity-90 text-white text-sm font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Source
        </button>
      </div>

      {sources.length === 0 ? (
        <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center space-y-3">
          <Globe className="w-10 h-10 text-muted-2 mx-auto" />
          <h3 className="text-base font-bold text-ink font-serif">No sources added yet</h3>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Add the outlets, benchmark databases, and official press rooms you rely on, and tag how
            close each is to primary evidence. Your entries stay on this page.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-citation hover:opacity-90 text-white px-4 py-2 rounded-full text-xs font-semibold transition"
          >
            <Plus className="w-4 h-4" /> Add your first source
          </button>
        </div>
      ) : (
        <div className="bg-card border border-line-soft shadow-card rounded-2xl relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
              <thead className="bg-paper border-b border-line-soft">
                <tr>
                  <th className="px-8 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest rounded-tl-2xl">
                    Source Domain / Name
                  </th>
                  <th className="px-6 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest">
                    Primary Proximity
                  </th>
                  <th className="px-6 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest">
                    Trust Score
                  </th>
                  <th className="px-6 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest">
                    Citations
                  </th>
                  <th className="px-8 py-5 font-mono text-[10px] uppercase font-bold text-muted-2 tracking-widest text-right rounded-tr-2xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {sources.map((s, i) => (
                  <tr key={i} className="hover:bg-paper/60 transition group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[9px] bg-paper border border-line-soft flex items-center justify-center font-extrabold text-muted-2 text-lg uppercase shrink-0 group-hover:bg-citation-bg group-hover:text-citation group-hover:border-citation/30 transition-colors">
                          {s.name.charAt(0)}
                        </div>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col cursor-pointer"
                        >
                          <span className="font-extrabold text-ink group-hover:text-citation transition truncate max-w-[250px] sm:max-w-sm">
                            {s.name}
                          </span>
                          <span className="text-[11px] font-mono font-medium text-muted-2 mt-0.5 group-hover:text-citation">
                            {s.url.replace("https://www.", "").replace("https://", "")}
                          </span>
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative group/tooltip inline-block cursor-help">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase transition-colors border ${
                            s.primaryProximity === "PRIMARY"
                              ? "bg-verified-bg text-verified border-verified/25"
                              : s.primaryProximity === "SECONDARY"
                              ? "bg-citation-bg text-citation border-citation/25"
                              : "bg-warning-bg text-warning border-warning/25"
                          }`}
                        >
                          {s.primaryProximity}
                          <Info className="w-3 h-3 opacity-70 inline-block ml-1 -mt-0.5" />
                        </span>

                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 z-[100]">
                          <div className="bg-card text-ink text-[11px] font-medium p-3 rounded-[9px] shadow-pop border border-line-soft leading-relaxed whitespace-normal relative">
                            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-card border-b border-r border-line-soft rotate-45"></div>
                            {getTooltip(s.primaryProximity)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck
                          className={`w-4 h-4 ${
                            s.trustScore >= 90
                              ? "text-verified"
                              : s.trustScore >= 70
                              ? "text-citation"
                              : "text-warning"
                          }`}
                        />
                        <span className="font-mono font-bold text-ink">
                          {s.trustScore}{" "}
                          <span className="text-muted-2 text-[10px] font-semibold">/ 100</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-mono text-ink font-extrabold">
                        {s.totalCitations}{" "}
                        <span className="text-muted-2 text-xs font-sans font-medium">citations</span>
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open source link in new tab"
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-line-soft text-muted-2 hover:text-ink hover:bg-paper transition-colors bg-card"
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
      )}

      {/* Add Source Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-pop border border-line-soft w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-line-soft flex items-center justify-between bg-paper">
              <h2 className="text-lg font-extrabold text-ink">Add Source</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-2 hover:text-ink p-1 rounded-full hover:bg-line-soft transition"
              >
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
                    className="w-full border border-line rounded-[9px] px-4 py-2.5 text-sm font-medium text-ink bg-card focus:outline-none focus:border-citation focus:ring-4 focus:ring-citation/10 transition-all placeholder:text-muted-2"
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
                    className="w-full border border-line rounded-[9px] px-4 py-2.5 text-sm font-medium text-ink bg-card focus:outline-none focus:border-citation focus:ring-4 focus:ring-citation/10 transition-all placeholder:text-muted-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">Primary Proximity</label>
                    <select
                      value={newProximity}
                      onChange={(e) => setNewProximity(e.target.value)}
                      className="w-full border border-line rounded-[9px] px-4 py-2.5 text-sm font-bold text-ink focus:outline-none focus:border-citation focus:ring-4 focus:ring-citation/10 transition-all bg-card"
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
                      min="0"
                      max="100"
                      placeholder="e.g. 95"
                      value={newTrustScore}
                      onChange={(e) => setNewTrustScore(e.target.value)}
                      className="w-full border border-line rounded-[9px] px-4 py-2.5 text-sm font-medium text-ink bg-card focus:outline-none focus:border-citation focus:ring-4 focus:ring-citation/10 transition-all placeholder:text-muted-2"
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
                    className="w-full border border-line rounded-[9px] px-4 py-2.5 text-sm font-medium text-ink bg-card focus:outline-none focus:border-citation focus:ring-4 focus:ring-citation/10 transition-all placeholder:text-muted-2"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-[9px] text-sm font-bold text-muted-2 hover:text-ink hover:bg-paper transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-[9px] text-sm font-bold text-white bg-citation hover:opacity-90 transition-colors active:scale-95 flex items-center gap-2"
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
