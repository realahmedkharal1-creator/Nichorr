"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings as SettingsIcon, Bell, User, Shield, CheckCircle2 } from "lucide-react";

export default function UserPreferencesPage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("Principal Researcher");
  const [emailNotifs, setEmailNotifs] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider block mb-1">USER PREFERENCES & NOTIFICATION SETTINGS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-indigo-400" />
          Account & Notification Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Configure profile details, in-app notification categories, and default research settings.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Preferences saved successfully.
        </div>
      )}

      {/* Preferences Form */}
      <form onSubmit={handleSave} className="slate-card p-6 bg-slate-900/90 border-slate-800 space-y-6">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Profile Information
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-850">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" /> Notification Categories
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
              />
              <span>In-App Critical Alert Notifications (Research Completion, Contradictions, Impact Alerts)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md transition"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}
