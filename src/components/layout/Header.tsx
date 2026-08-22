"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, ShieldCheck, Check, LogOut, Settings, Menu, X, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Research Completed", message: "Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max is ready.", read: false },
    { id: 2, title: "Action Required", message: "Resolve a methodological conflict in your brief.", read: false },
    { id: 3, title: "Trust Verified", message: "5 new primary sources verified by intelligence engine.", read: true },
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
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f5f5f7]/85 backdrop-blur-md border-b border-[#e5e5ea]/80 transition-all duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              V
            </div>
            <span className="font-mono font-extrabold text-base tracking-tight text-[#1d1d1f] hidden sm:inline">
              VeritasTech
            </span>
          </Link>
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[10px] font-bold font-mono text-[#15803d] tracking-wide">
            <ShieldCheck className="w-3 h-3 text-[#15803d]" /> EVIDENCE-FIRST
          </span>
        </div>

        {/* Center: Desktop Navigation Floating Capsule */}
        <nav className="hidden md:flex items-center gap-1 bg-white border border-[#e5e5ea] rounded-full p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {user && navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 select-none ${
                  isActive
                    ? "bg-[#1d1d1f] text-white shadow-sm"
                    : "text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <Link
                href="/search"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#e5e5ea] text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#d1d1d6] shadow-2xs transition-all"
                title="Search Intelligence (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-[#6e6e73]" />
              </Link>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#e5e5ea] text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#d1d1d6] shadow-2xs transition-all relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-[#6e6e73]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff3b30] border-2 border-white rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-[#e5e5ea] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-4 border-b border-[#e5e5ea] flex items-center justify-between bg-[#fbfbfd]">
                      <h3 className="font-bold text-[#1d1d1f] text-sm">Notifications</h3>
                      <span className="text-[10px] font-mono font-bold text-[#0071e3] bg-[#eef2ff] px-2 py-0.5 rounded-full border border-[#c7d2fe]">
                        {unreadCount} New
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#f5f5f7]">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3.5 flex gap-3 transition-colors ${
                              notif.read ? "opacity-60 bg-white" : "bg-[#fbfbfd]"
                            }`}
                          >
                            <div className="flex-1 space-y-0.5">
                              <p className="text-xs font-bold text-[#1d1d1f]">{notif.title}</p>
                              <p className="text-[11px] text-[#6e6e73] leading-relaxed">{notif.message}</p>
                            </div>
                            {!notif.read && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="w-6 h-6 shrink-0 rounded-full bg-white border border-[#e5e5ea] flex items-center justify-center text-[#34c759] hover:bg-[#ecfdf5] transition shadow-2xs"
                                title="Mark read"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-[#8e8e93] text-xs font-medium">
                          No unread notifications
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-[#e5e5ea] bg-[#fbfbfd] text-center">
                      <Link
                        href="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs font-bold text-[#0071e3] hover:underline"
                      >
                        View All Activity
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-9 h-9 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white border border-[#e5e5ea] shadow-2xs overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#0071e3]/30 transition-all select-none"
                  title="Profile"
                >
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold font-mono">
                      {user.user_metadata?.full_name
                        ? user.user_metadata.full_name.substring(0, 2).toUpperCase()
                        : user.email?.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e5e5ea] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-4 border-b border-[#e5e5ea] bg-[#fbfbfd]">
                      <p className="font-bold text-[#1d1d1f] text-sm truncate">
                        {user.user_metadata?.full_name || "Creator"}
                      </p>
                      <p className="text-xs text-[#8e8e93] truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl font-semibold transition-colors"
                      >
                        <Settings className="w-4 h-4 text-[#8e8e93]" /> Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-[#e11d48] hover:bg-[#fff1f2] rounded-xl font-semibold transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-[#e11d48]" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#e5e5ea] text-[#1d1d1f] hover:bg-[#f5f5f7]"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#1d1d1f] hover:bg-black text-white rounded-full text-xs font-bold transition-all shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Nav Menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-[#e5e5ea] bg-white/95 backdrop-blur-md px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#1d1d1f] text-white"
                    : "text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
