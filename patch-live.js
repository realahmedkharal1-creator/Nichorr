const fs = require('fs');
const filePath = 'd:\\AI Projects\\tech-research-platform\\src\\app\\research\\[id]\\live\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Add notFound state
content = content.replace(
  'const [run, setRun] = useState<ResearchRunSession | null>(null);',
  'const [run, setRun] = useState<ResearchRunSession | null>(null);\n  const [notFound, setNotFound] = useState(false);'
);

// Fix fetch logic
content = content.replace(
  `        if (data.success && data.run) {
          setRun(data.run);

          // Self-Healing Auto-Execution: If run was created but execution hasn't started yet, kick it off!
          if (data.run.status === "CREATED" && !executionTriggeredRef.current) {`,
  `        if (data.success && data.run) {
          setRun(data.run);

          // Self-Healing Auto-Execution: If run was created but execution hasn't started yet, kick it off!
          if (data.run.status === "CREATED" && !executionTriggeredRef.current) {`
);
// Wait, the easiest way to fix fetch logic is to just insert an else block
content = content.replace(
  `              .catch((err) => console.error("Auto-execution trigger error:", err));
          }
        }`,
  `              .catch((err) => console.error("Auto-execution trigger error:", err));
          }
        } else {
          setNotFound(true);
        }`
);

// Fix rendering
content = content.replace(
  `  if (!run) {`,
  `  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Run Not Found</h2>
        <p className="text-slate-600">This research run could not be recovered. Please start a new one.</p>
      </div>
    );
  }

  if (!run) {`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed live page');
