import os
import re

file_path = r"src\app\projects\[id]\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r'const MOCK_PROJECT: any = {.*?};\n', '', content, flags=re.DOTALL)
content = content.replace('setProject(MOCK_PROJECT);', 'setProject(null);')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned projects page")
