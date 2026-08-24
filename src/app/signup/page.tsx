
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center bg-[#F0F2F6]">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const supabase = createClient();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setMessage({ text: "You must accept the Terms and Privacy Policy.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      });

      if (error) throw error;

      if (data.session) {
        router.push(redirectTo);
      } else {
        setMessage({ text: "Account created! Please check your email to verify your account.", type: "success" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Registration failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    if (!termsAccepted) {
      setMessage({ text: "You must accept the Terms and Privacy Policy before continuing.", type: "error" });
      return;
    }
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

  // Simple password strength
  const getPasswordStrength = () => {
    if (password.length === 0) return { width: "0%", color: "bg-slate-200" };
    if (password.length < 6) return { width: "33%", color: "bg-red-400" };
    if (password.length < 10) return { width: "66%", color: "bg-amber-400" };
    return { width: "100%", color: "bg-emerald-400" };
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
          <Link href={`/login?redirectTo=${redirectTo}`} className="flex-1 text-center py-[9px] text-[13px] font-semibold rounded-[8px] text-muted hover:text-ink">
            Sign In
          </Link>
          <Link href={`/signup?redirectTo=${redirectTo}`} className="flex-1 text-center py-[9px] text-[13px] font-semibold rounded-[8px] bg-card text-ink shadow-[0_1px_3px_rgba(18,22,28,0.08)]">
            Sign Up
          </Link>
        </div>

        {message && (
          <div className={`p-4 rounded-xl border text-[13px] font-medium mb-5 ${message.type === 'error' ? 'bg-conflict-bg border-conflict text-conflict' : 'bg-verified-bg border-verified text-verified'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div className="mb-4">
            <label className="block text-[12.5px] font-semibold text-ink mb-[7px]">Full Name</label>
            <input
              type="text"
              required
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full font-sans text-[14px] p-[12px_14px] border border-line rounded-[10px] bg-paper text-ink focus:outline-none focus:border-citation focus:ring-[3px] focus:ring-citation-bg transition-shadow"
            />
          </div>

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
            <div className="h-1.5 w-full bg-line-soft rounded-full mt-2 overflow-hidden">
              <div className={`h-full ${getPasswordStrength().color} transition-all duration-300`} style={{ width: getPasswordStrength().width }} />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2 mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-citation bg-paper rounded border-line focus:ring-citation-bg"
            />
            <label htmlFor="terms" className="text-xs text-muted font-medium leading-relaxed">
              I agree to the <Link href="#" className="text-citation hover:underline">Terms of Service</Link> and <Link href="#" className="text-citation hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-white font-semibold text-[14.5px] p-[13px] rounded-[10px] border-none cursor-pointer mt-1.5 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
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

        <div className="flex gap-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="flex-1 flex items-center justify-center bg-card border border-line hover:bg-paper text-ink py-2.5 rounded-[10px] text-[13px] font-bold transition-all"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuthLogin('github')}
            className="flex-1 flex items-center justify-center bg-ink hover:bg-ink/90 text-white py-2.5 rounded-[10px] text-[13px] font-bold transition-all"
          >
            GitHub
          </button>
        </div>

        <div className="flex items-center gap-2 justify-center mt-[26px] font-mono text-[10.5px] text-muted-2 tracking-[0.4px]">
          <span className="w-[5px] h-[5px] rounded-full bg-verified"></span>
          TRACED CLAIMS ONLY · ZERO FABRICATED CITATIONS
        </div>
      </div>
    </div>
  );
}
