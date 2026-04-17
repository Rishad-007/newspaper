/**
 * Google OAuth sign-in button.
 */

"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/auth/actions";
import { isAppError } from "@/lib/auth/errors";

interface GoogleButtonProps {
  redirectTo?: string;
}

export function GoogleButton({ redirectTo }: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle(redirectTo);
    } catch (err) {
      const message = isAppError(err) ? err.message : String(err);
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </>
  );
}
