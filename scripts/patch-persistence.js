const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filePath.match(filter)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findFiles(path.join(__dirname, '../src/lib/creator'), /\.(ts|tsx)$/);

const importStatement = `import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add import if it has store.set and doesn't have the import
  if (content.includes('.set(') && !content.includes('CreatorIntelligenceRepo')) {
    const importRegex = /import .* from ['"].*['"];?/g;
    let lastImportMatch;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportMatch = match;
    }

    if (lastImportMatch) {
      const pos = lastImportMatch.index + lastImportMatch[0].length;
      content = content.slice(0, pos) + '\n' + importStatement + content.slice(pos);
      changed = true;
    } else {
      content = importStatement + '\n' + content;
      changed = true;
    }
  }

  // Regex to find store sets. We'll manually insert the saves.
  // Wait, regex replace might be risky for all files, so we'll do it specifically for `set` calls where we can identify the store, key, and value.
  
  // For audit files: `xxxAuditStore.set(key, [frozenEvent, ...current]);`
  const auditRegex = /([a-zA-Z0-9_]+Store)\.set\(([^,]+),\s*\[?([^,]+)(?:,\s*\.\.\.[^\]]+)?\]?\);/g;
  
  let newContent = content.replace(auditRegex, (match, storeName, keyObj, valObj) => {
    // If it's an audit store, saveAudit. Else saveArtifact
    if (storeName.toLowerCase().includes('audit')) {
      return `${match}\n    // Background persist to PostgreSQL\n    CreatorIntelligenceRepo.saveAudit("${storeName}", ${keyObj}, "AUDIT_EVENT", ${valObj}).catch(e => console.warn(e));`;
    } else {
      // Artifact
      // Value might be an array or the object itself
      // We extract the base artifact type from the value (approximate by using the variable name or a generic "Artifact")
      return `${match}\n    // Background persist to PostgreSQL\n    CreatorIntelligenceRepo.saveArtifact("${storeName}", "Artifact", ${keyObj}, ${valObj}).catch(e => console.warn(e));`;
    }
  });

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Patched ${file}`);
  }
}
