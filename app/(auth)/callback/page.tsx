/**
 * OAuth callback handler for Supabase.
 * This route handles the redirect from OAuth providers (Google, GitHub, etc).
 */

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; redirectTo?: string };
}) {
  const code = searchParams.code;
  const redirectTo = searchParams.redirectTo || "/admin";

  if (!code) {
    redirect("/login");
  }

  try {
    // Exchange code for session via Supabase client
    // The Supabase client library automatically handles this when getUser() is called
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // Exchange failed, redirect to login
      redirect("/login");
    }

    // User authenticated, redirect to original page or admin
    redirect(redirectTo);
  } catch (error) {
    // Any error, redirect to login
    console.error("Auth callback error:", error);
    redirect("/login");
  }
}
