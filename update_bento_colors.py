import sys

sys.stdout.reconfigure(encoding='utf-8')
file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Bento card background classes in creator/page.tsx
# Hero card
content = content.replace(
    'className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden group"',
    'className="bg-[#A9A9A9] border border-slate-400/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden group"'
)

# KPI cards
content = content.replace(
    'className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 group hover:border-slate-300 transition-colors"',
    'className="bg-[#A9A9A9] border border-slate-400/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4 group hover:border-slate-500 transition-colors"'
)

# Bento 9-stage container
content = content.replace(
    'className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm"',
    'className="bg-[#A9A9A9] border border-slate-400/80 rounded-3xl p-6 sm:p-8 shadow-sm"'
)

# Bento 9-stage individual cards
content = content.replace(
    'className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-h-[170px]"',
    'className="bg-[#A9A9A9] border border-slate-400/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-500 transition-all flex flex-col justify-between min-h-[170px]"'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated creator/page.tsx with #A9A9A9 Bento card surfaces")
