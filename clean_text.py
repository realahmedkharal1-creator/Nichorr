import os

def remove_mock_text(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace('(Mock)', '').replace('(MOCK)', '').replace('(MOCK DATA)', '').replace('Mock ', '')
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

remove_mock_text(r"src\app\research\[id]\creator\fact-check\page.tsx")
remove_mock_text(r"src\app\research\[id]\creator\script\page.tsx")

print("Cleaned text mocks")
