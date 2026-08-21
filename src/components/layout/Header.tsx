"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, ShieldCheck, Check } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Research Completed", message: "Your run on Quantum Computing is ready.", read: false },
    { id: 2, title: "Action Required", message: "Resolve a methodological conflict in your brief.", read: false }
  ]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem("userAvatar", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { href: "/", label: "Dashboard" },
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
         <span className="font-mono font-extrabold text-lg tracking-tight text-slate-900 hidden sm:block">
           VeritasTech
         </span>
         <span className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[9px] font-bold text-emerald-700 tracking-wider shadow-sm">
            <ShieldCheck className="w-3 h-3" /> EVIDENCE-FIRST
         </span>
      </div>

      {/* Centered Floating Pill Navbar */}
      <nav className="bg-white border border-slate-200/90 rounded-full px-2 py-1 shadow-sm shadow-slate-200/70 flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/dashboard") || (item.href !== "/" && pathname.startsWith(item.href));
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
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex-1 flex items-center justify-end gap-3">
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
        
        {/* Interactive Profile Upload */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white border border-slate-200/90 shadow-sm shadow-slate-200/70 overflow-hidden cursor-pointer hover:ring-2 hover:ring-slate-300 transition-all relative"
          title="Upload Profile Picture"
        >
           {avatar ? (
             <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
           ) : (
             <span className="text-xs font-bold font-mono">AH</span>
           )}
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleAvatarUpload} 
             accept="image/png, image/jpeg" 
             className="hidden" 
           />
        </div>
      </div>
    </header>
  );
}
