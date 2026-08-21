import os
import re

file_path = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\creator\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix remnants of dark mode
replacements = [
    (r"border-slate-855", "border-slate-100"),
    (r"divide-slate-800/60", "divide-slate-200"),
    (r"divide-slate-800", "divide-slate-200"),
    (r"bg-slate-855/40", "bg-slate-100"),
    (r"bg-slate-855", "bg-slate-100"),
    (r"hover:bg-slate-700", "hover:bg-slate-100"),
    (r"hover:text-slate-100", "hover:text-slate-900"),
    (r"border-slate-900", "border-slate-200"),
    (r"shadow-slate-900/50", "shadow-slate-200"),
    (r"shadow-black/50", "shadow-slate-200"),
    (r"bg-rose-900/60", "bg-rose-50"),
    (r"bg-emerald-900/60", "bg-emerald-50"),
    (r"bg-indigo-900/60", "bg-indigo-50"),
    (r"bg-amber-900/60", "bg-amber-50"),
    (r"border-rose-600/80", "border-rose-200"),
    # Replace the remaining text-slate-*
    (r"text-slate-400", "text-slate-500"),
    (r"text-slate-300", "text-slate-700"),
    (r"text-slate-200", "text-slate-700"),
    (r"text-slate-100", "text-slate-900"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Deep cleaned dark mode classes.")
