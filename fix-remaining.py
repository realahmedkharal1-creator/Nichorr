import os
import re

base = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src"

files_fixed = 0
for root, dirs, fnames in os.walk(base):
    for f in fnames:
        if not f.endswith('.tsx') and not f.endswith('.ts'):
            continue
        if 'CreatorTeleprompter' in f:
            continue
        fpath = os.path.join(root, f)
        try:
            with open(fpath, 'r', encoding='utf-8') as fl:
                content = fl.read()
        except:
            continue
        
        original = content
        
        # Fix invisible elements
        content = content.replace('bg-white text-white', 'bg-slate-900 text-white')
        content = content.replace('bg-white hover:bg-slate-50 text-white', 'bg-slate-900 hover:bg-slate-800 text-white')
        content = content.replace('bg-white hover:bg-white text-white', 'bg-slate-900 hover:bg-slate-800 text-white')
        content = content.replace('bg-white hover:bg-slate-100 text-white', 'bg-slate-900 hover:bg-slate-800 text-white')
        
        # Invalid classes
        content = content.replace('border-slate-750', 'border-slate-200')
        content = content.replace('bg-slate-750', 'bg-slate-100')
        
        # Specific dark mode classes that might have been missed
        content = re.sub(r'bg-slate-950/?\d*', 'bg-slate-50', content)
        content = re.sub(r'bg-slate-800/?\d*', 'bg-slate-50', content)
        content = re.sub(r'border-slate-800/?\d*', 'border-slate-200', content)
        
        if content != original:
            with open(fpath, 'w', encoding='utf-8') as fl:
                fl.write(content)
            route = fpath.replace(base, '').replace('\\', '/')
            files_fixed += 1
            print(f"FIXED: {route}")

print(f"\nTotal remaining pages fixed: {files_fixed}")
