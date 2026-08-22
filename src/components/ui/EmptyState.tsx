import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.02)]",
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-[#e5e5ea] flex items-center justify-center text-[#0071e3] mb-4 shadow-2xs">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-[#1d1d1f] mb-1 tracking-tight">{title}</h3>
      <p className="text-xs text-[#6e6e73] font-medium max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        actionHref ? (
          <a href={actionHref}>
            <Button size="sm" variant="primary">
              {actionLabel}
            </Button>
          </a>
        ) : (
          <Button size="sm" variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
