import os

file_path = r"src\components\layout\Header.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
'''        }) : (
           
        )}''',
'''        })}'''
)

content = content.replace('{user ? navItems.map((item) => {', '{user && navItems.map((item) => {')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed syntax error in Header.tsx")
