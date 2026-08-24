import React from 'react';

export type StepStatus = 'done' | 'active' | 'pending';

export type Step = {
  num: number | string;
  label: string;
  status: StepStatus;
};

interface StepperProps {
  steps: Step[];
}

export function Stepper({ steps }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-8 sm:mb-9 flex-wrap">
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div className="flex items-center gap-2">
            <div
              className={`w-[26px] h-[26px] rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                step.status === 'done'
                  ? 'bg-verified text-white'
                  : step.status === 'active'
                  ? 'bg-citation text-white'
                  : 'bg-card border-[1.5px] border-line text-muted-2'
              }`}
            >
              {step.status === 'done' ? '✓' : step.num}
            </div>
            <div
              className={`text-[13px] font-semibold hidden sm:block ${
                step.status === 'done'
                  ? 'text-verified'
                  : step.status === 'active'
                  ? 'text-ink'
                  : 'text-muted-2'
              }`}
            >
              {step.label}
            </div>
          </div>
          {idx < steps.length - 1 && (
            <span className="text-line text-[13px] mx-0.5 sm:mx-1">—</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
