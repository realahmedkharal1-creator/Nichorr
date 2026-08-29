"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/ui/AppHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBareLayout = pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (isBareLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </>
  );
}
