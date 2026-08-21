import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\lib\youtube\youtube-transcript.provider.ts"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

old_headers = """          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },"""

new_headers = """          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },"""

c = c.replace(old_headers, new_headers)

old_fetch2 = "const captionRes = await fetch(englishTrack.baseUrl);"
new_fetch2 = """const captionRes = await fetch(englishTrack.baseUrl, {
                headers: {
                  "Accept-Language": "en-US,en;q=0.9",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                }
              });"""

c = c.replace(old_fetch2, new_fetch2)

with open(p, "w", encoding="utf-8") as f:
    f.write(c)
