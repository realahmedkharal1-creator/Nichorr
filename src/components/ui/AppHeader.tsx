"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/projects" },
    { label: "Research", href: "/research" },
    { label: "Sources", href: "/sources" },
    { label: "Content", href: "/content" },
    { label: "Quality", href: "/quality" },
  ];

  return (
    <>
      <header className="bg-ink text-paper sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 h-[58px]">
          <Link href="/dashboard" className="font-serif font-semibold text-[18px] text-white tracking-tight">
            Nichorr<span className="text-[#7FA6D6]">.</span>
          </Link>
          
          <nav className="hidden md:flex gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[#B9C0C9] text-[13.5px] font-semibold px-[14px] py-[8px] rounded-lg transition-colors ${
                    isActive ? "bg-white/10 text-white" : "hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-[14px]">
            <div className="w-[30px] h-[30px] rounded-full bg-citation text-white flex items-center justify-center text-[12px] font-bold">
              AH
            </div>
            <button
              className="md:hidden bg-transparent border-none text-white text-[22px] cursor-pointer"
              onClick={() => setIsDrawerOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/45 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="bg-ink w-[78%] max-w-[300px] h-full p-5 flex flex-col gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="self-end bg-transparent border-none text-white text-[20px] mb-2.5 cursor-pointer"
              onClick={() => setIsDrawerOpen(false)}
            >
              ✕
            </button>
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[#DDE1E5] text-[15px] font-semibold px-[10px] py-[13px] rounded-lg block ${
                    isActive ? "bg-white/10 text-white" : ""
                  }`}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
