import os

file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find(">Production Matrix")
if idx == -1:
    idx = content.find("Production Matrix<")
if idx == -1:
    idx = content.find("Production Matrix")

if idx != -1:
    print(content[max(0, idx-500):idx+1500])
else:
    print("Not found")
