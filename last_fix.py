import os
import re

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\youtube\page.tsx"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace(".methodology}", ".methodologyNotes}")
c = c.replace("=== 'HIGH'", "=== 'STRONG_RECURRING'")
with open(p, "w", encoding="utf-8") as f:
    f.write(c)

qp = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\queue\page.tsx"
with open(qp, "r", encoding="utf-8") as f:
    qc = f.read()
qc = re.sub(r'(freshnessRequirement: "[^"]*")', r'\1, suggestedQuestions: []', qc)
with open(qp, "w", encoding="utf-8") as f:
    f.write(qc)

ctp = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\components\creator\CreatorTeleprompter.tsx"
with open(ctp, "r", encoding="utf-8") as f:
    cc = f.read()
if "StopCircle" not in cc:
    cc = re.sub(r'import\s+{([^}]*)}\s+from\s+"lucide-react"', r'import {\1, StopCircle } from "lucide-react"', cc)
with open(ctp, "w", encoding="utf-8") as f:
    f.write(cc)
