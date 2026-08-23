import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const globalWaitlist = globalThis as unknown as {
  waitlistStore: Set<string> | undefined;
};
const waitlistStore = globalWaitlist.waitlistStore ?? new Set<string>();

if (process.env.NODE_ENV !== "production") {
  globalWaitlist.waitlistStore = waitlistStore;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { name, email } = body || {};

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const supabase = createClient();
      const { error } = await supabase.from("waitlist").insert({
        name: normalizedName,
        email: normalizedEmail,
        source: "landing_page",
      });

      if (error) {
        // Check for unique constraint violation (PostgreSQL code 23505) or duplicate key
        if (
          error.code === "23505" ||
          error.message?.toLowerCase().includes("unique") ||
          error.message?.toLowerCase().includes("duplicate") ||
          error.details?.toLowerCase().includes("already exists")
        ) {
          return NextResponse.json({ success: true, alreadyJoined: true });
        }

        // If running in development/test with unconfigured or placeholder database
        if (
          process.env.NODE_ENV !== "production" &&
          (error.message?.includes("fetch failed") ||
            error.message?.includes("ENOTFOUND") ||
            error.code === "PGRST301" ||
            error.message?.includes("placeholder") ||
            error.message?.includes("relation \"public.waitlist\" does not exist"))
        ) {
          if (waitlistStore.has(normalizedEmail)) {
            return NextResponse.json({ success: true, alreadyJoined: true });
          }
          waitlistStore.add(normalizedEmail);
          return NextResponse.json({ success: true });
        }

        console.error("Waitlist database error:", error);
        return NextResponse.json(
          { success: false, error: "An unexpected error occurred. Please try again later." },
          { status: 500 }
        );
      }

      waitlistStore.add(normalizedEmail);
      return NextResponse.json({ success: true });
    } catch (dbError: any) {
      // Offline fallback in test / development
      if (process.env.NODE_ENV !== "production") {
        if (waitlistStore.has(normalizedEmail)) {
          return NextResponse.json({ success: true, alreadyJoined: true });
        }
        waitlistStore.add(normalizedEmail);
        return NextResponse.json({ success: true });
      }

      console.error("Unexpected database error:", dbError);
      return NextResponse.json(
        { success: false, error: "An unexpected error occurred. Please try again later." },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("Unexpected error in waitlist API handler:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
