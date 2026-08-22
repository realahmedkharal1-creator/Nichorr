import os

file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

return_idx = content.find("return (\n    <div className=\"space-y-6 font-sans\">\n     {/* Top Navigation */}")
if return_idx == -1:
    return_idx = content.find("return (")

print(f"return statement found at: {return_idx}")
if return_idx != -1:
    print(content[return_idx:return_idx+2000])
