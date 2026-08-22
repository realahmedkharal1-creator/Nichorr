"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings as SettingsIcon, Bell, User, Shield, CheckCircle2, Save, Key } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function UserPreferencesPage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("Principal Technology Researcher");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [evidenceAlerts, setEvidenceAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <span className="text-[10px] font-mono text-[#0071e3] font-bold uppercase tracking-widest block mb-1">
            USER PREFERENCES & CONFIGURATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-[#0071e3]" />
            Account & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium mt-1">
            Configure profile details, in-app notification categories, and default research settings.
          </p>
        </div>

        <Link
          href="/settings/security"
          className="flex items-center gap-2 bg-white hover:bg-[#f5f5f7] border border-[#e5e5ea] text-[#1d1d1f] px-4 py-2 rounded-full text-xs font-semibold shadow-2xs transition"
        >
          <Key className="w-3.5 h-3.5 text-[#0071e3]" />
          <span>Security & API Keys</span>
        </Link>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#15803d] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#34c759]" /> Preferences saved successfully.
        </div>
      )}

      {/* Preferences Form */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl shadow-[0_2px_14px_rgba(0,0,0,0.03)] border border-[#e5e5ea] p-6 sm:p-8 space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
            <User className="w-4 h-4 text-[#0071e3]" /> Profile Information
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1d1d1f]">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#e5e5ea]">
          <h2 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0071e3]" /> Notification Categories
          </h2>

          <div className="space-y-3 text-xs text-[#1d1d1f]">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 rounded border-[#d1d1d6] text-[#0071e3] focus:ring-0 cursor-pointer"
              />
              <span className="font-medium">In-App Critical Alert Notifications (Research Completion, Contradictions, Impact Alerts)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={evidenceAlerts}
                onChange={(e) => setEvidenceAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-[#d1d1d6] text-[#0071e3] focus:ring-0 cursor-pointer"
              />
              <span className="font-medium">Evidence Retraction & Benchmark Drift Telemetry Alerts</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e5e5ea] flex justify-end">
          <button
            type="submit"
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
