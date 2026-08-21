import os
import re

def repl_file(filepath, old_str, new_str):
    if not os.path.exists(filepath): return
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    if old_str in c:
        c = c.replace(old_str, new_str)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(c)

# 1. Update web-extractor.ts
extractor_path = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\lib\extraction\web-extractor.ts"
old_fetch = """      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "VeritasTechBot/1.0 (+https://veritastech.ai)",
          "Accept": "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(6000),
      });"""

new_fetch = """      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(6000),
      });"""

repl_file(extractor_path, old_fetch, new_fetch)

old_return = """      return {
        url,
        title,
        extractedText: cleanText.substring(0, 15000),
        isAccessible: true,
      };"""

new_return = """      // Sanitizer step
      let finalCleanText = cleanText;
      const boilerplateTerms = [
        "About Press Copyright Contact us Creators Advertise Developers",
        "Terms Privacy Policy & Safety",
        "How YouTube works Test new features",
        "تعارف پریس کاپی رائٹ ہم سے رابطہ کریں",
        "© 20",
        "All rights reserved",
        "Cookie Consent",
        "We use cookies",
        "Accept All Cookies"
      ];
      boilerplateTerms.forEach(term => {
         const regex = new RegExp(term, 'gi');
         finalCleanText = finalCleanText.replace(regex, ' ');
      });
      finalCleanText = finalCleanText.replace(/\\s+/g, ' ').trim();

      return {
        url,
        title,
        extractedText: finalCleanText.substring(0, 15000),
        isAccessible: true,
      };"""

repl_file(extractor_path, old_return, new_return)
