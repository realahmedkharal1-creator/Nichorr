import sys

sys.stdout.reconfigure(encoding='utf-8')
file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace any bg-[#A9A9A9] with elevated white bg-white with smooth subtle borders
content = content.replace('bg-[#A9A9A9] border border-slate-400/80', 'bg-white border border-slate-200/90')
content = content.replace('bg-[#A9A9A9]', 'bg-white')

# Ensure hover states on cards are smooth
content = content.replace('hover:border-slate-500', 'hover:border-slate-300')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated creator/page.tsx with Apple Warm Studio Bento cards")
