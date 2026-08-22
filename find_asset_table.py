import sys

sys.stdout.reconfigure(encoding='utf-8')
file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_start = content.find("{/* 5. Unified Project Asset Inventory */}")
idx_end = content.find("{/* 6. \"What Breaks If This Changes?\" Read-Only Impact Simulator */}")

print("Found section:")
print(content[idx_start:idx_end])
