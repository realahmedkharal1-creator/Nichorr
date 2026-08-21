import os
import shutil

# Remove the directory
dir_path = r"src\app\developers"
if os.path.exists(dir_path):
    shutil.rmtree(dir_path)

# Update Header.tsx
header_path = r"src\components\layout\Header.tsx"
with open(header_path, "r", encoding="utf-8") as f:
    header_content = f.read()

header_content = header_content.replace('{ href: "/developers/docs", label: "Docs" },', '')
header_content = header_content.replace('<Link href="/developers/docs" className="px-5 py-1.5 rounded-full text-sm transition-all font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">Docs</Link>', '')

with open(header_path, "w", encoding="utf-8") as f:
    f.write(header_content)

# Update CommandPalette.tsx
cmd_path = r"src\components\layout\CommandPalette.tsx"
with open(cmd_path, "r", encoding="utf-8") as f:
    cmd_content = f.read()

cmd_content = cmd_content.replace('{ label: "Platform Methodology & API Docs", href: "/developers/docs", icon: BookOpen },', '')

with open(cmd_path, "w", encoding="utf-8") as f:
    f.write(cmd_content)

print("Removed developers directory and links")
