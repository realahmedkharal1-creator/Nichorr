import os
import re
import glob

base = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src"

# Find all .tsx files under src/app and src/components
files = []
for root, dirs, fnames in os.walk(base):
    for f in fnames:
        if f.endswith('.tsx'):
            full = os.path.join(root, f)
            # Skip the Teleprompter component (it should stay dark)
            if 'CreatorTeleprompter' in f:
                continue
            files.append(full)

replacements = [
    # slate-card custom class -> standard light card
    (r'\bslate-card\b', 'bg-white rounded-[24px] shadow-sm border border-slate-200'),
    
    # Dark backgrounds
    (r'bg-slate-950/\d+', 'bg-slate-50'),
    (r'bg-slate-950', 'bg-slate-50'),
    (r'bg-slate-900/\d+', 'bg-white'),
    (r'bg-slate-900', 'bg-white'),
    (r'bg-slate-850', 'bg-slate-50'),
    (r'bg-slate-800/\d+', 'bg-slate-50'),
    (r'bg-slate-800', 'bg-slate-50'),
    
    # Dark borders
    (r'border-slate-850', 'border-slate-100'),
    (r'border-slate-800/\d+', 'border-slate-200'),
    (r'border-slate-800', 'border-slate-200'),
    (r'border-slate-900/\d+', 'border-slate-200'),
    (r'border-slate-900', 'border-slate-200'),
    
    # Divide
    (r'divide-slate-800/\d+', 'divide-slate-200'),
    (r'divide-slate-800', 'divide-slate-200'),
    (r'divide-slate-900', 'divide-slate-200'),
    
    # Hover bg dark
    (r'hover:bg-slate-850', 'hover:bg-slate-100'),
    (r'hover:bg-slate-800', 'hover:bg-slate-100'),
    (r'hover:bg-slate-900', 'hover:bg-slate-100'),
    (r'hover:bg-slate-700', 'hover:bg-slate-100'),
    
    # Text that's too light for white bg
    (r'text-slate-100\b', 'text-slate-900'),
    (r'text-slate-200\b', 'text-slate-700'),
    (r'text-slate-300\b', 'text-slate-700'),
    (r'text-slate-400\b', 'text-slate-500'),
    
    # Accent colors too dark/light
    (r'text-indigo-400\b', 'text-indigo-600'),
    (r'text-indigo-300\b', 'text-indigo-600'),
    (r'text-emerald-400\b', 'text-emerald-600'),
    (r'text-emerald-300\b', 'text-emerald-600'),
    (r'text-amber-400\b', 'text-amber-600'),
    (r'text-amber-300\b', 'text-amber-600'),
    (r'text-rose-400\b', 'text-rose-600'),
    (r'text-rose-300\b', 'text-rose-600'),
    (r'text-cyan-400\b', 'text-cyan-600'),
    (r'text-cyan-300\b', 'text-cyan-600'),
    (r'text-purple-400\b', 'text-purple-600'),
    (r'text-purple-300\b', 'text-purple-600'),
    (r'text-teal-400\b', 'text-teal-600'),
    (r'text-teal-300\b', 'text-teal-600'),
    (r'text-pink-400\b', 'text-pink-600'),
    (r'text-pink-300\b', 'text-pink-600'),
    (r'text-fuchsia-400\b', 'text-fuchsia-600'),
    (r'text-fuchsia-300\b', 'text-fuchsia-600'),
    (r'text-blue-400\b', 'text-blue-600'),
    (r'text-blue-300\b', 'text-blue-600'),
    (r'text-sky-400\b', 'text-sky-600'),
    (r'text-sky-300\b', 'text-sky-600'),
    
    # Dark accent backgrounds
    (r'bg-indigo-950/\d+', 'bg-indigo-50'),
    (r'bg-indigo-950', 'bg-indigo-50'),
    (r'bg-indigo-900/\d+', 'bg-indigo-50'),
    (r'bg-indigo-900', 'bg-indigo-50'),
    (r'bg-emerald-950/\d+', 'bg-emerald-50'),
    (r'bg-emerald-950', 'bg-emerald-50'),
    (r'bg-emerald-900/\d+', 'bg-emerald-50'),
    (r'bg-amber-950/\d+', 'bg-amber-50'),
    (r'bg-amber-950', 'bg-amber-50'),
    (r'bg-amber-900/\d+', 'bg-amber-50'),
    (r'bg-rose-950/\d+', 'bg-rose-50'),
    (r'bg-rose-950', 'bg-rose-50'),
    (r'bg-rose-900/\d+', 'bg-rose-50'),
    (r'bg-cyan-950/\d+', 'bg-cyan-50'),
    (r'bg-cyan-950', 'bg-cyan-50'),
    (r'bg-purple-950/\d+', 'bg-purple-50'),
    (r'bg-purple-950', 'bg-purple-50'),
    (r'bg-teal-950/\d+', 'bg-teal-50'),
    (r'bg-teal-950', 'bg-teal-50'),
    
    # Dark accent borders
    (r'border-indigo-900/\d+', 'border-indigo-200'),
    (r'border-indigo-900', 'border-indigo-200'),
    (r'border-indigo-800/\d+', 'border-indigo-200'),
    (r'border-indigo-800', 'border-indigo-200'),
    (r'border-emerald-800/\d+', 'border-emerald-200'),
    (r'border-emerald-800', 'border-emerald-200'),
    (r'border-amber-900/\d+', 'border-amber-200'),
    (r'border-amber-900', 'border-amber-200'),
    (r'border-amber-800/\d+', 'border-amber-200'),
    (r'border-amber-800', 'border-amber-200'),
    (r'border-rose-900/\d+', 'border-rose-200'),
    (r'border-rose-900', 'border-rose-200'),
    (r'border-rose-800/\d+', 'border-rose-200'),
    (r'border-rose-800', 'border-rose-200'),
    (r'border-cyan-800/\d+', 'border-cyan-200'),
    (r'border-cyan-800', 'border-cyan-200'),
    (r'border-purple-800/\d+', 'border-purple-200'),
    (r'border-purple-800', 'border-purple-200'),
    
    # Shadow dark
    (r'shadow-slate-900/\d+', 'shadow-slate-200/70'),
    (r'shadow-black/\d+', 'shadow-slate-200/70'),
    
    # Hover text
    (r'hover:text-slate-100', 'hover:text-slate-900'),
    (r'hover:text-slate-200', 'hover:text-slate-900'),
]

fixed = 0
for fpath in files:
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        try:
            with open(fpath, 'r', encoding='utf-16') as f:
                content = f.read()
        except:
            continue
    
    original = content
    for old, new in replacements:
        content = re.sub(old, new, content)
    
    if content != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        route = fpath.replace(base, '').replace('\\page.tsx','').replace('\\','/')
        fixed += 1
        print(f"FIXED: {route}")

print(f"\nTotal files fixed: {fixed}")
