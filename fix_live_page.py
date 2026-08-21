import os
import re

file_path = r"src\app\research\[id]\live\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the hardcoded IN_PROGRESS
content = content.replace(
    'const currentStageIndex = STAGES.findIndex((s) => s.id === ("IN_PROGRESS"));',
    '''
  const isCompleted = run.status === "COMPLETED";
  const isCancelled = run.status === "CANCELLED";
  const isFailed = run.status === "FAILED";

  // Map backend status to UI stage
  let activeStageId = run.status;
  if (run.status === "CREATED") activeStageId = "PLANNING";
  if (run.status === "PLAN_READY") activeStageId = "DISCOVERING";
  if (run.status === "CORRELATING") activeStageId = "CONFLICT_ANALYSIS";
  
  let currentStageIndex = STAGES.findIndex((s) => s.id === activeStageId);
  if (isCompleted) currentStageIndex = STAGES.length;
'''
)

# Remove the old definitions
content = content.replace('  const isCompleted = run.status === "COMPLETED";\n  const isCancelled = run.status === "CANCELLED";\n', '')

content = content.replace(
    'const progressPercent = currentStageIndex === -1 ? 100 : Math.round((currentStageIndex / STAGES.length) * 100);',
    'const progressPercent = isCompleted ? 100 : (currentStageIndex === -1 ? 0 : Math.round((currentStageIndex / STAGES.length) * 100));'
)

# Add the failure banner right above the cancellation banner
failure_banner = '''
      {/* Failure Notice Banner */}
      {isFailed && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-[24px] p-6 sm:p-8 flex items-start gap-4 text-rose-900 shadow-sm mb-4">
          <AlertCircle className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <span className="font-extrabold text-lg block text-rose-900 tracking-tight">Research Run Failed</span>
            <p className="text-sm text-rose-700 font-medium leading-relaxed max-w-2xl">
              Execution encountered an error and was halted. <br/>
              <strong>Reason:</strong> {run.failureReason || "Unknown pipeline error"}
            </p>
          </div>
        </div>
      )}
'''

content = content.replace(
    '{/* Cancellation Notice Banner */}',
    failure_banner + '\n      {/* Cancellation Notice Banner */}'
)

# Fix the Honest Stage Progress Tracker Timeline logic
content = content.replace(
    'const isDone = currentStageIndex > idx || isCompleted;',
    'const isDone = currentStageIndex > idx || isCompleted;'
)
content = content.replace(
    'const isCurrent = currentStageIndex === idx && !isCompleted && !isCancelled;',
    'const isCurrent = currentStageIndex === idx && !isCompleted && !isCancelled && !isFailed;'
)
content = content.replace(
    'isCancelled && currentStageIndex === idx ? (',
    '(isCancelled || isFailed) && currentStageIndex === idx ? ('
)
content = content.replace(
    'isCancelled && currentStageIndex === idx ? \'text-rose-500\'',
    '(isCancelled || isFailed) && currentStageIndex === idx ? \'text-rose-500\''
)
content = content.replace(
    'isCancelled && currentStageIndex === idx ? \'ABORTED\'',
    'isCancelled && currentStageIndex === idx ? \'ABORTED\' : (isFailed && currentStageIndex === idx ? \'FAILED\' : '
)
content = content.replace(
    ': \'QUEUED\'}',
    ': \'QUEUED\')}'
)
content = content.replace(
    '!isCompleted && !isCancelled && (',
    '!isCompleted && !isCancelled && !isFailed && ('
)
content = content.replace(
    'isCancelled ? "text-rose-600"',
    '(isCancelled || isFailed) ? "text-rose-600"'
)
content = content.replace(
    'isCancelled ? "border-rose-100"',
    '(isCancelled || isFailed) ? "border-rose-100"'
)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Modifications applied successfully.")
