const fs = require('fs');

let content = fs.readFileSync('src/app/research/[id]/creator/page.tsx', 'utf8');

// 1. Import TabBar
if (!content.includes('import { TabBar } from "@/components/ui/TabBar";')) {
  content = content.replace(
    'import { SkeletonCard } from "@/components/ui/Skeleton";',
    'import { SkeletonCard } from "@/components/ui/Skeleton";\nimport { TabBar } from "@/components/ui/TabBar";'
  );
}

// 2. Replace Pill Bar
const oldPillBar = `{/* NEW OVERHAULED PILL BAR */}
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
       className={\`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shrink-0 \${
        isActive 
         ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
         : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
       }\`}
      >
       <Icon className={\`w-3.5 h-3.5 \${isActive ? "text-white" : "text-slate-500"}\`} />
       {tab.label}
      </button>
     );
    })}
   </div>`;

const newPillBar = `<div className="mb-[22px]">
    <TabBar 
      tabs={[
        { id: "project", label: "Project Control Center" },
        { id: "matrix", label: "Production Matrix" },
        { id: "exportWorkspace", label: "Production Export" },
        { id: "publishingOrchestrator", label: "Publishing Orchestrator" },
        { id: "publicationIntegrity", label: "Publication Integrity" },
        { id: "researchCalibration", label: "Research Calibration" }
      ]}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as any)}
      variant="citation"
    />
   </div>`;

content = content.replace(oldPillBar, newPillBar);

// 3. Replace Project Control Center
// To reliably replace, I'll use regex or slice by finding the start and end of the block.
const startPCC = `{/* TAB: CREATOR PROJECT CONTROL CENTER */}`;
const endPCC = `{/* TAB: CREATOR CHANGE EXECUTION & SAFE ACTION ORCHESTRATION (PHASE 78) */}`;

const startIndex = content.indexOf(startPCC);
const endIndex = content.indexOf(endPCC);

