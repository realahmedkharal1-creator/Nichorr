import os, sys

sys.stdout.reconfigure(encoding='utf-8')
for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith((".tsx", ".ts", ".css")):
            p = os.path.join(root, f)
            with open(p, "r", encoding="utf-8", errors="ignore") as file:
                content = file.read()
                if "slate-card" in content or "var(--surface)" in content or "--surface" in content:
                    print(p)
