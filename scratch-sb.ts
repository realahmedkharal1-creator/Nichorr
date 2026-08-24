import { createServerClient } from "@supabase/ssr";

async function run() {
  const supabase = createServerClient(
    "https://placeholder-project.supabase.co",
    "placeholder-anon-key",
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  try {
    const { data, error } = await supabase.auth.getUser();
    console.log("Data:", data);
    console.log("Error:", error);
  } catch (e) {
    console.error("Caught Exception:", e);
  }
}

run();
