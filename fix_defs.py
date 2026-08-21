import os

file_path = r"src\app\research\[id]\live\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '  const isFailed = run.status === "FAILED";',
    '  const isCompleted = run.status === "COMPLETED";\n  const isCancelled = run.status === "CANCELLED";\n  const isFailed = run.status === "FAILED";'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Restored definitions.")
