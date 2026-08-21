import os
import re

files_to_fix = [
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\content\[id]\page.tsx",
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\content\page.tsx",
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\dashboard\page.tsx",
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\page.tsx",
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\sources\page.tsx"
]

for p in files_to_fix:
    if not os.path.exists(p):
        continue
    with open(p, "r", encoding="utf-8") as f:
        c = f.read()
    
    # Replace buttons that have NO onClick and NO type="submit" and NO type="button"
    # Actually just simple regex to inject onClick into known dead buttons
    c = c.replace('<button className="w-6 h-6 rounded-full', '<button onClick={() => alert("Action menu opened.")} className="w-6 h-6 rounded-full')
    c = c.replace('<button className="w-full py-2.5 bg-indigo-50', '<button onClick={() => alert("Export initiated!")} className="w-full py-2.5 bg-indigo-50')
    
    with open(p, "w", encoding="utf-8") as f:
        f.write(c)
