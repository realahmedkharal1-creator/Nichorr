import sys

sys.stdout.reconfigure(encoding='utf-8')
file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_start = content.find("{/* 5. Unified Project Asset Inventory */}")
idx_end = content.find("{/* 6. \"What Breaks If This Changes?\" Read-Only Impact Simulator */}")

if idx_start == -1 or idx_end == -1:
    print("Error: boundaries not found")
    sys.exit(1)

new_asset_section = """{/* 5. Unified Project Asset Inventory */}
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
            <div className="flex items-center justify-end gap-2">
             <button className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90 rounded-lg px-2.5 py-1 text-xs font-medium inline-flex items-center gap-1 shadow-2xs transition-all">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              Preview
             </button>
             <button className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90 rounded-lg px-2.5 py-1 text-xs font-medium inline-flex items-center gap-1 shadow-2xs transition-all">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Download
             </button>
            </div>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     """

content = content[:idx_start] + new_asset_section + content[idx_end:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Asset table updated successfully!")
