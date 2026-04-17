/**
 * Client-side auth hooks for Client Components.
 * Use these hooks to read session and auth state in browser.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SessionUser } from "./server";

interface UseAuthState {
  user: SessionUser | null;
  isLoading: boolean;
  error: Error | null;
}

const initialState: UseAuthState = {
  user: null,
  isLoading: true,
  error: null,
};

/**
 * Hook to read current user session (browser-side).
 * Subscribes to auth changes and keeps state in sync.
 */
export function useAuth(): UseAuthState {
  const [state, setState] = useState<UseAuthState>(initialState);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error || !user) {
          setState({
            user: null,
            isLoading: false,
            error: error ? new Error(error.message) : null,
          });
          return;
        }

        // Fetch profile with role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, role, display_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (!isMounted) return;

        if (profileError) {
          setState({
            user: {
              id: user.id,
              email: user.email,
            },
            isLoading: false,
            error: null,
          });
        } else if (profile) {
          setState({
            user: {
              id: user.id,
              email: user.email,
              role: profile.role as SessionUser["role"],
              displayName: profile.display_name || undefined,
              avatarUrl: profile.avatar_url || undefined,
            },
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            user: null,
            isLoading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      }
    }

    loadSession();

    // Subscribe to auth changes
    const supabase = getSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (!session) {
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return state;
}

/**
 * Hook to check if user is authenticated.
 */
export function useIsAuthenticated(): boolean {
  const { user, isLoading } = useAuth();
  return !isLoading && user !== null;
}

/**
 * Hook to check if user has a specific role or higher.
 */
export function useHasRole(
  requiredRole: "writer" | "editor" | "owner",
): boolean {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) return false;

  const roleHierarchy = { writer: 1, editor: 2, owner: 3 };
  const userRoleLevel = roleHierarchy[user.role || "writer"] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole];

  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Hook to check if user is an editor or owner.
 */
export function useIsEditor(): boolean {
  return useHasRole("editor");
}

/**
 * Hook to check if user is an owner.
 */
export function useIsOwner(): boolean {
  return useHasRole("owner");
}

/**
 * Hook to sign out the user.
 */
export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      // Redirect to home page (optional)
      window.location.href = "/";
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to sign out";
      setError(new Error(errorMsg));
      setIsLoading(false);
    }
  }, []);

  return { signOut, isLoading, error };
}
