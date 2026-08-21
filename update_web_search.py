import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\lib\search\web.search.provider.ts"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

old_headers = """          headers: {
            "Content-Type": "application/json",
          },"""
          
new_headers = """          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },"""

c = c.replace(old_headers, new_headers)
with open(p, "w", encoding="utf-8") as f:
    f.write(c)
