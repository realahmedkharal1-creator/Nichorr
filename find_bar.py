import os

file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_start = content.find("{/* Primary Workflow Stepper Bar (Phases 70-77) */}")
idx_end = content.find("{/* TAB: CREATOR PROJECT CONTROL CENTER (PHASE 77) */}")

if idx_start != -1 and idx_end != -1:
    print(f"Pill bar length: {idx_end - idx_start}")
    print(content[idx_start:idx_start+500])
else:
    print("Not found")
