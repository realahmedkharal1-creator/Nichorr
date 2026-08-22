import sys

sys.stdout.reconfigure(encoding='utf-8')
file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_start = content.find("{/* TAB: CREATOR PROJECT CONTROL CENTER */}")
idx_end = content.find("{/* TAB: SAFE EXECUTION PIPELINE")

print(content[idx_start:idx_start+2500])
