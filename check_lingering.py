import os, sys

sys.stdout.reconfigure(encoding='utf-8')
for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith((".tsx", ".ts", ".css")):
            p = os.path.join(root, f)
            with open(p, "r", encoding="utf-8", errors="ignore") as file:
                content = file.read()
                if "#A9A9A9" in content or "#a9a9a9" in content:
                    print(f"Found in {p}")
