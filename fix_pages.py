import os
import re

base_dir = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app"

# 1. quality/page.tsx
fpath = os.path.join(base_dir, "research", "quality", "page.tsx")
with open(fpath, "r", encoding="utf-8") as f: content = f.read()
content = content.replace("bg-white text-white", "bg-indigo-600 text-white")
with open(fpath, "w", encoding="utf-8") as f: f.write(content)

# 2. queue/page.tsx
fpath = os.path.join(base_dir, "research", "queue", "page.tsx")
with open(fpath, "r", encoding="utf-8") as f: content = f.read()
content = content.replace("border-slate-750", "border-slate-200")
content = content.replace("bg-slate-750", "bg-white")
with open(fpath, "w", encoding="utf-8") as f: f.write(content)

# 3. sources/page.tsx
fpath = os.path.join(base_dir, "research", "sources", "page.tsx")
with open(fpath, "r", encoding="utf-8") as f: content = f.read()
content = content.replace('bg-white text-white flex items-center', 'bg-indigo-600 text-white flex items-center')
content = content.replace('bg-white text-white text-[11px]', 'bg-white text-slate-900 text-[11px]')
content = content.replace('border-slate-700/50', 'border-slate-200')
content = content.replace('bg-slate-900 hover:bg-slate-800 text-white', 'bg-indigo-600 hover:bg-indigo-700 text-white')
with open(fpath, "w", encoding="utf-8") as f: f.write(content)

# 4. docs/page.tsx
fpath = os.path.join(base_dir, "developers", "docs", "page.tsx")
with open(fpath, "r", encoding="utf-8") as f: content = f.read()
content = content.replace('bg-white text-white flex items-center', 'bg-indigo-600 text-white flex items-center')
with open(fpath, "w", encoding="utf-8") as f: f.write(content)

# 5. login/page.tsx
fpath = os.path.join(base_dir, "login", "page.tsx")
with open(fpath, "r", encoding="utf-8") as f: content = f.read()
content = content.replace('bg-slate-50 border border-slate-200', 'bg-white border border-slate-200')
with open(fpath, "w", encoding="utf-8") as f: f.write(content)

# 6. onboarding/page.tsx
fpath = os.path.join(base_dir, "onboarding", "page.tsx")
with open(fpath, "r", encoding="utf-8") as f: content = f.read()
content = content.replace('border-indigo-850', 'border-indigo-200')
with open(fpath, "w", encoding="utf-8") as f: f.write(content)

# 7. research/create/page.tsx
fpath = os.path.join(base_dir, "research", "create", "page.tsx")
with open(fpath, "r", encoding="utf-8") as f: content = f.read()
content = content.replace('"bg-white text-white   shadow-md"', '"bg-indigo-600 text-white   shadow-md"')
content = content.replace('bg-white text-white hover:bg-slate-50', 'bg-indigo-600 text-white hover:bg-indigo-700')
with open(fpath, "w", encoding="utf-8") as f: f.write(content)

# 8. dashboard/page.tsx
fpath = os.path.join(base_dir, "dashboard", "page.tsx")
with open(fpath, "r", encoding="utf-8") as f: content = f.read()
content = content.replace('bg-slate-900 hover:bg-slate-800 text-white', 'bg-indigo-600 hover:bg-indigo-700 text-white')

# fix the dark card
dark_card_old = """bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md h-[380px]">
           <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-bold self-start flex items-center gap-1.5 border border-white/20 shadow-sm text-white">
             <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Quality Gate & Audit
           </div>

           <div className="space-y-4 mb-4 mt-8">
             <div className="font-mono text-6xl font-bold tracking-tight text-white">96.8%</div>
             <p className="text-base font-bold leading-relaxed text-white/95 pr-4">
               All evidence claims passed multi-source verification.
             </p>
             <p className="text-sm text-white/80 pr-4 leading-relaxed font-medium">
               0 critical contradictions detected. All citations are locked and ready for YouTube script & video production.
             </p>
           </div>

           <div className="flex items-center justify-between mt-auto">
             <div className="flex items-center gap-1.5 w-1/2">
               <div className="h-1.5 bg-white rounded-full flex-1 shadow-sm"></div>
               <div className="h-1.5 bg-white/30 rounded-full w-2"></div>
               <div className="h-1.5 bg-white/30 rounded-full w-2"></div>
             </div>
             
             <Link href="/content" className="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm border border-white/20 whitespace-nowrap text-white">
                Content Board <ArrowRight className="w-3.5 h-3.5" />
             </Link>"""

dark_card_new = """bg-white border border-slate-200/90 text-slate-900 rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-between shadow-sm h-[380px]">
           <div className="bg-amber-50 rounded-full px-4 py-1.5 text-xs font-bold self-start flex items-center gap-1.5 border border-amber-200 shadow-sm text-amber-600">
             <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Quality Gate & Audit
           </div>

           <div className="space-y-4 mb-4 mt-8">
             <div className="font-mono text-6xl font-bold tracking-tight text-slate-900">96.8%</div>
             <p className="text-base font-bold leading-relaxed text-slate-700 pr-4">
               All evidence claims passed multi-source verification.
             </p>
             <p className="text-sm text-slate-500 pr-4 leading-relaxed font-medium">
               0 critical contradictions detected. All citations are locked and ready for YouTube script & video production.
             </p>
           </div>

           <div className="flex items-center justify-between mt-auto">
             <div className="flex items-center gap-1.5 w-1/2">
               <div className="h-1.5 bg-emerald-500 rounded-full flex-1 shadow-sm"></div>
               <div className="h-1.5 bg-slate-200 rounded-full w-2"></div>
               <div className="h-1.5 bg-slate-200 rounded-full w-2"></div>
             </div>
             
             <Link href="/content" className="bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-indigo-200 whitespace-nowrap text-indigo-700">
                Content Board <ArrowRight className="w-3.5 h-3.5" />
             </Link>"""

content = content.replace(dark_card_old, dark_card_new)
with open(fpath, "w", encoding="utf-8") as f: f.write(content)

print("Updates applied")
