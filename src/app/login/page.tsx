"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/api/auth/callback` : undefined;

    try {
      if (isMagicLink) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        setMessage("Magic Link sent to your email! Click it to log in.");
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (error) throw error;
        if (data.session) {
          router.push("/dashboard");
        } else {
          setMessage("Account created! If email confirmation is enabled, check your inbox or confirm in Supabase Dashboard. Otherwise, try signing in!");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setMessage(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isMagicLink ? "Sign In with Magic Link" : isSignUp ? "Create Creator Account" : "Sign In to VeritasTech"}
        </h1>
        <p className="text-sm text-slate-500">
          Access private research runs and evidence-first tech briefs.
        </p>
      </div>

      {message && (
        <div className="p-3 rounded bg-white border border-indigo-200 text-xs font-mono text-indigo-600 text-center leading-relaxed">
          {message}
        </div>
      )}

      <form onSubmit={handleAuth} className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              required
              placeholder="creator@tech-channel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {!isMagicLink && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-semibold transition shadow-md shadow-indigo-600/20"
        >
          {loading
            ? "Processing..."
            : isMagicLink
            ? "Send Magic Link"
            : isSignUp
            ? "Sign Up Account"
            : "Sign In"}
          {isMagicLink ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>

        <div className="space-y-2 text-center pt-2">
          <div>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setIsMagicLink(false);
              }}
              className="text-xs text-slate-500 hover:text-indigo-600 underline underline-offset-4"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setIsMagicLink(!isMagicLink);
                setIsSignUp(false);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-600 flex items-center justify-center gap-1 mx-auto"
            >
              <Sparkles className="w-3 h-3" />
              {isMagicLink ? "Use Email & Password instead" : "Use Magic Link (Passwordless)"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
