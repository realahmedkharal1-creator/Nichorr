import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function TabBar({ tabs, activeTabId, onTabChange, className = "" }: TabBarProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-1 scrollbar-hide ${className}`} style={{ scrollbarWidth: 'none' }}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 font-sans text-[13.5px] font-semibold px-[16px] py-[9px] rounded-full border cursor-pointer whitespace-nowrap transition-colors ${
              isActive 
                ? "bg-ink text-paper border-ink" 
                : "bg-card text-muted border-line hover:bg-paper"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
