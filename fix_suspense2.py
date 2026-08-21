import os

p_login = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\login\page.tsx"
with open(p_login, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("export default function LoginPage() {", """export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center bg-[#F0F2F6]">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {""")
with open(p_login, "w", encoding="utf-8") as f:
    f.write(c)

p_signup = r"C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform\src\app\signup\page.tsx"
with open(p_signup, "r", encoding="utf-8") as f:
    c2 = f.read()

c2 = c2.replace("export default function SignUpPage() {", """export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center bg-[#F0F2F6]">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}

function SignUpContent() {""")
with open(p_signup, "w", encoding="utf-8") as f:
    f.write(c2)
