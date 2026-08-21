import os

file_path = r"src\lib\database\repositories\research-runs.repo.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('.select("*, sources(*), claims(*), evidence(*), conflicts(*), research_briefs(*)")', '.select("*, claims(*), evidence(*), conflicts(*), research_briefs(*)")')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Removed sources(*) from join.")
