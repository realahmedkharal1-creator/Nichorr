"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Mail, Lock, ArrowRight, Github, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-xs font-mono text-[#8e8e93]">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push(redirectTo);
    } catch (err: any) {
      setMessage({ text: err.message || "Authentication failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });

    if (error) {
      setMessage({ text: error.message, type: "error" });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center mx-auto shadow-sm mb-4">
            <ShieldCheck className="w-6 h-6 text-[#34c759]" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6e73] font-medium">
            Sign in to access your intelligence dashboard & evidence graph.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold ${
              message.type === "error"
                ? "bg-[#fff1f2] border-[#fecdd3] text-[#be123c]"
                : "bg-[#ecfdf5] border-[#a7f3d0] text-[#15803d]"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white border border-[#e5e5ea] rounded-3xl p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
          <div className="space-y-3">
            <button
              onClick={() => handleOAuthLogin("google")}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[#e5e5ea] hover:bg-[#f5f5f7] text-[#1d1d1f] py-2.5 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>
            
            <button
              onClick={() => handleOAuthLogin("github")}
              className="w-full flex items-center justify-center gap-3 bg-[#1d1d1f] hover:bg-black text-white py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Github className="w-4 h-4" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e5ea]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-[#8e8e93] font-medium text-[11px]">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1d1d1f]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8e8e93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition font-medium placeholder:text-[#8e8e93]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1d1d1f]">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8e8e93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#fbfbfd] border border-[#d1d1d6] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition font-medium placeholder:text-[#8e8e93]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-full text-xs font-semibold transition-all shadow-sm shadow-[#0071e3]/20 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-medium text-[#6e6e73]">
          Don't have an account?{" "}
          <Link
            href={`/signup?redirectTo=${redirectTo}`}
            className="font-bold text-[#0071e3] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
