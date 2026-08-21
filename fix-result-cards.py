import os

filepath = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\results\page.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace metric cards styling to pop out
content = content.replace(
    'className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-5 space-y-1.5"',
    'className="bg-white rounded-[24px] shadow-md border-2 border-slate-100 p-5 space-y-1.5 transition-shadow hover:shadow-lg"'
)

# Replace the big panels below them
content = content.replace(
    'className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4"',
    'className="bg-white rounded-[24px] shadow-md border-2 border-slate-100 p-6 sm:p-8 space-y-4"'
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated cards in results page")
