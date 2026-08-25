import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Bypasses RLS entirely — only for server-side write paths that are already gated by an explicit
// auth.getUser() check upstream (e.g. the research pipeline's own persistence calls). Route Handlers
// on Vercel spread rapid consecutive requests across many independent invocations; relying on
// cookie-forwarded RLS auth context for every single one of those (rather than just the one initial
// user-facing check) turned out to be the actual cause of research_runs UPDATEs silently failing
// mid-pipeline while the in-memory session kept advancing to a fake COMPLETED state.
export function createServiceClient() {
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key",
    { auth: { persistSession: false } }
  );
}

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component cookie set fallback
          }
        },
      },
    }
  );
}
