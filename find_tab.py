import os

file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_return = content.find("return (\n  <div className=\"space-y-6 font-sans\">")
if idx_return == -1:
    idx_return = content.find("return (\n    <div className=\"space-y-6 font-sans\">")

idx_matrix = content.find("{/* TAB: PRODUCTION MATRIX")

if idx_return != -1 and idx_matrix != -1:
    print(f"From {idx_return} to {idx_matrix} is {idx_matrix - idx_return} characters.")
else:
    print("Not found")
