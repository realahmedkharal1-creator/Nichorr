import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "outline" | "ghost" | "danger" | "soft";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        "bg-[#0071e3] text-white hover:bg-[#0077ed] active:scale-[0.98] shadow-sm shadow-[#0071e3]/20 border border-transparent",
      secondary:
        "bg-white text-[#1d1d1f] border border-[#e5e5ea] hover:bg-[#f5f5f7] hover:border-[#d1d1d6] active:scale-[0.98] shadow-2xs",
      dark: "bg-[#1d1d1f] text-white hover:bg-black active:scale-[0.98] shadow-sm border border-transparent",
      outline:
        "bg-transparent border border-[#d1d1d6] text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#8e8e93] active:scale-[0.98]",
      ghost:
        "bg-transparent text-[#1d1d1f] hover:bg-[#f5f5f7] active:scale-[0.98] border border-transparent",
      danger:
        "bg-[#fff1f2] text-[#e11d48] border border-[#fecdd3] hover:bg-[#ffe4e6] hover:border-[#fda4af] active:scale-[0.98]",
      soft: "bg-[#eef2ff] text-[#0071e3] border border-[#c7d2fe]/60 hover:bg-[#e0e7ff] active:scale-[0.98]",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs font-semibold rounded-full gap-1.5",
      md: "px-4 py-2 text-sm font-semibold rounded-full gap-2",
      lg: "px-6 py-2.5 text-base font-bold rounded-full gap-2.5",
      icon: "w-9 h-9 p-0 rounded-full flex items-center justify-center shrink-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
