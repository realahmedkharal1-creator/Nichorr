import os

file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_start = content.find("{/* TAB: CREATOR PROJECT CONTROL CENTER (PHASE 77) */}")
idx_end = content.find("{/* TAB:", idx_start + 10)

if idx_start != -1 and idx_end != -1:
    print(f"Project tab length: {idx_end - idx_start}")
else:
    print("Not found")
