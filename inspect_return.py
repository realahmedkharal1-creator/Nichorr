import os

file_path = r"src\app\research\[id]\creator\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_return = content.find("return (\n  <div className=\"space-y-6 font-sans\">")
if idx_return == -1:
    idx_return = content.find("return (\n    <div className=\"space-y-6 font-sans\">")
idx_tab = content.find("{activeTab === \"project\" && (")

if idx_return != -1 and idx_tab != -1:
    print(f"From {idx_return} to {idx_tab} is {idx_tab - idx_return} characters.")
    print("----- SNIPPET BEGIN -----")
    print(content[idx_return:idx_tab])
    print("----- SNIPPET END -----")
else:
    print(f"idx_return: {idx_return}, idx_tab: {idx_tab}")
