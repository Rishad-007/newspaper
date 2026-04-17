/**
 * Server actions for authentication: signup, signin, signout.
 */

"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  createAuthError,
  createDatabaseError,
  createValidationError,
  logError,
} from "./errors";
import { signUpSchema, signInSchema } from "./validation";

/**
 * Sign up with email and password.
 * Creates auth.users record and initializes profiles entry.
 * Returns error message on failure, redirects to /admin on success.
 */
export async function signUp(input: unknown) {
  try {
    // Validate input
    const parsed = signUpSchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw createValidationError(messages);
    }

    const { email, password, displayName } = parsed.data;

    // Create auth user
    const supabase = await getSupabaseServerClient();
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (signUpError) {
      throw createAuthError(
        signUpError.message || "Failed to create account",
        signUpError,
      );
    }

    if (!authData.user) {
      throw createAuthError("No user returned from sign-up");
    }

    // Profile is created automatically by trigger, but ensure it exists
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authData.user.id,
      display_name: displayName || null,
      role: "writer", // Default role for new users
    });

    if (profileError) {
      logError("signUp:upsertProfile", profileError);
      // Non-fatal: user auth exists, profile will be created by trigger
    }

    // Redirect to admin dashboard
    redirect("/admin");
  } catch (error) {
    logError("signUp", error);
    // Re-throw to be caught by form component
    throw error;
  }
}

/**
 * Sign in with email and password.
 * Returns error message on failure, redirects to /admin (or redirectTo) on success.
 */
export async function signIn(input: unknown, redirectTo?: string) {
  try {
    // Validate input
    const parsed = signInSchema.safeParse(input);
    if (!parsed.success) {
      const messages = parsed.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw createValidationError(messages);
    }

    const { email, password } = parsed.data;

    // Sign in with Supabase
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw createAuthError(error.message || "Invalid email or password");
    }

    // Redirect to original page or admin dashboard
    const destination =
      redirectTo && isValidRedirect(redirectTo) ? redirectTo : "/admin";
    redirect(destination);
  } catch (error) {
    logError("signIn", error);
    throw error;
  }
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw createAuthError(error.message || "Failed to sign out");
    }

    // Redirect to home page
    redirect("/");
  } catch (error) {
    logError("signOut", error);
    throw error;
  }
}

/**
 * Verify redirect URL is safe (prevent open redirect attacks).
 */
function isValidRedirect(url: string): boolean {
  try {
    const parsed = new URL(url, "http://localhost");
    // Only allow same-origin redirects
    return parsed.pathname.startsWith("/") && !url.includes("://");
  } catch {
    return false;
  }
}

/**
 * Sign in with Google OAuth.
 * Redirects to Google, then back to callback handler.
 */
export async function signInWithGoogle(redirectTo?: string) {
  try {
    const supabase = await getSupabaseServerClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback?redirectTo=${redirectTo || "/admin"}`,
      },
    });

    if (error) {
      throw createAuthError(error.message || "Failed to sign in with Google");
    }

    if (data.url) {
      redirect(data.url);
    }
  } catch (error) {
    logError("signInWithGoogle", error);
    throw error;
  }
}

/**
 * Handle OAuth callback from provider.
 * Supabase client library handles the session automatically.
 */
export async function handleOAuthCallback() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw createAuthError("OAuth callback failed: no user returned");
    }

    // Profile created automatically by trigger
    // Redirect handled by route
  } catch (error) {
    logError("handleOAuthCallback", error);
    throw error;
  }
}
