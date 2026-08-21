import os

p = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\lib\supabase\middleware.ts"
with open(p, "r", encoding="utf-8") as f:
    c = f.read()

# We want to protect the root "/" explicitly, so unauthenticated users visiting "/" get redirected to "/login".
c = c.replace(
    'const protectedPrefixes = ["/dashboard", "/projects", "/research", "/content", "/sources", "/settings"];',
    'const protectedPrefixes = ["/dashboard", "/projects", "/research", "/content", "/sources", "/settings"];\n  const isRoot = pathname === "/";'
)
c = c.replace(
    'const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));',
    'const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix)) || isRoot;'
)

with open(p, "w", encoding="utf-8") as f:
    f.write(c)
