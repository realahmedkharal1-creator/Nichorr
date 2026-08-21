"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft, Terminal, ShieldCheck, Copy, Check } from "lucide-react";

export default function DeveloperDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link href="/developers" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition bg-white border border-slate-200/90 shadow-sm shadow-slate-200/70 px-4 py-2 rounded-full">
        <ArrowLeft className="w-3.5 h-3.5" /> Developer Portal
      </Link>

      {/* Header */}
      <div className="pb-6 pt-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-slate-200/70">
            <Terminal className="w-6 h-6" />
          </div>
          Interactive API Reference
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-3 max-w-2xl leading-relaxed">Versioned public REST endpoints preserving provenance, epistemic certainty metadata, and RBAC scope guards.</p>
      </div>

      <div className="space-y-6">
        
        {/* Endpoint 1 */}
        <div className="bg-white border border-slate-200/90 shadow-sm shadow-slate-200/70 rounded-2xl overflow-hidden">
          <div className="bg-slate-50/50 p-4 border-b border-slate-200/90 flex items-center justify-between">
            <div className="flex items-center gap-3 font-mono text-sm font-bold text-slate-900">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">GET</span>
              <span>/api/v1/knowledge/search</span>
            </div>
            <button 
              onClick={() => handleCopy('curl -X GET "https://api.veritastech.ai/v1/knowledge/search?q=M4%20iPad" -H "Authorization: Bearer YOUR_API_KEY"', 'search')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              {copiedId === 'search' ? (
                <><Check className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-emerald-600">Copied!</span></>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy</>
              )}
            </button>
          </div>
          <div className="p-6 space-y-4">
             <p className="text-sm text-slate-700 font-medium">Query knowledge claims with hybrid semantic and source authority ranking.</p>
             <div className="bg-white text-slate-700 font-mono text-xs p-4 rounded-xl shadow-inner border border-slate-200">
               <span className="text-indigo-600">curl</span> -X GET "https://api.veritastech.ai/v1/knowledge/search?q=M4%20iPad" \<br/>
               &nbsp;&nbsp;-H <span className="text-emerald-600">"Authorization: Bearer YOUR_API_KEY"</span>
             </div>
          </div>
        </div>

        {/* Endpoint 2 */}
        <div className="bg-white border border-slate-200/90 shadow-sm shadow-slate-200/70 rounded-2xl overflow-hidden">
          <div className="bg-slate-50/50 p-4 border-b border-slate-200/90 flex items-center justify-between">
            <div className="flex items-center gap-3 font-mono text-sm font-bold text-slate-900">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">POST</span>
              <span>/api/v1/knowledge/answer</span>
            </div>
            <button 
              onClick={() => handleCopy('curl -X POST "https://api.veritastech.ai/v1/knowledge/answer" -H "Content-Type: application/json" -d \'{"query":"Compare efficiency"}\'', 'answer')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              {copiedId === 'answer' ? (
                <><Check className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-emerald-600">Copied!</span></>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy</>
              )}
            </button>
          </div>
          <div className="p-6 space-y-4">
             <p className="text-sm text-slate-700 font-medium">Generate a grounded response strictly synthesized from isolated tech research contexts.</p>
             <div className="bg-white text-slate-700 font-mono text-xs p-4 rounded-xl shadow-inner border border-slate-200">
               <span className="text-indigo-600">curl</span> -X POST "https://api.veritastech.ai/v1/knowledge/answer" \<br/>
               &nbsp;&nbsp;-H <span className="text-emerald-600">"Authorization: Bearer YOUR_API_KEY"</span> \<br/>
               &nbsp;&nbsp;-H <span className="text-emerald-600">"Content-Type: application/json"</span> \<br/>
               &nbsp;&nbsp;-d '&#123;<span className="text-rose-600">"query"</span>: <span className="text-emerald-600">"Compare thermal efficiency"</span>&#125;'
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
