"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Network, Database, ShieldCheck, Share2, Layers, ArrowLeft, RefreshCw, Filter } from "lucide-react";
import { KGNodeEntity, KGEdgeEntity } from "@/lib/database/repositories/knowledge-graph.repo";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function KnowledgeGraphExplorerPage({ params }: { params: { id: string } }) {
  const [nodes, setNodes] = useState<KGNodeEntity[]>([]);
  const [edges, setEdges] = useState<KGEdgeEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("ALL");

  useEffect(() => {
    fetchGraphData();
  }, [params.id]);

  const fetchGraphData = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}/graph`);
      const data = await res.json();
      if (data.success) {
        setNodes(data.graph.nodes || []);
        setEdges(data.graph.edges || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredNodes = selectedType === "ALL" ? nodes : nodes.filter((n) => n.node_type === selectedType);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4 font-sans">
      {/* Back Button */}
      <Link href={`/projects/${params.id}`} className="text-xs font-mono text-slate-500 hover:text-slate-700 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Project Command Center
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">EVIDENCE GRAPH VISUALIZER</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Network className="w-7 h-7 text-indigo-600" />
            Knowledge Graph Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Trace relational links between Research Runs, Sources, Evidence Excerpts, Verified Claims, and Content Items.</p>
        </div>

        <button
          onClick={fetchGraphData}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className="w-4 h-4 text-indigo-600" /> Reload Graph
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-4 bg-white border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Filter className="w-4 h-4 text-indigo-600" /> Filter Node Type:
        </div>
        <div className="flex flex-wrap gap-2">
          {["ALL", "KNOWLEDGE", "CLAIM", "SOURCE", "EVIDENCE", "CONTENT"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition ${
                selectedType === type
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-slate-50 text-slate-500 hover:text-slate-700 border border-slate-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Visualizer Sandbox */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-8 bg-slate-50 border-slate-200 min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden space-y-4">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        <Network className="w-12 h-12 text-indigo-500/40 relative z-10" />

        <div className="text-center relative z-10 space-y-1">
          <h3 className="text-base font-bold text-slate-900">Interactive Relational Graph Mesh</h3>
          <p className="text-xs text-slate-500 max-w-md">Displaying {filteredNodes.length} active Graph Nodes and {edges.length} Relational Claims Edges in this project workspace.</p>
        </div>

        {/* Node Badges */}
        <div className="flex flex-wrap justify-center gap-2 relative z-10 max-w-xl">
          {filteredNodes.map((n) => (
            <span key={n.id} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <strong className="text-indigo-600">[{n.node_type}]</strong> {n.label}
            </span>
          ))}
        </div>
      </div>

      {/* Graph Node Table Fallback for Accessibility */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Knowledge Graph Nodes List</h2>

        {loading ? (
          <SkeletonCard />
        ) : filteredNodes.length === 0 ? (
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-8 text-center text-slate-500 italic text-xs">
            No knowledge graph nodes found for selected filter.
          </div>
        ) : (
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden border border-slate-200">
            <table className="w-full text-left text-xs font-sans text-slate-700">
              <thead className="bg-white text-slate-500 font-mono border-b border-slate-100 uppercase">
                <tr>
                  <th className="p-3">Node Label</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Relationships</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredNodes.map((n) => (
                  <tr key={n.id} className="hover:bg-white">
                    <td className="p-3 font-semibold text-slate-900">{n.label}</td>
                    <td className="p-3 font-mono text-indigo-600">{n.node_type}</td>
                    <td className="p-3 font-mono text-slate-500">
                      {edges.filter((e) => e.source_node_id === n.id || e.target_node_id === n.id).length} Connected Edges
                    </td>
                    <td className="p-3 font-mono text-slate-500">{n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
