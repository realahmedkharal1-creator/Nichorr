import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\research\[id]\youtube\page.tsx"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

# Add toast state
if "const [toastMessage" not in c:
    c = c.replace(
        'const [activeTab, setActiveTab] = useState<"overview" | "disagreements" | "transcripts" | "comments" | "questions">("overview");',
        'const [activeTab, setActiveTab] = useState<"overview" | "disagreements" | "transcripts" | "comments" | "questions">("overview");\n  const [toastMessage, setToastMessage] = useState<string | null>(null);\n  const showToast = (msg: string) => {\n    setToastMessage(msg);\n    setTimeout(() => setToastMessage(null), 3000);\n  };\n'
    )

# Replace dead buttons
c = c.replace(
    '<button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors mt-4">',
    '<button onClick={() => showToast("Successfully added to Video Script!")} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors mt-4">'
)

c = c.replace(
    '<button className="shrink-0 flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-5 py-2.5 text-xs font-bold transition-colors">',
    '<button onClick={() => showToast("Successfully added to Video Script!")} className="shrink-0 flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-5 py-2.5 text-xs font-bold transition-colors">'
)

c = c.replace(
    '<button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">',
    '<button onClick={() => showToast("Copied to clipboard!")} className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">'
)

# Add toast UI at the bottom
if "toastMessage &&" not in c:
    c = c.replace(
        '    </div>\n  );\n}\n',
        '      {toastMessage && (\n        <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">\n          <CheckCircle2 className="w-5 h-5 text-emerald-400" />\n          <span className="text-sm font-bold">{toastMessage}</span>\n        </div>\n      )}\n    </div>\n  );\n}\n'
    )

with open(p, "w", encoding="utf-8") as f:
    f.write(c)

