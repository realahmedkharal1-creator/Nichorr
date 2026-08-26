import React from "react";

interface BadgeProps {
  variant: "verified" | "warning" | "conflict" | "neutral";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = "" }: BadgeProps) {
  const baseClasses = "font-mono text-[11.5px] font-semibold px-[10px] py-[4px] rounded-full inline-flex items-center gap-[6px] tracking-[0.2px] uppercase";
  const dotClasses = "w-[6px] h-[6px] rounded-full";
  
  let variantClasses = "";
  let dotVariantClasses = "";
  
  switch (variant) {
    case "verified":
      variantClasses = "bg-verified-bg text-verified";
      dotVariantClasses = "bg-verified";
      break;
    case "warning":
      variantClasses = "bg-warning-bg text-warning";
      dotVariantClasses = "bg-warning";
      break;
    case "conflict":
      variantClasses = "bg-conflict-bg text-conflict";
      dotVariantClasses = "bg-conflict";
      break;
    case "neutral":
      variantClasses = "bg-line-soft text-muted";
      dotVariantClasses = "bg-muted-2";
      break;
  }

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      <span className={`${dotClasses} ${dotVariantClasses}`}></span>
      {children}
    </span>
  );
}
