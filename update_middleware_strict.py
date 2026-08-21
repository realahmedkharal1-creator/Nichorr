import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\lib\supabase\middleware.ts"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

# Make protection strict, remove the placeholder bypass
new_c = c.replace(
    """  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co";

  // Enforce auth conditionally
  if (isSupabaseConfigured) {
    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (isAuthPage && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }""",
    """  // Enforce auth strictly
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }"""
)

with open(p, "w", encoding="utf-8") as f:
    f.write(new_c)
