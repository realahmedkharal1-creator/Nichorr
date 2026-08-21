import os

files = [
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\login\page.tsx",
    r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\signup\page.tsx"
]

for p in files:
    with open(p, "r", encoding="utf-8") as f:
        c = f.read()

    # Need to add Suspense import
    if "import { Suspense" not in c:
        c = c.replace('import { useState } from "react";', 'import { useState, Suspense } from "react";')

    if "LoginPage" in p:
        c = c.replace("export default function LoginPage() {", """export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center bg-[#F0F2F6]">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {""")

    if "SignUpPage" in p:
        c = c.replace("export default function SignUpPage() {", """export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center bg-[#F0F2F6]">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}

function SignUpContent() {""")

    with open(p, "w", encoding="utf-8") as f:
        f.write(c)
