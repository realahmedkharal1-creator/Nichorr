import React from "react";

export function SkeletonCard() {
  return (
    <div className="slate-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-1/3 skeleton" />
        <div className="h-4 w-16 skeleton" />
      </div>
      <div className="h-6 w-3/4 skeleton" />
      <div className="space-y-2">
        <div className="h-3 w-full skeleton" />
        <div className="h-3 w-5/6 skeleton" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="slate-card overflow-hidden border border-slate-800 space-y-3 p-4">
      <div className="h-8 w-full skeleton" />
      <div className="h-12 w-full skeleton" />
      <div className="h-12 w-full skeleton" />
      <div className="h-12 w-full skeleton" />
    </div>
  );
}
