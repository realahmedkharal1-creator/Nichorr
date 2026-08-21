import os
import re

file_path = r"src\app\notifications\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r'const MOCK_NOTIFICATIONS: NotificationEntity\[\] = \[.*?\];', '', content, flags=re.DOTALL)
content = content.replace('setNotifications(MOCK_NOTIFICATIONS);', 'setNotifications([]);')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned notifications page")
