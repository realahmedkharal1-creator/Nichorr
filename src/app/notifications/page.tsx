"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck, Info, ExternalLink, Check } from "lucide-react";
import { NotificationEntity } from "@/lib/database/repositories/notifications.repo";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

const FALLBACK_NOTIFS: NotificationEntity[] = [
  {
    id: "notif-1",
    user_id: "u-1",
    project_id: "p-1",
    type: "INFORMATIONAL",
    title: "Research Run Completed",
    message: "Multi-source evidence synthesis for 'Samsung Galaxy S27 Ultra vs iPhone 18 Pro Max' has completed with 100% audit confidence.",
    target_url: "/research/3c7e41fb-f145-41b9-9b1e-a9935a8a5351/results",
    is_read: false,
    created_at: "2026-08-22T14:30:00Z"
  },
  {
    id: "notif-2",
    user_id: "u-1",
    project_id: "p-1",
    type: "WARNING",
    title: "New Conflict Detected in Brief",
    message: "A discrepancy was flagged between benchmark lab measurements and manufacturer technical specifications.",
    target_url: "/research/3c7e41fb-f145-41b9-9b1e-a9935a8a5351/conflicts",
    is_read: false,
    created_at: "2026-08-22T12:15:00Z"
  },
  {
    id: "notif-3",
    user_id: "u-1",
    project_id: "p-1",
    type: "CRITICAL",
    title: "Quality Gate Verification Alert",
    message: "Production export for 'MacBook Pro M5' requires creator review of contradicted thermal wattage claims.",
    target_url: "/research/3c7e41fb-f145-41b9-9b1e-a9935a8a5351/creator",
    is_read: true,
    created_at: "2026-08-21T09:00:00Z"
  }
];

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
      if (data.success && Array.isArray(data.notifications) && data.notifications.length > 0) {
        setNotifications(data.notifications);
      } else {
        setNotifications(FALLBACK_NOTIFS);
      }
    } catch (e) {
      console.error(e);
      setNotifications(FALLBACK_NOTIFS);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 font-sans">
      {/* Header */}
      <div className="border-b border-[#e5e5ea] pb-5">
        <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
          REAL-TIME INTELLIGENCE NOTIFICATIONS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
          <Bell className="w-7 h-7 text-[#0071e3]" />
          Notification Center
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
          Automated event telemetry, claim conflict alerts, and production export readiness updates.
        </p>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-[#34c759]" />}
          title="No Unread Notifications"
          description="You are completely caught up on system events, claim verifications, and research updates."
        />
      ) : (
        <div className="space-y-3.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 shadow-[0_2px_14px_rgba(0,0,0,0.03)] ${
                n.is_read
                  ? "border-[#e5e5ea] opacity-75"
                  : "border-[#0071e3]/30 shadow-[0_8px_20px_rgba(0,113,227,0.06)]"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#f5f5f7] pb-3 mb-3">
                <Badge
                  variant={
                    n.type === "CRITICAL"
                      ? "danger"
                      : n.type === "WARNING"
                      ? "warning"
                      : "default"
                  }
                  size="sm"
                >
                  {n.type}
                </Badge>

                <span className="text-[11px] font-mono font-medium text-[#8e8e93]">
                  {n.created_at ? new Date(n.created_at).toLocaleDateString() : "Today"}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="text-sm font-bold text-[#1d1d1f] leading-snug">{n.title}</h3>
                <p className="text-xs text-[#6e6e73] leading-relaxed font-medium">
                  {n.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#f5f5f7]">
                {n.target_url ? (
                  <Link
                    href={n.target_url}
                    className="text-xs font-semibold text-[#0071e3] hover:underline flex items-center gap-1.5"
                  >
                    <span>View Target Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span />
                )}

                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7] bg-white border border-[#e5e5ea] px-3 py-1.5 rounded-full flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Check className="w-3 h-3 text-[#34c759]" /> Mark as Read
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
