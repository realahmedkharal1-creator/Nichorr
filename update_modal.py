import os

file_path = r"src\app\research\sources\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix Modal Overlay Background
old_overlay = '<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white backdrop-blur-sm animate-in fade-in duration-200">'
new_overlay = '<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">'
content = content.replace(old_overlay, new_overlay)

# 2. Fix Input Borders (Make them visibly bluish/indigo by default)
old_input_class = 'className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"'
new_input_class = 'className="w-full border-2 border-indigo-200/80 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-500"'
content = content.replace(old_input_class, new_input_class)

old_select_class = 'className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-white"'
new_select_class = 'className="w-full border-2 border-indigo-200/80 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-white"'
content = content.replace(old_select_class, new_select_class)

# 3. Fix Cancel and Submit Buttons
old_cancel = 'className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"'
new_cancel = 'className="px-5 py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"'
content = content.replace(old_cancel, new_cancel)

old_submit = 'className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-white hover:bg-slate-50 shadow-md transition-colors active:scale-95 flex items-center gap-2"'
new_submit = 'className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors active:scale-95 flex items-center gap-2"'
content = content.replace(old_submit, new_submit)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updates applied to src/app/research/sources/page.tsx")
