
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SocialAuthButtons, type OAuthProvider } from "@/components/auth/SocialAuthButtons";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center bg-paper">Loading...</div>}>
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

  const handleOAuthLogin = async (provider: OAuthProvider) => {
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
    <div className="min-h-[100vh] flex flex-col items-center justify-center p-[20px] bg-paper font-sans">
      <div className="w-full max-w-[400px] bg-card border border-line rounded-[20px] p-[40px_36px] shadow-[0_4px_24px_rgba(18,22,28,0.06)]">
        <div className="font-serif font-bold text-[22px] text-center mb-1 text-ink">
          Nichorr<span className="text-citation">.</span>
        </div>
        <div className="text-center text-[12.5px] text-muted-2 mb-7">
          Evidence-first research for tech YouTubers
        </div>

        <div className="flex bg-paper rounded-[10px] p-1 mb-[26px]">
          <Link href={`/login?redirectTo=${redirectTo}`} className="flex-1 text-center py-[9px] text-[13px] font-semibold rounded-[8px] bg-card text-ink shadow-[0_1px_3px_rgba(18,22,28,0.08)]">
            Sign In
          </Link>
          <Link href={`/signup?redirectTo=${redirectTo}`} className="flex-1 text-center py-[9px] text-[13px] font-semibold rounded-[8px] text-muted hover:text-ink">
            Sign Up
          </Link>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border text-[13px] font-medium mb-5 ${message.type === 'error' ? 'bg-conflict-bg border-conflict text-conflict' : 'bg-verified-bg border-verified text-verified'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-ink mb-[7px]">Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full font-sans text-[14px] p-[12px_14px] border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg transition-shadow"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-ink mb-[7px]">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full font-sans text-[14px] p-[12px_14px] border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg transition-shadow"
            />
          </div>

          <div className="text-right -mt-2 mb-4">
            <Link href="/login" className="text-[12px] text-citation hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white font-semibold text-[14.5px] p-[13px] rounded-[10px] border-none cursor-pointer mt-1.5 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative mt-6 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-card text-muted-2 font-medium">Or</span>
          </div>
        </div>

        <SocialAuthButtons onSelect={handleOAuthLogin} />

        <div className="flex items-center gap-2 justify-center mt-[26px] font-mono text-[10.5px] text-muted-2 tracking-[0.4px]">
          <span className="w-[5px] h-[5px] rounded-full bg-verified"></span>
          TRACED CLAIMS ONLY · ZERO FABRICATED CITATIONS
        </div>
      </div>
    </div>
  );
}
