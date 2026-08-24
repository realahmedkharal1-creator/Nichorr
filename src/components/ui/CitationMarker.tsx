import React from "react";

interface CitationMarkerProps {
  number: number | string;
  onClick?: () => void;
  className?: string;
}

export function CitationMarker({ number, onClick, className = "" }: CitationMarkerProps) {
  return (
    <button
      className={`inline-flex items-center justify-center w-[19px] h-[19px] rounded-full bg-citation-bg text-citation font-mono text-[10.5px] font-bold cursor-pointer border-none align-super ml-[2px] transition-colors duration-150 hover:bg-citation hover:text-white focus-visible:bg-citation focus-visible:text-white ${className}`}
      onClick={onClick}
      type="button"
    >
      {number}
    </button>
  );
}
