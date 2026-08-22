import sys
sys.stdout.reconfigure(encoding='utf-8')
file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re
matches = re.findall(r'bg-white\s+border\s+border-slate-200[^\"]*', content)
for m in set(matches):
    print(m)
