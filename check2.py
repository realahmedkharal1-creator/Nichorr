import os
import json

file_path = r"src\lib\database\repositories\research-runs.repo.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will rewrite `getRunById` to manually fetch sources if needed, or extract them from evidence!
# But actually, look at how the DB is queried.
print(content[:1500])
