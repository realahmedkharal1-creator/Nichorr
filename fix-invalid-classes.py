import os
import re

base = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src"

# Fix invalid border-slate-750 everywhere
files_fixed = 0
for root, dirs, fnames in os.walk(base):
    for f in fnames:
        if not f.endswith('.tsx') and not f.endswith('.ts'):
            continue
        fpath = os.path.join(root, f)
        try:
            with open(fpath, 'r', encoding='utf-8') as fl:
                content = fl.read()
        except:
            continue
        
        original = content
        # Fix invalid tailwind classes
        content = content.replace('border-slate-750', 'border-slate-200')
        content = content.replace('bg-slate-750', 'bg-slate-100')
        content = content.replace('text-slate-750', 'text-slate-600')
        
        if content != original:
            with open(fpath, 'w', encoding='utf-8') as fl:
                fl.write(content)
            route = fpath.replace(base, '').replace('\\', '/')
            files_fixed += 1
            print(f"FIXED border-slate-750: {route}")

print(f"\nTotal files with invalid class fixes: {files_fixed}")
