/**
 * Server-side auth helpers for Server Components and Server Actions.
 */

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { createAuthError, createUnauthorizedError } from "./errors";

export interface SessionUser {
  id: string;
  email?: string;
  role?: "writer" | "editor" | "owner";
  displayName?: string;
  avatarUrl?: string;
}

/**
 * Get the current user session (for Server Components and Server Actions).
 * Returns null if no session or user not found.
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Fetch user profile with role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, display_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      // User exists in auth but profile may not be created yet
      return {
        id: user.id,
        email: user.email,
      };
    }

    return {
      id: user.id,
      email: user.email,
      role: profile.role as SessionUser["role"],
      displayName: profile.display_name || undefined,
      avatarUrl: profile.avatar_url || undefined,
    };
  } catch (error) {
    throw createAuthError(
      "Failed to fetch session",
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Verify user is authenticated. Throws if not.
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw createAuthError("Authentication required");
  }
  return session;
}

/**
 * Verify user has required role. Throws if not.
 */
export async function requireRole(
  requiredRole: "writer" | "editor" | "owner",
): Promise<SessionUser> {
  const session = await requireAuth();

  const roleHierarchy = { writer: 1, editor: 2, owner: 3 };
  const userRoleLevel = roleHierarchy[session.role || "writer"] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole];

  if (userRoleLevel < requiredRoleLevel) {
    throw createUnauthorizedError(
      `This action requires ${requiredRole} or higher role`,
    );
  }

  return session;
}

/**
 * Verify user is an editor or owner. Throws if not.
 */
export async function requireEditor(): Promise<SessionUser> {
  return requireRole("editor");
}

/**
 * Verify user is an owner. Throws if not.
 */
export async function requireOwner(): Promise<SessionUser> {
  return requireRole("owner");
}
