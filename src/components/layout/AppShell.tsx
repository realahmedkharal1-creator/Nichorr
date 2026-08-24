"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/ui/AppHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <>
      <AppHeader />
      <main>
        {children}
      </main>
    </>
  );
}
