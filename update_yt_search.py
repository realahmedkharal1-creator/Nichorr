import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\lib\youtube\youtube-search.provider.ts"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

old_url = """const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=4&q=${encodedQuery}&key=${apiKey}`;"""
new_url = """const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=4&q=${encodedQuery}&relevanceLanguage=en&regionCode=US&key=${apiKey}`;"""

old_fetch = "const res = await fetch(url);"
new_fetch = """const res = await fetch(url, {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
          });"""

c = c.replace(old_url, new_url)
c = c.replace(old_fetch, new_fetch)

with open(p, "w", encoding="utf-8") as f:
    f.write(c)
