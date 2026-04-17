/**
 * Admin layout with authentication and role-based access control.
 */

import { redirect } from "next/navigation";
import { getSession, requireRole } from "@/lib/auth/server";
import { SignOutButton } from "@/components/auth/signout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require writer role (minimum) to access admin section
  let session = null;
  try {
    session = await requireRole("writer");
  } catch (error) {
    // Redirect to login if not authenticated
    redirect("/login");
  }

  // Fallback to getSession if requireRole succeeded but session is null
  if (!session) {
    session = await getSession();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="border-b bg-white">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {session?.email} • {session?.role || "writer"}
            </p>
          </div>
          <SignOutButton />
        </div>
      </header>

      {/* Admin content */}
      <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
