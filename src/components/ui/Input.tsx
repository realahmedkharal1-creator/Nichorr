import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, type, ...props }, ref) => {
    return (
      <div className="w-full relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-white border border-[#e5e5ea] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1d1d1f] placeholder:text-[#8e8e93] transition-all duration-150 focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 disabled:opacity-50 disabled:bg-[#f5f5f7]",
            icon && "pl-10",
            error && "border-[#ff3b30] focus:border-[#ff3b30] focus:ring-[#ff3b30]/10",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-[#ff3b30] font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
