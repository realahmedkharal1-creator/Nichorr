import os
import re

def clean_inline_mock(file_path, prop):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # We want to replace ((run.prop && run.prop.length > 0) ? run.prop : [ ... ]) with (run.prop || [])
    
    # We will use regex to find the exact pattern and replace it
    pattern = r'\(\(run\.' + prop + r' && run\.' + prop + r'\.length > 0\) \? run\.' + prop + r' : \[\s*\{.*?\s*\}\s*\]\)'
    content = re.sub(pattern, f"(run.{prop} || [])", content, flags=re.DOTALL)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

clean_inline_mock(r"src\app\research\[id]\audience\page.tsx", "audienceQuestions")
clean_inline_mock(r"src\app\research\[id]\community\page.tsx", "communitySignals")
clean_inline_mock(r"src\app\research\[id]\opportunities\page.tsx", "opportunities")

print("Cleaned inline mocks")
