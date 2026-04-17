/**
 * Sign-up form component with email/password validation.
 */

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/auth/actions";
import { isAppError } from "@/lib/auth/errors";
import { FormField } from "./form-field";
import { FormError } from "./form-error";
import { GoogleButton } from "./google-button";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
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
      await signUp(formData);
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
        label="Display Name (Optional)"
        name="displayName"
        type="text"
        placeholder="John Doe"
        value={formData.displayName}
        onChange={handleChange}
        disabled={isLoading}
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

      <p className="text-xs text-gray-500">
        • At least 8 characters
        <br />• Must include uppercase, lowercase, and a number
      </p>

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={isLoading}
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
