/**
 * Sign-in form component with email/password validation.
 */

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth/actions";
import { isAppError } from "@/lib/auth/errors";
import { FormField } from "./form-field";
import { FormError } from "./form-error";
import { GoogleButton } from "./google-button";

export function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(formData, redirectTo || undefined);
    } catch (err) {
      const message = isAppError(err) ? err.message : String(err);
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormError message={error} />

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
        required
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        disabled={isLoading}
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <GoogleButton redirectTo={redirectTo || undefined} />

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
