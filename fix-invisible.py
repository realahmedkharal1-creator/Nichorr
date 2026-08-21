import os
import re

base = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src"

# Find patterns where bg-white and text-white coexist in the same className that are likely broken
# (buttons, spans, badges that should have dark bg)
fixes = {
    # Buttons that were bg-slate-900 text-white (now broken as bg-white text-white)
    'bg-white hover:bg-slate-50 text-white': 'bg-slate-900 hover:bg-slate-800 text-white',
    'bg-white text-white shadow-sm"': 'bg-slate-900 text-white shadow-sm"',
    'bg-white text-white font-bold': 'bg-slate-900 text-white font-bold',
    'bg-white hover:bg-slate-100 text-white': 'bg-slate-900 hover:bg-slate-800 text-white',
}

files_fixed = 0
for root, dirs, fnames in os.walk(base):
    for f in fnames:
        if not f.endswith('.tsx'):
            continue
        fpath = os.path.join(root, f)
        if 'CreatorTeleprompter' in f:
            continue
        try:
            with open(fpath, 'r', encoding='utf-8') as fl:
                content = fl.read()
        except:
            continue
        
        original = content
        for old, new in fixes.items():
            content = content.replace(old, new)
        
        if content != original:
            with open(fpath, 'w', encoding='utf-8') as fl:
                fl.write(content)
            route = fpath.replace(base, '').replace('\\', '/')
            files_fixed += 1
            print(f"FIXED invisible elements: {route}")

print(f"\nTotal files with invisible fixes: {files_fixed}")
