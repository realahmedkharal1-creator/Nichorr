import os

file_path = r"src\app\research\[id]\live\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

warning_banner = '''        {/* Warning Notice Banner */}
        {isCompleted && run?.failureReason && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-[24px] p-6 sm:p-8 flex items-start gap-4 text-amber-900 shadow-sm mb-4">
            <AlertCircle className="w-8 h-8 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <span className="font-extrabold text-lg block text-amber-900 tracking-tight">Demo Mode Activated</span>
              <p className="text-sm text-amber-700 font-medium leading-relaxed max-w-2xl">
                {run.failureReason}
              </p>
            </div>
          </div>
        )}

        {/* Failure Notice Banner */}'''

content = content.replace('{/* Failure Notice Banner */}', warning_banner)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated live/page.tsx with Warning Banner")
