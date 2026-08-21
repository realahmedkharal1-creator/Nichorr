import os
import json

file_path = r"src\lib\database\repositories\research-runs.repo.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()
print(content[2000:2500])
