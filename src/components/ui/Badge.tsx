import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-[#eef2ff] text-[#0071e3] border border-[#c7d2fe]/70",
    success: "bg-[#ecfdf5] text-[#15803d] border border-[#a7f3d0]",
    warning: "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]",
    danger: "bg-[#fff1f2] text-[#be123c] border border-[#fecdd3]",
    info: "bg-[#eff6ff] text-[#0284c7] border border-[#bae6fd]",
    neutral: "bg-[#f5f5f7] text-[#48484a] border border-[#e5e5ea]",
    outline: "bg-white text-[#1d1d1f] border border-[#d1d1d6]",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] font-bold tracking-wide",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full uppercase font-mono transition-colors",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
