const fs = require('fs');

let content = fs.readFileSync('src/app/research/[id]/creator/page.tsx', 'utf8');

const classMap = {
  // Backgrounds & Borders
  'bg-white': 'bg-card',
  'bg-slate-50': 'bg-paper',
  'bg-slate-100': 'bg-paper',
  'bg-slate-50/50': 'bg-paper',
  'bg-slate-800': 'bg-ink',
  'bg-slate-900': 'bg-ink',
  'border-slate-200': 'border-line-soft',
  'border-slate-100': 'border-line-soft',
  'border-slate-200/90': 'border-line-soft',
  'border-slate-200/80': 'border-line-soft',
  'border-slate-300': 'border-line',
  
  // Text Colors
  'text-slate-900': 'text-ink',
  'text-slate-800': 'text-ink',
  'text-slate-700': 'text-ink',
  'text-slate-600': 'text-muted',
  'text-slate-500': 'text-muted-2',
  'text-slate-400': 'text-muted-2',
  
  // Semantic Colors (Verified / Success)
  'text-emerald-600': 'text-verified',
  'text-emerald-700': 'text-verified',
  'text-teal-600': 'text-verified',
  'text-teal-700': 'text-verified',
  'bg-emerald-50': 'bg-verified-bg',
  'bg-emerald-50/60': 'bg-verified-bg',
  'bg-teal-50': 'bg-verified-bg',
  'border-emerald-200': 'border-verified-bg',
  'border-emerald-600/80': 'border-verified-bg',
  'border-teal-800': 'border-verified-bg',
  
  // Semantic Colors (Warning)
  'text-amber-600': 'text-warning',
  'text-amber-500': 'text-warning',
  'bg-amber-50': 'bg-warning-bg',
  'border-amber-200': 'border-warning-bg',
  'bg-amber-600': 'bg-warning',
  
  // Semantic Colors (Conflict / Error)
  'text-rose-600': 'text-conflict',
  'bg-rose-50': 'bg-conflict-bg',
  'bg-rose-50/60': 'bg-conflict-bg',
  'border-rose-200': 'border-conflict-bg',
  'bg-rose-600': 'bg-conflict',
  
  // Semantic Colors (Citation / Info)
  'text-indigo-600': 'text-citation',
  'text-cyan-600': 'text-citation',
  'text-purple-600': 'text-citation',
  'text-blue-700': 'text-citation',
  'bg-indigo-50': 'bg-citation-bg',
  'bg-cyan-50': 'bg-citation-bg',
  'bg-purple-50': 'bg-citation-bg',
  'bg-blue-50': 'bg-citation-bg',
  'border-indigo-200': 'border-citation-bg',
  'border-cyan-200': 'border-citation-bg',
  'border-blue-200': 'border-citation-bg',
  'bg-indigo-600': 'bg-citation',
  'bg-cyan-600': 'bg-citation',
  
  // Radii & Shadows
  'rounded-[24px]': 'rounded-[14px]',
  'rounded-3xl': 'rounded-[14px]',
  'rounded-2xl': 'rounded-[14px]',
  'rounded-xl': 'rounded-[10px]',
  'rounded-lg': 'rounded-[8px]',
  'shadow-sm': '',
  'shadow-md': '',
  'shadow-2xl': '',
  'shadow-2xs': ''
};

function restyleBlock(code) {
  let newCode = code;
  
  // Apply class replacements
  for (const [oldClass, newClass] of Object.entries(classMap)) {
    // Regex to match exact class names
    const regex = new RegExp(`(?<=["'\\s\\\`])${oldClass.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, '\\$&')}(?=["'\\s\\\`])`, 'g');
    newCode = newCode.replace(regex, newClass);
  }
  
  // Cleanup multiple spaces inside class strings caused by replacing with empty string
  newCode = newCode.replace(/className=(["'`])\\s+/g, 'className=$1');
  newCode = newCode.replace(/\\s+(["'`])/g, '$1');
  newCode = newCode.replace(/\\s{2,}/g, ' ');

  // Outer wrapper 'space-y-6' to 'space-y-[22px]'
  newCode = newCode.replace(/className="space-y-6"/g, 'className="space-y-[22px]"');

  return newCode;
}

// Find tabs to restyle
const tabsToRestyle = [
  "matrix",
  "exportWorkspace",
  "publishingOrchestrator",
  "publicationIntegrity",
  "researchCalibration"
];

for (const tab of tabsToRestyle) {
  const startPattern = '{activeTab === "' + tab + '" && (';
  let startIndex = content.indexOf(startPattern);
  
  if (startIndex === -1) {
    console.log("Could not find tab: " + tab);
    continue;
  }
  
  let braceCount = 0;
  let endIndex = -1;
  let foundFirstBrace = false;
  
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      foundFirstBrace = true;
    } else if (content[i] === '}') {
      braceCount--;
    }
    
    if (foundFirstBrace && braceCount === 0) {
      if (content.substr(i-1, 2) === ')}' || content.substr(i-2, 3) === ')}\\n') {
         endIndex = i;
         break;
      }
    }
  }
  
  if (endIndex === -1) {
    console.log("Could not find end of tab block: " + tab);
    continue;
  }
  
  const block = content.substring(startIndex, endIndex + 1);
  const restyledBlock = restyleBlock(block);
  
  content = content.substring(0, startIndex) + restyledBlock + content.substring(endIndex + 1);
  console.log("Restyled tab: " + tab);
}

fs.writeFileSync('src/app/research/[id]/creator/page.tsx', content, 'utf8');
console.log("Restyle complete.");
