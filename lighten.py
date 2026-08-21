import os
import re

file_path = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\creator\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    (r"text-teal-400", "text-teal-600"),
    (r"text-teal-300", "text-teal-700"),
    (r"text-emerald-400", "text-emerald-600"),
    (r"text-emerald-300", "text-emerald-700"),
    (r"text-indigo-400", "text-indigo-600"),
    (r"text-indigo-300", "text-indigo-700"),
    (r"text-amber-400", "text-amber-600"),
    (r"text-amber-300", "text-amber-700"),
    (r"text-rose-400", "text-rose-600"),
    (r"text-rose-300", "text-rose-700"),
    (r"text-cyan-400", "text-cyan-600"),
    (r"text-cyan-300", "text-cyan-700"),
    (r"text-purple-400", "text-purple-600"),
    (r"text-purple-300", "text-purple-700"),
    (r"text-fuchsia-400", "text-fuchsia-600"),
    (r"text-fuchsia-300", "text-fuchsia-700"),
    (r"text-pink-400", "text-pink-600"),
    (r"text-pink-300", "text-pink-700"),
    (r"text-blue-400", "text-blue-600"),
    (r"text-blue-300", "text-blue-700"),
    (r"border-rose-900/60", "border-rose-200"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Lightened light colors.")
