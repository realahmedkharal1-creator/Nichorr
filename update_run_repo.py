import os

file_path = r"src\lib\database\repositories\research-runs.repo.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_payload = '''        status: session.status,
        source_count: session.sources.length,
        claim_count: session.claims.length,
      };'''

new_payload = '''        status: session.status,
        source_count: session.sources.length,
        claim_count: session.claims.length,
        token_usage: { sources: session.sources },
      };'''

content = content.replace(old_payload, new_payload)

old_sources_map = '''          sources: (data.sources || []).map((s: any) => ({
            id: s.id,
            title: s.title,
            url: s.canonical_url,
            publisher: s.publisher,
            sourceType: s.source_type,
            qualityScore: s.quality_score,
            extractedText: s.extracted_text,
          })),'''

new_sources_map = '''          sources: (data.token_usage?.sources || []).map((s: any) => ({
            id: s.id,
            title: s.title,
            url: s.url,
            publisher: s.publisher,
            sourceType: s.sourceType,
            qualityScore: s.qualityScore,
            extractedText: s.extractedText,
          })),'''

content = content.replace(old_sources_map, new_sources_map)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated research-runs.repo.ts")
