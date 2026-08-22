import os, sys

sys.stdout.reconfigure(encoding='utf-8')
file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("End-to-End Project Pipeline Integrity (9 Stages)")
if idx != -1:
    print(content[idx-100:idx+2500])
else:
    print("Not found")
