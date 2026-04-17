/**
 * Admin dashboard homepage.
 */

import { getSession } from "@/lib/auth/server";

export default async function AdminPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Welcome to Admin</h2>
        <p className="text-gray-600">
          Logged in as <span className="font-medium">{session?.email}</span> (
          {session?.role || "writer"})
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Articles card */}
        <div className="rounded-lg border border-gray-200 p-4 hover:shadow-md">
          <h3 className="font-semibold text-gray-900">Articles</h3>
          <p className="mt-2 text-sm text-gray-600">
            Manage and publish articles
          </p>
        </div>

        {/* Review queue card */}
        <div className="rounded-lg border border-gray-200 p-4 hover:shadow-md">
          <h3 className="font-semibold text-gray-900">Review Queue</h3>
          <p className="mt-2 text-sm text-gray-600">
            Approve or reject submissions
          </p>
        </div>

        {/* Categories card */}
        <div className="rounded-lg border border-gray-200 p-4 hover:shadow-md">
          <h3 className="font-semibold text-gray-900">Categories</h3>
          <p className="mt-2 text-sm text-gray-600">
            Manage article categories
          </p>
        </div>
      </div>
    </div>
  );
}