if (startIndex !== -1 && endIndex !== -1) {
  const newPCC = `{/* TAB: CREATOR PROJECT CONTROL CENTER */}
   {activeTab === "project" && (
    <div className="space-y-[22px]">
      
      {/* Controls Row */}
      <div className="flex items-center justify-between gap-[14px] flex-wrap mb-[18px]">
        <div className="flex bg-card border border-line rounded-[10px] overflow-hidden">
          {["Outline", "Script Ready", "Full Spoken"].map(mode => {
           const modeValue = mode.replace(" ", "_").toUpperCase();
           const isModeActive = outputMode === modeValue;
           return (
            <button
             key={mode}
             onClick={() => setOutputMode(modeValue as any)}
             className={\`bg-transparent border-none px-[14px] py-[8px] text-[12.5px] font-semibold cursor-pointer \${
              isModeActive 
               ? "bg-ink text-paper" 
               : "text-muted"
             }\`}
            >
             {mode}
            </button>
           );
          })}
        </div>

        <div className="flex gap-[10px] items-center">
          <span className="font-mono text-[12px] text-muted">
            Duration: 
            {[8, 12, 18].map((dur, i) => (
              <React.Fragment key={dur}>
                {i > 0 && " · "}
                {duration === dur ? <b className="text-ink">{dur}m</b> : <span onClick={() => setDuration(dur as any)} className="cursor-pointer">{dur}m</span>}
              </React.Fragment>
            ))}
          </span>
          <button className="bg-citation text-white border-none px-[16px] py-[9px] rounded-[9px] text-[12.5px] font-semibold cursor-pointer">
            🎙 Teleprompter
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-ink text-paper rounded-[16px] p-[20px_22px] mb-[20px]">
        <div className="flex gap-[8px] mb-[12px] flex-wrap">
          <span className="font-mono text-[10.5px] font-semibold px-[10px] py-[4px] rounded-[6px] bg-verified-bg text-verified uppercase">
            READY FOR PUBLISHING
          </span>
          <span className="font-mono text-[10.5px] font-semibold px-[10px] py-[4px] rounded-[6px] bg-white/10 text-[#C9CDD3] uppercase">
            SCRIPT V1.0
          </span>
        </div>
        <div className="font-serif font-semibold text-[19px] mb-[10px]">
          {report?.topic || "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max"}
        </div>
        <div className="flex gap-[16px] flex-wrap font-mono text-[11px] text-[#8A93A0]">
          <span>Project Hash: 0fc1ebed18dc...</span>
          <span>Evidence Hash: ev-hash-ca32...</span>
          <span>◈ 19 Nodes</span>
          <span>⇄ 17 Edges</span>
        </div>
      </div>

      {/* 5 Core Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[14px] mb-[22px]">
        {[
         { step: 1, title: "RESEARCH HEALTH", score: 29, color: "warning" },
         { step: 2, title: "CONTENT QUALITY", score: 25, color: "warning" },
         { step: 3, title: "PRODUCTION READY", score: 95, color: "verified" },
         { step: 4, title: "PUBLISHING PREFLIGHT", score: 100, color: "verified" },
         { step: 5, title: "DISTRIBUTION STAGING", score: 69, color: "warning" }
        ].map(kpi => (
         <div key={kpi.step} className="bg-card border border-line-soft rounded-[14px] p-[14px]">
           <div className="font-mono text-[9.5px] text-muted-2 tracking-[0.3px] mb-[8px] uppercase">{kpi.title}</div>
           <div className={\`font-serif font-semibold text-[22px] mb-[8px] text-\${kpi.color}\`}>
             {kpi.score}%
           </div>
           <div className="h-[5px] bg-line-soft rounded-[4px] overflow-hidden">
             <div 
              className={\`h-full rounded-[4px] bg-\${kpi.color}\`} 
              style={{ width: \`\${kpi.score}%\` }} 
             />
           </div>
         </div>
        ))}
      </div>

      {/* 9-Stage Pipeline Integrity */}
      <div>
        <h3 className="text-[15px] font-bold m-0 mb-[4px] text-ink">End-to-End Project Pipeline Integrity (9 Stages)</h3>
        <p className="text-[12.5px] text-muted m-0 mb-[16px]">Complete authority chain: Research → Evidence → Health → Decisions → Script → Quality → Production → Editor → Publishing → Distribution.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[14px] mb-[26px]">
          {[
           { i: 1, title: "Research & Sources", status: "IN PROGRESS", score: "Status: Active Collection", badgeClass: "bg-citation-bg text-citation" },
           { i: 2, title: "Evidence Health", status: "READY", score: "Score: 29%", badgeClass: "bg-verified-bg text-verified" },
           { i: 3, title: "Health Decisions", status: "READY", score: "Status: Verified", badgeClass: "bg-verified-bg text-verified" },
           { i: 4, title: "Script & Narration", status: "READY", score: "Status: Ready for Inspection", badgeClass: "bg-verified-bg text-verified" },
           { i: 5, title: "Quality Review", status: "WARNING", score: "Score: 25%", badgeClass: "bg-warning-bg text-warning" },
           { i: 6, title: "Production Assets", status: "READY", score: "Score: 95%", badgeClass: "bg-verified-bg text-verified" },
           { i: 7, title: "Publishing Preflight", status: "READY", score: "Score: 100%", badgeClass: "bg-verified-bg text-verified" },
           { i: 8, title: "Distribution & Release", status: "WARNING", score: "Score: 69%", badgeClass: "bg-warning-bg text-warning" },
           { i: 9, title: "Video Editor Sync", status: "READY", score: "Status: Ready for Inspection", badgeClass: "bg-verified-bg text-verified" }
          ].map(stage => (
           <div key={stage.i} className="bg-card border border-line-soft rounded-[14px] p-[16px]">
            <div className="flex justify-between items-start mb-[10px]">
              <span className="font-mono text-[10px] text-muted-2 uppercase tracking-wide">STAGE {stage.i}</span>
              <span className={\`font-mono text-[10px] font-semibold px-[8px] py-[3px] rounded-[12px] \${stage.badgeClass}\`}>
               {stage.status}
              </span>
            </div>
            <div className="font-bold text-[13.5px] text-ink m-[4px_0]">{stage.title}</div>
            <div className="text-[11.5px] text-muted">{stage.score}</div>
            <button className="w-full mt-[10px] bg-paper border border-line rounded-[8px] p-[8px] text-[12px] font-semibold cursor-pointer text-ink hover:bg-line-soft transition-colors">
              Open Subsystem →
            </button>
           </div>
          ))}
        </div>
      </div>

      {/* Unified Project Asset Inventory */}
      <div>
        <h3 className="text-[15px] font-bold m-0 mb-[4px] text-ink">Unified Project Asset Inventory (4 Assets)</h3>
        <p className="text-[12.5px] text-muted m-0 mb-[16px]">Real-time status, health, and provenance mapping for every script and production asset.</p>
        
        <div className="bg-card border border-line-soft rounded-[14px] p-[6px_16px] overflow-x-auto">
          <table className="w-full border-collapse text-[13px] min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Asset</th>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Type</th>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Subsystem</th>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Status</th>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Version</th>
              </tr>
            </thead>
            <tbody>
              {[
               { name: "📄 Main YouTube Script", type: "markdown", sub: "Production", status: "READY", v: "v1.0", badgeClass: "bg-verified-bg text-verified" },
               { name: "📊 Benchmark Comparison Cards", type: "json_matrix", sub: "Editor Sync", status: "READY", v: "v1.2", badgeClass: "bg-verified-bg text-verified" },
               { name: "🖼 Thumbnail Hook Brief", type: "text", sub: "Publishing", status: "STAGED", v: "v0.9", badgeClass: "bg-warning-bg text-warning" },
               { name: "📑 Fact-Checked Citations Sheet", type: "csv", sub: "Quality", status: "READY", v: "v2.1", badgeClass: "bg-verified-bg text-verified" }
              ].map((asset, i) => (
                <tr key={i}>
                  <td className="p-[12px_10px] border-t border-line-soft">
                    <div className="flex items-center gap-[8px] font-semibold text-ink">{asset.name}</div>
                  </td>
                  <td className="p-[12px_10px] border-t border-line-soft font-mono text-muted">{asset.type}</td>
                  <td className="p-[12px_10px] border-t border-line-soft text-ink">{asset.sub}</td>
                  <td className="p-[12px_10px] border-t border-line-soft">
                    <span className={\`font-mono text-[10px] font-semibold px-[8px] py-[3px] rounded-[12px] \${asset.badgeClass}\`}>
                     {asset.status}
                    </span>
                  </td>
                  <td className="p-[12px_10px] border-t border-line-soft font-mono text-muted">{asset.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulation Card */}
      <div className="bg-card border border-line-soft rounded-[14px] p-[20px] mt-[22px]">
        <h3 className="text-[15px] font-bold m-0 mb-[4px] text-ink flex items-center gap-[8px]">
          ⚡ "What Breaks If This Changes?" Read-Only Simulation
        </h3>
        <p className="text-[12.5px] text-muted m-0 mb-[16px]">Simulate downstream impact across scripts, benchmark cards, and distribution staging before making upstream research modifications.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-[12px] items-end">
          <div>
            <label className="font-mono text-[10px] text-muted-2 block mb-[6px] uppercase tracking-wide">SELECT UPSTREAM CLAIM / NODE</label>
            <select 
              value={simulationTargetId}
              onChange={(e) => setSimulationTargetId(e.target.value)}
              className="w-full font-sans text-[13px] p-[10px_12px] border border-line rounded-[9px] bg-paper text-ink focus:outline-none focus:border-citation"
            >
              <option value="">— Choose Claim to Simulate —</option>
              <option value="claim-4">Claim #4: S27 Ultra sustained thermal limit is 45°C</option>
              <option value="claim-7">Claim #7: A18 Pro benchmark multicore score</option>
            </select>
          </div>
          
          <div>
            <label className="font-mono text-[10px] text-muted-2 block mb-[6px] uppercase tracking-wide">SIMULATED CHANGE ACTION</label>
            <select 
              value={simulationAction}
              onChange={(e) => setSimulationAction(e.target.value)}
              className="w-full font-sans text-[13px] p-[10px_12px] border border-line rounded-[9px] bg-paper text-ink focus:outline-none focus:border-citation"
            >
              <option value="BENCHMARK_SCORE_CHANGED">Benchmark Score Changed (> 10% delta)</option>
              <option value="EVIDENCE_RETRACTED">Evidence Retracted (Dead Link)</option>
              <option value="CLAIM_CONTRADICTED">Claim Flipped to Contradicted</option>
            </select>
          </div>

          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="bg-citation text-white border-none rounded-[9px] p-[11px_18px] text-[12.5px] font-semibold cursor-pointer whitespace-nowrap hover:bg-opacity-90 disabled:opacity-50"
          >
            {isSimulating ? "⚡ Simulating..." : "⚡ Run Simulation"}
          </button>
        </div>
      </div>
      
    </div>
   )}
   
   `;
  content = content.substring(0, startIndex) + newPCC + content.substring(endIndex);
}

fs.writeFileSync('src/app/research/[id]/creator/page.tsx', content, 'utf8');
console.log("Updated page.tsx successfully.");
