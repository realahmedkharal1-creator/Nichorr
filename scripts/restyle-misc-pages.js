const fs = require('fs');

const classMap = {
  // Backgrounds & Borders
  'bg-white': 'bg-card',
  'bg-slate-50': 'bg-paper',
  'bg-slate-100': 'bg-paper',
  'bg-slate-50/50': 'bg-paper',
  'bg-slate-800': 'bg-ink',
  'bg-slate-900': 'bg-ink',
  'bg-slate-950': 'bg-ink',
  'bg-slate-900/60': 'bg-card',
  'bg-slate-900/50': 'bg-ink/50',
  'bg-slate-900/90': 'bg-card',
  'border-slate-200': 'border-line-soft',
  'border-slate-100': 'border-line-soft',
  'border-slate-200/90': 'border-line-soft',
  'border-slate-200/80': 'border-line-soft',
  'border-slate-300': 'border-line',
  'border-slate-800': 'border-line',
  'border-slate-800/80': 'border-line',
  'border-slate-850': 'border-line-soft',
  
  // Text Colors
  'text-slate-900': 'text-ink',
  'text-slate-800': 'text-ink',
  'text-slate-700': 'text-ink',
  'text-slate-600': 'text-muted',
  'text-slate-500': 'text-muted-2',
  'text-slate-400': 'text-muted-2',
  'text-slate-200': 'text-ink',
  'text-slate-100': 'text-ink',
  
  // Semantic Colors (Verified / Success)
  'text-emerald-600': 'text-verified',
  'text-emerald-700': 'text-verified',
  'text-emerald-500': 'text-verified',
  'text-teal-600': 'text-verified',
  'text-teal-700': 'text-verified',
  'bg-emerald-50': 'bg-verified-bg',
  'bg-emerald-50/60': 'bg-verified-bg',
  'bg-teal-50': 'bg-verified-bg',
  'border-emerald-200': 'border-verified',
  'border-emerald-600/80': 'border-verified',
  'border-teal-800': 'border-verified',
  
  // Semantic Colors (Warning)
  'text-amber-600': 'text-warning',
  'text-amber-500': 'text-warning',
  'bg-amber-50': 'bg-warning-bg',
  'border-amber-200': 'border-warning',
  'bg-amber-600': 'bg-warning',
  
  // Semantic Colors (Conflict / Error)
  'text-rose-600': 'text-conflict',
  'text-rose-500': 'text-conflict',
  'bg-rose-50': 'bg-conflict-bg',
  'bg-rose-50/60': 'bg-conflict-bg',
  'border-rose-200': 'border-conflict',
  'bg-rose-600': 'bg-conflict',
  
  // Semantic Colors (Citation / Info)
  'text-indigo-600': 'text-citation',
  'text-indigo-500': 'text-citation',
  'text-indigo-400': 'text-citation',
  'text-indigo-300': 'text-citation',
  'text-cyan-600': 'text-citation',
  'text-purple-600': 'text-citation',
  'text-blue-700': 'text-citation',
  'text-blue-500': 'text-citation',
  'bg-indigo-50': 'bg-citation-bg',
  'bg-indigo-100': 'bg-citation-bg',
  'bg-indigo-600': 'bg-citation',
  'bg-indigo-950': 'bg-citation-bg',
  'bg-cyan-50': 'bg-citation-bg',
  'bg-purple-50': 'bg-citation-bg',
  'bg-blue-50': 'bg-citation-bg',
  'bg-blue-100': 'bg-citation-bg',
  'border-indigo-200': 'border-citation',
  'border-indigo-200/80': 'border-citation',
  'border-indigo-850': 'border-citation',
  'border-cyan-200': 'border-citation',
  'border-blue-200': 'border-citation',
  'bg-cyan-600': 'bg-citation',
  
  // Radii & Shadows
  'rounded-[24px]': 'rounded-[16px]',
  'rounded-3xl': 'rounded-[16px]',
  'rounded-2xl': 'rounded-[16px]',
  'rounded-xl': 'rounded-[9px]',
  'rounded-lg': 'rounded-[9px]',
  'shadow-sm': '',
  'shadow-md': '',
  'shadow-lg': '',
  'shadow-2xl': '',
  'shadow-slate-200/70': '',
  'shadow-indigo-600/25': '',
  'shadow-indigo-200': '',
  'slate-card': 'bg-card border border-line-soft rounded-[16px]'
};

function restyleBlock(code) {
  let newCode = code;
  
  for (const [oldClass, newClass] of Object.entries(classMap)) {
    const regex = new RegExp(`(?<=["'\\s\\\`])${oldClass.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, '\\$&')}(?=["'\\s\\\`])`, 'g');
    newCode = newCode.replace(regex, newClass);
  }
  
  newCode = newCode.replace(/className=(["'`])\\s+/g, 'className=$1');
  newCode = newCode.replace(/\\s+(["'`])/g, '$1');
  newCode = newCode.replace(/\\s{2,}/g, ' ');

  return newCode;
}

const files = [
  'src/app/research/sources/page.tsx',
  'src/app/research/quality/page.tsx',
  'src/app/projects/page.tsx',
  'src/app/content/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = restyleBlock(content);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Restyled " + file);
}
