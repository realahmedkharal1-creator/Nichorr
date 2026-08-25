import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "ghost" | "light";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const baseClasses = "font-sans font-semibold text-[14px] px-[18px] py-[10px] rounded-[9px] inline-flex items-center justify-center gap-[8px] transition-all duration-150 active:translate-y-[1px] focus-visible:outline focus-visible:outline-[2.5px] focus-visible:outline-citation focus-visible:outline-offset-2";
  
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-ink text-paper hover:opacity-90";
      break;
    case "accent":
      variantClasses = "bg-citation text-white hover:opacity-90";
      break;
    case "ghost":
      variantClasses = "bg-transparent text-ink border border-line hover:bg-card hover:border-muted-2";
      break;
    case "light":
      variantClasses = "bg-paper text-ink hover:opacity-90";
      break;
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
