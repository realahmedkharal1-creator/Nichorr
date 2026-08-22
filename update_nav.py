import os
file_path = r"src\components\research\ResearchTabNav.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace any overflow/truncation issues with safe scrollbar-hide flex wrappers
content = content.replace('whitespace-nowrap transition-all select-none', 'whitespace-nowrap transition-all select-none shrink-0')
content = content.replace('flex overflow-x-auto gap-2 pb-3 pl-6 pr-0 w-full', 'flex overflow-x-auto gap-2 pb-3 pl-6 pr-0 w-full scrollbar-hide')
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated ResearchTabNav.tsx")
