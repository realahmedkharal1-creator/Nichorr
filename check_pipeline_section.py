import sys

sys.stdout.reconfigure(encoding='utf-8')
file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_start = content.find("{/* 4. End-to-End Pipeline Integrity (9 Stages 3x3 Bento Matrix) */}")
idx_end = content.find("{/* 5. Unified Project Asset Inventory */}")

print(content[idx_start:idx_end])
