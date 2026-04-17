/**
 * Sign-out button component for use in headers/navigation.
 */

"use client";

import { signOut } from "@/lib/auth/actions";
import { isAppError } from "@/lib/auth/errors";
import { useState } from "react";

export function SignOutButton({ className = "" }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signOut();
    } catch (err) {
      const message = isAppError(err) ? err.message : String(err);
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className={`rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 disabled:opacity-50 ${className}`}
      >
        {isLoading ? "Signing out..." : "Sign Out"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
