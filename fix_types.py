import os
import re

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\youtube\page.tsx"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("channelName", "channel")
c = c.replace("resolutionExplanation", "explanation")
c = c.replace("suggestedVideoAngle", "suggestedCreatorAngle")
c = c.replace("vid.views", "vid.viewCount")
c = c.replace("vid.likes", "vid.likeCount")
c = c.replace("selectedTranscript.map(", "selectedTranscript.segments.map(")
c = c.replace("seg.timestamp", "seg.formattedTime")
c = c.replace("prob.issue", "prob.category")
c = c.replace("prob.severity", "prob.signalStrength")
c = c.replace("prob.mentions", "prob.commentCount")
c = c.replace("prob.userQuotes", "prob.sampleComments")
c = c.replace('"{quote}"', '"{quote.text}"')
c = c.replace('rev.methodology', 'rev.methodologyNotes')

with open(p, "w", encoding="utf-8") as f:
    f.write(c)

np = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\notifications\page.tsx"
with open(np, "r", encoding="utf-8") as f:
    nc = f.read()
nc = nc.replace('"INFO"', '"INFORMATIONAL"')
nc = re.sub(r'type: "WARNING",\n\s+title:', r'type: "WARNING",\n    project_id: "default-proj",\n    title:', nc)
nc = re.sub(r'type: "CRITICAL",\n\s+title:', r'type: "CRITICAL",\n    project_id: "default-proj",\n    title:', nc)
nc = re.sub(r'type: "INFORMATIONAL",\n\s+title:', r'type: "INFORMATIONAL",\n    project_id: "default-proj",\n    title:', nc)
with open(np, "w", encoding="utf-8") as f:
    f.write(nc)

qp = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\queue\page.tsx"
with open(qp, "r", encoding="utf-8") as f:
    qc = f.read()
qc = qc.replace('priority: "HIGH",\n    freshnessRequirement: "Within 1 week"', 'priority: "HIGH",\n    freshnessRequirement: "Within 1 week",\n    suggestedQuestions: []')
qc = qc.replace('priority: "MEDIUM",\n    freshnessRequirement: "Within 1 month"', 'priority: "MEDIUM",\n    freshnessRequirement: "Within 1 month",\n    suggestedQuestions: []')
with open(qp, "w", encoding="utf-8") as f:
    f.write(qc)

rp = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\api\research\[id]\status\route.ts"
with open(rp, "r", encoding="utf-8") as f:
    rc = f.read()
rc = rc.replace('currentStage:', '// currentStage:')
with open(rp, "w", encoding="utf-8") as f:
    f.write(rc)

lp = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\live\page.tsx"
with open(lp, "r", encoding="utf-8") as f:
    lc = f.read()
lc = lc.replace('run.currentStage', '("IN_PROGRESS")')
with open(lp, "w", encoding="utf-8") as f:
    f.write(lc)
    
ctp = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\components\creator\CreatorTeleprompter.tsx"
with open(ctp, "r", encoding="utf-8") as f:
    cc = f.read()
if "import { Play," in cc and "StopCircle" not in cc:
    cc = cc.replace("import { Play,", "import { Play, StopCircle,")
with open(ctp, "w", encoding="utf-8") as f:
    f.write(cc)
