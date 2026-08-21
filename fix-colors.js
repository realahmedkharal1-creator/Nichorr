const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src/app', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove dark: classes
        let newContent = content.replace(/dark:[\w\-]+/g, '');
        
        // Replace hardcoded dark themes with light themes where appropriate
        // (but be careful not to destroy all black buttons)
        newContent = newContent.replace(/bg-slate-950/g, 'bg-slate-50');
        newContent = newContent.replace(/bg-slate-900\/80/g, 'bg-white');
        newContent = newContent.replace(/bg-slate-900/g, 'bg-white');
        newContent = newContent.replace(/text-slate-200/g, 'text-slate-700');
        newContent = newContent.replace(/text-slate-100/g, 'text-slate-800');
        newContent = newContent.replace(/border-slate-800/g, 'border-slate-200');
        newContent = newContent.replace(/border-slate-700/g, 'border-slate-200');
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Fixed:', filePath);
        }
    }
});
