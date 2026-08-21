import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\lib\extraction\web-extractor.ts"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

old_return = """      return {
        url,
        title,
        extractedText: cleanText.slice(0, 5000), // Limit payload length
        isAccessible: true,
        statusMessage: "Successfully extracted",
      };"""

new_return = """      // Boilerplate Sanitizer
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
      finalCleanText = finalCleanText.replace(/\s+/g, ' ').trim();

      return {
        url,
        title,
        extractedText: finalCleanText.slice(0, 5000), // Limit payload length
        isAccessible: true,
        statusMessage: "Successfully extracted",
      };"""

c = c.replace(old_return, new_return)

with open(p, "w", encoding="utf-8") as f:
    f.write(c)
