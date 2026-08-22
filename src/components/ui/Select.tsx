import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <select
          className={cn(
            "w-full appearance-none bg-white border border-[#e5e5ea] rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-[#1d1d1f] transition-all duration-150 focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 disabled:opacity-50 disabled:bg-[#f5f5f7] cursor-pointer",
            error && "border-[#ff3b30] focus:border-[#ff3b30] focus:ring-[#ff3b30]/10",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e8e93] pointer-events-none flex items-center">
          <ChevronDown className="w-4 h-4" />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[#ff3b30] font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
