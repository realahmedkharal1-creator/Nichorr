import os

file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find("Project Control Center")
if idx != -1:
    print(content[idx-500:idx+1500])
else:
    print("Not found")
