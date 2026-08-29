"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AppHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/projects" },
    { label: "Research", href: "/research/create" },
    { label: "Sources", href: "/research/sources" },
    { label: "Content", href: "/content" },
    { label: "Quality", href: "/research/quality" },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsProfileMenuOpen(false);
    router.push("/login");
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "?";

  return (
    <>
      <header className="bg-header text-white sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-5 h-[58px]">
          <Link href="/dashboard" className="font-serif font-semibold text-[18px] text-white tracking-tight">
            Nichorr<span className="text-citation">.</span>
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

          <div className="flex items-center gap-[10px]">
            <ThemeToggle />
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileMenuOpen((v) => !v)}
                className="w-[30px] h-[30px] rounded-full bg-citation text-white flex items-center justify-center text-[12px] font-bold cursor-pointer border-none"
              >
                {initials}
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-[180px] bg-card border border-line rounded-[12px] shadow-lg z-50 overflow-hidden py-1">
                  {user?.email && (
                    <div className="px-3.5 py-2.5 border-b border-line-soft">
                      <p className="text-[12.5px] font-semibold text-ink truncate">{user.email}</p>
                    </div>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-3.5 py-2.5 text-[13px] font-medium text-ink hover:bg-paper"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-conflict hover:bg-conflict-bg cursor-pointer border-none bg-transparent"
                  >
                    Sign Out
                  </button>
                </div>
              )}
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
            className="bg-header w-[78%] max-w-[300px] h-full p-5 flex flex-col gap-0.5"
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
