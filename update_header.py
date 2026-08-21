import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\components\layout\Header.tsx"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

# We need to rewrite Header.tsx to include auth state.
content = """
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, ShieldCheck, Check, LogOut, Settings, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Research Completed", message: "Your run on Quantum Computing is ready.", read: false },
    { id: 2, title: "Action Required", message: "Resolve a methodological conflict in your brief.", read: false }
  ]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/projects", label: "Projects" },
    { href: "/research/create", label: "Research" },
    { href: "/research/sources", label: "Sources" },
    { href: "/content", label: "Content" },
    { href: "/research/quality", label: "Quality" },
    { href: "/developers/docs", label: "Docs" },
  ];

  return (
    <header className="w-full flex justify-between items-center px-8 py-6">
      {/* Left: Logo + Badge */}
      <div className="flex-1 flex items-center gap-3">
         <Link href={user ? "/dashboard" : "/"} className="font-mono font-extrabold text-lg tracking-tight text-slate-900 hidden sm:block">
           VeritasTech
         </Link>
         <span className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[9px] font-bold text-emerald-700 tracking-wider shadow-sm">
            <ShieldCheck className="w-3 h-3" /> EVIDENCE-FIRST
         </span>
      </div>

      {/* Centered Floating Pill Navbar (Only show if logged in, or show docs if logged out) */}
      <nav className="bg-white border border-slate-200/90 rounded-full px-2 py-1 shadow-sm shadow-slate-200/70 flex items-center gap-1">
        {user ? navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-5 py-1.5 rounded-full text-sm transition-all font-medium ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          );
        }) : (
           <Link href="/developers/docs" className="px-5 py-1.5 rounded-full text-sm transition-all font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">Docs</Link>
        )}
      </nav>

      {/* Right Actions */}
      <div className="flex-1 flex items-center justify-end gap-3">
        {user ? (
          <>
            <Link href="/search" className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 shadow-sm shadow-slate-200/70 transition">
              <Search className="w-4 h-4" />
            </Link>
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 shadow-sm shadow-slate-200/70 transition relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border border-white rounded-full"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{unreadCount} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-slate-50 flex gap-3 ${notif.read ? 'opacity-60' : 'bg-indigo-50/30'}`}>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-bold text-slate-800">{notif.title}</p>
                          <p className="text-xs text-slate-500">{notif.message}</p>
                        </div>
                        {!notif.read && (
                          <button onClick={() => markAsRead(notif.id)} className="w-6 h-6 shrink-0 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition">
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )) : (
                      <div className="p-8 text-center text-slate-500 text-sm">No notifications</div>
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                    <Link href="/notifications" onClick={() => setShowNotifications(false)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white border border-slate-200/90 shadow-sm shadow-slate-200/70 overflow-hidden cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all relative"
                title="Profile"
              >
                 {avatar ? (
                   <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-xs font-bold font-mono">
                     {user.user_metadata?.full_name ? user.user_metadata.full_name.substring(0, 2).toUpperCase() : user.email?.substring(0, 2).toUpperCase()}
                   </span>
                 )}
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <p className="font-bold text-slate-900 text-sm truncate">{user.user_metadata?.full_name || "Creator"}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link href="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium transition-colors text-left">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
             <Link href="/login" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
               Sign In
             </Link>
             <Link href="/signup" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-bold transition-all shadow-sm">
               Get Started
             </Link>
          </div>
        )}
      </div>
    </header>
  );
}
"""

with open(p, "w", encoding="utf-8") as f:
    f.write(content)
