import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "gradient" | "muted";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variantClasses = {
    default: "bg-white border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.03)]",
    elevated: "bg-white border border-[#e5e5ea] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)]",
    interactive: "bg-white border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:border-[#0071e3]/40 hover:shadow-[0_12px_28px_-4px_rgba(0,113,227,0.08)] hover:-translate-y-0.5 cursor-pointer transition-all duration-200",
    gradient: "bg-gradient-to-b from-white to-[#fbfbfd] border border-[#e5e5ea] shadow-[0_2px_14px_rgba(0,0,0,0.03)]",
    muted: "bg-[#f5f5f7] border border-[#e5e5ea] shadow-none",
  };

  return (
    <div
      className={cn(
        "rounded-3xl p-6 transition-all duration-200",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-bold text-[#1d1d1f] tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-[#6e6e73] font-medium leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-[#e5e5ea] flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}
