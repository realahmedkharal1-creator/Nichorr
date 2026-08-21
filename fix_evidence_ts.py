import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\evidence\page.tsx"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace(
    "const evidenceItems = run.evidence?.filter((e) => e.claim_id === claim.id) || [];",
    "const evidenceItems = run.evidence?.filter((e) => claim.evidence_ids?.includes(e.id)) || [];"
)

# And fix the regex syntax that might have been interpreted as \s instead of \\s
c = c.replace(
    """return text.replace(/^(Verified finding:?|Technical review.*?excerpt.*?from.*?:\s*|Claim:\s*)/i, "").trim();""",
    r"""return text.replace(/^(Verified finding:?|Technical review.*?excerpt.*?from.*?:\s*|Claim:\s*)/i, "").trim();"""
)
c = c.replace(
    """return text.replace(/^(Verified finding:?|Technical review.*?excerpt.*?from.*?:\s*|Claim:\s*)/i, "").trim();""",
    """return text.replace(/^(Verified finding:?|Technical review.*?excerpt.*?from.*?:\s*|Claim:\s*)/i, "").trim();"""
)

with open(p, "w", encoding="utf-8") as f:
    f.write(c)
