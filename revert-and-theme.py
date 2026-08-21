import os
import re

file_path = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\creator\page.tsx"

replacements = [
    (r"\bslate-card\b", ""),
    (r"bg-slate-900/90", "bg-white rounded-[24px] shadow-sm"),
    (r"bg-slate-900/60", "bg-white rounded-[24px] shadow-sm"),
    (r"bg-slate-900/40", "bg-slate-50"),
    (r"bg-slate-900", "bg-white rounded-[24px] shadow-sm"),
    (r"bg-slate-950/80", "bg-slate-50"),
    (r"bg-slate-950/60", "bg-slate-50"),
    (r"bg-slate-950/40", "bg-slate-50"),
    (r"bg-slate-950", "bg-slate-50"),
    (r"bg-slate-850", "bg-slate-100"),
    (r"bg-slate-800", "bg-slate-100"),
    (r"border-slate-800/80", "border-slate-200"),
    (r"border-slate-800", "border-slate-200"),
    (r"border-slate-850", "border-slate-200"),
    (r"border-slate-700", "border-slate-300"),
    (r"border-slate-750", "border-slate-300"),
    (r"text-slate-100", "text-slate-900"),
    (r"text-slate-200", "text-slate-700"),
    (r"text-slate-300", "text-slate-700"),
    (r"text-slate-400", "text-slate-500"),
    (r"text-white", "text-slate-900"),
    (r"bg-indigo-950/80", "bg-indigo-50"),
    (r"bg-indigo-950/60", "bg-indigo-50"),
    (r"bg-indigo-950/40", "bg-indigo-50"),
    (r"bg-indigo-950", "bg-indigo-50"),
    (r"border-indigo-900/60", "border-indigo-200"),
    (r"border-indigo-900/40", "border-indigo-200"),
    (r"border-indigo-900", "border-indigo-200"),
    (r"border-indigo-800/60", "border-indigo-200"),
    (r"border-indigo-800/80", "border-indigo-200"),
    (r"border-indigo-800", "border-indigo-200"),
    (r"text-indigo-400", "text-indigo-600"),
    (r"text-indigo-300", "text-indigo-600"),
    (r"bg-emerald-950/30", "bg-emerald-50"),
    (r"bg-emerald-950", "bg-emerald-50"),
    (r"border-emerald-800/40", "border-emerald-200"),
    (r"border-emerald-800", "border-emerald-200"),
    (r"text-emerald-400", "text-emerald-600"),
    (r"text-emerald-300", "text-emerald-600"),
    (r"bg-amber-950/20", "bg-amber-50"),
    (r"bg-amber-950", "bg-amber-50"),
    (r"border-amber-900/40", "border-amber-200"),
    (r"border-amber-900", "border-amber-200"),
    (r"border-amber-800", "border-amber-200"),
    (r"text-amber-400", "text-amber-600"),
    (r"text-amber-300", "text-amber-600"),
    (r"bg-rose-950", "bg-rose-50"),
    (r"border-rose-800", "border-rose-200"),
    (r"text-rose-400", "text-rose-600"),
    (r"text-rose-300", "text-rose-600"),
    (r"text-pink-400", "text-pink-600"),
    (r"text-pink-300", "text-pink-700"),
    (r"bg-pink-950/60", "bg-pink-50"),
    (r"border-pink-800/60", "border-pink-200"),
    (r"bg-cyan-950", "bg-cyan-50"),
    (r"border-cyan-800", "border-cyan-200"),
    (r"text-cyan-400", "text-cyan-600"),
    (r"text-cyan-300", "text-cyan-600"),
    (r"bg-purple-950", "bg-purple-50"),
    (r"border-purple-800", "border-purple-200"),
    (r"text-purple-400", "text-purple-600"),
    (r"text-purple-300", "text-purple-600"),
]

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

for old, new in replacements:
    content = re.sub(old, new, content)
    
content = re.sub(r'className="\s+', 'className="', content)
content = content.replace('  ', ' ')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Restored file updated to light mode successfully.")
