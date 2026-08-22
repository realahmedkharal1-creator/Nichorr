import os

file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_start_pills = content.find("{/* Primary Workflow Stepper Bar (Phases 70-77) */}")
idx_end_project = content.find("{/* TAB: SAFE EXECUTION PIPELINE (PHASE 78) */}")
if idx_end_project == -1:
    idx_end_project = content.find("{/* TAB:", content.find("{/* TAB: CREATOR PROJECT CONTROL CENTER (PHASE 77) */}") + 10)

print(f"Replacing from {idx_start_pills} to {idx_end_project}")

new_ui = """{/* NEW OVERHAULED PILL BAR */}
   <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide w-full whitespace-nowrap">
    {[
     { id: "project", label: "Project Control Center", icon: Network },
     { id: "matrix", label: "Production Matrix", icon: Layers },
     { id: "exportWorkspace", label: "Production Export", icon: Download },
     { id: "publishingOrchestrator", label: "Publishing Orchestrator", icon: Send },
     { id: "publicationIntegrity", label: "Publication Integrity", icon: ShieldCheck },
     { id: "researchCalibration", label: "Research Calibration", icon: Scale }
    ].map((tab) => {
     const isActive = activeTab === tab.id;
     const Icon = tab.icon;
     return (
      <button
       key={tab.id}
       onClick={() => setActiveTab(tab.id as any)}
       className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
        isActive 
         ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
         : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
       }`}
      >
       <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
       {tab.label}
      </button>
     );
    })}
   </div>

   {/* TAB: CREATOR PROJECT CONTROL CENTER */}
   {activeTab === "project" && (
    <div className="space-y-6">
     
     {/* 1. Header, Sub-Navigation & Controls */}
     <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
       <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-widest block mb-1">
        CREATOR PROJECT INTELLIGENCE WORKSPACE
       </span>
       <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
        <Network className="w-7 h-7 text-indigo-600" />
        Creator Project Control Center
       </h1>
       <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
        Unified asset dependency graph, end-to-end evidence integrity, non-bypassable blocker intelligence, and read-only impact simulation.
       </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
       {/* Script Mode Segments */}
       <div className="flex items-center gap-1 bg-white border border-slate-200/90 p-1 rounded-full shadow-sm">
        <span className="text-[10px] font-mono text-slate-500 font-bold ml-2 mr-1 uppercase">Mode:</span>
        {["Outline", "Script Ready", "Full Spoken"].map(mode => {
         const modeValue = mode.replace(" ", "_").toUpperCase();
         const isModeActive = outputMode === modeValue;
         return (
          <button
           key={mode}
           onClick={() => setOutputMode(modeValue as any)}
           className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all ${
            isModeActive 
             ? "bg-slate-900 text-white shadow-sm" 
             : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
           }`}
          >
           {mode}
          </button>
         );
        })}
       </div>

       {/* Target Duration Segments */}
       <div className="flex items-center gap-1 bg-white border border-slate-200/90 p-1 rounded-full shadow-sm">
        <span className="text-[10px] font-mono text-slate-500 font-bold ml-2 mr-1 uppercase flex items-center gap-1">
         <Clock className="w-3 h-3" /> Duration:
        </span>
        {[8, 12, 18].map(dur => (
         <button
          key={dur}
          onClick={() => setDuration(dur as any)}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all ${
           duration === dur 
            ? "bg-indigo-600 text-white shadow-sm" 
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
         >
          {dur}m
         </button>
        ))}
       </div>

       {/* Teleprompter Button */}
       <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-colors active:scale-95 shrink-0">
        <MonitorPlay className="w-3.5 h-3.5" />
        Teleprompter
       </button>
      </div>
     </div>

     {/* 2. Project Status & Metadata Hero Card */}
     <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform group-hover:scale-110"></div>
      
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
       <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
         <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          PROJECT STATUS: READY FOR PUBLISHING
         </span>
         <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
          Script v1.0
         </span>
        </div>
        
        <h2 className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
         {report?.topic || "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max"}
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 pt-2">
         <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-600">
          <span className="text-slate-400">Project Hash:</span>
          <span className="font-bold">0fc1ebed18dc...</span>
          <button className="ml-1 text-slate-400 hover:text-indigo-600"><Copy className="w-3.5 h-3.5" /></button>
         </div>
         <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-600">
          <span className="text-slate-400">Evidence Hash:</span>
          <span className="font-bold">ev-hash-ca32...</span>
          <button className="ml-1 text-slate-400 hover:text-indigo-600"><Copy className="w-3.5 h-3.5" /></button>
         </div>
         <div className="flex items-center gap-1.5 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700">
          <Network className="w-3.5 h-3.5" /> 19 Nodes
         </div>
         <div className="flex items-center gap-1.5 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700">
          <Share2 className="w-3.5 h-3.5" /> 17 Edges
         </div>
        </div>
       </div>

       <button className="bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all shrink-0">
        <RefreshCw className="w-4 h-4" />
        Refresh Project State
       </button>
      </div>
     </div>

     {/* 3. 5 Core Health KPI Cards */}
     <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {[
       { step: 1, title: "RESEARCH HEALTH", score: 29, subtitle: "Freshness & Validity", color: "amber" },
       { step: 2, title: "CONTENT QUALITY", score: 25, subtitle: "Evidence Grounding", color: "amber" },
       { step: 3, title: "PRODUCTION READINESS", score: 95, subtitle: "Cards & Outline Assets", color: "emerald" },
       { step: 4, title: "PUBLISHING PREFLIGHT", score: 100, subtitle: "Multi-Platform Checks", color: "emerald" },
       { step: 5, title: "DISTRIBUTION STAGING", score: 69, subtitle: "Staged Release Plans", color: "amber" }
      ].map(kpi => (
       <div key={kpi.step} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 group hover:border-slate-300 transition-colors">
        <div>
         <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
          {kpi.step}. {kpi.title}
         </span>
         <div className={`text-3xl font-extrabold tracking-tight ${
          kpi.color === 'emerald' ? 'text-emerald-600' : 'text-amber-600'
         }`}>
          {kpi.score}%
         </div>
         <p className="text-[11px] font-bold text-slate-500 mt-0.5">{kpi.subtitle}</p>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
         <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
           kpi.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
          }`} 
          style={{ width: `${kpi.score}%` }} 
         />
        </div>
       </div>
      ))}
     </div>

     {/* 4. End-to-End Pipeline Integrity (9 Stages 3x3 Bento Matrix) */}
     <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
       <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-600" />
        End-to-End Project Pipeline Integrity (9 Stages)
       </h3>
       <p className="text-xs text-slate-500 font-medium mt-1">
        Complete authority chain: Research → Evidence → Health → Decisions → Script → Quality → Production → Editor → Publishing → Distribution.
       </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {[
        { i: 1, title: "Research & Sources", status: "IN_PROGRESS", score: null },
        { i: 2, title: "Evidence Health", status: "READY", score: "29%" },
        { i: 3, title: "Health Decisions", status: "READY", score: null },
        { i: 4, title: "Script & Narration", status: "READY", score: null },
        { i: 5, title: "Quality Review", status: "WARNING", score: "25%" },
        { i: 6, title: "Production Assets", status: "READY", score: "95%" },
        { i: 7, title: "Publishing Preflight", status: "READY", score: "100%" },
        { i: 8, title: "Distribution & Release", status: "WARNING", score: "69%" },
        { i: 9, title: "Video Editor Sync", status: "READY", score: null }
       ].map(stage => (
        <div key={stage.i} className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/10 transition-all flex flex-col justify-between gap-6 group">
         <div className="flex items-start justify-between gap-2">
          <div>
           <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
            STAGE {stage.i}
           </span>
           <h4 className="font-bold text-slate-900">{stage.title}</h4>
           {stage.score && (
            <p className="text-xs font-mono text-slate-500 mt-1">Score: <span className="font-bold text-slate-700">{stage.score}</span></p>
           )}
          </div>
          <span className={`px-2 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider border ${
           stage.status === 'READY' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : stage.status === 'WARNING'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
           {stage.status}
          </span>
         </div>
         <button className="w-full py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100">
          Open Subsystem <ArrowRight className="w-3.5 h-3.5" />
         </button>
        </div>
       ))}
      </div>
     </div>

     {/* 5. Unified Project Asset Inventory */}
     <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
       <div>
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
         <Package className="w-5 h-5 text-indigo-600" />
         Unified Project Asset Inventory (4 Assets)
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
         Real-time status, health, and provenance mapping for every script and production asset.
        </p>
       </div>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
        <thead className="bg-slate-50/80 border-b border-slate-200/90">
         <tr>
          <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest rounded-tl-xl">Asset</th>
          <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest">Type</th>
          <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest">Subsystem</th>
          <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest">Status</th>
          <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest">Version</th>
          <th className="px-6 py-4 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right rounded-tr-xl">Actions</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
         {[
          { name: "Main YouTube Script", type: "MARKDOWN", sub: "Production", status: "READY", v: "v1.0" },
          { name: "Benchmark Comparison Cards", type: "JSON_MATRIX", sub: "Editor Sync", status: "READY", v: "v1.2" },
          { name: "Thumbnail Hook Brief", type: "TEXT", sub: "Publishing", status: "STAGED", v: "v0.9" },
          { name: "Fact-Checked Citations Sheet", type: "CSV", sub: "Quality", status: "READY", v: "v2.1" }
         ].map((asset, i) => (
          <tr key={i} className="hover:bg-slate-50/50 transition group">
           <td className="px-6 py-4">
            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-2">
             <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
             {asset.name}
            </span>
           </td>
           <td className="px-6 py-4">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{asset.type}</span>
           </td>
           <td className="px-6 py-4">
            <span className="text-xs font-semibold text-slate-600">{asset.sub}</span>
           </td>
           <td className="px-6 py-4">
            <span className={`px-2 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider border ${
             asset.status === 'READY' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
             {asset.status}
            </span>
           </td>
           <td className="px-6 py-4">
            <span className="text-[11px] font-mono font-bold text-slate-500">{asset.v}</span>
           </td>
           <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm">
              <Eye className="w-3.5 h-3.5 text-slate-400" /> Preview
             </button>
             <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm">
              <Download className="w-3.5 h-3.5" /> DL
             </button>
            </div>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     {/* 6. "What Breaks If This Changes?" Read-Only Impact Simulator */}
     <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
       <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-500" />
        "What Breaks If This Changes?" Read-Only Simulation
       </h3>
       <p className="text-xs text-slate-500 font-medium mt-1">
        Simulate downstream impact across scripts, benchmark cards, and distribution staging before making upstream research modifications.
       </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-end gap-4">
       <div className="flex-1 w-full space-y-1.5">
        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Select Upstream Claim / Node</label>
        <select className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all">
         <option>-- Choose Claim to Simulate --</option>
         <option>Claim #4: S27 Ultra sustained thermal limit is 45°C</option>
         <option>Claim #7: A18 Pro benchmark multicore score</option>
        </select>
       </div>
       
       <div className="flex-1 w-full space-y-1.5">
        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Simulated Change Action</label>
        <select className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all">
         <option>Benchmark Score Changed ({">"} 10% delta)</option>
         <option>Evidence Retracted (Dead Link)</option>
         <option>Claim Flipped to Contradicted</option>
        </select>
       </div>

       <button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 py-2.5 font-bold text-sm shadow-md transition-colors active:scale-95 shrink-0 flex items-center justify-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        Run Read-Only Simulation
       </button>
      </div>
     </div>

    </div>
   )}
"""

content = content[:idx_start_pills] + new_ui + content[idx_end_project:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated creator/page.tsx with the newly requested UI blocks.")
