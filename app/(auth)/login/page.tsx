/**
 * Sign-in page.
 */

import { SignInForm } from "@/components/auth/signin-form";

export const metadata = {
  title: "Sign In | Newspaper",
};

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to access the admin dashboard
        </p>
      </div>

      <SignInForm />
    </div>
  );
}
