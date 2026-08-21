import os

file_path = r"src\app\research\[id]\live\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "isCancelled && currentStageIndex === idx ? 'ABORTED' : (isFailed && currentStageIndex === idx ? 'FAILED' :  : 'QUEUED')",
    "isCancelled && currentStageIndex === idx ? 'ABORTED' : (isFailed && currentStageIndex === idx ? 'FAILED' : 'QUEUED')"
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed syntax error.")
