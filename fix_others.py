import re
import os

# Fix search/page.tsx
p1 = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\search\page.tsx"
with open(p1, "r", encoding="utf-8") as f:
    c1 = f.read()
c1 = c1.replace("fetch(/api/search?q= + encodeURIComponent(searchQuery))", "fetch('/api/search?q=' + encodeURIComponent(searchQuery))")
# Let's fix any other missing quotes in search/page.tsx around className
c1 = re.sub(r'className=(?!["{])([a-zA-Z0-9_-]+)', r'className="\1"', c1)
with open(p1, "w", encoding="utf-8") as f:
    f.write(c1)

# Fix projects/page.tsx
p2 = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\projects\page.tsx"
with open(p2, "r", encoding="utf-8") as f:
    c2 = f.read()
# Let's check what's wrong around line 97
# The error was "Unexpected token `div`. Expected jsx identifier" which means returning <div directly if it's inside something else, or a missing closing tag above.
# I will use prettier or just restore them to a good state using git checkout if this is a git repo.
