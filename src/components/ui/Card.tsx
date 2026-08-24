import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div 
      className={`bg-card border border-line-soft rounded-2xl p-[20px] shadow-[0_1px_2px_rgba(18,22,28,0.03)] ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
