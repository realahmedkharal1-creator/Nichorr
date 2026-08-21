"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck, Info, ExternalLink } from "lucide-react";
import { NotificationEntity } from "@/lib/database/repositories/notifications.repo";
import { SkeletonCard } from "@/components/ui/Skeleton";



export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success && data.notifications && data.notifications.length > 0) {
        setNotifications(data.notifications);
      } else {
        setNotifications([]);
      }
    } catch (e) {
      console.error(e);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">REAL-TIME INTELLIGENCE NOTIFICATIONS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Bell className="w-7 h-7 text-indigo-600" />
          Notification Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Notifications triggered by automated research completion, knowledge changes, and content impact alerts.</p>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-12 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No Unread Notifications</p>
          <p className="text-xs text-slate-500">You are all caught up on system events and research intelligence updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-[24px] shadow-sm border p-5 space-y-3 transition-all ${
                n.is_read ? "bg-slate-50 border-slate-100 opacity-70" : "border-slate-200 hover:border-indigo-500/50"
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  n.type === 'CRITICAL'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : n.type === 'WARNING'
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                }`}>
                  {n.type}
                </span>

                <span className="text-xs font-mono text-slate-500">
                  {n.created_at ? new Date(n.created_at).toLocaleTimeString() : 'Recent'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">{n.message}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {n.target_url ? (
                  <Link href={n.target_url} className="text-xs font-mono text-indigo-600 hover:underline flex items-center gap-1 font-semibold">
                    View Target Details <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : <span />}

                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs font-mono text-slate-500 hover:text-slate-700 bg-slate-50 px-3 py-1 rounded border border-slate-200"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

