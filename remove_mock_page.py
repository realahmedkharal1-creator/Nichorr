import os

file_path = r"src\app\content\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove MOCK_DATA array block
content = re.sub(r'const MOCK_DATA = \[.*?\];', '', content, flags=re.DOTALL)

# Replace setContentItems(MOCK_DATA) with setContentItems([])
content = content.replace('setContentItems(MOCK_DATA);', 'setContentItems([]);')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Removed MOCK_DATA from content/page.tsx")
