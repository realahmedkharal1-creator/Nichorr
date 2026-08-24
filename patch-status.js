const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', 'research', '[id]');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('setNotFound')) return;
  
  // Add state
  content = content.replace(
    /const \[run, setRun\] = useState(<.*?>)?\(null\);/,
    'const [run, setRun] = useState$1(null);\n  const [notFound, setNotFound] = useState(false);'
  );
  
  // Replace the exact string `if (data.success) setRun(data.run);`
  content = content.replace(
    /if \(data\.success\) setRun\(data\.run\);/g,
    'if (data.success) { setRun(data.run); } else { setNotFound(true); }'
  );

  // For live/page.tsx
  content = content.replace(
    /if \(data\.success && data\.run\) \{\s*setRun\(data\.run\);/,
    'if (data.success && data.run) {\n          setRun(data.run);\n        } else {\n          setNotFound(true);\n        }'
  );

  // Add rendering
  content = content.replace(
    /if \(!run\) \{/,
    'if (notFound) {\n    return (\n      <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-4">\n        <h2 className="text-2xl font-bold text-slate-800">Run Not Found</h2>\n        <p className="text-slate-600">This research run could not be recovered. Please start a new one.</p>\n      </div>\n    );\n  }\n\n  if (!run) {'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('page.tsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = walkSync(baseDir);
files.forEach(processFile);
console.log('Done');
