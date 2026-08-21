import os

files_to_fix = [
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\page.tsx",
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\config\page.tsx",
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\plan\page.tsx"
]

for fpath in files_to_fix:
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        content = content.replace('hover:bg-slate-50 text-white', 'hover:bg-slate-800 text-white')
        content = content.replace('hover:bg-white text-white', 'hover:bg-slate-800 text-white')
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {fpath}")
    except Exception as e:
        print(f"Error on {fpath}: {e}")
