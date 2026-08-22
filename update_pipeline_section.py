import sys

sys.stdout.reconfigure(encoding='utf-8')
file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_start = content.find("{/* 4. End-to-End Pipeline Integrity (9 Stages 3x3 Bento Matrix) */}")
idx_end = content.find("{/* 5. Unified Project Asset Inventory */}")

if idx_start == -1 or idx_end == -1:
    print("Error: boundaries not found")
    sys.exit(1)

new_pipeline_section = """{/* 4. End-to-End Pipeline Integrity (9 Stages 3x3 Bento Matrix) */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
       {[
        { i: 1, title: "Research & Sources", status: "IN_PROGRESS", score: "Status: Active Collection" },
        { i: 2, title: "Evidence Health", status: "READY", score: "Score: 29%" },
        { i: 3, title: "Health Decisions", status: "READY", score: "Status: Verified" },
        { i: 4, title: "Script & Narration", status: "READY", score: "Status: Ready for Inspection" },
        { i: 5, title: "Quality Review", status: "WARNING", score: "Score: 25%" },
        { i: 6, title: "Production Assets", status: "READY", score: "Score: 95%" },
        { i: 7, title: "Publishing Preflight", status: "READY", score: "Score: 100%" },
        { i: 8, title: "Distribution & Release", status: "WARNING", score: "Score: 69%" },
        { i: 9, title: "Video Editor Sync", status: "READY", score: "Status: Ready for Inspection" }
       ].map(stage => (
        <div 
         key={stage.i} 
         className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-h-[170px]"
        >
         <div>
          <div className="flex items-center justify-between gap-2">
           <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
            STAGE {stage.i}
           </span>
           <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            stage.status === 'READY' 
             ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
             : stage.status === 'WARNING'
             ? 'bg-amber-50 text-amber-700 border-amber-200'
             : 'bg-blue-50 text-blue-700 border-blue-200'
           }`}>
            {stage.status}
           </span>
          </div>

          <h4 className="text-slate-900 font-bold text-base mt-2 mb-1">{stage.title}</h4>
          <p className="text-xs font-mono font-medium text-slate-500">{stage.score}</p>
         </div>

         <button className="w-full mt-4 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200/80 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs">
          Open Subsystem <ArrowRight className="w-3.5 h-3.5" />
         </button>
        </div>
       ))}
      </div>
     </div>

     """

content = content[:idx_start] + new_pipeline_section + content[idx_end:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Pipeline section updated successfully!")
