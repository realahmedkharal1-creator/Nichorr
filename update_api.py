import os

file_path = r"src\app\api\research\[id]\execute\route.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

if "export const maxDuration" not in content:
    content = 'export const maxDuration = 60;\n\n' + content
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
print("Updated execute/route.ts with maxDuration")
