/**
 * Sign-up page.
 */

import { SignUpForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign Up | Newspaper",
};

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign up to start writing and publishing articles
        </p>
      </div>

      <SignUpForm />
    </div>
  );
}
